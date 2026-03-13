const path = require('path');

const APPWRITE_KEY_PREFIX = 'appwrite';

const buildAppwriteFileKey = ({ bucketId, fileId, fileName }) => {
    const safeName = encodeURIComponent(fileName);
    return `${APPWRITE_KEY_PREFIX}/${bucketId}/${fileId}/${safeName}`;
};

const parseAppwriteFileKey = (fileKey) => {
    if (!fileKey || typeof fileKey !== 'string') {
        return null;
    }

    const parts = fileKey.split('/');
    if (parts.length < 4 || parts[0] !== APPWRITE_KEY_PREFIX) {
        return null;
    }

    const [provider, bucketId, fileId, ...nameParts] = parts;
    const encodedName = nameParts.join('/');
    const fileName = decodeURIComponent(encodedName || '');

    if (!provider || !bucketId || !fileId || !fileName) {
        return null;
    }

    return {
        provider,
        bucketId,
        fileId,
        fileName,
        extension: path.extname(fileName).toLowerCase(),
    };
};

module.exports = {
    APPWRITE_KEY_PREFIX,
    buildAppwriteFileKey,
    parseAppwriteFileKey,
};
