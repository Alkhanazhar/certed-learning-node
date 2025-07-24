const Joi = require('joi');


const coursePurchaseSchema = Joi.object({
    user_id: Joi.number().integer().positive().required().messages({
        'number.base': 'User ID must be a number',
        'number.positive': 'User ID must be positive',
        'any.required': 'User ID is required'
    }),
    course_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Course ID must be a number',
        'number.positive': 'Course ID must be positive',
        'any.required': 'Course ID is required'
    }),
    name: Joi.string().min(2).max(255).trim().required().messages({
        'string.min': 'User name must be at least 2 characters long',
        'string.max': 'User name cannot exceed 255 characters',
        'any.required': 'User name is required'
    }),
    email: Joi.string().email().max(255).trim().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.max': 'Email cannot exceed 255 characters',
        'any.required': 'Email is required'
    }),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional().messages({
        'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number'
    }),
    coupon_code: Joi.string().max(50).optional().allow('').messages({
        'string.max': 'Coupon code cannot exceed 50 characters'
    })
});

const paymentVerificationSchema = Joi.object({
    razorpay_payment_id: Joi.string().required().messages({
        'any.required': 'Razorpay payment ID is required'
    }),
    razorpay_order_id: Joi.string().required().messages({
        'any.required': 'Razorpay order ID is required'
    }),
    razorpay_signature: Joi.string().required().messages({
        'any.required': 'Razorpay signature is required'
    }),
    purchase_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Purchase ID must be a number',
        'number.positive': 'Purchase ID must be positive',
        'any.required': 'Purchase ID is required'
    })
});

module.exports = {
    coursePurchaseSchema,
    paymentVerificationSchema
  };