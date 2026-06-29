const PasswordReset = require('../models/PasswordReset');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendOtp } = require('../services/emailService');

// Generate a numeric OTP of given length
function generateOtp(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

// @desc    Initiate password reset – send OTP to email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Ensure user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOtp(6);
    const expiresIn = parseInt(process.env.OTP_EXPIRATION_MINUTES, 10) || 10;
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);

    // Upsert OTP record
    await PasswordReset.findOneAndUpdate(
      { email },
      { otp, expiresAt, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendOtp(email, otp);

    return res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err);
    next(err);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }
  try {
    const record = await PasswordReset.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    return res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (err) {
    console.error('[VERIFY OTP ERROR]', err);
    next(err);
  }
};

// @desc    Reset password after OTP verification
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body || {};
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
  }
  try {
    const record = await PasswordReset.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });
    // Clean up used OTP
    await PasswordReset.deleteOne({ email, otp });
    return res.status(200).json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err);
    next(err);
  }
};
