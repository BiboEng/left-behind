// Lightweight hash routing. Reading mode is shareable through ?view=reading.
import { relicById, relics } from "../data";
import type { World } from "../types/relic";
import { useTimeline } from "./timeline";

const WORLDS: readonly World[] = ["moon", "mars"];
let stopRouter: (() => void) | null = null;

function parse() {
  const [w, id] = window.location.hash.slice(1).split("/");
  const world = WORLDS.includes(w as World) ? w as World : null;
  const relic = id ? relicById.get(id) : undefined;
  return { world, relicId: world && relic?.world === world ? relic.id : null };
}

/** Returns cleanup for tests/embedders; repeated starts share one subscription. */
export function startRouter(): () => void {
  if (stopRouter) return stopRouter;
  let applyingUrl = false;
  const applyUrl = () => {
    applyingUrl = true;
    try {
      const { world, relicId } = parse();
      const s = useTimeline.getState();
      s.setMode(new URLSearchParams(window.location.search).get("view") === "reading" ? "reading" : "globe");
      if (relicId) s.jumpToRelic(relicId);
      else s.setWorld(world); // #moon always means its first relic, including within the same world.
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
    const url = new URL(window.location.href);
    if (s.mode === "reading") url.searchParams.set("view", "reading");
    else url.searchParams.delete("view");
    const relic = s.world ? relics[s.world][s.target ?? s.activeIndex] : undefined;
    url.hash = s.world ? `#${s.world}${relic ? "/" + relic.id : ""}` : "";
    const path = url.pathname + url.search + url.hash;
    if (changedWorld && s.world) window.history.pushState({ leftBehind: true }, "", path);
    else window.history.replaceState(s.world ? window.history.state : null, "", path);
  });

  stopRouter = () => {
    unsubscribe();
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
