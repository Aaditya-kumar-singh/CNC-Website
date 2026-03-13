const { z } = require('./common.validator');

const createReviewSchema = z.object({
    rating: z.coerce.number().int('Rating must be a whole number').min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: z.string().trim().min(1, 'Please provide both a rating and a comment.').max(500, 'Comment cannot exceed 500 characters'),
});

module.exports = {
    createReviewSchema,
};
