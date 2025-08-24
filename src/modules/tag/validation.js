// validation/tagValidation.js
import Joi from 'joi';

export const tagValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  desc: Joi.string().max(255),
  value: Joi.string().allow('').default(''),
  isDeleted: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
  createdBy: Joi.string()
});