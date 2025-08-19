import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { response401 } from "../utils/response.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return response401(res, "Unauthorized Request");
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    return response401(res, "Unauthorized Request");
  }
}
