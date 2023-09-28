// Import the Express library and create a router
const express = require('express');
const router = express.Router();

// Import the products controller to handle product-related routes
const productsController = require('../controllers/products_controller');

// Route to fetch all products (GET /products)
router.get('/products', productsController.products);

// Route to create a new product (POST /products/create)
router.post('/products/create', productsController.create);

// Route to delete a product by ID (DELETE /products/:productID)
router.delete('/products/:productID', productsController.delete);

// Route to update a product's quantity by ID (POST /products/:productID/update_quantity/)
router.post('/products/:productID/update_quantity/', productsController.updateQuantity);

// Export the router for use in the main Express application
module.exports = router;
