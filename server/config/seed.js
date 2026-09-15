const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const BloodInventory = require('../models/BloodInventory');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
const Chat = require('../models/Chat');
const { memoryUsers, memoryInventory, memoryRequests, memoryDonations, memoryChats } = require('./store');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blood_bank_db');
    console.log('Connected to MongoDB for Seeding...');

    await User.deleteMany({});
    await BloodInventory.deleteMany({});
    await Request.deleteMany({});
    await Donation.deleteMany({});
    await Chat.deleteMany({});

    console.log('Cleared existing data.');

    const createdUsers = await User.insertMany(memoryUsers.map(u => ({
      ...u,
      _id: undefined
    })));
    console.log(`Seeded ${createdUsers.length} users.`);

    await BloodInventory.insertMany(memoryInventory.map(i => ({
      ...i,
      _id: undefined
    })));
    console.log('Seeded blood inventory.');

    // Map requests to real user IDs
    const johnUser = createdUsers.find(u => u.email === 'john@example.com');
    const sarahUser = createdUsers.find(u => u.email === 'sarah@example.com');

    if (johnUser && sarahUser) {
      await Request.insertMany([
        {
          requestedBy: johnUser._id,
          userName: johnUser.name,
          userPhone: johnUser.phone,
          type: 'request',
          bloodGroup: 'A+',
          units: 2,
          preferredTime: 'Immediate',
          reason: 'Emergency Surgery',
          hospital: 'City Care Hospital',
          status: 'pending'
        },
        {
          requestedBy: sarahUser._id,
          userName: sarahUser.name,
          userPhone: sarahUser.phone,
          type: 'donate',
          bloodGroup: 'O-',
          units: 1,
          preferredTime: 'Tomorrow 10:00 AM',
          reason: 'Voluntary Donation Slot',
          hospital: 'Central Blood Bank Clinic',
          status: 'pending'
        }
      ]);
      console.log('Seeded requests.');
    }

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database Seeding Error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
