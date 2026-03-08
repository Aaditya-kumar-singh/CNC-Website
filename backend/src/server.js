require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

// ─── Startup environment validation ─────────────────────────────────────────
// Fail loudly if critical env vars are missing rather than silently misbehaving
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'MONGODB_URI'];
const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missing.length > 0) {
    console.error(`\n❌ FATAL: Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env file and try again.\n');
    process.exit(1);
}

// Non-fatal defaults for optional-but-recommended vars
if (!process.env.JWT_EXPIRES_IN) {
    console.warn('[Config] JWT_EXPIRES_IN not set — defaulting to 7d');
    process.env.JWT_EXPIRES_IN = '7d'; // Fix #1: tokens no longer immortal
}
if (!process.env.FRONTEND_URL) {
    console.warn('[Config] FRONTEND_URL not set — defaulting to http://localhost:5173');
}
// ─────────────────────────────────────────────────────────────────────────────

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT} in ${process.env.NODE_ENV} mode...`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
