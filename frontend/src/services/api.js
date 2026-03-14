import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection or try again later.'));
        }

        const { status, data } = error.response;
        const message = data?.error || data?.message || 'Something went wrong. Please try again.';

        if (status === 401 && !error.config.url.includes('/auth/me') && window.location.pathname !== '/login') {
            window.location.href = '/login';
        }

        const normalizedError = new Error(message);
        normalizedError.status = status;
        normalizedError.data = data;
        return Promise.reject(normalizedError);
    }
);

export default api;
