const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a bundle title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a bundle description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a bundle price'],
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
