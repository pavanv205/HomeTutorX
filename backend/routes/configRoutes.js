const express = require('express');
const router = express.Router();
const appSettings = require('../config/appSettings');

/**
 * @desc    Get tutor registration settings dynamically
 * @route   GET /api/config/settings
 * @access  Public
 */
router.get('/settings', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      tutorRegistrationFee: appSettings.tutorRegistrationFee,
      tutorSubscriptionMonths: appSettings.tutorSubscriptionMonths,
      studentVerificationFee: appSettings.studentVerificationFee
    });
  } catch (error) {
    console.error('Failed to fetch app settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve settings.'
    });
  }
});

module.exports = router;
