// OWNER: Ibrahim
import type { WorldConfig } from "./types";

export const moon: WorldConfig = {
  id: "moon",
  name: "The Moon",
  tagline: "TODO (Ibrahim): one line about what humanity left on the Moon",
  intro: "TODO (Ibrahim): documentary intro, 1–2 sentences",
  outro: "TODO (Ibrahim): 'this is today', plus what's coming next",
  // NASA SVS CGI Moon Kit, LRO LROC color map (2048 × 1024). Centered on 0° longitude, east to the right.
  // Calibrated: Apollo 11 lands on the SW edge of Mare Tranquillitatis with lonOffsetDeg 0 (open /?calibrate).
  texture: "/moon/moon-color-2k.jpg",
  // LOLA laser-altimeter elevation from the same CGI Moon Kit (ldem_16_uint.tif, 16 px/deg), turned into
  // a normal map with `npm run normal-map -- ldem_16_uint.tif public/moon/moon-normal.jpg --format svs-lola`.
  relief: {
    normalMap: "/moon/moon-normal.jpg",
    strength: 1,
    credit: "NASA's Scientific Visualization Studio, CGI Moon Kit (LRO LOLA elevation map)",
    sourceUrl: "https://svs.gsfc.nasa.gov/4720",
  },
  textureCredit: "NASA's Scientific Visualization Studio, CGI Moon Kit (LRO LROC color map)",
  textureSourceUrl: "https://svs.gsfc.nasa.gov/4720",
  baseColor: "#8a8a8a",
  accent: "#c9d1d9",
  lonOffsetDeg: 0,
};
