const Tutor = require('../models/Tutor');
const User = require('../models/User');
const mongoose = require('mongoose');
// No fallback logic used

// @desc    Get dashboard metrics / stats for admin
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const StudentRequest = require('../models/StudentRequest');

    const totalTutors = await Tutor.countDocuments();
    const verifiedTutors = await Tutor.countDocuments({ isVerified: true });
    const pendingTutors = await Tutor.countDocuments({ isVerified: false });

    const totalRequests = await StudentRequest.countDocuments();
    const pendingRequests = await StudentRequest.countDocuments({ status: 'Pending' });
    const contactedRequests = await StudentRequest.countDocuments({ status: 'Contacted' });
    const resolvedRequests = await StudentRequest.countDocuments({ status: 'Resolved' });

    res.status(200).json({
      success: true,
      data: {
        tutors: {
          total: totalTutors,
          verified: verifiedTutors,
          pending: pendingTutors
        },
        bookings: {
          total: totalRequests,
          pending: pendingRequests,
          contacted: contactedRequests,
          assigned: resolvedRequests
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify / Approve a tutor profile
// @route   PUT /api/admin/tutors/:id/verify
// @access  Private (Admin only)
exports.verifyTutor = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const targetStatus = isVerified !== undefined ? isVerified : true;
    const updateData = {
      isVerified: targetStatus,
      verifiedAt: targetStatus ? new Date() : null,
      verifiedDate: targetStatus ? new Date() : null
    };

    const tutor = await Tutor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    res.status(200).json({
      success: true,
      message: `Tutor verification status set to: ${tutor.isVerified}`,
      data: tutor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin update tutor profile directly (e.g. edit coordinates, name, etc)
// @route   PUT /api/admin/tutors/:id
// @access  Private (Admin only)
exports.adminUpdateTutor = async (req, res, next) => {
  try {
    const tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (err) {
    next(err);
  }
};
