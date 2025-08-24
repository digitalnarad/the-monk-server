// validation/categoryValidation.js
import Joi from 'joi';

export const createcategory = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  desc: Joi.string().max(255),
  isDeleted: Joi.boolean().default(false),
  bannerUrl:Joi.string().allow('').default(''),
  sortOrder:Joi.number(),
  isActive: Joi.boolean().default(true),
  createdBy: Joi.string()
});