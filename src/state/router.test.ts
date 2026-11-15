// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { relics } from "../data";
import { goHome, startRouter } from "./router";
import { useTimeline } from "./timeline";

let stop: (() => void) | undefined;
beforeEach(() => {
  window.history.replaceState(null, "", "/demo/?calibrate");
  useTimeline.setState({ world: null, mode: "globe", progress: 0, activeIndex: 0, target: null, jumpTo: null });
});
afterEach(() => { stop?.(); stop = undefined; });

const navigate = (path: string, event: "hashchange" | "popstate" = "hashchange") => {
  window.history.replaceState(null, "", path);
  window.dispatchEvent(new Event(event));
};

describe("shareable timeline routes", () => {
  it("opens a reading deep link immediately, with no WebGL lifecycle", () => {
    navigate("/demo/?calibrate&view=reading#mars/ingenuity");
    stop = startRouter();
    expect(useTimeline.getState()).toMatchObject({
      world: "mars", mode: "reading", target: null, jumpTo: null,
      activeIndex: relics.mars.findIndex((r) => r.id === "ingenuity"),
    });
  });

  it("handles hand-edited hashes, a bare same-world hash, and mismatched relic ids", () => {
    stop = startRouter();
    navigate("/demo/?view=reading#moon/apollo-17-challenger");
    expect(useTimeline.getState().activeIndex).toBeGreaterThan(0);
    navigate("/demo/?view=reading#moon");
    expect(useTimeline.getState()).toMatchObject({ world: "moon", activeIndex: 0 });
    navigate("/demo/?view=reading#moon/spirit");
    expect(useTimeline.getState()).toMatchObject({ world: "moon", activeIndex: 0 });
    navigate("/demo/?view=reading#pluto");
    expect(useTimeline.getState().world).toBeNull();
  });

  it("shares settled reading selections and preserves unrelated search parameters", () => {
    stop = startRouter();
    useTimeline.getState().setMode("reading");
    useTimeline.getState().jumpToRelic("spirit");
    expect(window.location.hash).toBe("#mars/spirit");
    expect(new URLSearchParams(window.location.search).has("calibrate")).toBe(true);
    expect(new URLSearchParams(window.location.search).get("view")).toBe("reading");
    useTimeline.getState().setMode("globe");
    expect(new URLSearchParams(window.location.search).has("view")).toBe(false);
    expect(window.location.hash).toBe("#mars/spirit");
  });

  it("does not add history entries for URL-originated world changes", () => {
    stop = startRouter();
    const push = vi.spyOn(window.history, "pushState");
    navigate("/demo/?view=reading#mars/spirit", "popstate");
    expect(push).not.toHaveBeenCalled();
    push.mockRestore();
  });

  it("supports Back to the title and Forward to the selected world", async () => {
    stop = startRouter();
    useTimeline.getState().setMode("reading");
    useTimeline.getState().jumpToRelic("spirit");
    goHome();
    await vi.waitFor(() => expect(useTimeline.getState().world).toBeNull());
    window.history.forward();
    await vi.waitFor(() => expect(useTimeline.getState().world).toBe("mars"));
    expect(useTimeline.getState().activeIndex).toBe(relics.mars.findIndex((r) => r.id === "spirit"));
  });

  it("unsubscribes and can restart without duplicate URL writers", () => {
    stop = startRouter();
    expect(startRouter()).toBe(stop);
    stop();
    const push = vi.spyOn(window.history, "pushState");
    useTimeline.getState().setWorld("moon");
    expect(push).not.toHaveBeenCalled();
    push.mockRestore();
    stop = startRouter();
    expect(useTimeline.getState().world).toBeNull();
  });
});
