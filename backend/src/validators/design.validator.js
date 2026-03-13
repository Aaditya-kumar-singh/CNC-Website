const { z, categorySchema } = require('./common.validator');

const titleSchema = z.string().trim().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters');
const descriptionSchema = z.string().trim().min(10, 'Description must be at least 10 characters').max(2000, 'Description cannot exceed 2000 characters');
const priceSchema = z.coerce.number().min(0, 'Price must be a valid non-negative number').max(100000, 'Price cannot exceed 100000');

const createDesignSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    price: priceSchema,
    category: categorySchema,
});

const updateDesignSchema = z.object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    price: priceSchema.optional(),
    category: categorySchema.optional(),
}).refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Please provide at least one field to update',
});

module.exports = {
    createDesignSchema,
    updateDesignSchema,
};
