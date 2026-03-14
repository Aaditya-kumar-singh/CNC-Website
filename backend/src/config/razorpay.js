const Razorpay = require('razorpay');

if ((!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) && process.env.NODE_ENV === 'production') {
    throw new Error('Razorpay keys are required in production.');
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

module.exports = razorpay;
