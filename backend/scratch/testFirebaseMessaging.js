try {
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getMessaging } = require('firebase-admin/messaging');
  console.log('initializeApp is defined:', typeof initializeApp === 'function');
  console.log('cert is defined:', typeof cert === 'function');
  console.log('getMessaging is defined:', typeof getMessaging === 'function');
} catch (err) {
  console.error('Import error:', err.message);
}
