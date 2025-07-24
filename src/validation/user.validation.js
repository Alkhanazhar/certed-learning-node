const Joi = require('joi');

const updateProfileSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().min(6).required()
});

const contactFormSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "any.required": "Name is required.",
        "string.empty": "Please enter your name.",
    }),

    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Email is required.",
        "string.email": "Enter a valid email address.",
    }),

    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        "any.required": "Phone number is required.",
        "string.pattern.base": "Phone must be exactly 10 digits.",
    }),

    subject: Joi.string().min(3).max(200).required().messages({
        "any.required": "Subject is required.",
        "string.empty": "Please enter a subject.",
    }),

    message: Joi.string().min(10).max(2000).required().messages({
        "any.required": "Message is required.",
        "string.empty": "Please enter your message.",
    }),
});

module.exports = {
    updateProfileSchema,
    changePasswordSchema,
    contactFormSchema
};
