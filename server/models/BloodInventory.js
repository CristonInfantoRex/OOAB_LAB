const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true,
    unique: true 
  },
  units: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
