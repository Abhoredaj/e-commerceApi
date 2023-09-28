// Import the Product model for database operations
const Product = require('../models/product');

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
        const newProduct = new Product({
            name: req.body.name,
            quantity: req.body.quantity
        });
        // Save the new product to the database
        await newProduct.save();
        
        // Format the product data to include only relevant fields
        const productData = {
            name: newProduct.name,
            quantity: newProduct.quantity,
        };
        
        // Respond with the newly created product data in a JSON response
        return res.status(200).json({
            data: {
              product: productData,
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
module.exports.delete = async function(req, res){
    try{
        // Find the product by its ID and delete it
        await Product.findByIdAndDelete(req.params.productID);

        // Respond with a success message in a JSON response
        return res.status(200).json({
            data: {
                message: "Product deleted"
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

// Controller function to update a product's quantity
module.exports.updateQuantity = async function(req, res){
    try {
        // Find the product by its ID
        const product = await Product.findById(req.params.productID);
    
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
