import { expect, test } from "vitest";
import { explorerQuestions } from "./explorer";
import { relics } from "./index";

test("learning questions use an existing relic and one of its cited NASA sources", () => {
  const all = [...relics.moon, ...relics.mars];
  const covered = new Set<string>();
  for (const [id, q] of Object.entries(explorerQuestions)) {
    expect(q).toBeDefined();
    if (!q) continue;
    const relic = all.find((r) => r.id === id);
    expect(relic, id).toBeDefined();
    expect(relic?.sources.map((s) => s.url), id).toContain(q.sourceUrl);
    const host = new URL(q.sourceUrl).hostname;
    expect(host === "nasa.gov" || host.endsWith(".nasa.gov")).toBe(true);
    expect(q.options).toHaveLength(3);
    expect(new Set(q.options).size).toBe(3);
    expect(q.answer).toBeGreaterThanOrEqual(0);
    expect(q.answer).toBeLessThan(q.options.length);
    expect(q.explanation.trim()).toBeTruthy();
    if (relic) covered.add(relic.world);
  }
  expect([...covered].sort()).toEqual(["mars", "moon"]);
});
