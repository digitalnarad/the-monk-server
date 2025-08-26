import { Router } from "express";
import { signup, login, me, adminLogin, meAdmin } from "./controller.js";
import { validator } from "../../middleware/validator.js";
import { signupSchema, loginSchema } from "./validation.js";
import { requireAdminAuth, requireAuth } from "../../middleware/auth.js";

const r = Router();

r.post("/signup", validator(signupSchema), signup);
r.post("/login", validator(loginSchema), login);
r.get("/me", requireAuth, me);

// Admin routes
r.post("/admin/login", validator(loginSchema), adminLogin);
r.get("/admin/me", requireAdminAuth, meAdmin);
export default r;
