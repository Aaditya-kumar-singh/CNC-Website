const isProduction = process.env.NODE_ENV === 'production';

const normalizeSameSite = (value = '') => {
    const normalized = String(value).trim().toLowerCase();

    if (normalized === 'strict') return 'strict';
    if (normalized === 'none') return 'none';
    return 'lax';
};

const sameSite = normalizeSameSite(process.env.AUTH_COOKIE_SAME_SITE);
const secure = isProduction || sameSite === 'none';

const getAuthCookieOptions = () => {
    const options = {
        httpOnly: true,
        secure,
        sameSite,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (process.env.AUTH_COOKIE_DOMAIN) {
        options.domain = process.env.AUTH_COOKIE_DOMAIN;
    }

    return options;
};

module.exports = {
    getAuthCookieOptions,
};
