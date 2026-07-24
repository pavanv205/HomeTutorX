import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hometutor.hometutorx',
  appName: 'HomeTutorX',
  webDir: 'dist',
  android: {
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
  },
  server: {
    androidScheme: 'https',
    allowNavigation: ['hometutorx.in', '*.hometutorx.in', '*.razorpay.com', 'api.razorpay.com', 'checkout.razorpay.com']
  }
};

export default config;
