const Design = require('../models/Design.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const paymentService = require('../services/payment.service');
const validateWithZod = require('../utils/validateWithZod');
const { createOrderSchema, verifyPaymentSchema } = require('../validators/payment.validator');

exports.createOrder = async (req, res, next) => {
    try {
        const { designIds } = validateWithZod(createOrderSchema, req.body);

        const designs = await Design.find({ _id: { $in: designIds } });
        if (designs.length !== designIds.length) {
            return errorResponse(res, 404, 'One or more designs not found');
        }

        const chargeableDesigns = designs.filter((design) => design.price > 0);

        if (chargeableDesigns.length === 0) {
            return errorResponse(res, 400, 'No chargeable designs in request. Use direct download for free designs.');
        }

        const order = await paymentService.createRazorpayOrder(chargeableDesigns, req.user.id);

        successResponse(res, 200, { order });
    } catch (error) {
        if (
            error.message === 'You have already purchased one or more of these designs.' ||
            error.message === 'You cannot purchase your own design.'
        ) {
            return errorResponse(res, 400, error.message);
        }
        next(error);
    }
};

exports.verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validateWithZod(verifyPaymentSchema, req.body);

        const isVerified = await paymentService.verifyAndFulfillPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            req.user.id
        );

        if (isVerified) {
            return successResponse(res, 200, { message: 'Payment verified successfully' });
        }

        return errorResponse(res, 400, 'Invalid signature. Payment failed');
    } catch (error) {
        if (error.message && error.message.startsWith('Unauthorized')) {
            return errorResponse(res, 403, error.message);
        }
        next(error);
    }
};

exports.handleWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        if (!signature) {
            return errorResponse(res, 400, 'Missing webhook signature');
        }

        const isValid = paymentService.verifyWebhookSignature(req.body, signature);
        if (!isValid) {
            return errorResponse(res, 400, 'Invalid webhook signature');
        }

        const payload = JSON.parse(req.body.toString('utf8'));

        if (payload.event === 'payment.captured') {
            await paymentService.handlePaymentCapturedWebhook(payload);
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        next(error);
    }
};
