const generateSignedUrl = require('../utils/generateSignedUrl');
const User = require('../models/User.model');

exports.authorizeAndGenerateUrl = async (design, user) => {
    let isAuthorized = false;

    if (design.price === 0) {
        // Rule 1: Free design
        isAuthorized = true;
    } else {
        // Rule 2: Paid design — check ownership or purchase
        // Fix #2: uploadedBy may be a populated object {_id, name} OR a raw ObjectId.
        // Calling .toString() on a plain object gives "[object Object]", breaking the owner check.
        // Safely extract the ID from either form:
        const uploadedById = design.uploadedBy?._id
            ? design.uploadedBy._id.toString()
            : design.uploadedBy?.toString();
        const isOwner = uploadedById === user._id.toString();

        const hasPurchased = (user.purchasedDesigns || []).some(
            (purchasedId) => purchasedId.toString() === design._id.toString()
        );

        if (isOwner || hasPurchased) {
            isAuthorized = true;
        } else if (user.subscriptionStatus === 'active' && user.downloadsRemaining > 0) {
            // Subscription users get the design
            const userDoc = await User.findById(user._id);
            if (userDoc && userDoc.subscriptionStatus === 'active' && userDoc.downloadsRemaining > 0) {
                userDoc.downloadsRemaining -= 1;
                userDoc.purchasedDesigns.push(design._id);
                await userDoc.save();
                isAuthorized = true;

                // Update the req.user memory as well so if it's used later it's fresh
                user.downloadsRemaining = userDoc.downloadsRemaining;
                user.purchasedDesigns = userDoc.purchasedDesigns;
            }
        }
    }

    if (!isAuthorized) {
        return null;
    }

    // Generate Signed URL
    const signedUrl = await generateSignedUrl(design.fileKey);
    return signedUrl;
};
