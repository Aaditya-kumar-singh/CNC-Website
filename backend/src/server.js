const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Determine environment
const envName = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), `.env.${envName}`);

// Load appropriate environment file if it exists, otherwise fallback to default .env
if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
} else {
    dotenv.config();
}
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
const startCartAbandonmentJob = require('./cron/abandonedCart.job');
const logger = require('./config/logger');

// ─── Startup environment validation ─────────────────────────────────────────
// Fail loudly if critical env vars are missing rather than silently misbehaving
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'MONGODB_URI'];
const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missing.length > 0) {
    logger.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    logger.error('Please check your .env file and try again.');
    process.exit(1);
}

// Non-fatal defaults for optional-but-recommended vars
if (!process.env.JWT_EXPIRES_IN) {
    logger.warn('[Config] JWT_EXPIRES_IN not set — defaulting to 7d');
    process.env.JWT_EXPIRES_IN = '7d';
}
if (!process.env.FRONTEND_URL) {
    logger.warn('[Config] FRONTEND_URL not set — defaulting to http://localhost:5173');
}
// ─────────────────────────────────────────────────────────────────────────────

// Connect to Database
connectDB();

// Start Background Jobs
startCartAbandonmentJob();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    logger.error({ message: 'UNHANDLED REJECTION 💥 Shutting down...', name: err.name, error: err.message });
    server.close(() => {
        process.exit(1);
    });
});
