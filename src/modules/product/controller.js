// src/modules/product/controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  response200,
  response201,
  response400,
  response404,
} from "../../utils/ApiResponse.js";
import {
  createOne,
  findOne,
  findAll,
  updateOne,
  findPaginateQuery,
  countDocument,
  aggregation,
} from "../../config/db.service.js";
import Product from "./model.js";
import { genSkuId_nanoid, modelName, msg } from "../../utils/helper.js";
import { uploadToCloudinary } from "../../lib/upload.js";

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
  console.log("req.body", req.body);
  const { title, desc } = req.body || {};

  let skuId = genSkuId_nanoid();

  const isSkuIdExists = await findOne(modelName.PRODUCT, {
    skuId: skuId,
    isDeleted: false,
  });

  if (isSkuIdExists) {
    skuId = genSkuId_nanoid();
  }

  if (!title || !desc) return response400(res, "title and desc are required");
  if (!req.file) return response400(res, "at least one image required");

  const folder = `the-monk/products/${skuId}/originals`;

  let image = null;
  if (req.file) {
    try {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        folder,
        `${skuId}-${Date.now().toString()}`
      );
      image = uploadResult.secure_url;
    } catch (error) {
      return response400(res, "Image upload failed");
    }
  }

  const product = await createOne(modelName.PRODUCT, {
    skuId,
    title,
    desc,
    image,
    defaultVariant: req.body.defaultVariant || "vertical",
    category: req.body.category,
    price: req.body.price,
    discount: req.body.discount,
    tags: JSON.parse(req.body.tags),
    isActive: Boolean(req.body?.isActive),
    addedBy: req.user._id,
  });

  return response201(res, msg.create_success("Product"), product);
});

export const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) return response404(res, "Product not found");

  const { title, desc } = req.body || {};
  if (!title || !desc) return response400(res, "title and desc are required");

  let newImage = null;
  if (req.file) {
    try {
      const folder = `the-monk/products/${product.skuId}/originals`;
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        folder,
        `${product.skuId}-${Date.now().toString()}`
      );
      newImage = uploadResult.secure_url;
    } catch (error) {
      return response400(res, "Image upload failed");
    }
  }

  const update = {
    title: req.body.title || product.title,
    desc: req.body.desc || product.desc,
    image: newImage || product.image,
    defaultVariant: req.body.defaultVariant || product.defaultVariant,
    category: req.body.category || product.category,
    price: req.body.price || product.price,
    discount: req.body.discount || product.discount,
    tags: JSON.parse(req.body.tags) || product.tags,
    isActive: Boolean(req.body?.isActive) || product.isActive,
  };

  await updateOne(modelName.PRODUCT, { _id: id }, update);

  return response200(res, msg.update_success("Product"), product);
});

export const updateVariants = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) return response404(res, "Product not found");

  const variants = req.body;
  console.log("variants", variants);

  const newProduct = await updateOne(
    modelName.PRODUCT,
    { _id: id },
    { variants }
  );

  console.log("newProduct", newProduct);
  return response200(res, "Variants updated", newProduct);
});

// GET /api/v1/products/:id
export const getProductBySku = asyncHandler(async (req, res) => {
  const product = await findOne(modelName.PRODUCT, {
    skuId: req.params.skuId,
    isDeleted: false,
  });
  if (!product) return response404(res, "Not found");
  return response200(res, msg.fetch_success("Product"), product);
});

// GET /api/v1/products
export const listProducts = asyncHandler(async (req, res) => {
  let {
    page = 0,
    limit = 10,
    sortBy = "createdAt",
    order = "asc",
    search = "",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const skip = page * limit;
  const sort = { [sortBy]: order === "asc" ? 1 : -1 };

  const match = {
    isDeleted: false,
    ...(search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { skuId: { $regex: search, $options: "i" } },
          ],
        }
      : {}),
  };

  const pipeline = [
    { $match: match },

    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },

    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ];

  const [products, count] = await Promise.all([
    aggregation(modelName.PRODUCT, pipeline),
    countDocument(modelName.PRODUCT, match),
  ]);

  return response200(res, msg.list_fetch_success("Products"), {
    products,
    count,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await findOne(modelName.PRODUCT, {
    _id: id,
    isDeleted: false,
  });
  if (!product) return response404(res, "Product not found");

  await updateOne(modelName.PRODUCT, { _id: id }, { isDeleted: true });

  return response200(res, msg.delete_success("Product"), {});
});
