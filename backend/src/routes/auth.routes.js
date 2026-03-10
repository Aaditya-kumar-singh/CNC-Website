const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter, forgotPasswordLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

// Public — rate-limited tightly to prevent brute force
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);
router.patch('/reset-password/:token', authLimiter, authController.resetPassword);

// Protected
router.get('/me', protect, authController.getMe);
router.get('/my-purchases', protect, authController.getMyPurchases);
router.get('/my-wishlist', protect, authController.getMyWishlist);
router.post('/wishlist/:id', protect, authController.toggleWishlist);

router.get('/my-cart', protect, authController.getMyCart);
router.post('/cart/:id', protect, authController.toggleCart);
router.delete('/cart', protect, authController.clearCart);

module.exports = router;
