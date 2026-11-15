// Keeps the address bar in sync with the timeline: `#moon`, `#mars/spirit`.
// That makes the browser Back button return to the title screen, and lets a shared link open
// straight onto one relic. No router library: the store stays the source of truth, this file
// only mirrors it into the URL and reads it back on load / Back / Forward.
import { relicById, relics } from "../data";
import type { World } from "../types/relic";
import { useTimeline } from "./timeline";

const WORLDS: readonly World[] = ["moon", "mars"];

function parse(): { world: World | null; relicId: string | null } {
  const [w, id] = window.location.hash.slice(1).split("/");
  const world = WORLDS.includes(w as World) ? (w as World) : null;
  const relic = id ? relicById.get(id) : undefined;
  return { world, relicId: world && relic?.world === world ? relic.id : null };
}

/** Same page (keeps ?calibrate), new hash. An empty hash drops the "#" entirely. */
const urlWith = (hash: string) => window.location.pathname + window.location.search + hash;

/** URL → store (page load, Back, Forward, hand-edited hash). */
function applyUrl() {
  const { world, relicId } = parse();
  const s = useTimeline.getState();
  if (relicId) s.jumpToRelic(relicId);
  else if (world !== s.world) s.setWorld(world);
}

let started = false;

/** Call once, before the first render. */
export function startRouter() {
  if (started) return;
  started = true;
  applyUrl();
  window.addEventListener("popstate", applyUrl);

  // store → URL
  useTimeline.subscribe((s, prev) => {
    if (s.world !== prev.world) {
      if (parse().world === s.world) return; // the URL already says so (we got here from applyUrl)
      if (s.world) {
        // Entering a world is a new history entry, so Back returns to the title screen.
        window.history.pushState({ leftBehind: true }, "", urlWith(`#${s.world}`));
      } else {
        window.history.replaceState(null, "", urlWith(""));
      }
      return;
    }
    // Settled on a new relic: update the link in place (no new history entry per relic).
    const settled = s.target === null && (s.activeIndex !== prev.activeIndex || prev.target !== null);
    if (s.world && settled) {
      const relic = relics[s.world][s.activeIndex];
      if (relic) window.history.replaceState(window.history.state, "", urlWith(`#${s.world}/${relic.id}`));
    }
  });
}

/** Back to the title screen: undo our own history entry if there is one, so Forward works too. */
export function goHome() {
  if (window.history.state?.leftBehind) window.history.back();
  else useTimeline.getState().setWorld(null);
}
