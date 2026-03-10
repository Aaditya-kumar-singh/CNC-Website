const express = require('express');
const bundleController = require('../controllers/bundle.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictToAdmin } = require('../middlewares/admin.middleware');

const router = express.Router();

router.route('/')
    .get(bundleController.getAllBundles)
    .post(protect, restrictToAdmin, bundleController.createBundle);

router.route('/:id')
    .get(bundleController.getBundle);

module.exports = router;
