const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictToAdmin } = require('../middlewares/admin.middleware');

const router = express.Router();

// All routes here should be protected and restricted to admin
router.use(protect, restrictToAdmin);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);

// Seller tier management
router.patch('/users/:userId/seller-tier', adminController.updateSellerTier);
router.get('/sellers/:sellerId/stats', adminController.getSellerStats);

module.exports = router;

