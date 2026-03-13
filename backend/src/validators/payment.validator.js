const { z, objectIdSchema } = require('./common.validator');

const createOrderSchema = z.object({
    designIds: z.array(objectIdSchema).min(1, 'An array of designIds is required'),
});

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().trim().min(1, 'Missing payment verification details'),
    razorpay_payment_id: z.string().trim().min(1, 'Missing payment verification details'),
    razorpay_signature: z.string().trim().min(1, 'Missing payment verification details'),
});

module.exports = {
    createOrderSchema,
    verifyPaymentSchema,
};
