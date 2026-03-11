const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');
const { paymentLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

// All payment routes require authentication + payment-specific rate limit
router.use(protect);
router.use(paymentLimiter);

router.post('/orders', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
