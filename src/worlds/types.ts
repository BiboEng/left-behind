import type { World } from "../types/relic";

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
  /** optional NASA displacement/bump map */
  bumpMap?: string | null;
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
