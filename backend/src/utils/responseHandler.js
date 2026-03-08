const successResponse = (res, statusCode, payload) => {
    return res.status(statusCode).json({
        status: 'success',
        ...payload
    });
};

const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        error: message
    });
};

const serverError = (res, error) => {
    return res.status(500).json({
        error: error.message || 'Internal server error'
    });
};

module.exports = {
    successResponse,
    errorResponse,
    serverError
};
