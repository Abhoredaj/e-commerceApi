const RefreshToken = require('../models/refreshToken');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtConfig = require('../config/jwt');


module.exports.profile = function(req, res){
  try {
    // Extract the user's ID from the request parameters
    const userId = req.params.id;
    const userId1 = req.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (userId !== userId1) {
      return res.status(403).json({ message: 'Unauthorized: You are not allowed' });
    }
    // Fetch the user's data from the database based on the user's ID
    const user = await User.findById(userId, 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an object with user information
    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // Send the user's profile information as a JSON response
    return res.status(200).json({ user: userProfile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to update the user's name
module.exports.updateUserName = async function (req, res) { 
    try {
      const { userId } = req.params;
      const { name } = req.body;
      const userId1 = req.userId; // Get the user ID from the authentication token
      // Find the user by ID
      const user = await User.findById(userId);
      // Check if the user is authorized to delete the product
      if (userId !== userId1) {
        return res.status(403).json({ message: 'Unauthorized: You are not allowed to update user name' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's name
      if (name) {
        user.name = name;
        await user.save();
        return res.status(200).json({ message: 'User name updated successfully' });
      } else {
        return res.status(400).json({ message: 'Name is required for updating' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
// Function to update the user's password
module.exports.updateUserPassword = async function (req, res) {
    try {
      const { userId } = req.params;
      const { password } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's password
      if (password) {
        // Check password criteria (minimum 8 characters, special character, uppercase, digit)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
        if (!password.match(passwordRegex)) {
          return res.status(400).json({ message: 'Password does not meet the criteria' });
        }
  
        // Hash the new password
        const saltRounds = 10;
        user.password = await bcrypt.hash(password, saltRounds);
        await user.save();
  
        return res.status(200).json({ message: 'User password updated successfully' });
      } else {
        return res.status(400).json({ message: 'Password is required for updating' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };



// Function to create a new user
module.exports.register = async function (req, res) {
    try {
      const { email, password, name } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(200).json({ message: 'User Already Existed' });
      }
  
      // Check password criteria (minimum 8 characters, special character, uppercase, digit)
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
      if (!password.match(passwordRegex)) {
        return res.status(400).json({ message: 'Password does not meet the criteria' });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create a new user
      const newUser = new User({ email, password: hashedPassword, name });
  
      // Save the user to the database
      await newUser.save();
  
      return res.status(200).json({ message: 'User registered' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
module.exports.login = async function (req, res) {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // Generate an access token
      const accessToken = jwt.sign({ userId: user._id }, jwtConfig.secretKey, {
        expiresIn: jwtConfig.expiresIn,
      });
  
      // Generate a refresh token (you can store this in your database for token refreshing)
      const refreshToken = jwt.sign({ userId: user._id }, jwtConfig.refreshSecretKey, {
        expiresIn: jwtConfig.refreshExpiresIn,
      });

      // Store the refreshToken in the database
      const refreshTokenDocument = new RefreshToken({ userId: user._id, token: refreshToken });
      await refreshTokenDocument.save();
      // Send the access token and refresh token in the response
      return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

module.exports.refreshToken = async function (req, res) {
    try {
      const { refreshToken } = req.body;
  
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecretKey);
  
      // Check if the user exists and is valid
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: Invalid user' });
      }
  
      // Generate a new access token
      const accessToken = jwt.sign({ userId: user._id }, jwtConfig.secretKey, {
        expiresIn: jwtConfig.expiresIn,
      });

      // In your user controller (when a refresh token is used successfully)
      const refreshTokenNew = jwt.sign({ userId: user._id }, jwtConfig.refreshSecretKey, {
        expiresIn: jwtConfig.refreshExpiresIn,
      });

      // Find the old refresh token and replace it with the new one
      await RefreshToken.findOneAndReplace({ userId: user._id }, { token: refreshTokenNew });
  
      return res.status(200).json({ accessToken });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle expired refresh token, e.g., return an error response
        return res.status(401).json({ message: 'Unauthorized: Refresh token has expired' });
      } else {
        // Handle other errors
        return res.status(401).json({ message: 'Unauthorized: Invalid refresh token' });
      }
    }
  };
  
// Controller function to delete a user's refresh token on logout
module.exports.logout = async function (req, res) {
  try {
    // Get the user's ID, either from the session or access token
    const userId1 = req.userId; // or obtained from the session
    const { userId } = req.params;
    if (userId !== userId1) {
      return res.status(403).json({ message: 'Unauthorized: You are not allowed to logout this product' });
    }

    // Delete the user's refresh token from the database
    await RefreshToken.deleteOne({ user: userId });

    // Respond with a success message
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller function to search for users by email starting part
module.exports.searchUsers = async function (req, res) {
  try {
    // Extract the starting part of the email from the query parameter
    const emailStartsWith = req.query.emailStartsWith;

    if (!emailStartsWith) {
      return res.status(400).json({ message: 'Invalid query parameter' });
    }

    // Search for users whose emails start with the provided query
    const users = await User.find({ email: { $regex: `^${emailStartsWith}`, $options: 'i' } }, 'email _id');

    // Create an array of user objects with email and ID
    const userList = users.map((user) => ({
      email: user.email,
      id: user._id,
    }));

    // Send the list of users as a JSON response
    return res.status(200).json({ users: userList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};