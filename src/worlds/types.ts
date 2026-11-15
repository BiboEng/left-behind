import type { World } from "../types/relic";

export interface Relief {
  /** normal map in public/<world>/, e.g. "/moon/moon-normal.jpg" */
  normalMap: string;
  /** how strongly the relief shows (three.js normalScale). 1 = as generated */
  strength: number;
  /** elevation dataset credit (shown on the credits screen) */
  credit: string;
  sourceUrl: string;
}

/** Everything the shared engine needs to know to draw one world. */
export interface WorldConfig {
  id: World;
  name: string;
  /** one line under the title on the landing screen */
  tagline: string;
  /** shown before the first relic (documentary tone, 1–2 sentences) */
  intro: string;
  /** shown after the last relic ("this is today") */
  outro: string;
  /** NASA global color map in public/<world>/, e.g. "/moon/moon-color-2k.jpg". null = plain color */
  texture: string | null;
  /**
   * Terrain relief: a NASA elevation grid turned into a normal map (`npm run normal-map`, see
   * scripts/make-normal-map.mjs), so craters, volcanoes and canyons catch the sunlight.
   * null = smooth sphere.
   */
  relief?: Relief | null;
  /** where the texture came from (shown on the credits screen) */
  textureCredit: string;
  textureSourceUrl: string;
  /** fallback color when there is no texture */
  baseColor: string;
  /** UI accent color for this world */
  accent: string;
  /** degrees to add to every longitude if the texture isn't centered on 0° (see docs/ENGINE.md) */
  lonOffsetDeg: number;
}
