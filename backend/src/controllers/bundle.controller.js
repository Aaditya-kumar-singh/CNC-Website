const bundleService = require('../services/bundle.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const validateWithZod = require('../utils/validateWithZod');
const { createBundleSchema } = require('../validators/bundle.validator');

exports.getAllBundles = async (req, res, next) => {
    try {
        const bundles = await bundleService.getAllBundles();
        successResponse(res, 200, { bundles });
    } catch (error) {
        next(error);
    }
};

exports.getBundle = async (req, res, next) => {
    try {
        const bundle = await bundleService.getBundleById(req.params.id);
        if (!bundle) return errorResponse(res, 404, 'Bundle not found');
        successResponse(res, 200, { bundle });
    } catch (error) {
        next(error);
    }
};

exports.createBundle = async (req, res, next) => {
    try {
        const validatedBundle = validateWithZod(createBundleSchema, req.body);

        const bundle = await bundleService.createBundle(validatedBundle);
        successResponse(res, 201, { bundle });
    } catch (error) {
        next(error);
    }
};
