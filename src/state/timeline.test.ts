import { beforeEach, describe, expect, it } from "vitest";
import { relics } from "../data";
import { useTimeline } from "./timeline";

beforeEach(() => useTimeline.setState({
  world: null, mode: "globe", progress: 0, activeIndex: 0, target: null, jumpTo: null,
}));

describe("renderer-independent navigation", () => {
  it("settles reading-mode navigation and progress without an engine frame", () => {
    useTimeline.getState().setMode("reading");
    useTimeline.getState().jumpToRelic("ingenuity");
    const s = useTimeline.getState();
    const index = relics.mars.findIndex((r) => r.id === "ingenuity");
    expect(s).toMatchObject({ world: "mars", mode: "reading", activeIndex: index, target: null, jumpTo: null });
    expect(s.progress).toBe(index / (relics.mars.length - 1));
  });

  it("keeps the chosen destination when switching modes during a glide", () => {
    useTimeline.getState().jumpToRelic("opportunity");
    const index = relics.mars.findIndex((r) => r.id === "opportunity");
    useTimeline.getState().setMode("reading");
    expect(useTimeline.getState()).toMatchObject({ activeIndex: index, target: null, jumpTo: null });
    useTimeline.getState().setMode("globe");
    expect(useTimeline.getState()).toMatchObject({ activeIndex: index, target: index, jumpTo: "opportunity" });
  });

  it("changes world and destination atomically without leaking an old pending jump", () => {
    useTimeline.getState().jumpToRelic("opportunity");
    const states: Array<{world: string | null; jumpTo: string | null}> = [];
    const off = useTimeline.subscribe((s) => states.push({ world: s.world, jumpTo: s.jumpTo }));
    useTimeline.getState().jumpToRelic("apollo-11-eagle");
    off();
    expect(states).toEqual([{ world: "moon", jumpTo: "apollo-11-eagle" }]);
    expect(useTimeline.getState().activeIndex).toBe(0);
  });

  it("returns home without retaining a destination, and ignores unknown relics", () => {
    useTimeline.getState().jumpToRelic("spirit");
    useTimeline.getState().setWorld(null);
    const before = useTimeline.getState();
    useTimeline.getState().jumpToRelic("not-a-mission");
    expect(useTimeline.getState()).toBe(before);
    expect(before).toMatchObject({ world: null, jumpTo: null, target: null, activeIndex: 0, progress: 0 });
  });
});
