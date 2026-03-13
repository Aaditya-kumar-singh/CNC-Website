const path = require('path');
const logger = require('../config/logger');
const { bucketId, configError, ID, InputFile, isConfigured, storage } = require('../config/appwrite');
const { buildAppwriteFileKey } = require('./fileStorageKey');

module.exports = async (fileBuffer, mimeType, originalName) => {
    if (!isConfigured) {
        throw new Error(configError || 'Appwrite storage is not configured on the backend.');
    }

    const ext = path.extname(originalName || '');

    try {
        const fileId = ID.unique();
        const file = InputFile.fromBuffer(fileBuffer, originalName);
        const uploadedFile = await storage.createFile({
            bucketId,
            fileId,
            file,
            permissions: [],
        });

        const fileName = uploadedFile?.name || originalName;
        if (!uploadedFile?.$id || !fileName) {
            throw new Error('Missing Appwrite file metadata in upload response');
        }

        return buildAppwriteFileKey({
            bucketId,
            fileId: uploadedFile.$id,
            fileName,
        });
    } catch (error) {
        logger.error({
            message: 'Appwrite upload error',
            error: error.message,
            type: error.type,
            code: error.code,
            response: error.response,
            name: originalName,
            ext,
            mimeType,
        });
        throw new Error(`Appwrite upload failed: ${error.message}`);
    }
};
