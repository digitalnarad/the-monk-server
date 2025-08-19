import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./model.js";
import { env } from "../../config/env.js";

export async function createUser({ fName, lName, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("Email already in use");
    err.status = 409;
    err.code = "EMAIL_IN_USE";
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ fName, lName, email, password: hash });
  return sanitizeUser(user);
}

export async function authenticate(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  const token = signToken(user._id, user.role);
  return { user: sanitizeUser(user), token };
}

export function signToken(id, role) {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function sanitizeUser(userDoc) {
  return {
    id: userDoc._id,
    fName: userDoc.fName,
    lName: userDoc.lName,
    email: userDoc.email,
    role: userDoc.role,
    createdAt: userDoc.createdAt,
  };
}
