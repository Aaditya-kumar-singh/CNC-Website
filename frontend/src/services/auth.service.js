import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const getCurrentUser = () => null;

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const toggleWishlist = async (designId) => {
    const response = await api.post(`/auth/wishlist/${designId}`);
    return response.data;
};

export const getMyWishlist = async () => {
    const response = await api.get('/auth/my-wishlist');
    return response.data;
};

export const toggleCart = async (designId) => {
    const response = await api.post(`/auth/cart/${designId}`);
    return response.data;
};

export const getMyCart = async () => {
    const response = await api.get('/auth/my-cart');
    return response.data;
};
