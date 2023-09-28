// Import required libraries
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// Create an Express application
const app = express();

// Define the port where the server will listen
const port = 8000;

// Require the Mongoose database connection
const db = require('./config/mongoose');

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data
app.use(express.json()); // Parse JSON data

// Include the routes defined in the './routes' module
app.use('/', require('./routes'));

// Start the Express server and listen on the specified port
app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    // Server is running, and the API is live
    console.log(`API is live on http://localhost:${port}/products`);
});
