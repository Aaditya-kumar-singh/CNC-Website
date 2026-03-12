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
        }
    }

    if (!isAuthorized) {
        return null;
    }

    // Generate Signed URL
    const signedUrl = await generateSignedUrl(design.fileKey);
    return signedUrl;
};
