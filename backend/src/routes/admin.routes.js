const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictToAdmin } = require('../middlewares/admin.middleware');

const router = express.Router();

// All routes here should be protected and restricted to admin
router.use(protect, restrictToAdmin);

router.route('/stats')
    .get(adminController.getDashboardStats);

module.exports = router;
