import React from 'react';
import SEO from '../components/SEO';
import { Shield, CreditCard, FileCheck, RefreshCw, Lock, MessageCircle, CheckCircle } from 'lucide-react';

const BuyerProtection = () => {
    return (
        <>
            <SEO 
                title="Buyer Protection Policy"
                description="Our buyer protection policy ensures safe purchases on CNC Market. Learn about our secure payment processing, file quality guarantees, and refund policy."
                keywords="buyer protection, CNC designs, secure payment, refund policy, file quality guarantee"
            />
            
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Hero Section */}
                <div className="bg-[#111] text-white py-20">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
                            <Shield className="w-10 h-10 text-green-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Buyer Protection Policy</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Shop with confidence. We've got you covered from purchase to download.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 py-16">
                    
                    {/* Protection Highlights */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                                <CreditCard className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payments</h3>
                            <p className="text-gray-600">
                                All transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. Your financial data is encrypted and secure.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                                <FileCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
                            <p className="text-gray-600">
                                All design files are verified for quality and compatibility. We ensure accurate file formats and clean vector paths.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                                <RefreshCw className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Refunds</h3>
                            <p className="text-gray-600">
                                Not satisfied? Get a full refund within 7 days of purchase if the files are defective or not as described.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Sellers</h3>
                            <p className="text-gray-600">
                                Our seller verification system ensures you're buying from trusted, rated sellers with proven track records.
                            </p>
                        </div>
                    </div>

                    {/* Detailed Policy Sections */}
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                What's Covered
                            </h2>
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700"><strong>File Format Issues</strong> - If the downloaded file doesn't match the described format (DXF, STL, SVG)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700"><strong>Corrupted Files</strong> - Files that cannot be opened or are damaged</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700"><strong>Missing Content</strong> - Designs that don't include all described elements</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700"><strong>Incorrect Size/Dimensions</strong> - Files that don't match stated measurements</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700"><strong>Download Failures</strong> - Inability to download within 30 days of purchase</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <RefreshCw className="w-6 h-6 text-blue-500" />
                                Refund Policy
                            </h2>
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="prose prose-gray max-w-none">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility for Refunds</h3>
                                    <p className="text-gray-600 mb-4">
                                        You may request a refund within <strong>7 days</strong> of your purchase if:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                        <li>The file is corrupted or cannot be opened</li>
                                        <li>The file format doesn't match what was described</li>
                                        <li>The design significantly differs from the listing</li>
                                        <li>Technical issues prevent you from using the files</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Non-Refundable Cases</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                                        <li>Change of mind after download</li>
                                        <li>Incorrect software compatibility (please check requirements before purchase)</li>
                                        <li>Files that have been modified after download</li>
                                        <li>Requests made after 7 days of purchase</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Request a Refund</h3>
                                    <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                                        <li>Contact us at <a href="mailto:ranjanraj232000@gmail.com" className="text-blue-600 hover:underline">ranjanraj232000@gmail.com</a></li>
                                        <li>Describe the issue with your purchase</li>
                                        <li>Our team will review your request within 48 hours</li>
                                        <li>Refunds are processed within 5-7 business days</li>
                                    </ol>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <MessageCircle className="w-6 h-6 text-purple-500" />
                                How to Contact Support
                            </h2>
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <p className="text-gray-600 mb-6">
                                    Our support team is here to help! Reach out to us through any of these channels:
                                </p>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                        <MessageCircle className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                        <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
                                        <p className="text-sm text-gray-500">Available 9AM - 6PM IST</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                        <CreditCard className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                                        <p className="text-sm text-gray-500">24/7 Response</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                        <Shield className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                        <h4 className="font-semibold text-gray-900 mb-1">Submit Ticket</h4>
                                        <p className="text-sm text-gray-500">24/7 Available</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seller Verification Tiers</h2>
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <p className="text-gray-600 mb-6">
                                    We implement a seller verification system to ensure a trustworthy marketplace:
                                </p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                            <h4 className="font-semibold text-blue-900">Verified</h4>
                                        </div>
                                        <p className="text-sm text-blue-700">Identity verified seller with basic account</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                                            <h4 className="font-semibold text-purple-900">Pro Seller</h4>
                                        </div>
                                        <p className="text-sm text-purple-700">20+ sales with professional support</p>
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                                            <h4 className="font-semibold text-amber-900">Top Seller</h4>
                                        </div>
                                        <p className="text-sm text-amber-700">50+ sales with top ratings</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-600 mb-6">Have questions about our buyer protection?</p>
                        <a 
                            href="mailto:ranjanraj232000@gmail.com" 
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#111] text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyerProtection;
