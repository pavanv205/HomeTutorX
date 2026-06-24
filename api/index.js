import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = require('../backend/server.js');

export default async function handler(req, res) {
  try {
    if (typeof app.connectDB === 'function') {
      await app.connectDB();
    }
  } catch (err) {
    console.error('Database connection failed in serverless function:', err);
  }
  return app(req, res);
}
