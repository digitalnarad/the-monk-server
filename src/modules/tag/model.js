// src/modules/category/model.js
import mongoose from "mongoose";
import { modelName } from "../../utils/helper.js";

const tagSchema = new mongoose.Schema(
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
        value: {
            type: String,
            trim: true,
            default: ""
        },

        // Soft flags
        isActive: { type: Boolean, default: true }, // hide from storefront if false
        isDeleted: { type: Boolean, default: false }, // keep for history without hard delete

        // Auditing (optional; fill in controllers/middleware if you track users)
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: modelName.TAG },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: modelName.TAG },
    },
    { timestamps: true }
);

export default mongoose.model("tags", tagSchema);
