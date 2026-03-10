const cron = require('node-cron');
const User = require('../models/User.model');
const sendEmail = require('../services/email.service');
const Design = require('../models/Design.model');

const startCartAbandonmentJob = () => {
    // Run every day at 10 AM
    cron.schedule('0 10 * * *', async () => {
        try {
            console.log('[Cron] Running Abandoned Cart Email Scan...');

            // Find users who:
            // 1. Have items in cart
            // 2. Haven't received an abandoned cart email yet.
            const usersWithAbandonedCarts = await User.find({
                'cart.0': { $exists: true },
                lastAbandonedCartEmailSentAt: { $exists: false }
            }).populate('cart', 'title price');

            for (const user of usersWithAbandonedCarts) {
                const numItems = user.cart.length;
                let cartSummary = '';
                let totalValue = 0;

                user.cart.forEach((item, idx) => {
                    cartSummary += `- ${item.title} (₹${item.price})\n`;
                    totalValue += item.price;
                });

                const emailMessage = `Hi ${user.name},\n\nYou left ${numItems} item(s) in your cart worth ₹${totalValue}. Come back and complete your purchase!\n\nYour Cart Items:\n${cartSummary}\nThanks,\nCNC Market Team`;

                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'Did you forget something? Complete your purchase!',
                        message: emailMessage
                    });

                    // Update user so we don't spam them again quickly
                    user.lastAbandonedCartEmailSentAt = new Date();
                    await user.save();
                } catch (emailError) {
                    console.error(`[Cron] Error sending email to ${user.email}:`, emailError);
                }
            }
            console.log(`[Cron] Finished scanning. Sent ${usersWithAbandonedCarts.length} emails.`);

        } catch (error) {
            console.error('[Cron] Error in Abandoned Cart Job:', error);
        }
    });
};

module.exports = startCartAbandonmentJob;
