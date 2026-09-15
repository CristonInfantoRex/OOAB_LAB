import React, { useState, useContext, useRef, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { X, Send, MessageSquare, Shield, Circle } from 'lucide-react';

const ChatWindow = () => {
  const { messages, isOpen, setIsOpen, sendMessage, activeRecipient } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const recipientName = user.role === 'admin' 
    ? (activeRecipient?.name || 'User Inquiry Channel')
    : 'Blood Bank Administrator';

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden animate-fade-in flex flex-col h-[520px]">
      
      {/* Chat Header */}
      <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-crimson-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-950"></span>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm text-white flex items-center">
              <span>{recipientName}</span>
            </h4>
            <span className="text-[11px] text-emerald-400 flex items-center font-medium">
              <Circle className="w-2 h-2 mr-1 fill-emerald-400" /> Socket.IO Live Channel
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-900 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50 text-crimson-500" />
            <p>No messages yet. Send a message to start real-time chat support.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = String(msg.senderId) === String(user._id || user.id);
            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-1 px-1 flex items-center space-x-1">
                  <span>{msg.senderName}</span>
                  {msg.senderRole === 'admin' && (
                    <Shield className="w-3 h-3 text-crimson-400 inline" />
                  )}
                </span>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                    isMe
                      ? 'bg-crimson-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.message}</p>
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message as ${user.name}...`}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-crimson-600 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-2xl bg-crimson-600 hover:bg-crimson-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-soft-glow flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

export default ChatWindow;
