// src/modules/product/model.js
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  format: { type: String, enum: ["jpeg", "png", "webp"], required: true },
});

const productSchema = new mongoose.Schema(
  {
    skuId: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    images: { type: [imageSchema], default: [] },
    primaryIndex: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["natural", "aesthetic", "blend"],
      required: true,
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tags: { type: [mongoose.Schema.Types.ObjectId], ref: "tags", default: [] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("products", productSchema);
