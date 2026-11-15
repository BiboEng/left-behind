import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { waveformFromWav } from "../../scripts/build-signal-waveform.mjs";
import { allRelics } from "./index";
import { exhibitionText } from "./exhibition";
import waveform from "./insight-waveform.json";
import { CASE_IDS, evidenceCases, signalAudio, signalMedia, signalSources } from "./signal";

const nasaUrl = (value: string) => {
  const url = new URL(value);
  expect(url.protocol).toBe("https:");
  expect(url.hostname === "nasa.gov" || url.hostname.endsWith(".nasa.gov")).toBe(true);
};

describe("evidence provenance", () => {
  it("ties every investigation to real hardware, both worlds, credited media and primary NASA sources", () => {
    expect(evidenceCases.map((item) => item.id)).toEqual(CASE_IDS);
    expect([...new Set(evidenceCases.map((item) => item.world))].sort()).toEqual(["mars", "moon"]);
    for (const item of evidenceCases) {
      expect(allRelics.find((r) => r.id === item.relicId)?.world).toBe(item.world);
      expect(signalMedia[item.media]).toBeDefined();
      expect(item.sources).toContain(signalMedia[item.media].source);
      for (const key of item.sources) {
        expect(signalSources[key].title.trim()).toBeTruthy();
        nasaUrl(signalSources[key].url);
      }
      for (const text of [item.observation, item.interpretation, item.limit, item.legacy]) expect(text.trim()).toBeTruthy();
    }
  });

  it("bundles the complete small evidence set instead of hotlinking the essential records", () => {
    let size = 0;
    for (const media of [...Object.values(signalMedia), signalAudio]) {
      expect(media.path).toMatch(/^\/evidence\/[a-z0-9-]+\.(webp|wav)$/);
      nasaUrl(media.original);
      expect(media.credit.trim()).toBeTruthy();
      expect(media.processing.trim()).toBeTruthy();
      size += statSync(resolve("public", media.path.slice(1))).size;
    }
    expect(size).toBeLessThan(750_000);
  });

  it("reproduces every plotted peak and exact duration from NASA's unmodified audio", () => {
    const bytes = readFileSync("public/evidence/insight-sol128.wav");
    expect(waveformFromWav(bytes)).toEqual(waveform);
    expect(waveform.sha256).toBe("4ce9b036927aeca94802a19a8e475d8f1a630fcb6170784a09408c555f926323");
    expect(waveform.sampleRate).toBe(1200);
    expect(waveform.frames).toBe(48002);
    expect(waveform.duration).toBeCloseTo(40.0016666667);
    expect(waveform.channels).toHaveLength(2);
    expect(Math.max(...waveform.channels.flat())).toBe(1);
    for (const channel of waveform.channels) {
      expect(channel).toHaveLength(256);
      expect(channel.every((value) => value >= 0 && value <= 1)).toBe(true);
    }
  });

  it("rejects a truncated or non-PCM source instead of silently fabricating a waveform", () => {
    const bytes = readFileSync("public/evidence/insight-sol128.wav");
    expect(() => waveformFromWav(bytes.subarray(0, bytes.length - 10))).toThrow();
    const badFormat = Buffer.from(bytes);
    badFormat.writeUInt16LE(3, 20);
    expect(() => waveformFromWav(badFormat)).toThrow();
  });
});

describe("portable exhibition", () => {
  it("keeps evidence, uncertainty, original credits and primary sources in the export", () => {
    const text = exhibitionText({ cards: ["insight", "ranger", "insight"], title: "Beyond the last signal", caption: "What survives?" });
    expect(text.startsWith("Beyond the last signal")).toBe(true);
    expect(text).toContain("READER'S CAPTION (not a NASA statement)");
    expect(text).toContain("What survives?");
    expect(text.indexOf(evidenceCases[2].exhibitLabel)).toBeLessThan(text.indexOf(evidenceCases[0].exhibitLabel));
    expect(text.split(evidenceCases[2].exhibitLabel)).toHaveLength(2);
    for (const item of [evidenceCases[2], evidenceCases[0]]) {
      expect(text).toContain(item.observation);
      expect(text).toContain(item.interpretation);
      expect(text).toContain(item.limit);
      for (const key of item.sources) expect(text).toContain(signalSources[key].url);
    }
    expect(text).toContain(signalAudio.credit);
    expect(text).toContain("60×");
    expect(text).toContain("Human source verification is still pending");
    expect(text).not.toContain(evidenceCases[1].exhibitLabel);
  });
});
