/* -------------------- AUTH/SECURITY HELPERS -------------------- */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import Joi from "joi";
import { customAlphabet } from "nanoid";

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  ERROR: 500,
};

export const msg = {
  notFound: "Data not found",
  invalidCredentials: "Invalid credentials",
  loginSuccess: "Login successfully",
  invalidRole: "Invalid role",
  tokenExpired: "Token is expired or Invalid",
  accountInActivated: "Your account has been deactivated by the administrator.",
  emailIsExists: "Email is already exists",
  fetchSuccessfully: "Fetched successfully",
  fetch_success: "Fetched successfully",
  update_success: "Updated successfully",
  delete_success: "Deleted successfully",
};

export const modelName = {
  USER: "users",
  PRODUCT: "products",
  CATEGORY: "categories",
  TAG:"tags"
};

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

// Password
export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}
export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// Request validation middleware

// JWT
export function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

/* -------------------- FIELD MAPPERS -------------------- */
export function mapUserDBToApi(doc) {
  if (!doc) return null;
  return {
    id: doc._id,
    fName: doc.f_name,
    lName: doc.l_name,
    email: doc.email,
    role: doc.role ?? "user",
    isActive: doc.is_active,
    createdAt: doc.createdAt,
  };
}

const nano = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 12);

export function genSkuId_nanoid() {
  return nano();
}
