import Category from './model.js';
import {
  response200,
  response201,
  response400,
  response404,
  response500,
} from "../../utils/ApiResponse.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    return response201(res, "Category created successfully", category);
  } catch (err) {
    return response400(res, err.message);
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    return response200(res, "Categories fetched successfully", categories);
  } catch (err) {
    return response500(res, err.message);
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
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
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
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
    const category = await Category.findById(req.params.id);
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