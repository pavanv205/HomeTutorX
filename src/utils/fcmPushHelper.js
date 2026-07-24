import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import api from '../services/api';
import { showLocalNotification } from './nativeNotificationHelper';

/**
 * Registers client device for FCM native push notifications, handles incoming
 * pushes in the foreground, and processes banner clicks.
 */
export async function registerFcmPush() {
  if (!Capacitor.isNativePlatform()) {
    console.log('[FCM FRONTEND] Not running on a native platform. Skipping FCM registration.');
    return;
  }

  try {
    // 1. Check and request notification permissions
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('[FCM FRONTEND] System-level push notification permission denied by user.');
      return;
    }

    // 2. Register device with Firebase Cloud Messaging
    await PushNotifications.register();

    // 3. Listen for successful registration and upload FCM token to backend
    await PushNotifications.addListener('registration', async (token) => {
      console.log('[FCM FRONTEND] Native registration success. FCM Token:', token.value);
      try {
        await api.post('/notifications/subscribe-fcm', { token: token.value });
        console.log('[FCM FRONTEND] FCM token successfully saved in user database.');
      } catch (err) {
        console.error('[FCM FRONTEND] Failed to upload FCM token to backend:', err.message);
      }
    });

    // 4. Handle registration errors
    await PushNotifications.addListener('registrationError', (error) => {
      console.error('[FCM FRONTEND] Native FCM registration failed:', error.error);
    });

    // 5. Handle push received while app is running in the foreground (Force a local heads-up banner)
    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[FCM FRONTEND] Foreground push received:', notification);
      
      const cleanMessage = String(notification.body || '')
        .replace(/a new trial class/gi, 'a new class')
        .replace(/a new trail class/gi, 'a new class')
        .replace(/new trial class/gi, 'new class')
        .replace(/new trail class/gi, 'new class')
        .replace(/trial class request/gi, 'class request')
        .replace(/trail class request/gi, 'class request')
        .replace(/trial/gi, 'class')
        .replace(/trail/gi, 'class');

      // Schedule a local alert using the max importance channel for peeking
      showLocalNotification(notification.title || 'HomeTutorX Alert', cleanMessage);
    });

    // 6. Handle notification click actions (Tapping system banner)
    await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[FCM FRONTEND] Notification action click performed:', action);
      
      const redirectUrl = action.notification.data?.url;
      if (redirectUrl) {
        console.log('[FCM FRONTEND] Redirecting user to:', redirectUrl);
        window.location.href = redirectUrl;
      }
    });

  } catch (err) {
    console.error('[FCM FRONTEND] Native push configuration failed:', err.message);
  }
}
