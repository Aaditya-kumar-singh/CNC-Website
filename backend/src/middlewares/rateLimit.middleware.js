const rateLimit = require('express-rate-limit');

// General API limiter — 100 req / 15 min per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests from this IP, please try again in 15 minutes.' });
    },
});

// Auth limiter — 10 attempts / 15 min (brute-force login protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // only count failed attempts
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes before trying again.' });
    },
});

// Forgot-password limiter — 5 attempts / hour (email flood protection)
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many password reset requests. Please wait an hour before trying again.' });
    },
});

// Download limiter — 20 downloads / hour
const downloadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    handler: (req, res) => {
        res.status(429).json({ error: 'Download limit exceeded. You can download up to 20 files per hour.' });
    },
});

// Payment limiter — 20 payment attempts / hour (abuse prevention)
const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many payment attempts. Please try again in an hour.' });
    },
});

// Upload limiter — 10 uploads / hour
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    handler: (req, res) => {
        res.status(429).json({ error: 'Upload limit exceeded. You can upload up to 10 files per hour.' });
    },
});

// Review limiter — 5 reviews / hour (spam prevention)
const reviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many reviews submitted. Please try again later.' });
    },
});

module.exports = {
    limiter,
    authLimiter,
    forgotPasswordLimiter,
    downloadLimiter,
    paymentLimiter,
    uploadLimiter,
    reviewLimiter,
};
