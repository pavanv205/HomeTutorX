const { getMessaging, firebaseApp } = require('../config/firebase');

/**
 * Sends a native Firebase push notification to registered FCM device tokens.
 * @param {string[]} tokens Array of destination FCM tokens
 * @param {string} title Notification title
 * @param {string} body Notification body text
 * @param {object} data Optional key-value payload data
 * @returns {Promise<string[]>} Array of tokens that failed/expired and should be removed from the DB
 */
async function sendFcmNotification(tokens, title, body, data = {}) {
  if (!firebaseApp) {
    console.warn('[FCM SERVICE] Firebase Admin SDK is not initialized. Skipping native push delivery.');
    return [];
  }

  const validTokens = tokens.filter(t => typeof t === 'string' && t.trim() !== '');
  if (validTokens.length === 0) {
    return [];
  }

  try {
    const message = {
      notification: {
        title,
        body
      },
      data: data || {},
      tokens: validTokens,
      android: {
        notification: {
          sound: 'default',
          clickAction: 'FCM_PLUGIN_ACTIVITY',
          channelId: 'hometutorx-alerts', // Routes notifications to the high importance heads-up channel
          icon: 'ic_launcher',
          color: '#0F172A'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      }
    };

    const response = await getMessaging().sendEachForMulticast(message);
    console.log(`[FCM SERVICE] Push delivery complete. Success: ${response.successCount}, Failure: ${response.failureCount}`);
    
    // Track expired or unregistered tokens for database pruning
    const failedTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code;
        if (
          errorCode === 'messaging/invalid-registration-token' ||
          errorCode === 'messaging/registration-token-not-registered'
        ) {
          failedTokens.push(validTokens[idx]);
        }
      }
    });

    return failedTokens;
  } catch (err) {
    console.error('[FCM SERVICE] Multicast message delivery failed:', err.message);
    return [];
  }
}

module.exports = {
  sendFcmNotification
};
