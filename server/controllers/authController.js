const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const { memoryUsers } = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'blood_bank_secret_key_2026_super_secure';

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      name: user.name, 
      role: user.role, 
      bloodGroup: user.bloodGroup 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, bloodGroup, address, city, state, role } = req.body;

    if (!name || !email || !phone || !password || !bloodGroup) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    if (getDBStatus()) {
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email or Phone already registered' });
      }

      const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        bloodGroup,
        role: assignedRole,
        address: address || '',
        city: city || 'Metropolis',
        state: state || 'Central State'
      });

      const token = generateToken(newUser);
      const userRes = newUser.toObject();
      delete userRes.password;

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: userRes
      });
    }

    // In-memory fallback
    const existsInMemory = memoryUsers.find(u => u.email === email || u.phone === phone);
    if (existsInMemory) {
      return res.status(400).json({ success: false, message: 'Email or Phone already registered' });
    }

    const newMemUser = {
      _id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      password: hashedPassword,
      bloodGroup,
      role: assignedRole,
      eligible: true,
      lastDonationDate: null,
      address: address || '',
      city: city || 'Metropolis',
      state: state || 'Central State',
      createdAt: new Date()
    };

    memoryUsers.push(newMemUser);
    const token = generateToken(newMemUser);
    const { password: _, ...userNoPass } = newMemUser;

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userNoPass
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user);
      const userRes = user.toObject();
      delete userRes.password;

      return res.json({ success: true, message: 'Logged in successfully', token, user: userRes });
    }

    // In-memory fallback
    const memUser = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!memUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(memUser);
    const { password: _, ...userNoPass } = memUser;

    return res.json({ success: true, message: 'Logged in successfully', token, user: userNoPass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Google OAuth Handler
exports.googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, bloodGroup } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Google authentication email required' });
    }

    let user;
    if (getDBStatus()) {
      user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: name || 'Google User',
          email,
          phone: `G-${Date.now().toString().slice(-8)}`,
          password: await bcrypt.hash('oauth_dummy_pass', 10),
          bloodGroup: bloodGroup || 'O+',
          role: 'user'
        });
      }
    } else {
      user = memoryUsers.find(u => u.email === email);
      if (!user) {
        user = {
          _id: `usr_g_${Date.now()}`,
          name: name || 'Google User',
          email,
          phone: `G-${Date.now().toString().slice(-8)}`,
          password: 'oauth_dummy_pass',
          bloodGroup: bloodGroup || 'O+',
          role: 'user',
          eligible: true,
          createdAt: new Date()
        };
        memoryUsers.push(user);
      }
    }

    const token = generateToken(user);
    return res.json({ success: true, message: 'Google Auth Success', token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Phone OTP
exports.sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });
  // For demo/testing: generate OTP 123456
  return res.json({ success: true, message: `OTP sent to ${phone}. (Demo OTP: 123456)`, demoOTP: '123456' });
};

// Verify Phone OTP
exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== '123456') {
    return res.status(400).json({ success: false, message: 'Invalid OTP code' });
  }

  let user;
  if (getDBStatus()) {
    user = await User.findOne({ phone });
  } else {
    user = memoryUsers.find(u => u.phone === phone);
  }

  if (!user) {
    return res.json({ success: true, isNewUser: true, message: 'OTP verified. Please complete registration form.' });
  }

  const token = generateToken(user);
  return res.json({ success: true, isNewUser: false, message: 'OTP Verified Successfully', token, user });
};

// Get Me
exports.getMe = async (req, res) => {
  return res.json({ success: true, user: req.user });
};
