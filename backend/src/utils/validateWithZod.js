const validateWithZod = (schema, payload) => {
    const result = schema.safeParse(payload);

    if (!result.success) {
        const issue = result.error.issues[0];
        const error = new Error(issue?.message || 'Invalid request data');
        error.statusCode = 400;
        throw error;
    }

    return result.data;
};

module.exports = validateWithZod;
