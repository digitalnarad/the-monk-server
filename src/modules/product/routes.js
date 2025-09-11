// src/modules/product/routes.js
import { Router } from "express";
import {
  createProduct,
  addImages,
  replaceImageById,
  deleteImageById,
  setPrimaryById,
  getProduct,
  listProducts,
  getSkuId,
  updateProductDetails,
} from "./controller.js";
import { uploadSingle } from "../../lib/upload.js";

const r = Router();

// Create product with multiple images (field: files[])
r.post("/", uploadSingle, createProduct);

// Update product details
r.put("/:id", uploadSingle, updateProductDetails);

// Add more images later
r.post("/:id/images", addImages);

// Replace/delete/set-primary using image _id only
r.put("/:id/images/:imageId", replaceImageById);
r.delete("/:id/images/:imageId", deleteImageById);
r.patch("/:id/primary/:imageId", setPrimaryById);

// Reads
r.get("/", listProducts);
r.get("/:id", getProduct);
r.get("/get-sku-id", getSkuId);

export default r;
