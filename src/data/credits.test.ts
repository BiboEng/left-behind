import { describe, expect, test } from "vitest";
import { worlds } from "../worlds";
import { buildCredits, datasetFor } from "./credits";
import { allRelics } from "./index";

describe("credits screen", () => {
  const credits = buildCredits();

  test("every photo is credited", () => {
    const listed = credits.photos.flatMap((g) => g.relics.flatMap((r) => r.images));
    expect(listed.length).toBe(allRelics.reduce((n, r) => n + r.images.length, 0));
    expect(credits.photoCount).toBe(listed.length);
  });

  test("every hero model is credited", () => {
    expect(credits.models.length).toBe(allRelics.filter((r) => r.model).length);
  });

  test("every globe texture has a real credit and source link", () => {
    for (const config of Object.values(worlds)) {
      if (!config.texture) continue;
      expect(config.textureCredit, config.id).not.toMatch(/TODO/);
      expect(() => new URL(config.textureSourceUrl), config.id).not.toThrow();
    }
  });

  test("archives are recognized by their web address", () => {
    expect(datasetFor("https://images.nasa.gov/details/PIA12205")?.name).toBe("NASA Image and Video Library");
    expect(datasetFor("https://science.nasa.gov/3d-resources/viking-lander/")?.name).toBe("NASA 3D Resources");
    expect(datasetFor("https://science.nasa.gov/mission/mer-spirit/")?.name).toMatch(/NASA Science/);
    expect(datasetFor("https://www.esa.int/anything")).toBeUndefined();
    expect(datasetFor("not a url")).toBeUndefined();
  });
});
