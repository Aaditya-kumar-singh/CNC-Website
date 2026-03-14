const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const compression = require('compression');
const logger = require('./config/logger');
const { MAX_CNC_FILE_SIZE_BYTES } = require('./constants/upload.constants');

const xssSanitizer = require('./middlewares/sanitize.middleware');
const { limiter } = require('./middlewares/rateLimit.middleware');
const paymentController = require('./controllers/payment.controller');

const authRouter = require('./routes/auth.routes');
const designRouter = require('./routes/design.routes');
const paymentRouter = require('./routes/payment.routes');
const downloadRouter = require('./routes/download.routes');
const adminRouter = require('./routes/admin.routes');
const reviewRouter = require('./routes/review.routes');
const bundleRouter = require('./routes/bundle.routes');

const app = express();

const parseAllowedOrigins = () => {
    const configuredOrigins = [
        process.env.FRONTEND_URL,
        process.env.ADDITIONAL_ALLOWED_ORIGINS,
        'https://www.cncmarket.in',
        'https://cncmarket.in',
        'http://localhost:5173',
        'http://localhost:5174',
    ]
        .filter(Boolean)
        .flatMap((entry) => String(entry).split(','))
        .map((origin) => origin.trim())
        .filter(Boolean);

    return [...new Set(configuredOrigins)];
};

const allowedOrigins = parseAllowedOrigins();
const connectSrc = [
    "'self'",
    ...allowedOrigins,
    'https://checkout.razorpay.com',
    'https://api.razorpay.com',
    'https://nyc.cloud.appwrite.io',
].filter(Boolean);

app.set('trust proxy', 1);

app.use(compression({
    level: 6,
    threshold: 1024
}));

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        return callback(new Error('CORS policy: this origin is not allowed.'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature'],
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
            connectSrc,
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
    },
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: (msg) => logger.http(msg.trim()) }
    }));
}

app.use('/api', limiter);
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

app.use((req, res, next) => {
    ['body', 'query', 'params'].forEach((key) => {
        if (req[key] && typeof req[key] === 'object') {
            for (const prop of Object.keys(req[key])) {
                req[key][prop] = mongoSanitize.sanitize(req[key][prop], {
                    replaceWith: '_'
                });
            }
        }
    });
    next();
});

app.use(xssSanitizer);
app.use(hpp({
    whitelist: ['sort', 'category', 'fileType', 'priceType', 'limit', 'page'],
}));

app.get('/', (req, res) => res.status(200).json({ status: 'live', message: 'CNC Backend is running' }));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'live' }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/designs', designRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/downloads', downloadRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bundles', bundleRouter);

app.all('/{*path}', (req, res) => {
    res.status(404).json({ error: `Can't find ${req.originalUrl} on this server!` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = `File is too large. Max allowed size is ${Math.round(MAX_CNC_FILE_SIZE_BYTES / (1024 * 1024))}MB.`;
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}.`;
    }

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        const value = err.keyValue?.[field];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already in use.`;
    }

    if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors).map((el) => el.message);
        message = `Invalid input data. ${errors.join('. ')}`;
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your session has expired. Please log in again.';
    }

    if (err.message && err.message.includes('CORS policy')) {
        statusCode = 403;
        message = err.message;
    }

    if (statusCode >= 500) {
        logger.error({
            message: err.message,
            stack: err.stack,
            method: req.method,
            url: req.originalUrl,
            statusCode,
        });
    }

    res.status(statusCode).json({ error: message });
});

module.exports = app;
