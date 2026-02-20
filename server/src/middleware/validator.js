// middleware/validator.js — Joi validation middleware factory
// Usage: validate(schema) where schema is a Joi schema object
// Validates req.body against the schema and returns 400 if invalid

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,     // Return all errors, not just the first
            stripUnknown: true,    // Remove unknown fields for safety
            allowUnknown: false    // Reject unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/['"]/g, '')
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Replace req.body with validated & sanitized data
        req.body = value;
        next();
    };
};

module.exports = { validate };
