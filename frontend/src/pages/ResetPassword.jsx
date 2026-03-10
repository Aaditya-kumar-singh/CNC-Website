import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { refreshUser } = useContext(AuthContext);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        if (password.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }

        setLoading(true);
        try {
            await api.patch(`/auth/reset-password/${token}`, { password });
            toast.success('Password reset successfully!');
            setSuccess(true);
            // Fix #2: refresh user context in-place instead of window.location.reload()
            // which was logging users out by destroying React state
            await refreshUser();
            setTimeout(() => navigate('/'), 1200);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#f8f9fc]">
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center">
                    <CheckCircle2 size={64} className="mx-auto text-green-500 mb-6" />
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Password Reset!</h2>
                    <p className="text-gray-500 font-medium mb-6">You have successfully secured your account.</p>
                    <p className="text-sm font-bold text-gray-400">Redirecting to store...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#f8f9fc] selection:bg-black selection:text-white font-sans">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center text-white font-black text-sm tracking-tighter mx-auto mb-6">
                        CNC
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">New Password</h2>
                    <p className="text-gray-500 font-medium mt-2">Enter your new secure password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder-gray-400"
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors w-8 h-8 flex items-center justify-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder-gray-400"
                            placeholder="••••••••"
                            minLength={8}
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
                            {loading ? 'Changing...' : 'Set New Password'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-[15px] font-medium text-gray-500">
                    <Link to="/login" className="text-[#111] hover:underline font-bold transition-all">
                        Cancel
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
