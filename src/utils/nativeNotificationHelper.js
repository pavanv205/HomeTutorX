import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export async function createNotificationChannel() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.createChannel({
      id: 'hometutorx-alerts',
      name: 'HomeTutorX Alerts',
      description: 'Heads-up visual alert banners for class requests and account verification updates',
      importance: 5, // MAX importance (High/Max peeks on top of screen)
      vibration: true,
      visibility: 1, // Visible on lock screen
      sound: null // Default notification sound
    });
    console.log('[NATIVE NOTIFICATIONS] Heads-up notification channel registered: hometutorx-alerts');
  } catch (err) {
    console.error('[NATIVE NOTIFICATIONS] Failed to create channel:', err);
  }
}

export async function requestNotificationPermission() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    // Register high importance notification channel on device first
    await createNotificationChannel();

    let status = await LocalNotifications.checkPermissions();
    if (status.receive === 'prompt' || status.receive === 'prompt-with-rationale') {
      status = await LocalNotifications.requestPermissions();
    }
    return status.receive === 'granted';
  } catch (err) {
    console.error('[NATIVE NOTIFICATIONS] Failed to check/request permission:', err);
    return false;
  }
}

export async function showLocalNotification(title, body, id = Math.floor(Math.random() * 1000000)) {
  if (!Capacitor.isNativePlatform()) {
    // Web notifications fallback
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body });
      } catch (err) {
        console.error('[NATIVE NOTIFICATIONS] Web fallback display failed:', err);
      }
    }
    return;
  }

  try {
    const isGranted = await requestNotificationPermission();
    if (!isGranted) {
      console.warn('[NATIVE NOTIFICATIONS] Permission not granted. Skipping notification display.');
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          channelId: 'hometutorx-alerts', // Route notification through high importance heads-up channel
          schedule: { at: new Date(Date.now() + 50) }, // Trigger immediately
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
    console.log('[NATIVE NOTIFICATIONS] Native alert scheduled successfully:', { title, body, id });
  } catch (err) {
    console.error('[NATIVE NOTIFICATIONS] Native scheduling failed:', err);
  }
}
