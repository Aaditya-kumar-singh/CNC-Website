import api from './api';

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const createOrder = async (designIds) => {
    const response = await api.post('/payments/orders', { designIds });
    return response.data;
};

export const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await api.post('/payments/verify', {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });
    return response.data;
};
