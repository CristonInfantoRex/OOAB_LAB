const { memoryChats } = require('../config/store');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket Client Connected: ${socket.id}`);

    // Join room (e.g. user ID or 'admin_room')
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Send Message
    socket.on('send_message', (data) => {
      const { senderId, senderName, senderRole, receiverId, message } = data;
      const msgObj = {
        _id: `chat_${Date.now()}`,
        senderId,
        senderName,
        senderRole,
        receiverId,
        message,
        timestamp: new Date()
      };

      memoryChats.push(msgObj);

      // Broadcast to receiver room and sender room
      io.to(receiverId).emit('receive_message', msgObj);
      io.to('admin_room').emit('receive_message', msgObj);
      socket.emit('message_sent', msgObj);
    });

    socket.on('typing', (data) => {
      socket.to(data.receiverId).emit('user_typing', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket Client Disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
