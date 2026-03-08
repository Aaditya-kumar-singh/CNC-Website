import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
    const { user } = useContext(AuthContext);
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto selection:bg-black selection:text-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#111] rounded-lg flex items-center justify-center text-white font-black text-xs tracking-tighter">
                                CNC
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-[#111]">CNC<span className="text-gray-400 font-medium">Market</span></span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
                            A secure marketplace for premium CNC, DXF, STL and SVG design files. Buy, sell, and download with confidence.
                        </p>
                        <a href="mailto:custom@cncdesignhub.com" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-100 font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors cursor-pointer">
                            <Mail size={16} /> Request Custom Design
                        </a>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h6 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Quick Links</h6>
                        <div className="flex flex-col gap-3">
                            <Link to="/" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">Browse Designs</Link>
                            {user ? (
                                <Link to="/my-purchases" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">My Purchases</Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">Login</Link>
                                    <Link to="/register" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <h6 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Platform Infrastructure</h6>
                        <div className="flex flex-col gap-4">
                            <span className="flex items-center gap-3 text-[14px] font-medium text-gray-500">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block shadow-sm"></span> Secured with Cloudflare
                            </span>
                            <span className="flex items-center gap-3 text-[14px] font-medium text-gray-500">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm"></span> Payments via Razorpay
                            </span>
                            <span className="flex items-center gap-3 text-[14px] font-medium text-gray-500">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block shadow-sm"></span> Images via Cloudinary
                            </span>
                            <span className="flex items-center gap-3 text-[14px] font-medium text-gray-500">
                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow-sm"></span> 5-min expiring download links
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 font-medium text-sm">
                    <p>© {new Date().getFullYear()} CNC Market. All rights reserved.</p>
                    <p>Built with <span className="text-red-500">♥</span> for woodworkers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
