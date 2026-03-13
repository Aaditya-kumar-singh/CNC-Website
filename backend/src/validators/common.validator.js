const { z } = require('zod');
const { DESIGN_CATEGORIES } = require('../constants/design.constants');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');
const emailSchema = z.string().trim().email('Please provide a valid email address').transform((value) => value.toLowerCase());
const categorySchema = z.enum(DESIGN_CATEGORIES);

module.exports = {
    z,
    objectIdSchema,
    emailSchema,
    categorySchema,
};
