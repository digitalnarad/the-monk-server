/* -------------------- AUTH/SECURITY HELPERS -------------------- */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import Joi from "joi";
import { customAlphabet } from "nanoid";

// HTTP status codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  ERROR: 500,
};

// Response messages
export const msg = {
  invalidCredentials: "Invalid credentials",
  loginSuccess: "Login successfully",
  invalidRole: "Invalid role",
  tokenExpired: "Token is expired or Invalid",
  accountInActivated: "Your account has been deactivated by the administrator.",
  verifiedTToken: "Token is verified",
  fetch_success: (name) => `${name} fetched successfully`,
  update_success: (name) => `${name} updated successfully`,
  delete_success: (name) => `${name} deleted successfully`,
  create_success: (name) => `${name} created successfully`,
  not_found: (name) => `${name} not found`,
  is_exists: (name) => `${name} is already exists`,
};

// Model names
export const modelName = {
  USER: "users",
  PRODUCT: "products",
  CATEGORY: "categories",
  TAG: "tags",
};

// Joi validation schemas
export const joi = {
  id: () =>
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Invalid id")
      .required(),
  email: () => Joi.string().trim().lowercase().email().max(254).required(),
  password: () =>
    Joi.string()
      .min(8)
      .max(128)
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
      .message("Password must contain letters and numbers")
      .required(),
  name: (label = "name") => Joi.string().trim().min(2).max(50).label(label),
  bool: () => Joi.boolean(),
  role: () => Joi.string().valid("user", "admin").default("user"),
};

// Password hashing and comparison
export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}
export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// JWT
export function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

// SKU ID Generator
const nano = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 12);

export function genSkuId_nanoid() {
  return nano();
}
