const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route to get reviews for a design
router.get('/:designId', reviewController.getDesignReviews);

// Protected route to add a review
router.post('/:designId', protect, reviewController.createReview);

module.exports = router;
