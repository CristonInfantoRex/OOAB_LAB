const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  userPhone: { type: String },
  type: { type: String, enum: ['donate', 'request'], required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  units: { type: Number, required: true, default: 1 },
  preferredTime: { type: String, default: '' },
  reason: { type: String, default: '' },
  hospital: { type: String, default: 'General Hospital' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'fulfilled', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
