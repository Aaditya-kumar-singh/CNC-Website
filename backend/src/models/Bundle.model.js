const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a bundle title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a bundle description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a bundle price'],
        min: [0, 'Price cannot be negative']
    },
    designs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Design',
        required: true,
    }],
    previewImage: {
        type: String,
        required: [true, 'Please provide a preview image'],
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bundle', bundleSchema);
