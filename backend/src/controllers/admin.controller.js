const { successResponse, serverError } = require('../utils/responseHandler');
const adminService = require('../services/admin.service');

exports.getDashboardStats = async (req, res) => {
    try {
        const statsData = await adminService.getDashboardStats();
        successResponse(res, 200, { data: statsData });
    } catch (error) {
        serverError(res, error);
    }
};

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const data = await adminService.getAllUsers(page, limit, search);
        successResponse(res, 200, data);
    } catch (error) {
        serverError(res, error);
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) return res.status(400).json({ error: 'Role is required' });
        const user = await adminService.setUserRole(req.params.id, role);
        successResponse(res, 200, { user });
    } catch (error) {
        serverError(res, error);
    }
};

