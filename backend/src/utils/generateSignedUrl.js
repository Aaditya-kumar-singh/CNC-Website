const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/storage');

const generateSignedUrl = async (fileKey) => {
    // Handling local files
    if (fileKey && fileKey.startsWith('local-designs/')) {
        const fileName = fileKey.replace('local-designs/', '');
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/designs/${fileName}`;
    }

    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
    });

    const expiry = parseInt(process.env.SIGNED_URL_EXPIRY) || 300; // default 5 minutes (was 60s — too tight for slow connections)

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: expiry });
        return url;
    } catch (error) {
        console.error("Error generating signed URL", error);
        throw new Error('Could not generate secure download link');
    }
};

module.exports = generateSignedUrl;
