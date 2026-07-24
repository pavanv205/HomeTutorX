const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, getVapidPublicKey, subscribePush, subscribeFcm } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All notification routes are protected
router.use(protect);

router.get('/', getNotifications);
router.get('/vapid-public-key', getVapidPublicKey);
router.post('/subscribe', subscribePush);
router.post('/subscribe-fcm', subscribeFcm);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
