// src/modules/product/model.js
import mongoose from "mongoose";
import { modelName } from "../../utils/helper.js";

// Subdoc for one image inside a variant
const variantImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "" },
    // optional extras if storing CDN info
    width: { type: Number },
    height: { type: Number },
    format: { type: String }, // e.g., "jpeg","png","webp"
    sortOrder: { type: Number, default: 0 }, // for manual ordering if needed
  },
  { _id: true, timestamps: false }
);

// Subdoc for a variant gallery
const gallerySchema = new mongoose.Schema(
  {
    images: { type: [variantImageSchema], default: [] },
    // 0-based index into images; clamp in controllers when images mutate
    primaryIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false, timestamps: false }
);

// Main product schema
const productSchema = new mongoose.Schema(
  {
    skuId: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },

    // Fixed variants: vertical, horizontal, square
    variants: {
      type: new mongoose.Schema(
        {
          vertical: { type: gallerySchema, default: () => ({}) },
          horizontal: { type: gallerySchema, default: () => ({}) },
          square: { type: gallerySchema, default: () => ({}) },
        },
        { _id: false }
      ),
      required: true,
      default: () => ({}),
    },

    // Optional default variant for storefront fallback
    defaultVariant: {
      type: String,
      enum: ["vertical", "horizontal", "square"],
      default: "vertical",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelName.CATEGORY,
      required: true,
      index: true,
    },

    image: { type: variantImageSchema, default: {} }, // generic images not tied to variants

    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },

    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: modelName.TAG }],

    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelName.USER,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional safety: clamp primaryIndex on save
productSchema.pre("save", function (next) {
  const clamp = (g) => {
    if (!g || !Array.isArray(g.images)) return;
    if (g.images.length === 0) g.primaryIndex = 0;
    else if (g.primaryIndex >= g.images.length)
      g.primaryIndex = g.images.length - 1;
    else if (g.primaryIndex < 0) g.primaryIndex = 0;
  };
  clamp(this.variants?.vertical);
  clamp(this.variants?.horizontal);
  clamp(this.variants?.square);
  next();
});

export default mongoose.model("products", productSchema);
