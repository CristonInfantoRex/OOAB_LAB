const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/history', verifyToken, chatController.getChatHistory);
router.post('/message', verifyToken, chatController.saveChatMessage);

module.exports = router;
