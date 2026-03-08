const paymentService = require('../../src/services/payment.service');
const razorpay = require('../../src/config/razorpay');
const crypto = require('crypto');
const Order = require('../../src/models/Order.model');
const User = require('../../src/models/User.model');

jest.mock('../../src/config/razorpay', () => ({
    orders: {
        create: jest.fn()
    }
}));
jest.mock('../../src/models/Order.model');
jest.mock('../../src/models/User.model');

describe('Payment Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.RAZORPAY_KEY_SECRET = 'test_secret';
    });

    describe('createRazorpayOrder', () => {
        it('should create order on Razorpay and DB', async () => {
            const mockDesign = { price: 500, _id: 'design123' };
            const mockUserId = 'user123';
            const mockRazorpayOrder = { id: 'rzp_order_123' };

            razorpay.orders.create.mockResolvedValue(mockRazorpayOrder);
            Order.create.mockResolvedValue({});

            jest.spyOn(Date, 'now').mockReturnValue(1000);

            const result = await paymentService.createRazorpayOrder(mockDesign, mockUserId);

            expect(razorpay.orders.create).toHaveBeenCalledWith({
                amount: 50000,
                currency: 'INR',
                receipt: 'rcpt_1000'
            });
            expect(Order.create).toHaveBeenCalledWith({
                userId: mockUserId,
                designId: 'design123',
                amount: 500,
                orderId: 'rzp_order_123'
            });
            expect(result).toEqual(mockRazorpayOrder);

            jest.restoreAllMocks();
        });
    });

    describe('verifyAndFulfillPayment', () => {
        it('should verify signature and fulfill order', async () => {
            const orderId = 'order123';
            const paymentId = 'pay123';
            const sign = orderId + "|" + paymentId;
            const signature = crypto.createHmac("sha256", 'test_secret').update(sign.toString()).digest("hex");

            Order.findOneAndUpdate.mockResolvedValue({ designId: 'design123' });

            const result = await paymentService.verifyAndFulfillPayment(orderId, paymentId, signature, 'user123');

            expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
                { orderId },
                { paymentStatus: 'success', paymentId },
                { new: true }
            );
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
                $addToSet: { purchasedDesigns: 'design123' }
            });
            expect(result).toBe(true);
        });

        it('should fail verification for bad signature', async () => {
            const orderId = 'order123';
            const paymentId = 'pay123';

            Order.findOneAndUpdate.mockResolvedValue({});

            const result = await paymentService.verifyAndFulfillPayment(orderId, paymentId, 'bad_signature', 'user123');

            expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
                { orderId },
                { paymentStatus: 'failed', paymentId }
            );
            expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
