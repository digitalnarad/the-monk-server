// src/modules/product/model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    skuId: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true }, // products/{skuId}/originals/img-{skuId}
    width: Number,
    height: Number,
    aspectRatio: Number,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("products", productSchema);
