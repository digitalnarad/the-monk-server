import express from "express";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} from "./controller.js";
import { validator } from "../../middleware/validator.js";
import { tagValidation } from "./validation.js";
import { isAdmin } from "../../middleware/auth.js";

const router = express.Router();

router.get("/getAllTags", getAllTags);
router.get("/getTagById/:id", getTagById);

// Admin routes
router.post("/", isAdmin, validator(tagValidation), createTag);
router.put("/:id", isAdmin, validator(tagValidation), updateTag);
router.delete("/:id", isAdmin, deleteTag);

export default router;
