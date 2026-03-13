const cloudinary = require("../config/cloudinary");
const { v4: uuid } = require("uuid");
const stream = require("stream");
const path = require("path");
const logger = require('../config/logger');
const { CLOUDINARY_CNC_CHUNK_SIZE_BYTES } = require('../constants/upload.constants');

module.exports = async (fileBuffer, mimeType, originalName) => {
    return new Promise((resolve, reject) => {
        const ext = path.extname(originalName || '');
        const fileName = `${uuid()}${ext}`;

        const uploadOptions = {
            resource_type: 'raw',
            folder: 'cnc/designs',
            public_id: fileName,
            type: 'private',
            overwrite: false,
            use_filename: false,
            unique_filename: false,
            access_mode: 'authenticated',
            chunk_size: CLOUDINARY_CNC_CHUNK_SIZE_BYTES,
            filename: fileName,
        };

        const uploadStream = cloudinary.uploader.upload_chunked_stream(
            uploadOptions,
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

                if (!result?.public_id) {
                    return reject(new Error('Cloudinary upload failed: Missing public_id in response'));
                }

                resolve(result.public_id);
            }
        );

        stream.Readable.from(fileBuffer).pipe(uploadStream);
    });
};
