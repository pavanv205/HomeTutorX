const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Tutor = require('../models/Tutor');

async function cleanup() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected successfully.');

    const email = 'pavanvadapalli205@gmail.com';
    const normalizedEmail = email.toLowerCase().trim();

    // Find User
    const users = await User.find({ email: normalizedEmail });
    console.log(`🔍 Found ${users.length} User document(s) matching ${email}:`);
    for (const u of users) {
      console.log(` - ID: ${u._id}, Role: ${u.role}, Name: ${u.name}`);
    }

    // Find Tutor
    const tutors = await Tutor.find({ email: normalizedEmail });
    console.log(`🔍 Found ${tutors.length} Tutor profile(s) matching ${email}:`);
    for (const t of tutors) {
      console.log(` - ID: ${t._id}, Name: ${t.fullName}`);
    }

    // Delete User
    if (users.length > 0) {
      console.log('🗑️ Deleting matching User document(s)...');
      const deleteUserResult = await User.deleteMany({ email: normalizedEmail });
      console.log(`✅ Deleted ${deleteUserResult.deletedCount} User document(s).`);
    }

    // Delete Tutor (just in case)
    if (tutors.length > 0) {
      console.log('🗑️ Deleting matching Tutor document(s)...');
      const deleteTutorResult = await Tutor.deleteMany({ email: normalizedEmail });
      console.log(`✅ Deleted ${deleteTutorResult.deletedCount} Tutor document(s).`);
    }

    console.log('🎉 Cleanup complete!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

cleanup();
