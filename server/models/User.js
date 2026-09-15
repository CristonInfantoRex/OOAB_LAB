const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastDonationDate: { type: Date, default: null },
  eligible: { type: Boolean, default: true },
  address: { type: String, default: '' },
  city: { type: String, default: 'Metropolis' },
  state: { type: String, default: 'Central Region' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
