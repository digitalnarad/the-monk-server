// src/modules/product/controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  response200,
  response201,
  response400,
  response404,
} from "../../utils/ApiResponse.js";
import { createOne, findOne, findAll } from "../../config/db.service.js";
import Product from "./model.js";
import { genSkuId_nanoid } from "../../utils/helper.js";
import { deliverUrl, uploadBuffer, uploadMany } from "../../lib/upload.js";

function folderFor(skuId) {
  return `the-monk/products/${skuId}/originals`;
}
function publicIdForIndex(idx1) {
  return `img${idx1}`;
}

function normalizeFormat(fmt) {
  return fmt === "jpg" ? "jpeg" : fmt;
}

function findImageIndexById(product, imageId) {
  return product.images.findIndex((img) => String(img._id) === String(imageId));
}

export const createProduct = asyncHandler(async (req, res) => {
  const { title, desc, primaryIndex = 0 } = req.body || {};
  const files = req.files || [];

  if (!title || !desc) return response400(res, "title and desc are required");
  if (!files.length) return response400(res, "at least one image required");

  const folder = folderFor(skuId);

  const images = await uploadMany(files, folder, 1);

  const product = await createOne("products", {
    skuId,
    title,
    desc,
    images,
    primaryIndex,
  });

  return response201(res, "Created", {
    product,
    primary: product.images[product.primaryIndex] || null,
  });
});

// POST /api/v1/products/:id/images (files[])
export const addImages = asyncHandler(async (req, res) => {
  const files = req.files || [];
  if (!files.length) return response400(res, "no images provided");

  const product = await Product.findOne({
    _id: req.params.id,
    isDeleted: false,
  });
  if (!product) return response404(res, "Product not found");

  const folder = folderFor(product.skuId);
  const start = (product.images?.length || 0) + 1;

  const newImages = await uploadMany(files, folder, start);
  product.images.push(...newImages);
  await product.save();

  return response201(res, "Images added", {
    images: product.images,
    primaryIndex: product.primaryIndex,
  });
});

// PUT /api/v1/products/:id/images/:imageId  (file)
export const replaceImageById = asyncHandler(async (req, res) => {
  if (!req.file) return response400(res, "file is required");
  const { id, imageId } = req.params;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) return response404(res, "Product not found");

  const idx = findImageIndexById(product, imageId);
  if (idx === -1) return response404(res, "Image not found");

  const folder = folderFor(product.skuId);
  const public_id = publicIdForIndex(idx + 1); // keep deterministic naming
  const up = await uploadBuffer(req.file.buffer, folder, public_id);

  // preserve same _id while updating fields
  product.images[idx] = {
    _id: product.images[idx]._id,
    url: deliverUrl(up.public_id),
    width: up.width,
    height: up.height,
    format: normalizeFormat(up.format),
  };
  await product.save();

  return response200(res, "Image replaced", { image: product.images[idx] });
});

// DELETE /api/v1/products/:id/images/:imageId
export const deleteImageById = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) return response404(res, "Product not found");

  const idx = findImageIndexById(product, imageId);
  if (idx === -1) return response404(res, "Image not found");

  // Optional: also delete from Cloudinary if you store public_id separately.
  product.images.splice(idx, 1);

  // clamp primaryIndex
  if (product.images.length === 0) product.primaryIndex = 0;
  else if (product.primaryIndex >= product.images.length)
    product.primaryIndex = product.images.length - 1;

  await product.save();

  return response200(res, "Image deleted", {
    images: product.images,
    primaryIndex: product.primaryIndex,
  });
});

// PATCH /api/v1/products/:id/primary/:imageId
export const setPrimaryById = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) return response404(res, "Product not found");

  const idx = findImageIndexById(product, imageId);
  if (idx === -1) return response404(res, "Image not found");

  product.primaryIndex = idx;
  await product.save();

  return response200(res, "Primary updated", {
    primaryIndex: idx,
    primary: product.images[idx],
  });
});

// GET /api/v1/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const p = await findOne("products", { _id: req.params.id, isDeleted: false });
  if (!p) return response404(res, "Not found");
  return response200(res, "OK", {
    product: p,
    primary: p.images[p.primaryIndex] || null,
  });
});

// GET /api/v1/products
export const listProducts = asyncHandler(async (req, res) => {
  const items = await findAll("products", { isDeleted: false });
  console.log("items", items);
  const out = items.map((p) => ({
    ...p,
    primary: p.images[p.primaryIndex] || null,
  }));
  return response200(res, "OK", { items: out });
});

export const getSkuId = asyncHandler(async (req, res) => {
  let skuId = genSkuId_nanoid();

  const product = await findOne("products", {
    skuId: req.params.id,
    isDeleted: false,
  });
  if (product) {
    skuId = product.skuId;
  }
  return response200(res, "OK", { skuId });
});
