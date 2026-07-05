const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createBooking);
router.get('/', protect, getBookings);

const Booking = require('../models/Booking');
const User = require('../models/User');
router.get('/diagnostic-all', async (req, res) => {
  try {
    const bookings = await Booking.find({});
    const users = await User.find({});
    res.json({ bookings, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', protect, updateBooking);

module.exports = router;
