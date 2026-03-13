const path = require('path');
const logger = require('../config/logger');
const cloudinary = require('../config/cloudinary');

const getCloudinaryPrivateDownloadUrl = (fileKey, expiry) => {
    if (!fileKey || !path.extname(fileKey || '')) {
        throw new Error('Invalid Cloudinary file key');
    }

    const expiresAt = Math.floor(Date.now() / 1000) + expiry;

    // Raw uploads are stored with the extension already embedded in public_id
    // (for example: cnc/designs/uuid.dxf). Passing the extension separately
    // causes Cloudinary to look up the wrong resource.
    return cloudinary.utils.private_download_url(fileKey, undefined, {
        resource_type: 'raw',
        type: 'private',
        expires_at: expiresAt,
        attachment: true,
    });
};

const generateSignedUrl = async (fileKey) => {
    if (!fileKey || typeof fileKey !== 'string') {
        throw new Error('Invalid file key');
    }

    const sanitizedKey = fileKey
        .replace(/\0/g, '')
        .replace(/\.\.\/|\.\.\\/g, '')
        .trim();

    if (!sanitizedKey || sanitizedKey !== fileKey) {
        throw new Error('Invalid or malicious file key detected');
    }

    const expiry = parseInt(process.env.SIGNED_URL_EXPIRY, 10) || 300;

    if (sanitizedKey.startsWith('cnc/designs/')) {
        return getCloudinaryPrivateDownloadUrl(sanitizedKey, expiry);
    }

    if (sanitizedKey.startsWith('local-designs/')) {
        const fileName = path.basename(sanitizedKey.replace('local-designs/', ''));
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/designs/${fileName}`;
    }

    logger.error({ message: 'Error generating signed URL', error: 'Unsupported file key origin', key: sanitizedKey });
    throw new Error('Could not generate secure download link');
};

module.exports = generateSignedUrl;
