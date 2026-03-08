import api from './api';

export const getDesignReviews = async (designId) => {
    const response = await api.get(`/reviews/${designId}`);
    return response.data;
};

export const createReview = async (designId, rating, comment) => {
    const response = await api.post(`/reviews/${designId}`, { rating, comment });
    return response.data;
};
