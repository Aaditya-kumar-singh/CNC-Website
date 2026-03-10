const bundleService = require('../services/bundle.service');
const { successResponse, errorResponse, serverError } = require('../utils/responseHandler');

exports.getAllBundles = async (req, res) => {
    try {
        const bundles = await bundleService.getAllBundles();
        successResponse(res, 200, { bundles });
    } catch (error) {
        serverError(res, error);
    }
};

exports.getBundle = async (req, res) => {
    try {
        const bundle = await bundleService.getBundleById(req.params.id);
        if (!bundle) return errorResponse(res, 404, 'Bundle not found');
        successResponse(res, 200, { bundle });
    } catch (error) {
        serverError(res, error);
    }
};

exports.createBundle = async (req, res) => {
    try {
        const bundle = await bundleService.createBundle(req.body);
        successResponse(res, 201, { bundle });
    } catch (error) {
        serverError(res, error);
    }
};
