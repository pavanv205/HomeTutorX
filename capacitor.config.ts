import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hometutor.hometutorx',
  appName: 'HomeTutorX',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['hometutorx.in', '*.hometutorx.in']
  }
};

export default config;
