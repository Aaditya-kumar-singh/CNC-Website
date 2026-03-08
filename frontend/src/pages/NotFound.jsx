import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    useEffect(() => {
        document.title = '404 — Page Not Found | CNC Market';
        return () => { document.title = 'CNC Market'; };
    }, []);
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#f8f9fc] selection:bg-black selection:text-white font-sans">
            <div className="relative mb-8 flex justify-center items-center">
                <span className="text-[12rem] sm:text-[15rem] font-black text-gray-100 leading-none select-none tracking-tighter">404</span>
                <div className="absolute flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg border border-gray-100">
                    <Sparkles className="text-[#111]" size={40} />
                </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">Page Not Found</h1>
            <p className="text-gray-500 font-medium text-lg max-w-md mb-10 leading-relaxed">
                The design or page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#111] text-white rounded-full font-bold text-[15px] hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <ArrowLeft size={18} /> Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
