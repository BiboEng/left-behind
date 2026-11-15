// Hash routes keep both the atlas and the evidence room shareable without a server rewrite.
import { relicById, relics } from "../data";
import type { SignalChapter } from "../data/signal";
import type { World } from "../types/relic";
import { cleanText, DEFAULT_EXHIBIT_TITLE, MAX_CAPTION, MAX_TITLE, parseCards, parseSignalChapter, useSignal } from "./signal";
import { useTimeline } from "./timeline";

const WORLDS: readonly World[] = ["moon", "mars"];
let stopRouter: (() => void) | null = null;
let applyingUrl = false;

function parse() {
  const [w, id] = window.location.hash.slice(1).split("/");
  const world = WORLDS.includes(w as World) ? w as World : null;
  const relic = id ? relicById.get(id) : undefined;
  return { world, relicId: world && relic?.world === world ? relic.id : null };
}
function writeExhibition(url: URL) {
  const s = useSignal.getState();
  if (s.cards.length) url.searchParams.set("collection", s.cards.join(","));
  else url.searchParams.delete("collection");
  const title = cleanText(s.title, MAX_TITLE);
  if (title && title !== DEFAULT_EXHIBIT_TITLE) url.searchParams.set("exhibitTitle", title);
  else url.searchParams.delete("exhibitTitle");
  const caption = cleanText(s.caption, MAX_CAPTION, true);
  if (caption) url.searchParams.set("exhibitNote", caption);
  else url.searchParams.delete("exhibitNote");
}
function clearExhibition(url: URL) {
  for (const key of ["collection", "exhibitTitle", "exhibitNote"]) url.searchParams.delete(key);
}
const pathOf = (url: URL) => url.pathname + url.search + url.hash;

export function signalUrl(chapter: SignalChapter = "exhibit") {
  const url = new URL(window.location.href);
  writeExhibition(url);
  url.hash = chapter === "intro" ? "signal" : `signal/${chapter}`;
  return url;
}
function visit(url: URL) {
  if (pathOf(url) === window.location.pathname + window.location.search + window.location.hash) return;
  window.history.pushState({ leftBehind: true }, "", pathOf(url));
  window.dispatchEvent(new PopStateEvent("popstate"));
}
export function openSignal(chapter: SignalChapter = "intro") { visit(signalUrl(chapter)); }
export function openAtlas() {
  const url = new URL(window.location.href);
  clearExhibition(url);
  url.hash = "";
  visit(url);
}

/** Returns cleanup for tests/embedders; repeated starts share the same subscriptions. */
export function startRouter(): () => void {
  if (stopRouter) return stopRouter;
  const applyUrl = () => {
    applyingUrl = true;
    try {
      const url = new URL(window.location.href);
      const chapter = parseSignalChapter(url.hash);
      const s = useTimeline.getState();
      if (chapter) {
        useSignal.setState({
          chapter, cards: parseCards(url.searchParams.get("collection")),
          title: cleanText(url.searchParams.get("exhibitTitle"), MAX_TITLE) || DEFAULT_EXHIBIT_TITLE,
          caption: cleanText(url.searchParams.get("exhibitNote"), MAX_CAPTION, true),
        });
        s.setWorld(null);
        s.setMode(url.searchParams.get("view") === "reading" ? "reading" : "globe");
      } else {
        useSignal.setState({ chapter: null });
        const { world, relicId } = parse();
        s.setMode(url.searchParams.get("view") === "reading" ? "reading" : "globe");
        if (relicId) s.jumpToRelic(relicId);
        else s.setWorld(world);
      }
    } finally {
      applyingUrl = false;
    }
  };
  applyUrl();
  window.addEventListener("popstate", applyUrl);
  window.addEventListener("hashchange", applyUrl);

  const unsubscribe = useTimeline.subscribe((s, prev) => {
    if (applyingUrl) return;
    const changedWorld = s.world !== prev.world;
    const settled = s.target === null && (s.activeIndex !== prev.activeIndex || prev.target !== null);
    if (!changedWorld && !settled && s.mode === prev.mode) return;
    // Index results can open the atlas from either screen. URL-originated changes stay suppressed.
    if (useSignal.getState().chapter && !s.world) return;
    if (s.world) useSignal.setState({ chapter: null });
    const url = new URL(window.location.href);
    clearExhibition(url);
    if (s.mode === "reading") url.searchParams.set("view", "reading");
    else url.searchParams.delete("view");
    const relic = s.world ? relics[s.world][s.target ?? s.activeIndex] : undefined;
    url.hash = s.world ? `#${s.world}${relic ? "/" + relic.id : ""}` : "";
    if (changedWorld && s.world) window.history.pushState({ leftBehind: true }, "", pathOf(url));
    else window.history.replaceState(s.world ? window.history.state : null, "", pathOf(url));
  });
  const unsubscribeSignal = useSignal.subscribe((s, prev) => {
    if (applyingUrl || !s.chapter) return;
    if (s.cards === prev.cards && s.title === prev.title && s.caption === prev.caption) return;
    const url = new URL(window.location.href);
    writeExhibition(url);
    window.history.replaceState(window.history.state, "", pathOf(url));
  });

  stopRouter = () => {
    unsubscribe();
    unsubscribeSignal();
    window.removeEventListener("popstate", applyUrl);
    window.removeEventListener("hashchange", applyUrl);
    stopRouter = null;
  };
  return stopRouter;
}

export function goHome() {
  if (window.history.state?.leftBehind) window.history.back();
  else useTimeline.getState().setWorld(null);
}
