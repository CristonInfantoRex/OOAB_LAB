const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/search', verifyToken, requireAdmin, donorController.searchDonors);

module.exports = router;
