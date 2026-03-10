import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cnc_cookie_consent';

const defaultConsent = {
    essential: true,      // always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false,
    decided: false,       // has the user made a choice?
    decidedAt: null,
};

export const useCookieConsent = () => {
    const [consent, setConsent] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...defaultConsent, ...JSON.parse(stored) } : defaultConsent;
        } catch {
            return defaultConsent;
        }
    });

    // Persist to localStorage whenever consent changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    }, [consent]);

    const acceptAll = () => {
        setConsent({ essential: true, functional: true, analytics: true, marketing: true, decided: true, decidedAt: new Date().toISOString() });
    };

    const rejectAll = () => {
        setConsent({ essential: true, functional: false, analytics: false, marketing: false, decided: true, decidedAt: new Date().toISOString() });
    };

    const saveCustom = (custom) => {
        setConsent({ ...custom, essential: true, decided: true, decidedAt: new Date().toISOString() });
    };

    const resetConsent = () => {
        const fresh = { ...defaultConsent };
        localStorage.removeItem(STORAGE_KEY);
        setConsent(fresh);
    };

    return { consent, acceptAll, rejectAll, saveCustom, resetConsent };
};
