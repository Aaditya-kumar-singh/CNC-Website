const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user']
    },
    design: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design',
        required: [true, 'A review must belong to a design']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'A review must have a rating']
    },
    comment: {
        type: String,
        required: [true, 'A review must have a comment'],
        trim: true,
        maxlength: [500, 'A comment cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Prevent multiple reviews from the same user on the same design
reviewSchema.index({ design: 1, user: 1 }, { unique: true });
// Standalone index on design for fast getDesignReviews read queries
reviewSchema.index({ design: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
