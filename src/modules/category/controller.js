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
import { asyncHandler } from "../../utils/asyncHandler.js";

// Create a new category
export const createCategory = asyncHandler(async (req, res) => {
  const category = await createOne(modelName.CATEGORY, req.body);
  return response201(res, "Category created successfully", category);
});

// Get all categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await findAll(
    modelName.CATEGORY,
    { isDeleted: false },
    {},
    { lean: true }
  );
  return response200(res, "Categories fetched successfully", categories);
});

// Get a single category by ID
export const getCategoryById = asyncHandler(async (req, res) => {
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
});

// Update a category
export const updateCategory = asyncHandler(async (req, res) => {
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
});

// Soft delete a category
export const deleteCategory = asyncHandler(async (req, res) => {
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
});
