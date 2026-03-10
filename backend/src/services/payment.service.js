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

exports.createBundleOrderSession = async (bundle, userId) => {
    // Determine the designs inside the bundle so we can add them to user
    const designIds = bundle.designs.map(d => d._id || d);

    // See if they already bought the bundle
    const alreadyPurchasedCount = await Order.countDocuments({
        userId,
        bundleId: bundle._id,
        paymentStatus: 'success'
    });

    if (alreadyPurchasedCount > 0) {
        throw new Error('You have already purchased this bundle.');
    }

    // Save order in DB (pending)
    const orderDoc = await Order.create({
        userId: userId,
        designIds: designIds,
        bundleId: bundle._id,
        amount: bundle.price,
        orderId: 'pending_' + Date.now()
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: `Bundle: ${bundle.title}`,
                    description: bundle.description ? bundle.description.substring(0, 255) : 'Premium CNC Bundle',
                },
                unit_amount: Math.round(bundle.price * 100),
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/bundles?canceled=true`,
        client_reference_id: orderDoc._id.toString(),
        metadata: {
            userId: userId.toString(),
            orderId: orderDoc._id.toString(),
            bundleId: bundle._id.toString()
        }
    });

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

exports.createSubscriptionSession = async (planId, userId) => {
    const user = await User.findById(userId);

    // Hardcoded plan logic (in a real app, you'd fetch this from DB or Stripe Products)
    let priceId = '';
    let downloads = 0;

    // Example Stripe Price ID (You will need to replace this with your actual Stripe Price ID)
    if (planId === 'pro_monthly') {
        priceId = process.env.STRIPE_PRO_PLAN_ID || 'price_placeholder_pro_monthly';
        downloads = 20;
    } else {
        throw new Error('Invalid plan selected');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Create a Checkout Session for the subscription
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: priceId,
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
        cancel_url: `${frontendUrl}/pricing?canceled=true`,
        client_reference_id: userId.toString(),
        metadata: {
            userId: userId.toString(),
            downloadsGrant: downloads.toString()
        }
    });

    return session;
};

exports.verifyAndFulfillSubscription = async (sessionId, userId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Check if payment was successful
        if (session.payment_status === 'paid') {
            const downloadsGrant = parseInt(session.metadata.downloadsGrant || 20);
            const user = await User.findById(userId);

            if (user) {
                // Determine end period (e.g. 30 days from now)
                const currentPeriodEnd = new Date();
                currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

                user.stripeCustomerId = session.customer;
                user.stripeSubscriptionId = session.subscription;
                user.subscriptionStatus = 'active';
                // Only renew limits if this is the first time verifying this session
                // In production, rely on webhooks, but this lets us test immediately
                if (!user.stripeSubscriptionId || user.stripeSubscriptionId !== session.subscription) {
                    user.downloadsRemaining += downloadsGrant;
                }
                user.subscriptionPeriodEnd = currentPeriodEnd;

                await user.save();
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Subscription verification error:', error);
        return false;
    }
};
