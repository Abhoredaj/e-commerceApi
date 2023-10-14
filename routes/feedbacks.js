const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedback_controller');
const verifyToken = require('../config/verifyToken'); // Import the verifyToken middleware

router.post('/create', verifyToken, feedbackController.createFeedback);
router.delete('/delete/:feedbackID', verifyToken, feedbackController.deleteFeedback);


module.exports = router;