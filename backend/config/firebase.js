const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const path = require('path');
const fs = require('fs');

let firebaseApp = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('[FIREBASE SERVICE] Firebase Admin SDK initialized successfully via Environment Variable.');
  } else {
    const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      firebaseApp = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('[FIREBASE SERVICE] Firebase Admin SDK initialized successfully via local JSON file.');
    } else {
      console.warn('[FIREBASE SERVICE] Firebase credentials not found (checked process.env.FIREBASE_SERVICE_ACCOUNT and backend/firebase-service-account.json.json). Native pushes will be disabled.');
    }
  }
} catch (err) {
  console.error('[FIREBASE SERVICE] Error initializing Firebase Admin SDK:', err.message);
}

module.exports = {
  firebaseApp,
  getMessaging
};
