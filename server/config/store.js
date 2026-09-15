const bcrypt = require('bcryptjs');

// In-Memory Data Store (Used as fallback or sync layer)
const hashedPassword = bcrypt.hashSync('admin123', 10);
const userPassword = bcrypt.hashSync('user123', 10);

const memoryUsers = [
  {
    _id: 'usr_admin_001',
    name: 'Blood Bank Admin',
    email: 'admin@bloodbank.org',
    phone: '9998887770',
    password: hashedPassword,
    bloodGroup: 'O+',
    role: 'admin',
    lastDonationDate: null,
    eligible: false,
    address: '100 Healthcare Blvd, Suite 400',
    city: 'Metropolis',
    state: 'Central State',
    createdAt: new Date('2026-01-01')
  },
  {
    _id: 'usr_donor_001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    password: userPassword,
    bloodGroup: 'A+',
    role: 'user',
    lastDonationDate: new Date('2025-11-10'),
    eligible: true,
    address: '42 Maple Street',
    city: 'Metropolis',
    state: 'Central State',
    createdAt: new Date('2026-02-15')
  },
  {
    _id: 'usr_donor_002',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '9876543211',
    password: userPassword,
    bloodGroup: 'O-',
    role: 'user',
    lastDonationDate: new Date('2025-08-01'),
    eligible: true,
    address: '77 Cyberdyne Way',
    city: 'Metropolis',
    state: 'Central State',
    createdAt: new Date('2026-02-20')
  },
  {
    _id: 'usr_donor_003',
    name: 'Michael Scott',
    email: 'michael@example.com',
    phone: '9876543212',
    password: userPassword,
    bloodGroup: 'B+',
    role: 'user',
    lastDonationDate: new Date('2026-01-10'),
    eligible: false,
    address: '1725 Slough Avenue',
    city: 'Scranton',
    state: 'Pennsylvania',
    createdAt: new Date('2026-03-01')
  }
];

const memoryInventory = [
  { _id: 'inv_1', bloodGroup: 'A+', units: 15, lastUpdated: new Date() },
  { _id: 'inv_2', bloodGroup: 'A-', units: 8, lastUpdated: new Date() },
  { _id: 'inv_3', bloodGroup: 'B+', units: 12, lastUpdated: new Date() },
  { _id: 'inv_4', bloodGroup: 'B-', units: 5, lastUpdated: new Date() },
  { _id: 'inv_5', bloodGroup: 'AB+', units: 10, lastUpdated: new Date() },
  { _id: 'inv_6', bloodGroup: 'AB-', units: 4, lastUpdated: new Date() },
  { _id: 'inv_7', bloodGroup: 'O+', units: 22, lastUpdated: new Date() },
  { _id: 'inv_8', bloodGroup: 'O-', units: 0, lastUpdated: new Date() } // 0 stock for live Find Donors demo
];

const memoryRequests = [
  {
    _id: 'req_001',
    requestedBy: 'usr_donor_001',
    userName: 'John Doe',
    userPhone: '9876543210',
    type: 'request',
    bloodGroup: 'A+',
    units: 2,
    preferredTime: 'Immediate',
    reason: 'Emergency Surgery',
    hospital: 'City Care Hospital',
    status: 'pending',
    createdAt: new Date('2026-09-14T10:00:00Z')
  },
  {
    _id: 'req_002',
    requestedBy: 'usr_donor_002',
    userName: 'Sarah Connor',
    userPhone: '9876543211',
    type: 'donate',
    bloodGroup: 'O-',
    units: 1,
    preferredTime: 'Tomorrow 10:00 AM',
    reason: 'Voluntary Donation Slot',
    hospital: 'Central Blood Bank Clinic',
    status: 'pending',
    createdAt: new Date('2026-09-14T11:30:00Z')
  }
];

const memoryDonations = [
  {
    _id: 'don_001',
    donor: 'usr_donor_001',
    donorName: 'John Doe',
    bloodGroup: 'A+',
    units: 1,
    date: new Date('2025-11-10'),
    notes: 'Routine voluntary donation'
  }
];

const memoryChats = [
  {
    _id: 'chat_001',
    senderId: 'usr_donor_001',
    senderName: 'John Doe',
    senderRole: 'user',
    receiverId: 'usr_admin_001',
    message: 'Hello! Is A+ blood available today?',
    timestamp: new Date('2026-09-14T10:05:00Z')
  },
  {
    _id: 'chat_002',
    senderId: 'usr_admin_001',
    senderName: 'Blood Bank Admin',
    senderRole: 'admin',
    receiverId: 'usr_donor_001',
    message: 'Yes John, we currently have A+ units in stock. You can submit a request on your dashboard.',
    timestamp: new Date('2026-09-14T10:06:12Z')
  }
];

module.exports = {
  memoryUsers,
  memoryInventory,
  memoryRequests,
  memoryDonations,
  memoryChats
};
