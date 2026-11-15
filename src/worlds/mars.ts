// OWNER: Rayan
import type { WorldConfig } from "./types";

export const mars: WorldConfig = {
  id: "mars",
  name: "Mars",
  tagline: "TODO (Rayan): one line about what humanity left on Mars",
  intro: "TODO (Rayan): documentary intro, 1–2 sentences",
  outro: "TODO (Rayan): 'this is today', e.g. who is still working there right now",
  // Viking MDIM 2.1 colorized global mosaic (4096 × 2048), fetched from the USGS Planetary Maps server
  // (layer MDIM21_color). Simple cylindrical, -180°E to 180°E: centered on 0° longitude, east to the right.
  // Calibrated: Olympus Mons lands under the red dot with lonOffsetDeg 0 (open /?calibrate).
  texture: "/mars/mars-color.jpg",
  bumpMap: null,
  textureCredit: "NASA/JPL/USGS, Viking Orbiter MDIM 2.1 global color mosaic (colorized by NASA Ames)",
  textureSourceUrl: "https://astrogeology.usgs.gov/search/map/mars_viking_global_color_mosaic_925m",
  baseColor: "#b5562e",
  accent: "#e07a4f",
  lonOffsetDeg: 0,
};
