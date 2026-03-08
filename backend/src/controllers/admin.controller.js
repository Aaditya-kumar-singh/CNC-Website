const { successResponse, serverError } = require('../utils/responseHandler');
const adminService = require('../services/admin.service');

exports.getDashboardStats = async (req, res) => {
    try {
        const statsData = await adminService.getDashboardStats();

        successResponse(res, 200, {
            data: statsData
        });
    } catch (error) {
        serverError(res, error);
    }
};
