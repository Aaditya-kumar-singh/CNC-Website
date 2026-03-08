const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { limiter } = require('./middlewares/rateLimit.middleware');

// Routes
const authRouter = require('./routes/auth.routes');
const designRouter = require('./routes/design.routes');
const paymentRouter = require('./routes/payment.routes');
const downloadRouter = require('./routes/download.routes');
const adminRouter = require('./routes/admin.routes');
const reviewRouter = require('./routes/review.routes');

const app = express();
const path = require('path');

// 0. Serve static local uploads in development fallback
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 1. CORS setup (MUST be first so even rate-limited or blocked requests get CORS headers)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// 2. Security HTTP headers
app.use(helmet());

// 3. Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Rate Limiter (100 requests from same IP per 15 minutes)
app.use('/api', limiter);

// 5. Body parser
app.use(express.json({ limit: '50kb' })); // Raised from 10kb — payment/review payloads need more headroom

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/designs', designRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/downloads', downloadRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handle undefined routes
app.all('/{*path}', (req, res, next) => {
    res.status(404).json({ error: `Can't find ${req.originalUrl} on this server!` });
});

// Global Error Handling Middleware (Catches Multer limit errors, malformed JSON, etc)
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // 1. Handle Multer specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = 'File is too large. Max allowed size is 50MB.';
    }

    // 2. Mongoose Bad ObjectId (Cast Error)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}.`;
    }

    // 3. Mongoose Duplicate Key (Fix #3: use err.keyValue — err.errmsg is deprecated in Mongoose v7+)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        const value = err.keyValue?.[field];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already in use. Please choose another.`;
    }

    // 4. Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors).map(el => el.message);
        message = `Invalid input data. ${errors.join('. ')}`;
    }

    // Only log real 500 server crashes — not 400-level user errors (bad login, etc.)
    if (statusCode >= 500) {
        console.error('Unhandled Server Error 💥:', err);
    }

    res.status(statusCode).json({ error: message });
});

module.exports = app;
