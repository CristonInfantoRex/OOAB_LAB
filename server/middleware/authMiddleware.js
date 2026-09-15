const jwt = require('jsonwebtoken');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const { memoryUsers } = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'blood_bank_secret_key_2026_super_secure';

const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getDBStatus()) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Fallback to in-memory store
    const memUser = memoryUsers.find(u => u._id === decoded.id || u.email === decoded.email);
    if (memUser) {
      const { password, ...userWithoutPassword } = memUser;
      req.user = userWithoutPassword;
      return next();
    }

    // If decoded payload itself has role/email info
    req.user = {
      _id: decoded.id,
      email: decoded.email,
      name: decoded.name || 'User',
      role: decoded.role || 'user',
      bloodGroup: decoded.bloodGroup || 'O+'
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token verification failed', error: error.message });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
};

module.exports = { verifyToken, requireAdmin };
