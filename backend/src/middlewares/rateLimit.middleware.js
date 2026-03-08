const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    // Fix #3: return JSON { error } to match all other API error responses
    // so api.js interceptor can correctly extract the message
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests from this IP, please try again in 15 minutes.' });
    },
});

const downloadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    handler: (req, res) => {
        res.status(429).json({ error: 'Download limit exceeded. You can download up to 20 files per hour.' });
    },
});

module.exports = {
    limiter,
    downloadLimiter,
};
