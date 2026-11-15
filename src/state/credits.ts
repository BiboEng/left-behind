// Whether the Credits screen is open. Kept apart from the timeline state on purpose: the
// Credits screen can open from the title screen or from inside a world, and doesn't touch the globe.
import { create } from "zustand";

interface CreditsState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCredits = create<CreditsState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
