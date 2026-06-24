const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// Protect routes - Verify JWT Token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    console.error(`[AUTH ERROR] ${req.method} ${req.originalUrl} - Status: 401 - Message: No token provided.`);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is missing.');
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Get user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      console.error(`[AUTH ERROR] ${req.method} ${req.originalUrl} - Status: 401 - Message: User not found with ID ${decoded.id}.`);
      return res.status(401).json({
        success: false,
        message: 'No user found with this id'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(`[AUTH ERROR] ${req.method} ${req.originalUrl} - Status: 401 - Message: Invalid or expired token. Error: ${err.message}`);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid or expired token.'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.error(`[AUTH ERROR] ${req.method} ${req.originalUrl} - Status: 403 - Message: Role '${req.user ? req.user.role : 'Guest'}' is not authorized.`);
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this route.`
      });
    }
    next();
  };
};
