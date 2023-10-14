const Product = require('../models/product');
const User = require('../models/user');
const Feedback = require('../models/feedback');

// Controller function to create feedback for a product
module.exports.createFeedback = async function (req, res) {
    try {
      const { productId, text } = req.body;
      const userId = req.userId; // Get the user ID from the middleware
        
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
      // Create a new Feedback document with data from the request
      const newFeedback = new Feedback({
        product: productId,
        user: userId,
        text: text,
      });
  
      // Save the new feedback to the database
      await newFeedback.save();
  
      // Get the user's name who created the feedback
      const user = await User.findById(userId);
      const userName = user ? user.name : 'Unknown'; // Use 'Unknown' if user not found
  
      // Format the feedback data to include relevant fields
      const feedbackData = {
        id: newFeedback._id,
        text: newFeedback.text,
        userName: userName,
        createdAt: newFeedback.timestamps,
      };
  
      // Respond with the newly created feedback data in a JSON response
      return res.status(200).json({
        data: {
          feedback: feedbackData,
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
  
// Controller function to delete a feedback by its ID
module.exports.deleteFeedback = async function(req, res) {
    try {
      const feedbackId = req.params.feedbackID;
      const userId = req.userId; // Get the user ID from the middleware
  
      // Find the feedback by its ID
      const feedback = await Feedback.findById(feedbackId);
      
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
  
      // Check if the user is authorized to delete this feedback
      if (feedback.user.toString() !== userId) {
        return res.status(401).json({ message: 'Unauthorized: You do not have permission to delete this feedback' });
      }
  
      // Delete the feedback from the database
      await Feedback.findByIdAndDelete(feedbackId);
  
      // Update the product to remove the deleted feedback ID
      const product = await Product.findById(feedback.product);
      if (product) {
        product.feedbacks.pull(feedbackId);
        await product.save();
      }
  
      // Respond with the deleted feedback ID in a JSON response
      return res.status(200).json({
        data: {
          message: 'Feedback deleted',
          feedbackId: feedbackId,
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
  