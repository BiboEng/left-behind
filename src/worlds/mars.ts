// OWNER: Rayan
import type { WorldConfig } from "./types";

export const mars: WorldConfig = {
  id: "mars",
  name: "Mars",
  tagline: "Silent machines. A record of the search for another world.",
  intro: "No person has stood beside these machines. Trace NASA landers, rovers, discarded landing gear, and a helicopter through the evidence they sent home, and the silence that followed.",
  outro: "A mission can end while its discoveries keep working. These machines changed what we know about Martian water, weather, and the planet's interior. Some have been seen again from orbit; others remain lost inside their intended landing regions.",
  // Viking MDIM 2.1 colorized global mosaic (4096 × 2048), fetched from the USGS Planetary Maps server
  // (layer MDIM21_color). Simple cylindrical, -180°E to 180°E: centered on 0° longitude, east to the right.
  // Calibrated: Olympus Mons lands under the red dot with lonOffsetDeg 0 (open /?calibrate).
  texture: "/mars/mars-color.jpg",
  // MOLA laser-altimeter elevation (MEGDR megt90n000eb.img, 16 px/deg) from NASA's PDS Geosciences Node,
  // turned into a normal map with `npm run normal-map -- megt90n000eb.img public/mars/mars-normal.jpg --format pds-mola`.
  // Mars is bigger and its relief broader than the Moon's, so it gets a stronger setting.
  relief: {
    normalMap: "/mars/mars-normal.jpg",
    strength: 1.6,
    credit: "NASA/GSFC/JPL, Mars Global Surveyor MOLA elevation model (MEGDR)",
    sourceUrl: "https://pds-geosciences.wustl.edu/missions/mgs/megdr.html",
  },
  textureCredit: "NASA/JPL/USGS, Viking Orbiter MDIM 2.1 global color mosaic (colorized by NASA Ames)",
  textureSourceUrl: "https://astrogeology.usgs.gov/search/map/mars_viking_global_color_mosaic_925m",
  baseColor: "#b5562e",
  accent: "#e07a4f",
  lonOffsetDeg: 0,
};
