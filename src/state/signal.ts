// An exhibition lives in memory and in an explicit share URL, never in a user account.
import { create } from "zustand";
import { CASE_IDS, type CaseId, type SignalChapter } from "../data/signal";

export const DEFAULT_EXHIBIT_TITLE = "The hardware stayed. The knowledge travelled.";
export const MAX_TITLE = 80;
export const MAX_CAPTION = 280;

export function parseCards(value: string | null): CaseId[] {
  const result: CaseId[] = [];
  for (const id of (value ?? "").split(",")) {
    if (CASE_IDS.includes(id as CaseId) && !result.includes(id as CaseId)) result.push(id as CaseId);
  }
  return result;
}
export function cleanText(value: string | null, max: number, multiline = false) {
  // Textarea line breaks belong in shared captions too; normalize Windows line endings.
  return Array.from((value ?? "").replace(/\r\n?/g, "\n"), (char) => {
    const code = char.charCodeAt(0);
    if (multiline && code === 10) return char;
    return code < 32 || code === 127 ? " " : char;
  }).join("").trim().slice(0, max);
}
export function parseSignalChapter(hash: string): SignalChapter | null {
  const [root, chapter] = hash.replace(/^#/, "").split("/");
  if (root !== "signal") return null;
  return CASE_IDS.includes(chapter as CaseId) || chapter === "exhibit" ? chapter as SignalChapter : "intro";
}

interface SignalState {
  chapter: SignalChapter | null;
  cards: CaseId[];
  title: string;
  caption: string;
  toggleCard: (id: CaseId) => void;
  setTitle: (value: string) => void;
  setCaption: (value: string) => void;
}
export const useSignal = create<SignalState>()((set) => ({
  chapter: null, cards: [], title: DEFAULT_EXHIBIT_TITLE, caption: "",
  toggleCard: (id) => set((s) => ({
    cards: s.cards.includes(id) ? s.cards.filter((item) => item !== id) : [...s.cards, id],
  })),
  setTitle: (title) => set({ title: title.slice(0, MAX_TITLE) }),
  setCaption: (caption) => set({ caption: caption.slice(0, MAX_CAPTION) }),
}));
