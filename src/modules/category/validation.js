// validation/categoryValidation.js
import Joi from "joi";

export const createCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  desc: Joi.string().max(255),
  isDeleted: Joi.boolean().default(false),
  image: Joi.any().allow(null),
  sortOrder: Joi.number(),
  isActive: Joi.boolean().default(true),
});
