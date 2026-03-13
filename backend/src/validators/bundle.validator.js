const { z, objectIdSchema } = require('./common.validator');

const createBundleSchema = z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000, 'Description cannot exceed 2000 characters'),
    price: z.coerce.number().min(0, 'Price must be a valid non-negative number').max(100000, 'Price cannot exceed 100000'),
    designs: z.array(objectIdSchema).min(1, 'Designs must be a non-empty array of design IDs.'),
    previewImage: z.string().trim().min(1, 'Please provide a preview image'),
});

module.exports = {
    createBundleSchema,
};
