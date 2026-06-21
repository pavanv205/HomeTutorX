const User = require('../models/User');
const Tutor = require('../models/Tutor');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getFileUrl } = require('../utils/uploadHelper');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tutorconnect_secret_key_123', {
    expiresIn: '30d'
  });
};

// @desc    Register a new tutor
// @route   POST /api/auth/register
// @access  Public
exports.registerTutor = async (req, res, next) => {
  try {
    const data = req.body || {};
    const { name, email, password, phone, mobile } = data;

    // Check if user already exists in Mongoose
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create User document first
    const user = await User.create({
      name: name || data.fullName,
      email,
      password,
      role: 'Tutor'
    });

    // Handle file upload if present
    let photoUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
    let certificateUrl = '';
    if (req.files && req.files['resume'] && req.files['resume'][0]) {
      photoUrl = getFileUrl(req.files['resume'][0]); // Cloudinary secure URL or Local URL
    } else if (req.file) {
      photoUrl = getFileUrl(req.file);
    }
    if (req.files && req.files['certificate'] && req.files['certificate'][0]) {
      certificateUrl = getFileUrl(req.files['certificate'][0]);
    }

    const parseIfJson = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        try { return JSON.parse(val); } catch (e) { return [val]; }
      }
      return [val];
    };

    // Create associated Tutor profile with all details from the form
    const tutor = await Tutor.create({
      userId: user._id,
      fullName: name || data.fullName,
      mobile: phone || mobile || 'N/A',
      email: email,
      gender: data.gender,
      age: data.age ? Number(data.age) : undefined,
      qualification: data.degree || data.qualification,
      university: data.institution || data.university,
      graduationYear: data.passingYear ? Number(data.passingYear) : undefined,
      experience: data.experienceYears ? Number(data.experienceYears) : undefined,
      subjects: parseIfJson(data.subjects),
      classes: parseIfJson(data.classes),
      teachingMode: data.teachingMode || 'Both',
      hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : undefined,
      monthlyRate: data.monthlyRate ? Number(data.monthlyRate) : undefined,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      lat: data.lat ? Number(data.lat) : undefined,
      lng: data.lng ? Number(data.lng) : undefined,
      bio: data.bio,
      photo: photoUrl,
      resumeUrl: photoUrl,
      certificateUrl: certificateUrl
    });

    // Link Tutor profile back to User
    user.tutorProfile = tutor._id;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tutorProfile: tutor._id
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (Admin or Tutor)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tutorProfile: user.tutorProfile
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // req.user is attached by protect middleware
    const user = await User.findById(req.user._id).populate('tutorProfile');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
