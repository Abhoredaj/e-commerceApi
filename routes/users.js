const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');
const verifyToken = require('../config/verifyToken'); // Import the verifyToken middleware

router.get('/profile/:id', verifyToken, usersController.profile);
router.post('/updateName/:id', verifyToken, usersController.updateUserName);
router.post('/updatePassword/:id', usersController.updateUserName);
router.get('/', usersController.searchUsers);

router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.post('/refreshToken', usersController.refreshToken);
router.get('/logout/:id', verifyToken, usersController.logout);

module.exports = router;