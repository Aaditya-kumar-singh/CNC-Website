const { z, emailSchema } = require('./common.validator');

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

const registerSchema = z.object({
    name: z.string().trim().min(1, 'Please provide a valid name').max(100, 'Name cannot exceed 100 characters'),
    email: emailSchema,
    password: passwordSchema,
});

const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Please provide email and password'),
});

const forgotPasswordSchema = z.object({
    email: emailSchema,
});

const resetPasswordSchema = z.object({
    password: passwordSchema,
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
