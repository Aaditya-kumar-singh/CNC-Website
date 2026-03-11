import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

// With Razorpay payments are verified inline in the handler callback
// (in Cart.jsx / DesignDetails.jsx), so this page is just a confirmation landing.
const PaymentSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                    <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 font-medium mb-8">
                    Thank you for your purchase. Your designs have been added to your library.
                </p>
                <Link
                    to="/my-purchases"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#111] text-white rounded-xl font-bold hover:bg-black hover:shadow-lg transition-all"
                >
                    <ShoppingBag size={18} /> View My Files
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
