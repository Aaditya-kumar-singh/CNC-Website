import api from './api';

export const getAllBundles = async () => {
    const response = await api.get('/bundles');
    return response.data;
};

export const getBundleById = async (id) => {
    const response = await api.get(`/bundles/${id}`);
    return response.data;
};

export const createBundleOrder = async (bundleId) => {
    const response = await api.post('/payments/orders/bundle', { bundleId });
    return response.data;
};
