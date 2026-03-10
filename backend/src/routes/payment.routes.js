const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All payment routes require authentication

router.post('/orders', paymentController.createOrder);
router.post('/orders/bundle', paymentController.createBundleOrder);
router.post('/verify', paymentController.verifyPayment);

router.post('/subscriptions', paymentController.createSubscription);
router.post('/verify-subscription', paymentController.verifySubscription);

module.exports = router;
