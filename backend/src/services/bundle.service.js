const Bundle = require('../models/Bundle.model');

exports.getAllBundles = async () => {
    return await Bundle.find({ isActive: true }).populate('designs', 'title price previewImages');
};

exports.getBundleById = async (id) => {
    return await Bundle.findById(id).populate('designs');
};

exports.createBundle = async (bundleData) => {
    return await Bundle.create(bundleData);
};
