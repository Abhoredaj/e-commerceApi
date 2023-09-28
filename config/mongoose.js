// Import the Mongoose library
const mongoose = require('mongoose');
require('dotenv').config();

const userName = process.env.USERNAME1
const passWord = process.env.PASSWORD
const dbName = process.env.DATABASE

// Connect to the MongoDB database using the specified URL
uri = `mongodb+srv://${userName}:${passWord}@cluster0.y53e56l.mongodb.net/${dbName}?retryWrites=true&w=majority`
// mongoose.connect('mongodb://127.0.0.1:27017/my-ecommerce-db');

// Alternative connection string for MongoDB Atlas (commented out)
mongoose.connect(uri, {
     useNewUrlParser: true
 });

// Get a reference to the database connection
const db = mongoose.connection;

// Event listener for MongoDB connection errors
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

// Event listener for when the MongoDB connection is successfully established
db.once('open', function(){
    // Log a message when the connection is open
    console.log('Connected to Database :: MongoDB');
});

// Export the database connection for use in other parts of the application
module.exports = db;
