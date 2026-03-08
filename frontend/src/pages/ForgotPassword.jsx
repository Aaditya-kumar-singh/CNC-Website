import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            // Fix #3: removed toast — the UI switches to a confirmation card immediately,
            // so the toast fires and vanishes before the user can read it (double feedback)
            setSent(true);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#f8f9fc] selection:bg-black selection:text-white font-sans">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center text-white font-black text-sm tracking-tighter mx-auto mb-6">
                        CNC
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reset Password</h2>
                    <p className="text-gray-500 font-medium mt-2">We'll send you a link to reset it.</p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder-gray-400"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#111] text-white rounded-xl font-bold text-[15px] hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 font-medium rounded-xl p-4 border border-green-100 mb-6">
                            If an account exists for {email}, you will receive a password reset link shortly.
                        </div>
                        <Link to="/login" className="w-full flex py-4 bg-gray-100 text-black rounded-xl font-bold text-[15px] hover:bg-gray-200 transition-all justify-center items-center">
                            Return to Login
                        </Link>
                    </div>
                )}

                <p className="mt-8 text-center text-[15px] font-medium text-gray-500">
                    Remember your password?{' '}
                    <Link to="/login" className="text-[#111] hover:underline font-bold transition-all">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
