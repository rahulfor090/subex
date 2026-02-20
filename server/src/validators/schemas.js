// validators/schemas.js — Joi validation schemas for admin endpoints
const Joi = require('joi');

// ── User Schemas ──

exports.createUserSchema = Joi.object({
    first_name: Joi.string().max(100).required().messages({
        'any.required': 'First name is required.'
    }),
    last_name: Joi.string().max(100).required().messages({
        'any.required': 'Last name is required.'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required.',
        'string.email': 'Please provide a valid email.'
    }),
    password: Joi.string().min(6).optional().default('Welcome@123').messages({
        'string.min': 'Password must be at least 6 characters.'
    }),
    phone_number: Joi.string().max(20).allow('', null).optional(),
    role: Joi.string().valid('user', 'admin').optional().default('user'),
    status: Joi.string().valid('active', 'suspended', 'banned').optional().default('active')
});

exports.updateUserRoleSchema = Joi.object({
    role: Joi.string().valid('user', 'admin').required().messages({
        'any.only': 'Role must be either "user" or "admin". Cannot assign super_admin via API.',
        'any.required': 'Role is required.'
    })
});

exports.updateUserStatusSchema = Joi.object({
    status: Joi.string().valid('active', 'suspended', 'banned').required().messages({
        'any.only': 'Status must be "active", "suspended", or "banned".',
        'any.required': 'Status is required.'
    })
});

exports.updateUserSchema = Joi.object({
    first_name: Joi.string().max(100).optional(),
    last_name: Joi.string().max(100).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('user', 'admin').optional().messages({
        'any.only': 'Role must be either "user" or "admin".'
    }),
    status: Joi.string().valid('active', 'suspended', 'banned').optional().messages({
        'any.only': 'Status must be "active", "suspended", or "banned".'
    })
});

// ── Plan Schemas ──

exports.createPlanSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'any.required': 'Plan name is required.'
    }),
    description: Joi.string().max(500).allow('', null).optional(),
    price: Joi.number().min(0).required().messages({
        'any.required': 'Price is required.',
        'number.min': 'Price cannot be negative.'
    }),
    interval: Joi.string().valid('monthly', 'yearly', 'weekly', 'lifetime').required().messages({
        'any.required': 'Billing interval is required.',
        'any.only': 'Interval must be "monthly", "yearly", "weekly", or "lifetime".'
    }),
    features: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional(),
    max_users: Joi.number().integer().min(1).allow(null).optional(),
    is_active: Joi.boolean().optional()
});

exports.updatePlanSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    description: Joi.string().max(500).allow('', null).optional(),
    price: Joi.number().min(0).optional(),
    interval: Joi.string().valid('monthly', 'yearly', 'weekly', 'lifetime').optional(),
    features: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional(),
    max_users: Joi.number().integer().min(1).allow(null).optional(),
    is_active: Joi.boolean().optional()
});
