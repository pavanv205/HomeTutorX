// Vercel Serverless Function entry point
// This file re-exports the Express app so Vercel can handle all /api/* routes
const app = require('../backend/server');

module.exports = app;
