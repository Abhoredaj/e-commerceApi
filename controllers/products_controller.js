// Import the Product model for database operations
const Product = require('../models/product');
const Feedback = require('../models/feedback');

// Controller function to fetch all products
module.exports.products = async function(req, res){
    // Retrieve all products from the database and sort them by timestamps in descending order
    const products = await Product.find().sort({ timestamps: -1 });

    // Map the product data to a simplified format
    const productsData = products.map(product => {
      return {
        id: product._id,
        name: product.name,
        quantity: product.quantity,
      };
    });
  
    // Respond with the product data in a JSON response
    return res.status(200).json({
        data: {
          products: productsData
        }
    });
}

// Controller function to create a new product
module.exports.create = async function(req, res){
    try{
        // Create a new Product document with data from the request body
        const userId = req.userId;

        // Retrieve all product names for the user (case-insensitive)
        const existingProductNames = await Product.find(
          {
            user: userId,
          },
          'name -_id' // Project only the 'name' field and exclude '_id'
        ).lean();

        // Check if a product with the same name (case-insensitive) already exists for the user
        const productWithSameName = existingProductNames.find(
          (product) => product.name.toLowerCase() === productName.toLowerCase()
        );

        if (productWithSameName) {
          // If a product with the same name already exists (case-insensitive), you can choose to handle it as per your requirements.
          // For example, return an error response.
          return res.status(400).json({
            message: 'Product with the same name already exists for this user',
          });
        }

        const newProduct = new Product({
            name: req.body.name,
            quantity: req.body.quantity,
            user: userId
        });
        // Save the new product to the database
        await newProduct.save();
        
        // Respond with the newly created product data in a JSON response
        return res.status(200).json({ 
            data: {
              product: newProduct,
            }
          });
    }catch(err){
        console.log('********', err);
        // Respond with a 500 Internal Server Error if an error occurs
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// Controller function to delete a product by its ID
module.exports.delete = async function (req, res) {
  try {
    const productId = req.params.productID;
    const userId = req.userId; // Get the user ID from the authentication token

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user is authorized to delete the product
    if (product.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not allowed to delete this product' });
    }

    // Delete associated feedbacks, if any
    const feedbackIds = product.feedbacks; // Assuming feedbacks is an array of feedback IDs

    if (feedbackIds && feedbackIds.length > 0) {
      // Delete the feedbacks from the feedback collection
      await Feedback.deleteMany({ _id: { $in: feedbackIds } });
    }

    // Delete the product
    await product.remove();

    // Respond with the deleted product's ID and a success message in a JSON response
    return res.status(200).json({
      data: {
        productId: productId,
        message: 'Product and associated feedbacks deleted',
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


// Controller function to update a product's quantity
module.exports.updateQuantity = async function(req, res){
    try {
        // Find the product by its ID
        const product = await Product.findById(req.params.productID);
        const userId = req.userId; // Get the user ID from the authentication token

        // Check if the user is authorized to delete the product
        if (product.user.toString() !== userId) {
          return res.status(403).json({ message: 'Unauthorized: You are not allowed to delete this product' });
        }

        // Calculate the updated quantity based on the query parameter
        const updatedQuantity = parseInt(product.quantity) + parseInt(req.query.number);
        if (updatedQuantity < 0) {
          // Respond with a 400 Bad Request status and an error message if quantity becomes negative
          return res.status(400).json({
            error: 'Product quantity cannot be less than zero',
          });
        }

        // Update the product's quantity
        product.quantity = updatedQuantity;

        // Save the updated product to the database
        await product.save();
    
        // Format the product data to include only relevant fields
        const productData = {
          id: product._id,
          name: product.name,
          quantity: product.quantity,
        };
    
        // Respond with the updated product data and a success message in a JSON response
        res.json({
          data: {
            product: productData,
            message: 'Updated successfully',
          },
        });
      } catch (error) {
        // Respond with a 500 Internal Server Error if an error occurs
        res.status(500).json({
          error: error.message,
        });
      }
    };
