import {
  response200,
  response201,
  response400,
  response404,
  response409,
  response500,
} from "../../utils/ApiResponse.js";
import {
  countDocument,
  createOne,
  findAll,
  findOne,
  findPaginateQuery,
  updateOne,
} from "../../config/db.service.js";
import { modelName, msg } from "../../utils/helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadToCloudinary } from "../../lib/upload.js";

// Get all categories
export const getAllCategories = asyncHandler(async (req, res) => {
  let {
    page = 0,
    limit = 10,
    shortBy = "createdAt",
    order = "asc",
    search = "",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const textCriteria = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { desc: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const categories = await findPaginateQuery(
    modelName.CATEGORY,
    { isDeleted: false, ...textCriteria },
    { [shortBy]: order === "asc" ? 1 : -1 },
    page * limit,
    limit
  );

  const count = await countDocument(modelName.CATEGORY, {
    isDeleted: false,
    ...textCriteria,
  });

  return response200(res, "Categories fetched successfully", {
    categories,
    count,
  });
});

// Get a single category by ID
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await findOne(
    modelName.CATEGORY,
    { _id: req.params.id, isDeleted: false },
    {},
    { lean: true }
  );

  if (!category) {
    return response404(res, "Category not found");
  }

  return response200(res, "Category fetched successfully", category);
});

// Create a new category
export const createCategory = asyncHandler(async (req, res) => {
  const { name, desc = "", sortOrder = 0, isActive = true } = req.body;
  const createdBy = req.user?.id;

  // Check if category name already exists
  const existingCategory = await findOne(modelName.CATEGORY, {
    name: name.trim(),
    isDeleted: false,
  });
  if (existingCategory) {
    return response400(res, "Category name already exists");
  }

  // Handle image upload if present
  let bannerUrl = "";
  if (req.file) {
    try {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "the-monk/categories"
      );
      bannerUrl = uploadResult.secure_url;
    } catch (error) {
      return response400(res, "Image upload failed");
    }
  }

  const category = await createOne(modelName.CATEGORY, {
    name: name.trim(),
    desc,
    bannerUrl,
    sortOrder: Number(sortOrder),
    createdBy,
    isActive,
    isDeleted: false,
  });

  return response201(res, "Category created successfully", { category });
});

// Update a category
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Check if category exists
  const existingCategory = await findOne(modelName.CATEGORY, {
    _id: id,
    isDeleted: false,
  });
  if (!existingCategory) {
    return response404(res, "Category not found");
  }

  // Check name uniqueness if name is being updated
  if (updateData.name && updateData.name !== existingCategory.name) {
    const nameExists = await findOne(modelName.CATEGORY, {
      name: updateData.name.trim(),
      _id: { $ne: id },
      isDeleted: false,
    });
    if (nameExists) {
      return response409(res, "Category name already exists");
    }
    updateData.name = updateData.name.trim();
  }

  // Handle image upload if present
  if (req.file) {
    try {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "the-monk/categories"
      );
      updateData.bannerUrl = uploadResult.secure_url;
    } catch (error) {
      return response400(res, "Image upload failed");
    }
  }

  // Convert sortOrder to number if present
  if (updateData.sortOrder !== undefined) {
    updateData.sortOrder = Number(updateData.sortOrder);
  }

  const updatedCategory = await updateOne(
    modelName.CATEGORY,
    { _id: id },
    updateData
  );

  return response200(res, msg.update_success("Category"), {
    category: updatedCategory,
  });
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

  // category.isDeleted = true;
  await updateOne(
    modelName.CATEGORY,
    { _id: req.params.id },
    { isDeleted: true }
  );

  return response200(res, "Category deleted successfully", {});
});

export const getAllCategoriesList = asyncHandler(async (req, res) => {
  const categories = await findAll(
    modelName.CATEGORY,
    { isDeleted: false },
    {
      desc: 1,
      sortOrder: 1,
      bannerUrl: 1,
      slug: 1,
      name: 1,
      _id: 1,
    }
  );
  return response200(res, "Categories fetched successfully", { categories });
});
