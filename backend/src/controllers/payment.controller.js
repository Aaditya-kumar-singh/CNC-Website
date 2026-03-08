const Design = require('../models/Design.model');
const { successResponse, errorResponse, serverError } = require('../utils/responseHandler');
const paymentService = require('../services/payment.service');

// Create order for Razorpay UI
exports.createOrder = async (req, res) => {
    try {
        const { designId } = req.body;

        if (!designId) {
            return errorResponse(res, 400, 'Design ID is required');
        }

        // Find design
        const design = await Design.findById(designId);
        if (!design) {
            return errorResponse(res, 404, 'Design not found');
        }

        if (design.price === 0) {
            return errorResponse(res, 400, 'Design is free. Use direct download.');
        }

        const order = await paymentService.createRazorpayOrder(design, req.user.id);

        successResponse(res, 200, { order });
    } catch (error) {
        // Fix #2: duplicate purchase is a 400 client error, not a 500 server crash
        if (error.message === 'You have already purchased this design.') {
            return errorResponse(res, 400, error.message);
        }
        serverError(res, error);
    }
};

// Verify payment signature
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return errorResponse(res, 400, 'Missing payment verification details');
        }

        const isVerified = await paymentService.verifyAndFulfillPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            req.user.id
        );

        if (isVerified) {
            return successResponse(res, 200, { message: 'Payment verified successfully' });
        } else {
            return errorResponse(res, 400, 'Invalid signature. Payment failed');
        }
    } catch (error) {
        serverError(res, error);
    }
};
