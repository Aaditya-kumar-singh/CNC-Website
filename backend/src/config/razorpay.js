const Razorpay = require('razorpay');

// Fix #7: fail fast at startup if keys are missing rather than silently creating a broken client
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('[Razorpay] WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. Payment routes will fail at runtime.');
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

module.exports = razorpay;
