const Product = require('../models/product');
const User = require('../models/user');
const Feedback = require('../models/feedback');

// Controller function to fetch all products and associated feedbacks for a specific user
module.exports.products = async function (req, res) {
    try {
      // Get the user ID from the authentication token or session
      const userId = req.userId; // Modify this to get the user ID properly
      const user = await User.findById(userId);
      const userName = user ? user.name : 'Unknown'; // Use the user's name or 'Unknown' if user not found
  
      // Retrieve all products for the specific user and sort them by timestamps in descending order
      const products = await Product.find({ user: userId })
        .sort({ timestamps: -1 })
        .populate({
          path: 'feedback',
          populate: {
            path: 'user',
            select: 'name', // Include user name
          },
        });
  
      // Map the product data to a simplified format
      const productsData = products.map(product => {
        return {
          id: product._id,
          name: product.name,
          quantity: product.quantity,
          createdAt: product.timestamps,
          feedbacks: product.feedbacks.map(feedback => ({
            id: feedback._id,
            text: feedback.text,
            userName: feedback.user.name,
            createdAt: feedback.timestamps, // Include user name
          })),
        };
      });
  
      // Respond with the product data in a JSON response
      return res.status(200).json({
        data: {
          products: productsData,
          userName: userName,
        },
      });
    } catch (err) {
      console.error(err);
      // Respond with a 500 Internal Server Error if an error occurs
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  };
  
// Controller function to fetch a specific user's data
module.exports.getUserData = async function (req, res) {
  try {
    // Get the user ID from the URL parameter
    const selectedUserId = req.params.userId;

    // Retrieve the user's information based on the selected user ID
    const user = await User.findById(selectedUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user-specific products and associated feedbacks
    const products = await Product.find({ user: selectedUserId })
      .sort({ timestamps: -1 })
      .populate({
        path: 'feedback',
        populate: {
          path: 'user',
          select: 'name', // Include user name
        },
      });

    // Map the product data to a simplified format
    const productsData = products.map(product => {
      return {
        id: product._id,
        name: product.name,
        quantity: product.quantity,
        createdAt: product.timestamps,
        feedbacks: product.feedbacks.map(feedback => ({
          id: feedback._id,
          text: feedback.text,
          userName: feedback.user.name,
          createdAt: feedback.timestamps, // Include user name
        })),
      };
    });

    // Respond with the user's data and associated products and feedbacks in a JSON response
    return res.status(200).json({
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        products: productsData,
      },
    });
  } catch (err) {
    console.error(err);
    // Respond with a 500 Internal Server Error if an error occurs
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
