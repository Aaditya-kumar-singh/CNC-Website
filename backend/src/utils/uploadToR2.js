const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../config/storage"); // S3/R2 client
const { v4: uuid } = require("uuid");

const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

module.exports = async (fileBuffer, mimeType, originalName) => {
    const ext = path.extname(originalName || '');
    const fileName = `${uuid()}${ext}`;

    // Check if R2 is fully configured (and not the default placeholders)
    if (
        process.env.R2_BUCKET_NAME &&
        process.env.R2_ACCESS_KEY &&
        process.env.R2_ACCESS_KEY !== 'your_r2_access_key'
    ) {
        const key = `designs/${fileName}`;
        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
                Body: fileBuffer,
                ContentType: mimeType
            })
        );
        return key; // store in DB
    } else {
        // Fallback: Store locally
        const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'designs');
        await fsPromises.mkdir(uploadDir, { recursive: true });

        const localFilePath = path.join(uploadDir, fileName);
        await fsPromises.writeFile(localFilePath, fileBuffer);

        return `local-designs/${fileName}`; // Local path string format
    }
};
