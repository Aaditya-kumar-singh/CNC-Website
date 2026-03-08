const User = require('../models/User.model');
const crypto = require('crypto');

exports.createUser = async (name, email, password) => {
    return await User.create({ name, email, password });
};

exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
        return null;
    }
    return user;
};

exports.getUserProfile = async (userId) => {
    // Do NOT populate purchasedDesigns — keep as array of ObjectIds
    // to stay consistent with auth.middleware.js which also only returns IDs
    return await User.findById(userId);
};

// Separate function used only for the /my-purchases endpoint
exports.getUserWithPurchases = async (userId) => {
    return await User.findById(userId).populate({
        path: 'purchasedDesigns',
        select: '+fileKey', // Include fileKey so format badge works correctly
        populate: { path: 'uploadedBy', select: 'name' }
    });
};

exports.createPasswordResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return null; // We don't throw an error to prevent exact email enumeration

    // Create unique hex token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set it on the user along with expiry
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    return { user, resetToken };
};

exports.resetPassword = async (token, newPassword) => {
    // 1. Get user based on hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() } // Assures token has not expired
    });

    if (!user) {
        throw new Error('Token is invalid or has expired');
    }

    // 2. Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return user;
};
