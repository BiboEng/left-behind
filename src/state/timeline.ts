// Shared navigation works with or without the renderer. Only the globe needs deferred jumps.
import { create } from "zustand";
import { relicById, relics } from "../data";
import type { World } from "../types/relic";

export type ViewMode = "globe" | "reading";

interface TimelineState {
  world: World | null;
  mode: ViewMode;
  progress: number;
  activeIndex: number;
  jumpTo: string | null;
  /** Destination shown while the globe travels, or null when settled. */
  target: number | null;
  setWorld: (world: World | null) => void;
  setMode: (mode: ViewMode) => void;
  setProgress: (progress: number) => void;
  setActiveIndex: (index: number) => void;
  jumpToRelic: (relicId: string) => void;
  clearJump: () => void;
  clearTarget: () => void;
}

const progressAt = (index: number, count: number) => count > 1 ? index / (count - 1) : 0;

export const useTimeline = create<TimelineState>()((set, get) => ({
  world: null,
  mode: "globe",
  progress: 0,
  activeIndex: 0,
  jumpTo: null,
  target: null,
  setWorld: (world) => set({ world, progress: 0, activeIndex: 0, jumpTo: null, target: null }),
  setMode: (mode) => {
    const s = get();
    if (s.mode === mode) return;
    const index = s.target ?? s.activeIndex;
    const list = s.world ? relics[s.world] : [];
    const relic = list[index];
    set({
      mode, activeIndex: index, progress: progressAt(index, list.length),
      jumpTo: mode === "globe" && relic ? relic.id : null,
      target: mode === "globe" && relic ? index : null,
    });
  },
  setProgress: (progress) => {
    if (progress !== get().progress) set({ progress });
  },
  setActiveIndex: (activeIndex) => {
    if (activeIndex !== get().activeIndex) set({ activeIndex });
  },
  jumpToRelic: (relicId) => {
    const relic = relicById.get(relicId);
    if (!relic) return;
    const list = relics[relic.world];
    const index = list.findIndex((r) => r.id === relicId);
    if (get().mode === "reading") {
      set({ world: relic.world, activeIndex: index, progress: progressAt(index, list.length), jumpTo: null, target: null });
    } else {
      // Atomic across worlds: subscribers never observe the old world's pending destination.
      const changedWorld = relic.world !== get().world;
      set({
        world: relic.world, jumpTo: relicId, target: index,
        ...(changedWorld ? { progress: 0, activeIndex: 0 } : {}),
      });
    }
  },
  clearJump: () => set({ jumpTo: null }),
  clearTarget: () => {
    if (get().target !== null) set({ target: null });
  },
}));

export const useShownIndex = () => useTimeline((s) => s.target ?? s.activeIndex);
