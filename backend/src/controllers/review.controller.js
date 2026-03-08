const reviewService = require('../services/review.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { designId } = req.params;
        const userId = req.user.id; // from auth middleware

        if (!rating || !comment) {
            return errorResponse(res, 400, 'Please provide both a rating and a comment.');
        }

        const review = await reviewService.createReview(userId, designId, rating, comment);
        return successResponse(res, 201, { message: 'Review created successfully', data: { review } });

    } catch (error) {
        if (error.code === 11000) {
            return errorResponse(res, 400, 'You have already reviewed this design.');
        }
        return errorResponse(res, 400, error.message);
    }
};

exports.getDesignReviews = async (req, res) => {
    try {
        const { designId } = req.params;
        const reviews = await reviewService.getDesignReviews(designId);

        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
            avgRating = (sum / reviews.length).toFixed(1);
        }

        return successResponse(res, 200, { data: { reviews, avgRating } });
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};
