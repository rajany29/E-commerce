const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid('electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'other').required(),
  brand: Joi.string().optional(),
  stock: Joi.number().min(0).required(),
  sku: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional(),
  specifications: Joi.object().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});
module.exports = { registerSchema , loginSchema , productSchema}