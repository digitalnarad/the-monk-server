// src/modules/product/controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  response200,
  response201,
  response400,
  response404,
} from "../../utils/ApiResponse.js";
import { createOne, findOne, findAll } from "../../config/db.service.js";
import { buildMockupUrl } from "../../mockup/builder.js";
import { cloudinary } from "../../services/cloudinary.js";
import { randomUUID } from "crypto";

const MODEL = "products";

function makeMockupUrls(p) {
  const aspect =
    p.aspectRatio || (p.width && p.height ? p.width / p.height : 1);
  const id = p.cloudinaryPublicId;
  return {
    front0_800: buildMockupUrl({
      productPublicId: id,
      artAspect: aspect,
      templateKey: "front0",
      outW: 800,
    }),
    front0_1600: buildMockupUrl({
      productPublicId: id,
      artAspect: aspect,
      templateKey: "front0",
      outW: 1600,
    }),
    angle30_1600: buildMockupUrl({
      productPublicId: id,
      artAspect: aspect,
      templateKey: "angle30",
      outW: 1600,
    }),
    angle45_1600: buildMockupUrl({
      productPublicId: id,
      artAspect: aspect,
      templateKey: "angle45",
      outW: 1600,
    }),
  };
}

// POST /api/v1/products (multipart: file, title)
export const createProduct = asyncHandler(async (req, res) => {
  const { title } = req.body || {};
  if (!title) return response400(res, "title is required");
  if (!req.file) return response400(res, "file is required");

  const skuId = randomUUID().slice(0, 12);
  const publicId = `img-${skuId}`;
  const folderPath = `the-monk/products/${skuId}/originals`;

  const uploadRes = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        folder: folderPath,
      },
      (err, data) => (err ? reject(err) : resolve(data))
    );
    stream.end(req.file.buffer);
  });

  const doc = await createOne(MODEL, {
    skuId,
    title,
    cloudinaryPublicId: `${folderPath}/${publicId}`,
    width: uploadRes.width,
    height: uploadRes.height,
    aspectRatio: uploadRes.width / uploadRes.height,
  });

  return response201(res, "Created", {
    product: doc,
    mockupUrls: makeMockupUrls(doc),
  });
});

// GET /api/v1/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const p = await findOne(MODEL, { _id: req.params.id, isDeleted: false });
  if (!p) return response404(res, "Not found");
  return response200(res, "OK", { product: p, mockupUrls: makeMockupUrls(p) });
});

// GET /api/v1/products
export const listProducts = asyncHandler(async (req, res) => {
  const items = await findAll(MODEL, { isDeleted: false });
  const out = items.map((p) => ({ ...p, mockupUrls: makeMockupUrls(p) }));
  return response200(res, "OK", { items: out });
});
