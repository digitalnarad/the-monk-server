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

// Create a new tag
export const createTag = asyncHandler(async (req, res) => {
  const tag = await createOne(modelName.TAG, req.body);
  return response201(res, "Tag created successfully", tag);
});

// Get all active tags
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await findAll(
    modelName.TAG,
    { isDeleted: false },
    {},
    { lean: true }
  );
  return response200(res, "Tags fetched successfully", tags);
});

// Get a single tag by ID
export const getTagById = asyncHandler(async (req, res) => {
  const tag = await findOne(
    modelName.TAG,
    { _id: req.params.id },
    {},
    { lean: true }
  );

  if (!tag || tag.isDeleted) {
    return response404(res, "Tag not found");
  }

  return response200(res, "Tag fetched successfully", tag);
});


// Update a tag
export const updateTag = asyncHandler(async (req, res) => {
  const tag = await updateOne(
    modelName.TAG,
    { _id: req.params.id },
    req.body,
    { runValidators: true }
  );

  if (!tag) {
    return response404(res, "Tag not found");
  }

  return response200(res, "Tag updated successfully", tag);
});


// Soft delete a tag
export const deleteTag = asyncHandler(async (req, res) => {
  const tag = await findOne(
    modelName.TAG,
    { _id: req.params.id },
    {},
    { lean: false }
  );

  if (!tag || tag.isDeleted) {
    return response404(res, "Tag not found");
  }

  tag.isDeleted = true;
  await tag.save();

  return response200(res, "Tag deleted successfully");
});

