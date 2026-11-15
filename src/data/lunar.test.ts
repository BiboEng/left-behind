import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { catalogFromCsv } from "../../scripts/build-lunar-catalog.mjs";
import catalog from "./lunar-catalog.json";
import { DEFAULT_LUNAR_VIEW, parseLunarView, writeLunarView } from "./lunar-view";
import { filterLunarEvents, fromModuleSector, lunarEvents, lunarHistogram, lunarReceipt, relativeArrivals } from "./lunar";

describe("Apollo 17 published data", () => {
  it("reproduces all 3,250 events from the checksum-pinned, unchanged 13,000-row CSV", () => {
    const bytes = readFileSync("public/evidence/apollo17-catalog.csv");
    expect(catalogFromCsv(bytes)).toEqual(catalog);
    expect(catalog.rows).toBe(13000);
    expect(lunarEvents).toHaveLength(3250);
    expect(new Set(lunarEvents.map((event) => event.id)).size).toBe(3250);
    expect(() => catalogFromCsv(bytes.subarray(0, -1))).toThrow("checksum");
  });
  it("counts events once and applies published-sector and variance boundaries exactly", () => {
    expect(filterLunarEvents(DEFAULT_LUNAR_VIEW)).toHaveLength(3062);
    expect(filterLunarEvents({ ...DEFAULT_LUNAR_VIEW, direction: "module" })).toHaveLength(1072);
    expect(filterLunarEvents({ ...DEFAULT_LUNAR_VIEW, tight: false, direction: "module" })).toHaveLength(1085);
    expect(filterLunarEvents({ ...DEFAULT_LUNAR_VIEW, tight: false, month: "1976-08" })).toHaveLength(201);
    expect([80, 80.1, 119.9, 120].map(fromModuleSector)).toEqual([false, true, true, false]);
    const bins = lunarHistogram(filterLunarEvents(DEFAULT_LUNAR_VIEW));
    expect(bins).toEqual([77, 55, 127, 139, 702, 372, 171, 132, 146, 97, 125, 148, 126, 136, 213, 100, 89, 107]);
    expect(bins.reduce((a, b) => a + b)).toBe(3062);
  });
  it("keeps sub-millisecond arrival differences and handles a midnight crossing", () => {
    expect(relativeArrivals(lunarEvents[0])).toEqual([2.4395, 2.38, 1.785, 0]);
    expect(relativeArrivals({ ...lunarEvents[0], arrivals: ["1976-08-15T23:59:59.999999", "1976-08-16T00:00:00.000001"] })).toEqual([0, 0.000002]);
  });
  it("exports a reproducible selection with counts, original picks, provenance and limits", () => {
    const text = lunarReceipt(DEFAULT_LUNAR_VIEW, lunarEvents[0], "https://example.test/#signal/apollo");
    expect(text).toContain("3062 of 3250");
    expect(text).toContain("760815-10-M1");
    expect(text).toContain("+2.439500 s");
    expect(text).toContain(catalog.sha256);
    expect(text).toContain("not a confidence percentage");
    expect(text).toContain("does not prove the source");
  });
  it("validates shared selections while preserving unrelated URL parameters", () => {
    const params = new URLSearchParams("campaign=school&moonMonth=bogus&moonDirection=invalid&moonEvent=<script>");
    expect(parseLunarView(params)).toEqual(DEFAULT_LUNAR_VIEW);
    const view = { month: "1976-08", direction: "module", tight: false, eventId: "760815-10-M1" } as const;
    writeLunarView(params, view);
    expect(params.get("campaign")).toBe("school");
    expect(parseLunarView(params)).toEqual(view);
    writeLunarView(params, DEFAULT_LUNAR_VIEW);
    expect(params.toString()).toBe("campaign=school");
  });
});
