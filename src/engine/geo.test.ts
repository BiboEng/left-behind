import { describe, expect, test } from "vitest";
import { Vector3 } from "three";
import { faceSiteQuaternion, latLonToVector3 } from "./geo";

const sites = [
  [0, 0],
  [0.674, 23.473], // Apollo 11
  [38.3, -35],
  [-45, 120],
  [70, 179],
  [-89, -100],
] as const;

describe("geo", () => {
  test("points lie on the sphere", () => {
    for (const [lat, lon] of sites) expect(latLonToVector3(lat, lon, 2).length()).toBeCloseTo(2, 6);
  });

  test("facing rotation brings the site to +Z (towards the camera)", () => {
    for (const [lat, lon] of sites) {
      const p = latLonToVector3(lat, lon).applyQuaternion(faceSiteQuaternion(lat, lon));
      expect(p.distanceTo(new Vector3(0, 0, 1))).toBeLessThan(1e-6);
    }
  });

  test("north stays up after facing a site", () => {
    for (const [lat, lon] of sites) {
      if (Math.abs(lat) > 80) continue;
      const north = new Vector3(0, 1, 0).applyQuaternion(faceSiteQuaternion(lat, lon));
      expect(north.x).toBeCloseTo(0, 6);
      expect(north.y).toBeGreaterThan(0);
    }
  });
});
