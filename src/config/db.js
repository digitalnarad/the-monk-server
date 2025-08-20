import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  if (!env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");
}
