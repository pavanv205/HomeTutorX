const Tutor = require('../models/Tutor');
const User = require('../models/User');
const mongoose = require('mongoose');
// No fallback logic used

// @desc    Get dashboard metrics / stats for admin
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const isOffline = mongoose.connection.readyState !== 1;
    if (isOffline) {
      console.log('🔌 MongoDB is offline. Running getDashboardStats in Fallback mode.');
      const dbFallback = require('../utils/dbFallback');
      const tutorsList = await dbFallback.getTutors();
      const bookingsList = await dbFallback.getBookings();
      const usersList = await dbFallback.getUsers();
      
      const totalTutors = tutorsList.length;
      const verifiedTutors = tutorsList.filter(t => t.isVerified).length;
      const pendingTutors = tutorsList.filter(t => !t.isVerified).length;
      const totalStudents = usersList.filter(u => u.role === 'Student').length;

      const totalRequests = bookingsList.length;
      const pendingRequests = bookingsList.filter(b => b.status === 'Pending').length;
      const contactedRequests = bookingsList.filter(b => b.status === 'Contacted').length;
      const resolvedRequests = bookingsList.filter(b => b.status === 'Assigned' || b.status === 'Resolved').length;

      return res.status(200).json({
        success: true,
        data: {
          tutors: {
            total: totalTutors,
            verified: verifiedTutors,
            pending: pendingTutors
          },
          students: {
            total: totalStudents
          },
          bookings: {
            total: totalRequests,
            pending: pendingRequests,
            contacted: contactedRequests,
            assigned: resolvedRequests
          }
        }
      });
    }

    const StudentRequest = require('../models/StudentRequest');

    const totalTutors = await Tutor.countDocuments();
    const verifiedTutors = await Tutor.countDocuments({ isVerified: true });
    const pendingTutors = await Tutor.countDocuments({ isVerified: false });
    const totalStudents = await User.countDocuments({ role: 'Student' });

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
        students: {
          total: totalStudents
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

    let tutor;
    if (mongoose.connection.readyState !== 1) {
      console.log('🔌 MongoDB is offline. Running verifyTutor in Fallback mode.');
      const dbFallback = require('../utils/dbFallback');
      const tutorsList = await dbFallback.getTutors();
      tutor = tutorsList.find(t => String(t._id) === String(req.params.id));
      if (tutor) {
        tutor.isVerified = targetStatus;
        tutor.verifiedAt = targetStatus ? new Date() : null;
        tutor.verifiedDate = targetStatus ? new Date() : null;
        await dbFallback.updateTutor(req.params.id, tutor);
      }
    } else {
      tutor = await Tutor.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
    }

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
    let tutor;
    if (mongoose.connection.readyState !== 1) {
      console.log('🔌 MongoDB is offline. Running adminUpdateTutor in Fallback mode.');
      const dbFallback = require('../utils/dbFallback');
      const tutorsList = await dbFallback.getTutors();
      const existing = tutorsList.find(t => String(t._id) === String(req.params.id));
      if (existing) {
        tutor = { ...existing, ...req.body };
        await dbFallback.updateTutor(req.params.id, tutor);
      }
    } else {
      tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

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
