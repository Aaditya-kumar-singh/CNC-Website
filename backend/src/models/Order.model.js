const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    designId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Design',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
    paymentId: {
        type: String, // from razorpay
    },
    orderId: {
        type: String, // razorpay order id
        required: true,
    }
}, {
    timestamps: true
});

// Fix #4: Index orderId for fast payment verification lookups
orderSchema.index({ orderId: 1 });
// Compound index for duplicate purchase guard query (userId + designId + paymentStatus)
orderSchema.index({ userId: 1, designId: 1, paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
