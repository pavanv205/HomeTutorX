const express = require('express');
const router = express.Router();
const { getDashboardStats, verifyTutor, adminUpdateTutor, getStudents } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getDashboardStats);
router.get('/students', getStudents);
router.put('/tutors/:id/verify', verifyTutor);
router.put('/tutors/:id', adminUpdateTutor);

module.exports = router;
