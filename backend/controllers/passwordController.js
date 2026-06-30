const PasswordReset = require('../models/PasswordReset');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { sendOtp } = require('../services/emailService');

// In-memory OTP storage for fallback mode when MongoDB is offline
const memoryPasswordResets = [];

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
    let user;
    const isOffline = mongoose.connection.readyState !== 1;

    if (isOffline) {
      console.log('🔌 MongoDB is offline. Running forgotPassword in Fallback mode.');
      const dbFallback = require('../utils/dbFallback');
      const usersList = await dbFallback.getUsers();
      user = usersList.find(u => u.email === email);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOtp(6);
    const expiresIn = parseInt(process.env.OTP_EXPIRATION_MINUTES, 10) || 10;
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);

    if (isOffline) {
      // Upsert record in-memory
      const existingIdx = memoryPasswordResets.findIndex(r => r.email === email);
      if (existingIdx !== -1) {
        memoryPasswordResets.splice(existingIdx, 1);
      }
      memoryPasswordResets.push({ email, otp, expiresAt, createdAt: new Date() });
    } else {
      // Upsert OTP record in DB
      await PasswordReset.findOneAndUpdate(
        { email },
        { otp, expiresAt, createdAt: new Date() },
        { upsert: true, new: true }
      );
    }

    await sendOtp(email, otp);

    const responsePayload = { success: true, message: 'OTP sent to email' };
    const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if (process.env.NODE_ENV !== 'production' || !isSmtpConfigured) {
      responsePayload.devModeOtp = otp;
    }

    return res.status(200).json(responsePayload);
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
    let record;
    const isOffline = mongoose.connection.readyState !== 1;

    if (isOffline) {
      record = memoryPasswordResets.find(r => r.email === email && r.otp === otp);
    } else {
      record = await PasswordReset.findOne({ email, otp });
    }

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
    let record;
    const isOffline = mongoose.connection.readyState !== 1;

    if (isOffline) {
      record = memoryPasswordResets.find(r => r.email === email && r.otp === otp);
    } else {
      record = await PasswordReset.findOne({ email, otp });
    }

    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    if (isOffline) {
      const dbFallback = require('../utils/dbFallback');
      const usersList = await dbFallback.getUsers();
      const user = usersList.find(u => u.email === email);
      if (user) {
        user.password = hashed;
      }
      
      // Clean up used OTP in-memory
      const existingIdx = memoryPasswordResets.findIndex(r => r.email === email && r.otp === otp);
      if (existingIdx !== -1) {
        memoryPasswordResets.splice(existingIdx, 1);
      }
    } else {
      await User.findOneAndUpdate({ email }, { password: hashed });
      // Clean up used OTP in DB
      await PasswordReset.deleteOne({ email, otp });
    }

    return res.status(200).json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err);
    next(err);
  }
};
