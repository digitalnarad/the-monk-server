import express from "express";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
  getTagList,
} from "./controller.js";
import { validator } from "../../middleware/validator.js";
import { tagValidation } from "./validation.js";
import { isAdmin } from "../../middleware/auth.js";

const r = express.Router();

r.get("/get-List", getTagList);
r.get("/", getAllTags);
r.get("/:id", getTagById);

// Admin routes
r.post("/", isAdmin, validator(tagValidation), createTag);
r.put("/:id", isAdmin, validator(tagValidation), updateTag);
r.delete("/:id", isAdmin, deleteTag);

export default r;
