export const templates = {
  front0: {
    base: "mockups/canvas/front0_base", // replace if different in your cloud
    overlays: [
      // optional later: "mockups/canvas/front_texture",
      // optional later: "mockups/canvas/front_shadow",
    ],
    // TODO: measure precisely and update x,y,w,h for pixel-perfect fit
    artRect: { x: 380, y: 240, w: 1640, h: 1090 },
    maxOutputW: 2000,
  },
  angle30: {
    base: "mockups/canvas/right30_base", // replace if different
    overlays: [
      // optional later: "mockups/canvas/angle30_edges"
    ],
    artRect: { x: 430, y: 330, w: 1500, h: 1000 },
    maxOutputW: 2000,
  },
  angle45: {
    base: "mockups/canvas/left45_base", // replace if different
    overlays: [
      // optional later: "mockups/canvas/angle45_edges"
    ],
    artRect: { x: 460, y: 360, w: 1420, h: 940 },
    maxOutputW: 2000,
  },
};
