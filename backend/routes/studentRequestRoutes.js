const express = require('express');
const router = express.Router();
const studentRequestController = require('../controllers/studentRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', studentRequestController.createStudentRequest);
router.get('/', protect, authorize('Admin'), studentRequestController.getStudentRequests);
router.put('/:id/status', protect, authorize('Admin'), studentRequestController.updateStatus);

module.exports = router;
