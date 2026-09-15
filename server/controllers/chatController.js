const { getDBStatus } = require('../config/db');
const Chat = require('../models/Chat');
const { memoryChats } = require('../config/store');

// GET /api/chat/history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const currentUserId = req.user._id || req.user.id;
    const targetUserId = userId || currentUserId;

    if (getDBStatus()) {
      const messages = await Chat.find({
        $or: [
          { senderId: targetUserId },
          { receiverId: targetUserId }
        ]
      }).sort({ timestamp: 1 });

      return res.json({ success: true, messages });
    }

    // In-memory filter
    const messages = memoryChats.filter(c => 
      String(c.senderId) === String(targetUserId) || 
      String(c.receiverId) === String(targetUserId)
    );

    return res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/chat/message
exports.saveChatMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id || req.user.id;
    const senderName = req.user.name;
    const senderRole = req.user.role || 'user';

    if (!message || !receiverId) {
      return res.status(400).json({ success: false, message: 'Message content and receiverId required' });
    }

    if (getDBStatus()) {
      const newMsg = await Chat.create({
        senderId,
        senderName,
        senderRole,
        receiverId,
        message,
        timestamp: new Date()
      });

      return res.json({ success: true, message: newMsg });
    }

    const newMsg = {
      _id: `chat_${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      receiverId,
      message,
      timestamp: new Date()
    };

    memoryChats.push(newMsg);
    return res.json({ success: true, message: newMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
