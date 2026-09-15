const { getDBStatus } = require('../config/db');
const Request = require('../models/Request');
const BloodInventory = require('../models/BloodInventory');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { memoryRequests, memoryInventory, memoryDonations, memoryUsers } = require('../config/store');

// POST /api/requests (Submit Donate or Request Blood slot form)
exports.createRequest = async (req, res) => {
  try {
    const { type, bloodGroup, units, preferredTime, reason, hospital } = req.body;

    if (!type || !bloodGroup || !units) {
      return res.status(400).json({ success: false, message: 'Type, bloodGroup, and units are required' });
    }

    const userId = req.user._id || req.user.id;
    const userName = req.user.name;
    const userPhone = req.user.phone || 'N/A';

    if (getDBStatus()) {
      const newRequest = await Request.create({
        requestedBy: userId,
        userName,
        userPhone,
        type,
        bloodGroup,
        units: Number(units),
        preferredTime: preferredTime || '',
        reason: reason || '',
        hospital: hospital || 'General Hospital',
        status: 'pending'
      });

      return res.status(201).json({
        success: true,
        message: `${type === 'donate' ? 'Donation slot booked' : 'Blood request submitted'} successfully. Status: Pending approval.`,
        request: newRequest
      });
    }

    // In-memory fallback
    const memReq = {
      _id: `req_${Date.now()}`,
      requestedBy: userId,
      userName,
      userPhone,
      type,
      bloodGroup,
      units: Number(units),
      preferredTime: preferredTime || '',
      reason: reason || '',
      hospital: hospital || 'General Hospital',
      status: 'pending',
      createdAt: new Date()
    };

    memoryRequests.unshift(memReq);

    return res.status(201).json({
      success: true,
      message: `${type === 'donate' ? 'Donation slot booked' : 'Blood request submitted'} successfully. Status: Pending approval.`,
      request: memReq
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/requests/mine
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getDBStatus()) {
      const requests = await Request.find({ requestedBy: userId }).sort({ createdAt: -1 });
      return res.json({ success: true, requests });
    }

    const requests = memoryRequests.filter(r => String(r.requestedBy) === String(userId));
    return res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/requests (Admin)
exports.getAllRequests = async (req, res) => {
  try {
    if (getDBStatus()) {
      const requests = await Request.find({}).populate('requestedBy', 'name email phone').sort({ createdAt: -1 });
      return res.json({ success: true, requests });
    }

    return res.json({ success: true, requests: memoryRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/requests/:id/status (Admin - Approve, Fulfill, Reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'fulfilled', 'rejected'

    if (!['pending', 'approved', 'fulfilled', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (getDBStatus()) {
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      const oldStatus = request.status;
      request.status = status;
      await request.save();

      // If status changed to 'fulfilled'
      if (oldStatus !== 'fulfilled' && status === 'fulfilled') {
        let inv = await BloodInventory.findOne({ bloodGroup: request.bloodGroup });
        if (!inv) inv = new BloodInventory({ bloodGroup: request.bloodGroup, units: 0 });

        if (request.type === 'donate') {
          inv.units += request.units;
          // Record Donation
          await Donation.create({
            donor: request.requestedBy,
            bloodGroup: request.bloodGroup,
            units: request.units,
            notes: 'Donation fulfilled'
          });

          // Update user lastDonationDate & eligibility
          await User.findByIdAndUpdate(request.requestedBy, {
            lastDonationDate: new Date(),
            eligible: true
          });
        } else if (request.type === 'request') {
          inv.units = Math.max(0, inv.units - request.units);
        }
        inv.lastUpdated = new Date();
        await inv.save();
      }

      return res.json({ success: true, message: `Request status updated to ${status}`, request });
    }

    // In-memory update
    const reqIndex = memoryRequests.findIndex(r => String(r._id) === String(id));
    if (reqIndex === -1) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const request = memoryRequests[reqIndex];
    const oldStatus = request.status;
    request.status = status;

    if (oldStatus !== 'fulfilled' && status === 'fulfilled') {
      const inv = memoryInventory.find(i => i.bloodGroup === request.bloodGroup);
      if (inv) {
        if (request.type === 'donate') {
          inv.units += request.units;
          memoryDonations.push({
            _id: `don_${Date.now()}`,
            donor: request.requestedBy,
            donorName: request.userName,
            bloodGroup: request.bloodGroup,
            units: request.units,
            date: new Date()
          });

          const user = memoryUsers.find(u => String(u._id) === String(request.requestedBy));
          if (user) {
            user.lastDonationDate = new Date();
          }
        } else if (request.type === 'request') {
          inv.units = Math.max(0, inv.units - request.units);
        }
        inv.lastUpdated = new Date();
      }
    }

    return res.json({ success: true, message: `Request status updated to ${status}`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
