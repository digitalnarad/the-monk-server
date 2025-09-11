// src/modules/category/upload.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for single image upload
export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /image\/(jpeg|jpg|png|webp)$/i.test(file.mimetype);
    cb(
      allowed ? null : new Error("Only JPEG/PNG/WebP images allowed"),
      allowed
    );
  },
}).single("image");

// Upload buffer to Cloudinary
export function uploadToCloudinary(
  buffer,
  folder = "the-monk/categories",
  public_id = `img-${Date.now().toString()}`
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: public_id,
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
