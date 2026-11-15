import { create } from "zustand";
import { DEFAULT_LUNAR_VIEW, type LunarView } from "../data/lunar-view";

export const useLunar = create<{ view: LunarView; setView: (update: Partial<LunarView>) => void }>()((set) => ({
  view: { ...DEFAULT_LUNAR_VIEW },
  setView: (update) => set((s) => ({ view: { ...s.view, ...update } })),
}));
