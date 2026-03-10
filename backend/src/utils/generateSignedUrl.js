const cloudinary = require('../config/cloudinary');

const generateSignedUrl = async (fileKey) => {
    // Handling local files
    if (fileKey && fileKey.startsWith('local-designs/')) {
        const fileName = fileKey.replace('local-designs/', '');
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/designs/${fileName}`;
    }

    const expiry = parseInt(process.env.SIGNED_URL_EXPIRY) || 300; // default 5 minutes
    const expiresAt = Math.floor(Date.now() / 1000) + expiry;

    try {
        const url = cloudinary.utils.private_download_url(fileKey, 'raw', {
            expires_at: expiresAt,
            attachment: true
        });
        return url;
    } catch (error) {
        console.error("Error generating signed URL", error);
        throw new Error('Could not generate secure download link');
    }
};

module.exports = generateSignedUrl;
