// Calibration check from docs/ENGINE.md. Open the app with `?calibrate` at the end of the URL
// (http://localhost:5173/?calibrate): the globe turns to a well-known landmark and puts a RED dot
// on it. If the dot isn't on the landmark, the texture needs `lonOffsetDeg` in src/worlds/<world>.ts.
// This is a developer tool only: without `?calibrate` nothing here is visible.
import type { World } from "../types/relic";

export interface CalibrationPoint {
  label: string;
  /** what the human should see under the red dot */
  expect: string;
  lat: number;
  lon: number;
}

export const CALIBRATION: Record<World, CalibrationPoint> = {
  moon: {
    label: "Apollo 11",
    expect: "the southwest edge of Mare Tranquillitatis, the large dark smooth patch right of center on the near side",
    lat: 0.674,
    lon: 23.473,
  },
  mars: {
    label: "Olympus Mons",
    expect: "the giant shield volcano, a round feature with a summit crater, northwest of the Tharsis volcanoes",
    lat: 18.65,
    lon: -133.8,
  },
};

export const calibrating =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("calibrate");
