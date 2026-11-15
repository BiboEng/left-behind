// Enforces docs/DATA_CONTRACT.md.
//   npm test          → structure rules (always)
//   npm run test:final → also fails on placeholders, unverified relics, missing photos (use in Phase 4)
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { Relic } from "../types/relic";
import { relicFiles, relics } from "./index";

const STATUSES = ["crashed", "impacted", "lost", "retired", "abandoned"];
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const validDate = (s: string) => isoDate.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"));
const isHttps = (s: string) => /^https:\/\/\S+$/.test(s);

const entries = Object.entries(relicFiles) as [string, Relic][];

describe("relic data", () => {
  test("there is at least one relic per world", () => {
    expect(relics.moon.length).toBeGreaterThan(0);
    expect(relics.mars.length).toBeGreaterThan(0);
  });

  test.each(entries)("%s follows the contract", (path, r) => {
    const folder = path.split("/").at(-2);
    const file = path.split("/").at(-1)?.replace(/\.json$/, "");

    expect(r.id, "id must be kebab-case").toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(r.id, "id must equal the file name").toBe(file);
    expect(r.world, "world must match the folder").toBe(folder);
    expect(["hero", "standard"]).toContain(r.tier);
    for (const k of ["name", "mission", "agency"] as const) expect(r[k], k).toBeTruthy();

    expect(validDate(r.arrived), `arrived "${r.arrived}" must be YYYY-MM-DD`).toBe(true);
    if (r.lastContact !== undefined) {
      expect(validDate(r.lastContact), "lastContact must be YYYY-MM-DD").toBe(true);
      expect(r.lastContact >= r.arrived, "lastContact must not be before arrived").toBe(true);
    }
    expect(STATUSES).toContain(r.status);

    expect(r.location.name).toBeTruthy();
    expect(r.location.lat).toBeGreaterThanOrEqual(-90);
    expect(r.location.lat).toBeLessThanOrEqual(90);
    expect(r.location.lon, "lon must be east-positive, -180..180").toBeGreaterThanOrEqual(-180);
    expect(r.location.lon).toBeLessThanOrEqual(180);
    if (r.location.precision) {
      expect(["reported", "approximate", "target"]).toContain(r.location.precision);
      if (r.location.precision !== "reported") expect(r.location.note?.trim()).toBeTruthy();
    }

    expect(r.headline.length, "headline max 90 chars").toBeLessThanOrEqual(90);
    expect(r.story.length, "story must have 2–3 paragraphs").toBeGreaterThanOrEqual(2);
    expect(r.story.length).toBeLessThanOrEqual(3);
    expect(r.facts.length, "2–5 facts").toBeGreaterThanOrEqual(1);
    expect(r.facts.length).toBeLessThanOrEqual(5);

    expect(Array.isArray(r.images)).toBe(true);
    expect(r.images.length, "max 3 images").toBeLessThanOrEqual(3);
    for (const img of r.images) {
      expect(isHttps(img.url), "image url must be https").toBe(true);
      expect(isHttps(img.sourceUrl), "image sourceUrl must be https").toBe(true);
      expect(img.credit, "image credit").toBeTruthy();
      expect(img.caption, "image caption").toBeTruthy();
    }

    if (r.model) {
      expect(r.model.path, "model path must be /<world>/models/<file>.glb").toMatch(
        new RegExp(`^/${r.world}/models/[\\w.-]+\\.glb$`),
      );
      expect(existsSync(join(process.cwd(), "public", r.model.path)), `missing file public${r.model.path}`).toBe(true);
      expect(r.tier).toBe("hero");
      expect(r.model.credit).toBeTruthy();
      expect(isHttps(r.model.sourceUrl)).toBe(true);
      const modelPath = join(process.cwd(), "public", r.model.path);
      expect(statSync(modelPath).size, "model budget: <10 MB").toBeLessThan(10_000_000);
      const bytes = readFileSync(modelPath);
      expect(bytes.subarray(0, 4).toString()).toBe("glTF");
      expect(bytes.readUInt32LE(4)).toBe(2);
      expect(bytes.readUInt32LE(8)).toBe(bytes.length);
      const document = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
      for (const resource of [...(document.buffers ?? []), ...(document.images ?? [])]) {
        expect(!resource.uri || resource.uri.startsWith("data:"), "model must embed its dependencies").toBe(true);
      }
    }

    expect(r.sources.length, "at least one source").toBeGreaterThan(0);
    for (const s of r.sources) expect(isHttps(s.url), `source url ${s.url}`).toBe(true);
    expect(typeof r.verified).toBe("boolean");
  });
});

describe.skipIf(import.meta.env.MODE !== "final")("final checks (npm run test:final)", () => {
  test("no placeholder relics left", () => {
    expect(entries.filter(([, r]) => r.id.startsWith("placeholder-")).map(([, r]) => r.id)).toEqual([]);
  });
  test("every relic is verified by a human", () => {
    expect(entries.filter(([, r]) => !r.verified).map(([, r]) => r.id)).toEqual([]);
  });
  test("every relic has at least one real photo", () => {
    expect(entries.filter(([, r]) => r.images.length === 0).map(([, r]) => r.id)).toEqual([]);
  });
  test("every hero has a 3D model", () => {
    expect(entries.filter(([, r]) => r.tier === "hero" && !r.model).map(([, r]) => r.id)).toEqual([]);
  });
});
