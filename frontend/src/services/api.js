import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const AUTH_STATUS_EVENT = 'cnc:auth-status-changed';

const isAuthSessionCheckRequest = (url = '') => url.includes('/auth/me');
const isExplicitAuthAction = (url = '') => (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/logout')
);

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
        const requestUrl = error.config?.url || '';

        if (status === 401 && !isAuthSessionCheckRequest(requestUrl) && !isExplicitAuthAction(requestUrl)) {
            window.dispatchEvent(new CustomEvent(AUTH_STATUS_EVENT, {
                detail: {
                    status,
                    url: requestUrl,
                    message,
                },
            }));
        }

        const normalizedError = new Error(message);
        normalizedError.status = status;
        normalizedError.data = data;
        return Promise.reject(normalizedError);
    }
);

export default api;
export { AUTH_STATUS_EVENT };
