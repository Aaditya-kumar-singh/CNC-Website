import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Check, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Pricing = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const handleSubscribe = async () => {
        if (!user) {
            toast.error('Please login to subscribe');
            navigate('/login');
            return;
        }

        if (user.subscriptionStatus === 'active') {
            toast.success('You have an active subscription!');
            navigate('/my-purchases');
            return;
        }

        toast('Subscription coming soon! Contact us to upgrade.', { icon: '🚀' });
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] py-20 font-sans selection:bg-black selection:text-white relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[50%] h-[80%] rounded-full bg-gradient-to-tr from-blue-100/40 via-purple-50/40 to-transparent blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Power Up Your CNC Workshop
                    </h1>
                    <p className="text-xl text-gray-600 font-medium leading-relaxed">
                        Get instant access to premium 3D reliefs and 2D vectors every month. Save hundreds compared to buying individually.
                    </p>
                </div>

                <div className="flex justify-center">
                    {/* Pricing Card */}
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border-4 border-[#111] relative transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute -top-5 right-8 bg-blue-600 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-1.5">
                            <Zap size={14} className="fill-current" /> MOST POPULAR
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-2">Pro Maker</h2>
                        <p className="text-sm font-bold text-gray-500 mb-6">BEST FOR HEAVY USERS</p>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">₹899</span>
                            <span className="text-lg font-bold text-gray-400">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {[
                                '20 Premium Design Downloads / mo',
                                'All file types (STL, DXF, SVG)',
                                'Unlimited Free Designs',
                                'Commercial Use License',
                                'Priority Support'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Check size={14} className="text-green-600" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleSubscribe}
                            disabled={processing}
                            className="w-full py-4 rounded-full bg-[#111] text-white font-bold text-lg hover:bg-black shadow-xl hover:shadow-[#111]/20 transition-all disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2"
                        >
                            {processing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Subscribe Now"
                            )}
                        </button>

                        <p className="text-center text-xs font-bold text-gray-400 mt-6 flex items-center justify-center gap-1">
                            <ShieldCheck size={14} /> Secure Payment via Razorpay
                        </p>
                    </div>
                </div>

                {user && user.subscriptionStatus === 'active' && (
                    <div className="mt-16 text-center">
                        <div className="inline-block bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl font-bold">
                            You currently have <span className="text-xl mx-1">{user.downloadsRemaining}</span> downloads remaining this month.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pricing;
