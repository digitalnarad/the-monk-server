import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from './controller.js';
import { validator } from "../../middleware/validator.js";
import { createCategoryValidation } from "./validation.js";

const router = express.Router();

router.get('/getAllCategories', getAllCategories);
router.post('/', validator(createCategoryValidation), createCategory);
router.put('/updateCategory/:id', validator(createCategoryValidation), updateCategory);
router.get('/getCategoryById/:id', getCategoryById);

router.delete('/deleteCategory/:id', deleteCategory);

export default router;


