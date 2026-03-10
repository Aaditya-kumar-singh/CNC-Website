const Design = require('../models/Design.model');
const { successResponse, errorResponse, serverError } = require('../utils/responseHandler');
const paymentService = require('../services/payment.service');
const Bundle = require('../models/Bundle.model');

// Create order for Stripe checkout (Single or Multiple items)
exports.createOrder = async (req, res) => {
    try {
        const { designIds } = req.body;

        if (!designIds || !Array.isArray(designIds) || designIds.length === 0) {
            return errorResponse(res, 400, 'An array of designIds is required');
        }

        // Find designs
        const designs = await Design.find({ _id: { $in: designIds } });
        if (designs.length !== designIds.length) {
            return errorResponse(res, 404, 'One or more designs not found');
        }

        // Filter out any free designs just in case they were passed (although free = download directly without stripe)
        const chargeableDesigns = designs.filter(d => d.price > 0);

        if (chargeableDesigns.length === 0) {
            return errorResponse(res, 400, 'No chargeable designs in request. Use direct download for free designs.');
        }

        const session = await paymentService.createOrderSession(chargeableDesigns, req.user.id);

        successResponse(res, 200, { sessionUrl: session.url, sessionId: session.id });
    } catch (error) {
        if (error.message === 'You have already purchased one or more of these designs.') {
            return errorResponse(res, 400, error.message);
        }
        serverError(res, error);
    }
};

exports.createBundleOrder = async (req, res) => {
    try {
        const { bundleId } = req.body;

        if (!bundleId) {
            return errorResponse(res, 400, 'bundleId is required');
        }

        const bundle = await Bundle.findById(bundleId).populate('designs');
        if (!bundle) {
            return errorResponse(res, 404, 'Bundle not found');
        }

        const session = await paymentService.createBundleOrderSession(bundle, req.user.id);

        successResponse(res, 200, { sessionUrl: session.url, sessionId: session.id });
    } catch (error) {
        if (error.message === 'You have already purchased this bundle.') {
            return errorResponse(res, 400, error.message);
        }
        serverError(res, error);
    }
};

// Verify payment signature
exports.verifyPayment = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return errorResponse(res, 400, 'Missing payment session details');
        }

        const isVerified = await paymentService.verifyAndFulfillPayment(session_id, req.user.id);

        if (isVerified) {
            return successResponse(res, 200, { message: 'Payment verified successfully' });
        } else {
            return errorResponse(res, 400, 'Payment verification failed');
        }
    } catch (error) {
        serverError(res, error);
    }
};

exports.createSubscription = async (req, res) => {
    try {
        const { planId } = req.body;
        if (!planId) return errorResponse(res, 400, 'planId is required');

        const session = await paymentService.createSubscriptionSession(planId, req.user.id);
        successResponse(res, 200, { sessionUrl: session.url, sessionId: session.id });
    } catch (error) {
        if (error.message === 'Invalid plan selected') {
            return errorResponse(res, 400, error.message);
        }
        serverError(res, error);
    }
};

exports.verifySubscription = async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!session_id) return errorResponse(res, 400, 'Missing session details');

        const isVerified = await paymentService.verifyAndFulfillSubscription(session_id, req.user.id);

        if (isVerified) {
            return successResponse(res, 200, { message: 'Subscription verified successfully' });
        } else {
            return errorResponse(res, 400, 'Subscription verification failed');
        }
    } catch (error) {
        serverError(res, error);
    }
};
