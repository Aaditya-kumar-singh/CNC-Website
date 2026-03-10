import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, CheckCircle2, Package, Star, Users } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success('Account created! Welcome to CNC Market.');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Package,
            title: 'Instant Download Access',
            desc: 'Purchase any design and download your DXF, STL or SVG file immediately.',
        },
        {
            icon: Star,
            title: 'Premium CNC Designs',
            desc: 'Curated, tested files ready for routers, V-carve, laser and 3D relief work.',
        },
        {
            icon: Users,
            title: 'Maker Community',
            desc: 'Share projects, get feedback, and learn from thousands of woodworkers.',
        },
    ];

    return (
        <div className="min-h-screen flex font-sans selection:bg-amber-500 selection:text-white">

            {/* ── Left: Hero Panel ─────────────────────────────────────── */}
            <div
                className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between p-12 xl:p-16 overflow-hidden"
                style={{ background: 'linear-gradient(150deg, #0f0f0f 0%, #1c1510 45%, #0d0d0d 100%)' }}
            >
                {/* Texture */}
                <div className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            80deg,
                            transparent,
                            transparent 3px,
                            rgba(200,140,60,0.2) 3px,
                            rgba(200,140,60,0.2) 5px
                        )`
                    }}
                />

                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Circles */}
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full border border-amber-500/10" />
                <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full border border-amber-600/15" />
                <div className="absolute -bottom-20 left-1/4 w-56 h-56 rounded-full border border-amber-500/10" />

                {/* Logo */}
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

                {/* Headline */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">15,000+ Makers</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
                        Master the <span className="text-amber-400">Craft</span><br />
                        of Digital<br />
                        Woodworking
                    </h1>
                    <p className="text-gray-400 font-medium text-base leading-relaxed">
                        Join thousands of makers using our precision tools and expert resources.
                    </p>

                    {/* Feature list */}
                    <div className="mt-10 space-y-5">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon size={18} className="text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{title}</p>
                                    <p className="text-gray-500 font-medium text-sm mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonial */}
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

            {/* ── Right: Register Form ──────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fafaf9]">
                <div className="w-full max-w-[420px]">

                    {/* Mobile Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 bg-[#111] rounded-lg flex items-center justify-center text-white font-black text-xs">CNC</div>
                        <span className="font-extrabold text-lg tracking-tight text-[#111]">CNC<span className="text-gray-400 font-medium">Market</span></span>
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create your account</h2>
                        <p className="text-gray-500 font-medium">Start your journey into precision woodworking today.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                placeholder="John Doe"
                                maxLength={100}
                                required
                            />
                        </div>

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
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                    placeholder="Min. 8 characters"
                                    minLength={8}
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
                            <p className="mt-1.5 text-xs font-medium text-gray-400 flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-green-500" />
                                Min. 8 characters · 1 uppercase · 1 lowercase · 1 number
                            </p>
                        </div>

                        {/* Terms note */}
                        <p className="text-xs font-medium text-gray-400 leading-relaxed">
                            By creating an account, you agree to our{' '}
                            <span className="text-gray-600 font-semibold">Terms of Service</span>{' '}
                            and{' '}
                            <span className="text-gray-600 font-semibold">Privacy Policy</span>.
                        </p>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#111] hover:bg-black text-white rounded-xl font-bold text-[15px] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[15px] font-medium text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#111] font-bold hover:text-amber-600 transition-colors">
                            Log in here
                        </Link>
                    </p>

                    <p className="mt-10 text-center text-xs font-medium text-gray-400">
                        © {new Date().getFullYear()} CNC Market. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
