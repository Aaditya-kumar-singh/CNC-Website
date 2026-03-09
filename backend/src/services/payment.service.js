const Order = require('../models/Order.model');
const User = require('../models/User.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createOrderSession = async (designs, userId) => {
    // Collect IDs
    const designIds = designs.map(d => d._id);

    // Guard: prevent buying designs already purchased
    const alreadyPurchasedCount = await Order.countDocuments({
        userId,
        designIds: { $in: designIds },
        paymentStatus: 'success'
    });

    if (alreadyPurchasedCount > 0) {
        throw new Error('You have already purchased one or more of these designs.');
    }

    // Calculate total amount
    const totalAmount = designs.reduce((sum, design) => sum + design.price, 0);

    const lineItems = designs.map(design => ({
        price_data: {
            currency: 'inr',
            product_data: {
                name: design.title,
                description: design.description ? design.description.substring(0, 255) : 'Premium CNC Design',
            },
            unit_amount: Math.round(design.price * 100), // Amount in paise
        },
        quantity: 1,
    }));

    // Save order in DB (pending)
    const orderDoc = await Order.create({
        userId: userId,
        designIds: designIds,
        amount: totalAmount,
        orderId: 'pending_' + Date.now()
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/cart?canceled=true`,
        client_reference_id: orderDoc._id.toString(),
        metadata: {
            userId: userId.toString(),
            orderId: orderDoc._id.toString()
        }
    });

    // Update order with stripe session id
    orderDoc.orderId = session.id;
    await orderDoc.save();

    return session;
};

exports.verifyAndFulfillPayment = async (sessionId, userId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Payment Successful
            // Update Order Status
            const order = await Order.findOne({ orderId: sessionId });

            if (order && order.paymentStatus !== 'success') {
                order.paymentStatus = 'success';
                order.paymentId = session.payment_intent || session.id;
                await order.save();

                // Add to user purchased library, and clear the cart!
                await User.findByIdAndUpdate(userId, {
                    $addToSet: { purchasedDesigns: { $each: order.designIds } },
                    $set: { cart: [] } // Clear cart on successful purchase
                });
            }

            return true;
        } else {
            // Payment Failed or Pending
            await Order.findOneAndUpdate(
                { orderId: sessionId },
                { paymentStatus: 'failed', paymentId: session.payment_intent || session.id }
            );
            return false;
        }
    } catch (error) {
        console.error('Stripe verification error:', error);
        return false;
    }
};
