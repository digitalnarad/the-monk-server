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
} from "./controller.js";
import { upload } from "../../lib/upload.js";

const r = Router();

// Create product with multiple images (field: files[])
r.post("/", upload.array("files", 20), createProduct);

// Add more images later
r.post("/:id/images", upload.array("files", 20), addImages);

// Replace/delete/set-primary using image _id only
r.put("/:id/images/:imageId", upload.single("file"), replaceImageById);
r.delete("/:id/images/:imageId", deleteImageById);
r.patch("/:id/primary/:imageId", setPrimaryById);

// Reads
r.get("/", listProducts);
r.get("/:id", getProduct);
r.get("/get-sku-id", getSkuId);

export default r;
