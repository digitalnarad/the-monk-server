import { Router } from "express";
import authRoutes from "./modules/user/routes.js";
import productRoutes from "./modules/product/routes.js";
import categoryRoutes from "./modules/category/routes.js";
import tagRoutes from "./modules/tag/routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/category", categoryRoutes);
router.use("/tag",tagRoutes);

export default router;
