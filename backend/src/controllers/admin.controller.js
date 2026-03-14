const { successResponse } = require('../utils/responseHandler');
const adminService = require('../services/admin.service');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const statsData = await adminService.getDashboardStats();
        successResponse(res, 200, { data: statsData });
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const { page, limit, search, role, sortBy, dateFrom, dateTo } = req.query;
        const data = await adminService.getAllUsers({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            search: search || '',
            role: role || '',
            sortBy: sortBy || 'newest',
            dateFrom: dateFrom || '',
            dateTo: dateTo || '',
        });
        successResponse(res, 200, data);
    } catch (error) {
        next(error);
    }
};

exports.updateSellerTier = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { tier } = req.body;
        
        if (!tier) {
            return res.status(400).json({ message: 'Seller tier is required' });
        }
        
        const user = await adminService.updateSellerTier(userId, tier);
        successResponse(res, 200, { message: 'Seller tier updated successfully', user });
    } catch (error) {
        next(error);
    }
};

exports.getSellerStats = async (req, res, next) => {
    try {
        const { sellerId } = req.params;
        const stats = await adminService.getSellerStats(sellerId);
        successResponse(res, 200, stats);
    } catch (error) {
        next(error);
    }
};


