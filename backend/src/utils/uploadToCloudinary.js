const cloudinary = require("../config/cloudinary");
const { v4: uuid } = require("uuid");
const stream = require("stream");
const path = require("path");
const logger = require('../config/logger');

module.exports = async (fileBuffer, mimeType, originalName) => {
    return new Promise((resolve, reject) => {
        const ext = path.extname(originalName || '');
        const fileName = `${uuid()}${ext}`;

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'cnc/designs',
                public_id: fileName,
                type: 'private',
                overwrite: false,
                use_filename: false,
                unique_filename: false,
                access_mode: 'authenticated'
            },
            (error, result) => {
                if (error) {
                    logger.error({
                        message: 'Cloudinary upload error',
                        error: error.message,
                        http_code: error.http_code,
                        name: originalName,
                        ext,
                        mimeType,
                    });
                    return reject(new Error(`Cloudinary upload failed: ${error.message}`));
                }

                // Return the public_id representing the file in Cloudinary
                resolve(result.public_id);
            }
        );

        stream.Readable.from(fileBuffer).pipe(uploadStream);
    });
};
