const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const { memoryUsers } = require('../config/store');

// GET /api/donors/search?bloodGroup=O- (Admin)
exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup } = req.query;

    if (!bloodGroup) {
      return res.status(400).json({ success: false, message: 'bloodGroup query parameter is required' });
    }

    const targetGroup = bloodGroup.toUpperCase();

    if (getDBStatus()) {
      const donors = await User.find({
        bloodGroup: targetGroup,
        role: 'user'
      }).select('-password').sort({ lastDonationDate: 1 });

      return res.json({ success: true, bloodGroup: targetGroup, count: donors.length, donors });
    }

    // In-memory search
    const donors = memoryUsers.filter(u => 
      u.role === 'user' && 
      u.bloodGroup.toUpperCase() === targetGroup
    ).map(({ password, ...rest }) => rest);

    return res.json({ success: true, bloodGroup: targetGroup, count: donors.length, donors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
