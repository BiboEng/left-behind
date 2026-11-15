// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { relics } from "../data";
import { openAtlas, openSignal, signalUrl, startRouter } from "./router";
import { cleanText, DEFAULT_EXHIBIT_TITLE, parseCards, parseSignalChapter, useSignal } from "./signal";
import { useTimeline } from "./timeline";

let stop: (() => void) | undefined;
beforeEach(() => {
  window.history.replaceState(null, "", "/demo/?calibrate&campaign=school");
  useTimeline.setState({ world: null, mode: "reading", progress: 0, activeIndex: 0, target: null, jumpTo: null });
  useSignal.setState({ chapter: null, cards: [], title: DEFAULT_EXHIBIT_TITLE, caption: "" });
});
afterEach(() => { stop?.(); stop = undefined; vi.restoreAllMocks(); });

const navigate = (path: string) => {
  window.history.replaceState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

describe("documentary and atlas route boundary", () => {
  it("opens and reloads a portable exhibition without an account, storage or a renderer", () => {
    navigate("/demo/?campaign=school&collection=insight,ranger,insight,unknown&exhibitTitle=Our+evidence&exhibitNote=A+question#signal/exhibit");
    stop = startRouter();
    expect(useTimeline.getState().world).toBeNull();
    expect(useSignal.getState()).toMatchObject({
      chapter: "exhibit", cards: ["insight", "ranger"], title: "Our evidence", caption: "A question",
    });
    const shared = signalUrl();
    stop();
    useSignal.setState({ chapter: null, cards: [], title: "", caption: "" });
    navigate(shared.pathname + shared.search + shared.hash);
    stop = startRouter();
    expect(useSignal.getState()).toMatchObject({ chapter: "exhibit", cards: ["insight", "ranger"], title: "Our evidence" });
  });

  it("keeps edits in one URL entry, preserves unrelated parameters and pushes chapter changes", () => {
    stop = startRouter();
    openSignal("ranger");
    const length = window.history.length;
    useSignal.getState().toggleCard("ranger");
    useSignal.getState().setTitle("A story & a question?");
    useSignal.getState().setCaption("What evidence would change your mind?");
    expect(window.history.length).toBe(length);
    openSignal("spirit");
    expect(window.history.length).toBe(length + 1);
    expect(window.location.hash).toBe("#signal/spirit");
    const params = new URLSearchParams(window.location.search);
    expect(params.has("calibrate")).toBe(true);
    expect(params.get("campaign")).toBe("school");
    expect(params.get("exhibitTitle")).toBe("A story & a question?");
    expect(params.get("collection")).toBe("ranger");
    expect(useSignal.getState().cards).toEqual(["ranger"]);
    openSignal("spirit");
    expect(window.history.length).toBe(length + 1);
  });

  it("moves from a case to the correct atlas relic, then restores the case with Back", async () => {
    stop = startRouter();
    useTimeline.getState().setMode("reading");
    openSignal("spirit");
    useTimeline.getState().jumpToRelic("spirit");
    expect(useSignal.getState().chapter).toBeNull();
    expect(useTimeline.getState()).toMatchObject({
      world: "mars", mode: "reading", target: null, activeIndex: relics.mars.findIndex((r) => r.id === "spirit"),
    });
    expect(window.location.hash).toBe("#mars/spirit");
    window.history.back();
    await vi.waitFor(() => expect(useSignal.getState().chapter).toBe("spirit"));
    expect(useTimeline.getState().world).toBeNull();
    window.history.forward();
    await vi.waitFor(() => expect(useTimeline.getState().world).toBe("mars"));
    expect(useSignal.getState().chapter).toBeNull();
  });

  it("restores the URL's curation on Back/Forward without creating new history entries", async () => {
    stop = startRouter();
    openSignal("ranger");
    useSignal.getState().toggleCard("ranger");
    openSignal("spirit");
    useSignal.getState().toggleCard("spirit");
    openSignal("exhibit");
    const push = vi.spyOn(window.history, "pushState");
    window.history.back();
    await vi.waitFor(() => expect(useSignal.getState().chapter).toBe("spirit"));
    expect(useSignal.getState().cards).toEqual(["ranger", "spirit"]);
    window.history.forward();
    await vi.waitFor(() => expect(useSignal.getState().chapter).toBe("exhibit"));
    expect(useSignal.getState().cards).toEqual(["ranger", "spirit"]);
    expect(push).not.toHaveBeenCalled();
  });

  it("leaves exhibition parameters behind while keeping the reading preference and campaign", () => {
    stop = startRouter();
    useTimeline.getState().setMode("reading");
    openSignal("insight");
    useSignal.getState().toggleCard("insight");
    openAtlas();
    expect(useSignal.getState().chapter).toBeNull();
    expect(useTimeline.getState()).toMatchObject({ world: null, mode: "reading" });
    const params = new URLSearchParams(window.location.search);
    expect(params.has("collection")).toBe(false);
    expect(params.get("campaign")).toBe("school");
    expect(params.get("view")).toBe("reading");
  });

  it("falls back safely for unknown chapters, filters invalid cards and caps URL-provided text", () => {
    stop = startRouter();
    navigate("/demo/?collection=spirit,spirit,../../evil,ranger&exhibitTitle=" + "a".repeat(200) + "&exhibitNote=" + "b".repeat(400) + "#signal/unknown");
    expect(useSignal.getState()).toMatchObject({ chapter: "intro", cards: ["spirit", "ranger"] });
    expect(useSignal.getState().title).toHaveLength(80);
    expect(useSignal.getState().caption).toHaveLength(280);
    expect(parseSignalChapter("#mars/spirit")).toBeNull();
    expect(parseCards("unknown,ranger,ranger")).toEqual(["ranger"]);
    expect(cleanText("\u0000 hi\nthere\u007f", 80)).toBe("hi there");
  });

  it("removes both subscriptions on cleanup and starts without duplicate writers", () => {
    stop = startRouter();
    openSignal("exhibit");
    stop();
    const replace = vi.spyOn(window.history, "replaceState");
    useSignal.getState().toggleCard("spirit");
    expect(replace).not.toHaveBeenCalled();
    stop = startRouter();
    expect(startRouter()).toBe(stop);
    replace.mockClear();
    useSignal.getState().toggleCard("ranger");
    expect(replace).toHaveBeenCalledTimes(1);
  });
});
