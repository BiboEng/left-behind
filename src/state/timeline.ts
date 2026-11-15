// SHARED state between the 3D globe and the HTML overlay.
// The engine WRITES progress + activeIndex, clears jumpTo, and clears target when a jump ends.
// The UI sets world and calls jumpToRelic(). Everyone reads everything.
import { create } from "zustand";
import { relicById, relics } from "../data";
import type { World } from "../types/relic";

interface TimelineState {
  /** null = landing screen */
  world: World | null;
  /** 0 = oldest relic, 1 = newest */
  progress: number;
  /** index into relics[world] of the relic the GLOBE is facing right now */
  activeIndex: number;
  /** relic id the engine should scroll to next (UI sets it, engine clears it) */
  jumpTo: string | null;
  /**
   * index the timeline is travelling to after a jump (rail click, keys, Prev/Next), or null when
   * the user is scrolling freely. While set, the UI shows this relic instead of every relic the
   * globe glides past on the way, and a second key press counts from here.
   */
  target: number | null;

  setWorld: (world: World | null) => void;
  setProgress: (progress: number) => void;
  setActiveIndex: (index: number) => void;
  jumpToRelic: (relicId: string) => void;
  clearJump: () => void;
  clearTarget: () => void;
}

export const useTimeline = create<TimelineState>()((set, get) => ({
  world: null,
  progress: 0,
  activeIndex: 0,
  jumpTo: null,
  target: null,

  setWorld: (world) => set({ world, progress: 0, activeIndex: 0, jumpTo: null, target: null }),
  setProgress: (progress) => {
    if (progress !== get().progress) set({ progress });
  },
  setActiveIndex: (activeIndex) => {
    if (activeIndex !== get().activeIndex) set({ activeIndex });
  },
  jumpToRelic: (relicId) => {
    const relic = relicById.get(relicId);
    if (!relic) return;
    if (relic.world !== get().world) set({ world: relic.world, progress: 0, activeIndex: 0 });
    const target = relics[relic.world].findIndex((r) => r.id === relicId);
    set({ jumpTo: relicId, target });
  },
  clearJump: () => set({ jumpTo: null }),
  clearTarget: () => {
    if (get().target !== null) set({ target: null });
  },
}));

/** The relic the UI should show: the jump destination while travelling, else the one in focus. */
export const useShownIndex = () => useTimeline((s) => s.target ?? s.activeIndex);
