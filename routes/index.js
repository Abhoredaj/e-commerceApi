// Import the Express library and create a router
const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');
const verifyToken = require('../config/verifyToken'); // Import the verifyToken middleware

router.get('/', verifyToken, homeController.products);
router.get('/:userId', homeController.getUserData);

router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/feedbacks', require('./feedbacks'));
console.log('router loaded');

// Export the router for use in the main Express application
module.exports = router;

