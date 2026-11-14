// SHARED state between the 3D globe and the HTML overlay.
// The engine WRITES progress + activeIndex and clears jumpTo.
// The UI sets world and calls jumpToRelic(). Everyone reads everything.
import { create } from "zustand";
import { relicById } from "../data";
import type { World } from "../types/relic";

interface TimelineState {
  /** null = landing screen */
  world: World | null;
  /** 0 = oldest relic, 1 = newest */
  progress: number;
  /** index into relics[world] of the relic in focus */
  activeIndex: number;
  /** relic id the engine should scroll to next (UI sets it, engine clears it) */
  jumpTo: string | null;

  setWorld: (world: World | null) => void;
  setProgress: (progress: number) => void;
  setActiveIndex: (index: number) => void;
  jumpToRelic: (relicId: string) => void;
  clearJump: () => void;
}

export const useTimeline = create<TimelineState>()((set, get) => ({
  world: null,
  progress: 0,
  activeIndex: 0,
  jumpTo: null,

  setWorld: (world) => set({ world, progress: 0, activeIndex: 0, jumpTo: null }),
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
    set({ jumpTo: relicId });
  },
  clearJump: () => set({ jumpTo: null }),
}));
