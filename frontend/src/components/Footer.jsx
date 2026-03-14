import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Cookie } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { companyInfo } from '../content/companyInfo';

const Footer = () => {
    const { user } = useContext(AuthContext);

    return (
        <footer className="bg-white border-t border-gray-100 mt-auto selection:bg-black selection:text-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#111] rounded-lg flex items-center justify-center text-white font-black text-xs tracking-tighter">
                                CNC
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-[#111]">
                                CNC<span className="text-gray-400 font-medium">Market</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
                            A secure marketplace for premium CNC, DXF, STL and SVG design files. Buy, sell, and download with confidence.
                        </p>
                        <a
                            href={`mailto:${companyInfo.email}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-100 font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                        >
                            <Mail size={16} /> Request Custom Design
                        </a>
                    </div>

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

                    <div>
                        <h6 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Contact</h6>
                        <div className="flex flex-col gap-3">
                            <p className="text-gray-900 font-semibold text-[15px]">{companyInfo.name}</p>
                            <a href={`mailto:${companyInfo.email}`} className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors inline-flex items-center gap-2">
                                <Mail size={15} /> {companyInfo.email}
                            </a>
                            <a href={`tel:${companyInfo.phone}`} className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors inline-flex items-center gap-2">
                                <Phone size={15} /> {companyInfo.phoneDisplay}
                            </a>
                        </div>
                    </div>

                    <div>
                        <h6 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Company</h6>
                        <div className="flex flex-col gap-3">
                            <Link to="/about" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">About Us</Link>
                            <Link to="/contact" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">Contact Support</Link>
                            <Link to="/buyer-protection" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">Buyer Protection</Link>
                            <a href={companyInfo.instagram} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">Instagram</a>
                            <a href={companyInfo.facebook} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black font-medium text-[15px] transition-colors">Facebook</a>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('cnc:open-cookie-manager'))}
                                className="text-left text-gray-500 hover:text-black font-medium text-[15px] transition-colors flex items-center gap-1.5"
                            >
                                <Cookie size={15} /> Cookie Preferences
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust & Security Badges */}
                <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
                    <p className="text-center text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Trusted & Secure Payments</p>
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                <path d="M9 12l2 2 4-4"/>
                            </svg>
                            <span className="text-xs font-bold">SSL Secured</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <span className="text-xs font-bold">Razorpay</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <span className="text-xs font-bold">Verified Sellers</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                            <Link to="/buyer-protection" className="text-xs font-bold hover:text-blue-600">Buyer Protection</Link>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span className="text-xs font-bold">Quality Guaranteed</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 font-medium text-sm">
                    <p>&copy; {new Date().getFullYear()} CNC Market. All rights reserved. Premium Marketplace for Router and Laser Cutters.</p>
                    <div className="flex items-center gap-6">
                        <a href={companyInfo.instagram} target="_blank" rel="noreferrer" className="hover:text-black transition-colors inline-flex items-center gap-2">
                            <Instagram size={16} /> Instagram
                        </a>
                        <a href={companyInfo.facebook} target="_blank" rel="noreferrer" className="hover:text-black transition-colors inline-flex items-center gap-2">
                            <Facebook size={16} /> Facebook
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
