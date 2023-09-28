// Import the Mongoose library
const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
    // Define the 'name' field with type String, which is required and must be unique
    name: {
        type: String,
        required: true, // Indicates that 'name' is a required field
        unique: true,  // Ensures that each product has a unique name
    },
    // Define the 'quantity' field with type Number, which is required
    quantity: {
        type: Number,
        required: true, // Indicates that 'quantity' is a required field
    }
}, {
    timestamps: true // Adds 'createdAt' and 'updatedAt' timestamps to each document
});

// Create a Mongoose model named 'Product' based on the defined schema
const Product = mongoose.model('Product', productSchema);

// Export the 'Product' model for use in other parts of the application
module.exports = Product;
