const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentId: String,
    signature: String,
    status: {
        type: String,
        enum: ['success', 'failed'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
