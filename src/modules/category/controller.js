import {
    response200,
    response201,
    response400,
    response404,
    response500,
} from "../../utils/ApiResponse.js";
import {
    createOne,
    findAll,
    findOne,
    updateOne,
} from "../../config/db.service.js";
import { modelName } from "../../utils/helper.js";

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const category = await createOne(modelName.CATEGORY, req.body);
        return response201(res, "Category created successfully", category);
    } catch (err) {
        return response400(res, err.message);
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await findAll(
            modelName.CATEGORY,
            { isDeleted: false },
            {},
            { lean: true }
        );
        return response200(res, "Categories fetched successfully", categories);
    } catch (err) {
        return response500(res, err.message);
    }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await findOne(
            modelName.CATEGORY,
            { _id: req.params.id },
            {},
            { lean: true }
        );

        if (!category || category.isDeleted) {
            return response404(res, "Category not found");
        }

        return response200(res, "Category fetched successfully", category);
    } catch (err) {
        return response500(res, err.message);
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    try {
        const category = await updateOne(
            modelName.CATEGORY,
            { _id: req.params.id },
            req.body,
            { runValidators: true }
        );

        if (!category) {
            return response404(res, "Category not found");
        }

        return response200(res, "Category updated successfully", category);
    } catch (err) {
        return response400(res, err.message);
    }
};

// Soft delete a category
export const deleteCategory = async (req, res) => {
    try {
        const category = await findOne(
            modelName.CATEGORY,
            { _id: req.params.id },
            {},
            { lean: false }
        );

        if (!category || category.isDeleted) {
            return response404(res, "Category not found");
        }

        category.isDeleted = true;
        await category.save();

        return response200(res, "Category deleted successfully");
    } catch (err) {
        return response500(res, err.message);
    }
};