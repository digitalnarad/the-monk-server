// src/modules/product/routes.js
import { Router } from "express";
import multer from "multer";
import { createProduct, getProduct, listProducts } from "./controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});
const r = Router();

r.post("/", upload.single("file"), createProduct);
r.get("/", listProducts);
r.get("/:id", getProduct);

export default r;
