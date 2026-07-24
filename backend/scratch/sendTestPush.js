const mongoose = require('mongoose');
const path = require('path');
require('../config/env');
const { firebaseApp, getMessaging } = require('../config/firebase');
const User = require('../models/User');

async function diagnosticRun() {
  console.log('[DIAGNOSTIC] Connecting to database...');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hometutorx');
    console.log('[DIAGNOSTIC] Connected successfully.');
  } catch (err) {
    console.error('[DIAGNOSTIC] DB Connection failed:', err.message);
    process.exit(1);
  }

  try {
    // Find all users who have registered FCM tokens
    const registeredUsers = await User.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } });
    console.log(`[DIAGNOSTIC] Found ${registeredUsers.length} user(s) with registered device tokens.`);

    if (registeredUsers.length === 0) {
      console.warn('[DIAGNOSTIC] WARNING: No users in your database have registered FCM device tokens yet.');
      console.warn('[DIAGNOSTIC] This means the mobile app has NOT successfully registered or uploaded its token.');
      console.warn('[DIAGNOSTIC] Please ensure that you are logging into the newly built app, and that your phone is connected to the internet.');
      mongoose.disconnect();
      return;
    }

    for (const user of registeredUsers) {
      console.log(`\n--- Sending Test Push to User: ${user.name} (${user.email}) ---`);
      console.log(`Tokens: ${user.fcmTokens.length} active device(s)`);

      const message = {
        notification: {
          title: 'HomeTutorX Test Alert',
          body: 'If you see this, native Firebase push notifications are 100% working!'
        },
        tokens: user.fcmTokens,
        android: {
          notification: {
            sound: 'default',
            clickAction: 'FCM_PLUGIN_ACTIVITY',
            channelId: 'hometutorx-alerts'
          }
        }
      };

      try {
        const response = await getMessaging().sendEachForMulticast(message);
        console.log(`[DIAGNOSTIC] Firebase Response: Success=${response.successCount}, Failure=${response.failureCount}`);
        response.responses.forEach((res, i) => {
          if (res.success) {
            console.log(`  Token [${i}]: Delivered successfully.`);
          } else {
            console.error(`  Token [${i}]: Delivery failed -`, res.error.message);
          }
        });
      } catch (pushErr) {
        console.error('[DIAGNOSTIC] Firebase multicast delivery error:', pushErr.message);
      }
    }

  } catch (err) {
    console.error('[DIAGNOSTIC] Diagnostic run encountered an error:', err);
  } finally {
    mongoose.disconnect();
  }
}

diagnosticRun();
