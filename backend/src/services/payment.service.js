const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order.model');
const User = require('../models/User.model');

exports.createRazorpayOrder = async (design, userId) => {
    // Guard: prevent buying same design twice
    const alreadyPurchased = await Order.findOne({
        userId,
        designId: design._id,
        paymentStatus: 'success'
    });
    if (alreadyPurchased) {
        throw new Error('You have already purchased this design.');
    }

    const options = {
        amount: design.price * 100, // Amount in paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Save order in DB (pending)
    await Order.create({
        userId: userId,
        designId: design._id,
        amount: design.price,
        orderId: order.id
    });

    return order;
};

exports.verifyAndFulfillPayment = async (orderId, paymentId, signature, userId) => {
    const sign = orderId + "|" + paymentId;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (signature === expectedSign) {
        // Payment Successful
        // Update Order Status
        const order = await Order.findOneAndUpdate(
            { orderId: orderId },
            { paymentStatus: 'success', paymentId: paymentId },
            { new: true }
        );

        if (order) {
            // Add to user purchased library
            await User.findByIdAndUpdate(userId, {
                $addToSet: { purchasedDesigns: order.designId }
            });
        }

        return true;
    } else {
        // Payment Failed
        await Order.findOneAndUpdate(
            { orderId: orderId },
            { paymentStatus: 'failed', paymentId: paymentId }
        );
        return false;
    }
};
