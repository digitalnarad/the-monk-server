// src/modules/product/upload.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function publicIdForIndex(idx1) {
  return `img${idx1}`; // deterministic naming: img1, img2, ...
}
function normalizeFormat(fmt) {
  return fmt === "jpg" ? "jpeg" : fmt;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 20 }, // up to 20 images
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|jpg|png|webp)$/i.test(file.mimetype);
    cb(ok ? null : new Error("Only JPEG/PNG/WebP images allowed"), ok);
  },
});

function uploadBuffer(buffer, folder, public_id) {
  return new Promise((resolve, reject) => {
    const s = cloudinary.uploader.upload_stream(
      { folder, public_id, overwrite: true, resource_type: "image" },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    s.end(buffer);
  });
}
async function uploadMany(files, folder, startIdx1 = 1) {
  const out = [];
  for (let i = 0; i < files.length; i++) {
    const idx1 = startIdx1 + i;
    const pid = publicIdForIndex(idx1);
    const up = await uploadBuffer(files[i].buffer, folder, pid);
    out.push({
      url: deliverUrl(up.public_id),
      width: up.width,
      height: up.height,
      format: normalizeFormat(up.format),
    });
  }
  return out;
}

function deliverUrl(public_id) {
  return cloudinary.url(public_id, {
    secure: true,
    transformation: [{ fetch_format: "auto", quality: "auto" }],
  });
}

export { upload, uploadMany, deliverUrl, uploadBuffer };
