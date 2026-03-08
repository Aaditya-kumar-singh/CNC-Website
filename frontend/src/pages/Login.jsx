import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-amber-500 selection:text-white">

            {/* ── Left: Hero Panel ─────────────────────────────────────── */}
            <div
                className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1410 50%, #0f0f0f 100%)' }}
            >
                {/* Warm wood-grain texture overlay */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            85deg,
                            transparent,
                            transparent 2px,
                            rgba(180,120,60,0.15) 2px,
                            rgba(180,120,60,0.15) 4px
                        )`
                    }}
                />

                {/* Grid lines */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Decorative arc circle */}
                <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full border border-amber-600/20" />
                <div className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full border border-amber-600/10" />
                <div className="absolute top-1/3 -left-20 w-[200px] h-[200px] rounded-full border border-amber-500/10" />

                {/* Top: Logo */}
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-black font-black text-xs tracking-tighter">CNC</span>
                        </div>
                        <span className="text-white font-extrabold text-xl tracking-tight">
                            CNC<span className="text-amber-400 font-medium">Market</span>
                        </span>
                    </Link>
                </div>

                {/* Middle: Headline */}
                <div className="relative z-10 max-w-md">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Precision Craftsmanship</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
                        Reimagined<br />
                        <span className="text-amber-400">for the modern</span><br />
                        woodworker.
                    </h1>
                    <p className="text-gray-400 font-medium text-base leading-relaxed">
                        Access professional-grade CNC designs, premium DXF and STL files, and a community of elite makers.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        {['15,000+ Designs', 'Instant Download', 'Lifetime Access'].map((f) => (
                            <span key={f} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm font-medium">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom: Testimonial */}
                <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-300 text-sm font-medium leading-relaxed italic mb-4">
                        "The support and resources here changed how I approach my hobby. It's more than just a shop."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">D</div>
                        <div>
                            <p className="text-white text-sm font-bold">David Miller</p>
                            <p className="text-gray-500 text-xs font-medium">Custom Furniture Maker</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right: Login Form ─────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fafaf9]">
                <div className="w-full max-w-[420px]">

                    {/* Mobile Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 bg-[#111] rounded-lg flex items-center justify-center text-white font-black text-xs">CNC</div>
                        <span className="font-extrabold text-lg tracking-tight text-[#111]">CNC<span className="text-gray-400 font-medium">Market</span></span>
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome back</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#111] hover:bg-black text-white rounded-xl font-bold text-[15px] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[15px] font-medium text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#111] font-bold hover:text-amber-600 transition-colors">
                            Start crafting for free
                        </Link>
                    </p>

                    {/* Footer */}
                    <p className="mt-12 text-center text-xs font-medium text-gray-400">
                        © {new Date().getFullYear()} CNC Market. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
