import api from './api';

export const getAdminStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getAdminUsers = async (page = 1, search = '') => {
    const response = await api.get(`/admin/users?page=${page}&limit=20&search=${encodeURIComponent(search)}`);
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
};

