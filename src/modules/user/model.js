import mongoose from "mongoose";
import { modelName } from "../../utils/helper.js";

const userSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model(modelName.USER, userSchema);

const d = {
  name: "user",
  desc: "doe",
  tag: "user@example.com",
  password: "user@123",
};
