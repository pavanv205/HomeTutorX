import { createRequire } from 'module';
import mongoose from 'mongoose';

const require = createRequire(import.meta.url);
const app = require('../backend/server.js');

// Standard Vercel/Serverless MongoDB connection caching pattern using global object
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tutorconnect';
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');

  if (cached.conn) {
    console.log(`[MongoDB Cache] Reusing existing active connection to: ${maskedUri}`);
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`[MongoDB Connection] Initiating new connection handshake to: ${maskedUri}`);
    const opts = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then(async (mongooseInstance) => {
      console.log(`[MongoDB Connection] Connected successfully to: ${maskedUri}`);
      
      // Seeding database default accounts inside connection callback
      try {
        const User = require('../backend/models/User');
        const adminExists = await User.findOne({ role: 'Admin' });
        if (!adminExists) {
          await User.create({
            name: 'System Admin',
            email: 'admin@tutorconnect.com',
            password: 'adminpassword123',
            role: 'Admin'
          });
          console.log('[MongoDB Seeding] Default Admin Account Seeded');
        }
      } catch (seedErr) {
        console.error('[MongoDB Seeding Error] Admin seeding failed:', seedErr.message);
      }

      try {
        const User = require('../backend/models/User');
        const Tutor = require('../backend/models/Tutor');
        const tutorExists = await User.findOne({ email: 'tutor@tutorconnect.com' });
        if (!tutorExists) {
          const user = await User.create({
            name: 'Default Tutor',
            email: 'tutor@tutorconnect.com',
            password: 'tutor123',
            role: 'Tutor'
          });
          
          const tutor = await Tutor.create({
            userId: user._id,
            fullName: 'Default Tutor',
            mobile: '9876543210',
            email: 'tutor@tutorconnect.com',
            gender: 'Male',
            age: 30,
            qualification: 'M.Sc. Physics',
            university: 'Stanford University',
            graduationYear: 2018,
            experience: 5,
            subjects: ['Mathematics', 'Physics'],
            classes: ['Class 9-10', 'Class 11-12'],
            teachingMode: 'Both',
            hourlyRate: 50,
            monthlyRate: 8000,
            streetAddress: 'Madhapur',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500081',
            lat: 17.4483,
            lng: 78.3741,
            bio: 'Passionate mathematics and physics tutor with 5+ years of experience helping students achieve academic excellence.',
            photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
            resumeUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
            isVerified: true
          });

          user.tutorProfile = tutor._id;
          await user.save();
          console.log('[MongoDB Seeding] Default Tutor Account Seeded');
        }
      } catch (seedErr) {
        console.error('[MongoDB Seeding Error] Tutor seeding failed:', seedErr.message);
      }

      return mongooseInstance;
    }).catch((err) => {
      console.error(`[MongoDB Connection Error] Failed to connect: ${err.message}`);
      cached.promise = null; // Clear cached promise on failure to allow retry
      throw err;
    });
  } else {
    console.log('[MongoDB Cache] Awaiting existing in-progress connection promise...');
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Vercel Serverless Function] MongoDB initialization failed:', err);
  }
  return app(req, res);
}
