// SHARED contract. Change only after telling your teammate. See docs/DATA_CONTRACT.md.

export type World = "moon" | "mars";

/**
 * crashed   – destroyed on arrival by accident
 * impacted  – crashed into the surface on purpose (end of mission / experiment)
 * lost      – contact lost unexpectedly
 * retired   – mission ended as planned or wore out
 * abandoned – left behind on purpose (descent stages, crewed rovers)
 */
export type RelicStatus = "crashed" | "impacted" | "lost" | "retired" | "abandoned";

/** hero = gets a NASA 3D model in its card (~4 per world) */
export type RelicTier = "hero" | "standard";

export interface Source {
  title: string;
  url: string;
}

/** A real NASA (or partner agency) photo shown in the relic's card */
export interface RelicImage {
  /** direct image URL, e.g. https://images-assets.nasa.gov/image/<nasa_id>/<nasa_id>~medium.jpg */
  url: string;
  /** short caption, documentary tone */
  caption: string;
  /** credit line, e.g. "NASA/GSFC/Arizona State University" */
  credit: string;
  /** page the image came from (NASA Image Library, LROC, HiRISE...) */
  sourceUrl: string;
}

export interface Relic {
  /** kebab-case, unique, same as the file name */
  id: string;
  world: World;
  tier: RelicTier;
  name: string;
  mission: string;
  agency: string;
  /** ISO date (YYYY-MM-DD, UTC) it reached the surface */
  arrived: string;
  /** ISO date it went silent or the mission ended */
  lastContact?: string;
  status: RelicStatus;
  /** degrees; latitude north-positive, longitude EAST-positive (-180..180) */
  location: {
    name: string; lat: number; lon: number;
    /** Omitted = reported site. Target regions must never be presented as found hardware. */
    precision?: "reported" | "approximate" | "target";
    /** Explain which feature/region the marker represents; required for non-reported sites. */
    note?: string;
  };
  /** one line, max 90 characters */
  headline: string;
  /** 2–3 short paragraphs, documentary narrator voice (third person) */
  story: string[];
  /** 2–5 quick facts */
  facts: { label: string; value: string }[];
  /** 1–3 real photos */
  images: RelicImage[];
  /** hero relics only: NASA 3D model in public/<world>/models/ */
  model?: { path: string; credit: string; sourceUrl: string; description?: string };
  sources: Source[];
  /** true only after a human opened the sources and checked the facts */
  verified: boolean;
}
