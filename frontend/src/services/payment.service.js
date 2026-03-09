import api from './api';

export const createOrder = async (designIds) => {
    const response = await api.post('/payments/orders', { designIds });
    return response.data;
};

export const verifyPayment = async (session_id) => {
    const response = await api.post('/payments/verify', { session_id });
    return response.data;
};
