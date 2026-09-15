import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import API from '../api/axios';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeRecipient, setActiveRecipient] = useState(null);

  // Initialize socket
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Join Room when user logs in
  useEffect(() => {
    if (socket && user) {
      const roomId = user.role === 'admin' ? 'admin_room' : user._id || user.id;
      socket.emit('join_room', roomId);

      // Listen for messages
      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      // Load initial chat history
      const fetchHistory = async () => {
        try {
          const targetId = user.role === 'admin' ? activeRecipient?._id || 'usr_donor_001' : user._id;
          const res = await API.get(`/chat/history?userId=${targetId}`);
          if (res.data.success) {
            setMessages(res.data.messages || []);
          }
        } catch (err) {
          console.error('Error loading chat history:', err);
        }
      };

      fetchHistory();
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [socket, user, activeRecipient]);

  const sendMessage = async (messageText, receiverId) => {
    if (!messageText.trim() || !user) return;

    const targetReceiver = receiverId || (user.role === 'admin' ? activeRecipient?._id || 'usr_donor_001' : 'usr_admin_001');

    const msgData = {
      senderId: user._id || user.id,
      senderName: user.name,
      senderRole: user.role,
      receiverId: targetReceiver,
      message: messageText
    };

    if (socket) {
      socket.emit('send_message', msgData);
    }

    // Persist via HTTP API as well
    try {
      await API.post('/chat/message', {
        receiverId: targetReceiver,
        message: messageText
      });
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        setIsOpen,
        sendMessage,
        activeRecipient,
        setActiveRecipient
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
