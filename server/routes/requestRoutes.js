const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requestController.createRequest);
router.get('/mine', verifyToken, requestController.getMyRequests);
router.get('/', verifyToken, requireAdmin, requestController.getAllRequests);
router.put('/:id/status', verifyToken, requireAdmin, requestController.updateRequestStatus);

module.exports = router;
