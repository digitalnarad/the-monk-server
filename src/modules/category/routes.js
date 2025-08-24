import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from './controller.js';
import { validator } from "../../middleware/validator.js";
import { createcategory } from "./validation.js";

const router = express.Router();

router.get('/getallcategories', getAllCategories);
router.post('/', validator(createcategory), createCategory);
router.put('/updatecategory/:id', validator(createcategory), updateCategory);
router.get('/getCategoryById/:id', getCategoryById);

router.delete('/deleteCategory/:id', deleteCategory);

export default router;


