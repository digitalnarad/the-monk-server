import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { response401 } from "../utils/ApiResponse.js";
import { findOne } from "../config/db.service.js";
import { modelName } from "../utils/helper.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return response401(res, "Unauthorized Request");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    const user = await findOne(modelName.USER, {
      _id: payload._id,
      isDeleted: false,
    });
    if (!user) return response401(res, "Unauthorized Request");
    if (payload.role !== user.role) return response401(res, "access required");

    req.user = {
      ...user,
      _id: user._id.toString(),
      __v: undefined,
      password: undefined,
    };
    next();
  } catch {
    return response401(res, "Unauthorized Request");
  }
}

export function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return response401(res, "Admin access required");
}
