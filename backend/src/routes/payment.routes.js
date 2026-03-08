const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All payment routes require authentication

router.post('/orders', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
