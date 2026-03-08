import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response error interceptor — normalizes all backend errors
api.interceptors.response.use(
    (response) => response, // pass through success responses untouched
    (error) => {
        // Network error (no response from server)
        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection or try again later.'));
        }

        const { status, data } = error.response;

        // Extract readable message from backend's { error: "..." } format
        const message =
            data?.error ||
            data?.message ||
            'Something went wrong. Please try again.';

        // Handle specific status codes globally
        if (status === 401) {
            // Clear stale tokens on unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect to login if the failing request wasn't the silent boot check 
            // AND we aren't already on the login page.
            if (!error.config.url.includes('/auth/me') && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Re-throw as a plain Error so all catch blocks get error.message
        const normalizedError = new Error(message);
        normalizedError.status = status;
        normalizedError.data = data;
        return Promise.reject(normalizedError);
    }
);

export default api;
