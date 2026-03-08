const { errorResponse } = require('../utils/responseHandler');

exports.restrictToAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return errorResponse(res, 403, 'You do not have permission to perform this action');
    }
    next();
};
