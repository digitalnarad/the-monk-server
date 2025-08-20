import { Router } from "express";
import authRoutes from "./modules/user/routes.js";

const router = Router();

router.use("/auth", authRoutes);

export default router;
