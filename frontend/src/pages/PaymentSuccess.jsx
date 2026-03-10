import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyPayment, verifySubscription } from '../services/payment.service';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useContext(AuthContext);

    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const sessionId = searchParams.get('session_id');
    const type = searchParams.get('type');

    useEffect(() => {
        // BUG FIX #1: Use a ref to hold the timer ID so we can cancel it
        // if the component unmounts before the 3s redirect fires.
        // Without this: React warning "Can't perform a state update on an unmounted component"
        // AND navigate() fires after unmount causing potential double-navigation.
        let redirectTimer;

        const verifyStripePayment = async () => {
            if (!sessionId) {
                setStatus('error');
                return;
            }

            try {
                if (type === 'subscription') {
                    await verifySubscription(sessionId);
                } else {
                    await verifyPayment(sessionId);
                }

                await refreshUser();
                setStatus('success');
                toast.success('Payment verified successfully!');

                redirectTimer = setTimeout(() => {
                    navigate('/my-purchases');
                }, 3000);
            } catch (error) {
                console.error("Payment verification failed", error);
                setStatus('error');
                toast.error('Payment verification failed. Please contact support if you were charged.');
            }
        };

        verifyStripePayment();

        // Cleanup: cancel the pending redirect if user navigates away early
        return () => clearTimeout(redirectTimer);
    }, [sessionId, type, navigate, refreshUser]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                {status === 'verifying' && (
                    <>
                        <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
                        <p className="text-gray-500 font-medium">Please don't close this window while we securely confirm your translation with Stripe.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                            <CheckCircle2 size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 font-medium mb-8">Thank you for your purchase. Your new designs have been added to your library.</p>
                        <Link
                            to="/my-purchases"
                            className="w-full flex items-center justify-center gap-2 py-4 bg-[#111] text-white rounded-xl font-bold hover:bg-black hover:shadow-lg transition-all"
                        >
                            <ShoppingBag size={18} /> View My Files
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-500 font-medium mb-8">We couldn't securely verify this payment session. Please check your account or contact support.</p>
                        <Link
                            to="/"
                            className="w-full inline-block py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Back to Home
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
