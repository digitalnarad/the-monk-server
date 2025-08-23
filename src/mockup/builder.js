// src/modules/mockup/builder.js
import { cloudinary } from "../services/cloudinary.js";
import { templates } from "./templates.js";

// fit artwork aspect ratio into a template rect
function fitIntoRect(aspect, rect) {
  let w = rect.w;
  let h = Math.round(w / aspect);
  if (h > rect.h) {
    h = rect.h;
    w = Math.round(h * aspect);
  }
  const x = rect.x + Math.round((rect.w - w) / 2);
  const y = rect.y + Math.round((rect.h - h) / 2);
  return { w, h, x, y };
}

export function buildMockupUrl({
  productPublicId, // e.g. "products/SKU/originals/img-SKU"
  artAspect, // width/height of original
  templateKey = "front0",
  outW = 1600,
}) {
  const t = templates[templateKey];
  if (!t) throw new Error(`Unknown template: ${templateKey}`);

  const width = Math.min(Number(outW) || 1600, t.maxOutputW);
  const { w, h, x, y } = fitIntoRect(artAspect || 1, t.artRect);

  const transformation = [
    { fetch_format: "auto", quality: "auto", width, crop: "scale" },
    {
      overlay: `${productPublicId}`,
      width: w,
      height: h,
      crop: "fill",
      gravity: "north_west",
      x,
      y,
    },
    ...t.overlays.map((pid) => ({ overlay: pid, flags: "layer_apply" })),
  ];

  return cloudinary.url(t.base, { transformation, version: null });
}
