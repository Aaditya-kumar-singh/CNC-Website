import React, { useState, useEffect } from 'react';
import { Cookie, X, ChevronDown, ChevronUp, ShieldCheck, BarChart2, Megaphone, Settings2 } from 'lucide-react';


// ─── Individual Toggle Row ────────────────────────────────────────────────────
const CookieToggle = ({ label, description, icon: Icon, iconColor, checked, disabled, onChange }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                    <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-sm">{label}</p>
                        {disabled && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Always On</span>}
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Toggle details"
                    >
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {/* Toggle switch */}
                    <button
                        role="switch"
                        aria-checked={checked}
                        disabled={disabled}
                        onClick={() => !disabled && onChange(!checked)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${checked ? 'bg-black' : 'bg-gray-200'} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>
            {open && (
                <div className="px-5 pb-4 text-xs font-medium text-gray-500 leading-relaxed bg-gray-50/50 border-t border-gray-100">
                    {description}
                </div>
            )}
        </div>
    );
};

// ─── Main Cookie Consent Component ───────────────────────────────────────────
const CookieConsent = ({ consent, acceptAll, rejectAll, saveCustom }) => {
    const [showManager, setShowManager] = useState(false);
    const [custom, setCustom] = useState({
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
    });

    // BUG FIX #1: Sync custom state every time the manager opens
    // Without this, the toggles show stale initial values (always false)
    // when the user opens the manager from the Footer after already deciding.
    useEffect(() => {
        if (showManager) {
            setCustom({
                functional: consent.functional,
                analytics: consent.analytics,
                marketing: consent.marketing,
            });
        }
    }, [showManager, consent.functional, consent.analytics, consent.marketing]);

    // Allow external triggers (e.g. Footer link) to open the manager
    useEffect(() => {
        const handler = () => setShowManager(true);
        window.addEventListener('cnc:open-cookie-manager', handler);
        return () => window.removeEventListener('cnc:open-cookie-manager', handler);
    }, []);

    if (consent.decided && !showManager) return null;

    const handleSaveCustom = () => {
        saveCustom({ ...custom, essential: true });
        setShowManager(false);
    };


    // ─── Manager Modal ───
    if (showManager) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-6 pt-6 pb-4 rounded-t-[2rem] z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                                    <Settings2 size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-gray-900">Cookie Preferences</h2>
                                    <p className="text-xs text-gray-400 font-medium">Manage how we use cookies</p>
                                </div>
                            </div>
                            {/* BUG FIX #2: Always show close button when manager is open.
                                Previously hidden when consent.decided=true, trapping users who
                                opened the manager from the Footer with no way to close it. */}
                            <button
                                onClick={() => setShowManager(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                aria-label="Close cookie manager"
                            >
                                <X size={14} className="text-gray-600" />
                            </button>

                        </div>
                    </div>

                    <div className="px-6 py-5 space-y-3">
                        <CookieToggle
                            label="Essential Cookies"
                            icon={ShieldCheck}
                            iconColor="text-green-600 bg-green-50"
                            description="These cookies are required for the website to function. They include authentication tokens, security cookies, and shopping cart persistence. They cannot be disabled."
                            checked={true}
                            disabled={true}
                            onChange={() => { }}
                        />
                        <CookieToggle
                            label="Functional Cookies"
                            icon={Cookie}
                            iconColor="text-blue-600 bg-blue-50"
                            description="These cookies remember your preferences, such as your preferred sort order, category filters, and display settings. Disabling them means your preferences will reset each visit."
                            checked={custom.functional}
                            disabled={false}
                            onChange={v => setCustom(c => ({ ...c, functional: v }))}
                        />
                        <CookieToggle
                            label="Analytics Cookies"
                            icon={BarChart2}
                            iconColor="text-purple-600 bg-purple-50"
                            description="These cookies help us understand how visitors use our website, which pages are most popular, and what design categories perform best. All data is anonymous and aggregated."
                            checked={custom.analytics}
                            disabled={false}
                            onChange={v => setCustom(c => ({ ...c, analytics: v }))}
                        />
                        <CookieToggle
                            label="Marketing Cookies"
                            icon={Megaphone}
                            iconColor="text-orange-600 bg-orange-50"
                            description="These cookies are used to deliver relevant advertisements and measure ad campaign effectiveness. They track visits across websites to build a profile of your interests."
                            checked={custom.marketing}
                            disabled={false}
                            onChange={v => setCustom(c => ({ ...c, marketing: v }))}
                        />

                        <div className="pt-2 pb-1 text-xs text-gray-400 font-medium leading-relaxed">
                            You can change these preferences at any time by clicking "Cookie Preferences" in the footer.
                            View our <a href="/privacy-policy" className="underline hover:text-gray-700">Privacy Policy</a> for more information.
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                onClick={handleSaveCustom}
                                className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors"
                            >
                                Save My Preferences
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => { rejectAll(); setShowManager(false); }}
                                    className="py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Reject All
                                </button>
                                <button
                                    onClick={() => { acceptAll(); setShowManager(false); }}
                                    className="py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Initial Banner ───
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6 pointer-events-none">
            <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 sm:p-8 pointer-events-auto">
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Cookie size={22} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-gray-900 text-base mb-1">We use cookies 🍪</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            We use cookies to enhance your browsing experience, serve personalized content, and analyze site traffic.
                            <button onClick={() => setShowManager(true)} className="text-blue-600 underline ml-1 hover:text-blue-700 font-bold">Manage preferences</button>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <button
                            onClick={rejectAll}
                            className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            Reject All
                        </button>
                        <button
                            onClick={() => setShowManager(true)}
                            className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                        >
                            Manage
                        </button>
                        <button
                            onClick={acceptAll}
                            className="flex-1 sm:flex-none px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors whitespace-nowrap"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
