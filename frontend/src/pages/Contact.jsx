import React from 'react';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';
import SEO from '../components/SEO';
import { companyInfo } from '../content/companyInfo';

const contacts = [
    {
        title: 'Email',
        detail: companyInfo.email,
        href: `mailto:${companyInfo.email}`,
        action: 'Send an email',
        icon: Mail,
    },
    {
        title: 'Call',
        detail: companyInfo.phoneDisplay,
        href: `tel:${companyInfo.phone}`,
        action: 'Call now',
        icon: Phone,
    },
    {
        title: 'Instagram',
        detail: '@cnc_market_7',
        href: companyInfo.instagram,
        action: 'Open Instagram',
        icon: Instagram,
    },
    {
        title: 'Facebook',
        detail: 'CNC Market page',
        href: companyInfo.facebook,
        action: 'Open Facebook',
        icon: Facebook,
    },
];

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fc] selection:bg-black selection:text-white">
            <SEO
                title="Contact CNC Market"
                description="Contact Ranjan Kumar at CNC Market by email, phone, Instagram, or Facebook."
            />

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <section className="rounded-[2rem] bg-gradient-to-br from-[#111] via-[#1b1b1b] to-[#2a2a2a] px-8 py-10 lg:px-12 lg:py-14 text-white shadow-2xl">
                    <p className="text-sm font-black tracking-[0.25em] text-white/60">CONTACT CNC MARKET</p>
                    <h1 className="mt-4 text-4xl lg:text-5xl font-black tracking-tight">
                        Reach {companyInfo.name} directly.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base lg:text-lg leading-8 text-white/75">
                        Use the contact details below for support, business communication, and social updates connected to this website.
                    </p>
                </section>

                <section className="mt-8 grid gap-6 md:grid-cols-2">
                    {contacts.map(({ title, detail, href, action, icon: Icon }) => {
                        const external = title === 'Instagram' || title === 'Facebook';

                        return (
                            <a
                                key={title}
                                href={href}
                                target={external ? '_blank' : undefined}
                                rel={external ? 'noreferrer' : undefined}
                                className="group rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-[#111]">
                                    <Icon size={22} />
                                </div>
                                <h2 className="mt-6 text-2xl font-black tracking-tight text-[#111]">{title}</h2>
                                <p className="mt-3 text-base font-semibold text-gray-700">{detail}</p>
                                <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-gray-400 transition-colors group-hover:text-black">
                                    {action}
                                </p>
                            </a>
                        );
                    })}
                </section>
            </div>
        </div>
    );
};

export default Contact;
