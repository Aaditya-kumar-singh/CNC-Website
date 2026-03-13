const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const authService = require('../services/auth.service');
const sendEmail = require('../services/email.service');
const validateWithZod = require('../utils/validateWithZod');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.validator');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    user.password = undefined;

    successResponse(res, statusCode, {
        token,
        data: { user }
    });
};

exports.register = async (req, res) => {
    try {
        const validatedBody = validateWithZod(registerSchema, req.body);
        const safeName = validatedBody.name.replace(/<[^>]*>/g, '').trim();
        if (!safeName) {
            return errorResponse(res, 400, 'Please provide a valid name');
        }

        const newUser = await authService.createUser(safeName, validatedBody.email, validatedBody.password);

        createSendToken(newUser, 201, res);
    } catch (error) {
        if (error.statusCode === 400) {
            return errorResponse(res, 400, error.message);
        }
        if (error.code === 11000) {
            return errorResponse(res, 400, 'Email is already registered');
        }
        errorResponse(res, 400, error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const validatedBody = validateWithZod(loginSchema, req.body);
        const user = await authService.authenticateUser(validatedBody.email, validatedBody.password);

        if (!user) {
            return errorResponse(res, 401, 'Incorrect email or password');
        }

        createSendToken(user, 200, res);
    } catch (_error) {
        if (_error.statusCode === 400) {
            return errorResponse(res, 400, _error.message);
        }
        errorResponse(res, 401, 'Incorrect email or password');
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await authService.getUserProfile(req.user.id);
        successResponse(res, 200, {
            data: { user }
        });
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = validateWithZod(forgotPasswordSchema, req.body);
        const result = await authService.createPasswordResetToken(email);

        if (!result) {
            return successResponse(res, 200, { message: 'If this email exists in our system, a reset link has been sent.' });
        }

        const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${result.resetToken}`;
        const message = `Forgot your password? Click here to reset it:\n${resetURL}\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                email: result.user.email,
                subject: 'Your Password Reset Token (Valid for 10 minutes)',
                message
            });
            successResponse(res, 200, { message: 'If this email exists in our system, a reset link has been sent.' });
        } catch (_err) {
            result.user.resetPasswordToken = undefined;
            result.user.resetPasswordExpire = undefined;
            await result.user.save({ validateBeforeSave: false });
            return errorResponse(res, 500, 'There was an error sending the email. Try again later.');
        }

    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = validateWithZod(resetPasswordSchema, req.body);

        const user = await authService.resetPassword(token, password);
        createSendToken(user, 200, res);
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.getMyPurchases = async (req, res) => {
    try {
        const user = await authService.getUserWithPurchases(req.user.id);
        successResponse(res, 200, {
            data: { designs: user.purchasedDesigns }
        });
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return errorResponse(res, 400, 'Invalid design ID');
        }

        const isAlreadyInWishlist = req.user.wishlist.some((wId) => wId.toString() === id);
        if (!isAlreadyInWishlist && req.user.wishlist.length >= 100) {
            return errorResponse(res, 400, 'Wishlist limit reached. Please remove some items first.');
        }

        const result = await authService.toggleWishlist(req.user.id, id);
        successResponse(res, 200, { data: result });
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.getMyWishlist = async (req, res) => {
    try {
        const user = await authService.getUserWishlist(req.user.id);
        successResponse(res, 200, {
            data: { designs: user.wishlist }
        });
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.toggleCart = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return errorResponse(res, 400, 'Invalid design ID');
        }

        const isAlreadyInCart = req.user.cart.some((cId) => cId.toString() === id);
        if (!isAlreadyInCart && req.user.cart.length >= 50) {
            return errorResponse(res, 400, 'Cart limit reached. You can only have 50 items at a time.');
        }

        const result = await authService.toggleCart(req.user.id, id);
        successResponse(res, 200, { data: result });
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.getMyCart = async (req, res) => {
    try {
        const user = await authService.getUserCart(req.user.id);
        successResponse(res, 200, {
            data: { designs: user.cart }
        });
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};

exports.clearCart = async (req, res) => {
    try {
        await authService.clearCart(req.user.id);
        successResponse(res, 200, { message: 'Cart cleared successfully' });
    } catch (error) {
        errorResponse(res, 400, error.message);
    }
};
