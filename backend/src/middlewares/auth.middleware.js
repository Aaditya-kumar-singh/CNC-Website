const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { errorResponse, serverError } = require('../utils/responseHandler');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return errorResponse(res, 401, 'You are not logged in. Please log in to get access.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return errorResponse(res, 401, 'The user belonging to this token no longer exists.');
        }

        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return errorResponse(res, 401, 'Invalid token. Please log in again.');
        }
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Your token has expired. Please log in again.');
        }
        serverError(res, error);
    }
};
