import Joi from "joi";
import { joi } from "../../utils/helper.js";

// POST /auth/signup
export const signupSchema = Joi.object({
  fName: joi.name("fName").required(),
  lName: joi.name("lName").required(),
  email: joi.email(),
  password: joi.password(),
});

// POST /auth/login
export const loginSchema = Joi.object({
  email: joi.email(),
  password: Joi.string().required(),
});

// PATCH /users/:id (example for future use)
export const updateSchema = Joi.object({
  fName: joi.name("fName"),
  lName: joi.name("lName"),
  isActive: joi.bool(),
  role: joi.role(),
}).min(1);

// :id param validation (example)
export const idParamSchema = Joi.object({
  id: joi.id(),
});
