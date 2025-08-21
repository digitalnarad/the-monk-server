import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  // CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  // CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  // CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
};
