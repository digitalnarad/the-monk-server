import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesList,
} from "./controller.js";
import { validator } from "../../middleware/validator.js";
import { createCategoryValidation } from "./validation.js";
import { isAdmin } from "../../middleware/auth.js";
import { uploadSingle } from "../../lib/upload.js";

const r = express.Router();

r.get("/", getAllCategories);
r.get("/get-list", getAllCategoriesList);
r.get("/:id", getCategoryById);

// Admin routes
r.post(
  "/",
  isAdmin,
  uploadSingle,
  validator(createCategoryValidation),
  createCategory
);
r.put(
  "/:id",
  isAdmin,
  uploadSingle,
  validator(createCategoryValidation),
  updateCategory
);
r.delete("/:id", isAdmin, deleteCategory);

export default r;
