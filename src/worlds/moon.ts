// OWNER: Ibrahim
import type { WorldConfig } from "./types";

export const moon: WorldConfig = {
  id: "moon",
  name: "The Moon",
  tagline: "Footprints, fallen spacecraft, and the cars we never drove home.",
  intro: "Robots reached the surface before people did. Follow a selection of NASA machines from Ranger 7's final photographs to the rocket stage that helped reveal water in a dark polar crater.",
  outro: "Leaving the Moon did not mean taking everything home. Descent stages, rovers, experiments, and impact craters preserve the history of these journeys; NASA's Lunar Reconnaissance Orbiter has photographed many of the sites from above.",
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
