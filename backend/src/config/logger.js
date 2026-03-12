const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Dev format: colourful, human-readable
const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'HH:mm:ss' }),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack, ...meta }) => {
        const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}]: ${stack || message}${extras}`;
    })
);

// Production format: structured JSON for log aggregators (Datadog, Logtail, etc.)
const prodFormat = combine(
    timestamp(),
    errors({ stack: true }),
    json()
);

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
    transports: [
        // Always log to console
        new winston.transports.Console(),

        // Errors only → error.log (keep this small and focused)
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024,  // 5MB max per file
            maxFiles: 3,                 // Keep last 3 rotations
        }),

        // All logs → combined.log
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 10 * 1024 * 1024, // 10MB max per file
            maxFiles: 5,
        }),
    ],

    // Don't crash on unhandled exceptions — log them instead
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(logsDir, 'exceptions.log') })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(logsDir, 'rejections.log') })
    ],
});

module.exports = logger;
