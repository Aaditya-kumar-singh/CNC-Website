import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';
import SEO from '../components/SEO';
import { companyInfo } from '../content/companyInfo';

const channels = [
    {
        label: 'Email',
        value: companyInfo.email,
        href: `mailto:${companyInfo.email}`,
        icon: Mail,
    },
    {
        label: 'Phone',
        value: companyInfo.phoneDisplay,
        href: `tel:${companyInfo.phone}`,
        icon: Phone,
    },
    {
        label: 'Instagram',
        value: '@cnc_market_7',
        href: companyInfo.instagram,
        icon: Instagram,
    },
    {
        label: 'Facebook',
        value: 'CNC Market Facebook',
        href: companyInfo.facebook,
        icon: Facebook,
    },
];

const About = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fc] selection:bg-black selection:text-white">
            <SEO
                title="About CNC Market"
                description="Learn more about CNC Market and connect directly with Ranjan Kumar for design support and updates."
            />

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 lg:p-12">
                        <span className="inline-flex items-center rounded-full bg-orange-50 px-4 py-2 text-xs font-black tracking-[0.2em] text-orange-700">
                            ABOUT CNC MARKET
                        </span>
                        <h1 className="mt-6 text-4xl lg:text-5xl font-black tracking-tight text-[#111]">
                            Premium CNC designs with direct support.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 font-medium">
                            CNC Market is a design marketplace focused on router, laser, STL, DXF, and SVG files for makers, furniture work, panels, and decorative carving projects.
                        </p>
                        <p className="mt-4 text-base leading-7 text-gray-500">
                            If you need help choosing files, want custom work, or want to connect with the team directly, the primary contact for the website is {companyInfo.name}.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-3">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center rounded-full bg-[#111] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
                            >
                                Contact Us
                            </Link>
                            <a
                                href={companyInfo.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Visit Instagram
                            </a>
                        </div>
                    </section>

                    <aside className="bg-[#111] text-white rounded-[2rem] shadow-xl p-8 lg:p-10">
                        <p className="text-sm font-black tracking-[0.25em] text-white/60">BUSINESS CONTACT</p>
                        <h2 className="mt-4 text-3xl font-black tracking-tight">{companyInfo.name}</h2>
                        <p className="mt-3 text-white/70 leading-7">
                            Reach out for support, social updates, and direct communication related to CNC Market.
                        </p>

                        <div className="mt-8 space-y-4">
                            {channels.map(({ label, value, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={label === 'Email' || label === 'Phone' ? undefined : '_blank'}
                                    rel={label === 'Email' || label === 'Phone' ? undefined : 'noreferrer'}
                                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition-colors hover:bg-white/10"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                                        <Icon size={18} />
                                    </span>
                                    <span>
                                        <span className="block text-xs font-bold tracking-[0.18em] text-white/50">{label}</span>
                                        <span className="block text-sm font-semibold text-white">{value}</span>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default About;
