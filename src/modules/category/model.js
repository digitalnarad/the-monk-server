// src/modules/category/model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // Human-readable unique name (e.g., "Wall Art")
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      unique: true,
      index: true,
    },

    // Short description for admins/SEO snippets
    desc: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // URL-friendly slug generated from name (unique)
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    bannerUrl: { type: String, default: "" },

    sortOrder: { type: Number, default: 0 },

    // Soft flags
    isActive: { type: Boolean, default: true }, // hide from storefront if false
    isDeleted: { type: Boolean, default: false }, // keep for history without hard delete

    // Auditing (optional; fill in controllers/middleware if you track users)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Bhumi' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Bhumi' },
  },
  { timestamps: true }
);

// Simple slugify helper
function toSlug(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Ensure slug exists/updates when name changes
categorySchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = toSlug(this.name);
  }
  next();
});

export default mongoose.model("category", categorySchema);
