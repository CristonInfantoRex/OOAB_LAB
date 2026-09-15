const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', inventoryController.getInventory);
router.put('/:bloodGroup', verifyToken, requireAdmin, inventoryController.updateInventory);

module.exports = router;
