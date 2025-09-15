// src/modules/product/routes.js
import { Router } from "express";
import {
  createProduct,
  listProducts,
  updateProductDetails,
  updateVariants,
  deleteProduct,
  getProductBySku,
} from "./controller.js";
import { uploadSingle } from "../../lib/upload.js";
import { isAdmin } from "../../middleware/auth.js";

const r = Router();

// Reads
r.get("/", listProducts);
r.get("/:skuId", getProductBySku);

// Create product with multiple images (field: files[])
r.post("/", isAdmin, uploadSingle, createProduct);

// Update product details
r.put("/:id", isAdmin, uploadSingle, updateProductDetails);
r.put("/:id/variants", isAdmin, updateVariants);

// delete product
r.delete("/:id", isAdmin, deleteProduct);

export default r;
