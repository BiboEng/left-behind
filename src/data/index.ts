// Loads every relic. One JSON file per relic:
//   src/data/moon/<id>.json  (Ibrahim)
//   src/data/mars/<id>.json  (Rayan)
// Sorted oldest -> newest, so scrolling down moves toward today.
import type { Relic, World } from "../types/relic";

const moonFiles = import.meta.glob<Relic>("./moon/*.json", { eager: true, import: "default" });
const marsFiles = import.meta.glob<Relic>("./mars/*.json", { eager: true, import: "default" });

const byDate = (a: Relic, b: Relic) => a.arrived.localeCompare(b.arrived) || a.id.localeCompare(b.id);

export const relics: Record<World, Relic[]> = {
  moon: Object.values(moonFiles).sort(byDate),
  mars: Object.values(marsFiles).sort(byDate),
};

export const allRelics: Relic[] = [...relics.moon, ...relics.mars];

export const relicById = new Map(allRelics.map((r) => [r.id, r]));

/** raw file paths, used by the tests to check that file names match ids */
export const relicFiles: Record<string, Relic> = { ...moonFiles, ...marsFiles };
