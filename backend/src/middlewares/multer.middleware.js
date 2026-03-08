const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { v4: uuid } = require("uuid");

// Cloudinary storage for preview images
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "cnc/previews",
        allowed_formats: ["jpg", "png", "webp", "jpeg"],
        public_id: () => uuid()
    }
});

// Custom storage: routes 'preview' → Cloudinary, 'cnc' → memory
const hybridStorage = {
    _handleFile(req, file, cb) {
        if (file.fieldname === "preview") {
            // Delegate to Cloudinary storage
            imageStorage._handleFile(req, file, cb);
        } else {
            // Fix #5: validate CNC file type before buffering
            const allowedCNCExtensions = ['.stl', '.dxf', '.svg', '.obj', '.nc', '.gcode', '.tap', '.ngc'];
            const path = require('path');
            const ext = path.extname(file.originalname || '').toLowerCase();
            if (!allowedCNCExtensions.includes(ext)) {
                return cb(new Error(`Invalid CNC file type "${ext}". Allowed: ${allowedCNCExtensions.join(', ')}`));
            }

            // Buffer to memory for R2 upload
            const chunks = [];
            file.stream.on("data", (chunk) => chunks.push(chunk));
            file.stream.on("end", () => {
                file.buffer = Buffer.concat(chunks);
                cb(null, { buffer: file.buffer });
            });
            file.stream.on("error", cb);
        }
    },
    _removeFile(req, file, cb) {
        if (file.fieldname === "preview" && imageStorage._removeFile) {
            imageStorage._removeFile(req, file, cb);
        } else {
            cb(null);
        }
    }
};

// Single unified multer instance — handles both fields in one pass
const upload = multer({
    storage: hybridStorage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max (images are validated separately in controller)
    }
});

module.exports = { upload };
