const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products_controller');
const verifyToken = require('../config/verifyToken'); // Import the verifyToken middleware

// Route to fetch all products (GET /products)
router.get('/', productsController.products);

// Route to create a new product (POST /products/create)
router.post('/create', verifyToken, productsController.create);

// Route to delete a product by ID (DELETE /products/:productID)
router.delete('/:productID', verifyToken, productsController.delete);

// Route to update a product's quantity by ID (POST /products/:productID/update_quantity/)
router.post('/:productID/update_quantity/', verifyToken, productsController.updateQuantity);

module.exports = router;