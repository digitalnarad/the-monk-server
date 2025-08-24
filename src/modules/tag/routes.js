import express from 'express';
import {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
} from './controller.js';
import { validator } from "../../middleware/validator.js";
import { tagValidation } from "./validation.js";

const router = express.Router();

router.get('/getAllTags', getAllTags);
router.post('/', validator(tagValidation), createTag);
router.put('/updateTag/:id', validator(tagValidation), updateTag);
router.get('/getTagById/:id', getTagById);

router.delete('/deleteTag/:id', deleteTag);

export default router;


