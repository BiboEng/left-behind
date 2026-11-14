// Everything drawn ON TOP of the 3D canvas: header with Back, the rail, the story card.
//
// The overlay covers the whole screen but has `pointer-events: none` (index.css), so mouse wheel
// and touch go straight through to the globe's scroller. Only the buttons, rail and card take
// clicks. Wheel events over the card are forwarded to the timeline unless the card itself can
// still scroll in that direction.
import { type WheelEvent, useEffect, useRef } from "react";
import { relics } from "../data";
import { CALIBRATION, calibrating } from "../engine/calibration";
import { scrollTimelineBy } from "../engine/scrollBridge";
import { useTimeline } from "../state/timeline";
import type { World } from "../types/relic";
import { worlds } from "../worlds";
import { year } from "./format";
import StoryCard from "./StoryCard";
import TimelineRail, { ProgressBar } from "./TimelineRail";

export default function Overlay({ world }: { world: World }) {
  const config = worlds[world];
  const list = relics[world];
  const activeIndex = useTimeline((s) => s.activeIndex);
  const setWorld = useTimeline((s) => s.setWorld);
  const relic = list[Math.min(activeIndex, list.length - 1)];

  useKeyboard(world);

  return (
    <div className="overlay" onWheel={forwardWheel}>
      <header className="topbar">
        <button className="back" onClick={() => setWorld(null)}>
          <span aria-hidden>‹</span> Back
        </button>
        <p className="title">
          Left Behind <span className="sep">·</span> {config.name}
        </p>
        {relic && <p className="current-year mono" aria-hidden>{year(relic.arrived)}</p>}
      </header>
      <ProgressBar />

      {calibrating ? (
        <CalibrationNote world={world} />
      ) : (
        <>
          <TimelineRail list={list} />
          {relic && <StoryCard relic={relic} index={activeIndex} total={list.length} />}
        </>
      )}
    </div>
  );
}

function CalibrationNote({ world }: { world: World }) {
  const p = CALIBRATION[world];
  return (
    <aside className="calibration-note">
      <h2>Calibration check</h2>
      <p>
        The <strong>red dot</strong> marks {p.label} ({p.lat}, {p.lon}). It should sit on {p.expect}.
      </p>
      <p className="muted">
        Off by half a planet? Set <code>lonOffsetDeg: 180</code> in <code>src/worlds/{world}.ts</code>. Remove{" "}
        <code>?calibrate</code> from the URL to leave this mode.
      </p>
    </aside>
  );
}

/** Wheel over the card/rail: let the card scroll its own text first, then scroll the timeline. */
function forwardWheel(e: WheelEvent<HTMLDivElement>) {
  const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
  if (dy === 0) return;
  let node = e.target as HTMLElement | null;
  while (node && node !== e.currentTarget) {
    const scrollable = /(auto|scroll)/.test(getComputedStyle(node).overflowY);
    if (scrollable) {
      const canGoDown = node.scrollTop + node.clientHeight < node.scrollHeight - 1;
      const canGoUp = node.scrollTop > 0;
      if ((dy > 0 && canGoDown) || (dy < 0 && canGoUp)) return; // the browser scrolls the card
    }
    node = node.parentElement;
  }
  scrollTimelineBy(dy);
}

/** ↑/↓ and PageUp/PageDown: previous/next relic. Home/End: first/last. Esc: back to the title. */
function useKeyboard(world: World) {
  // Where the last key press was heading. While the globe is still gliding there, activeIndex
  // hasn't caught up, so pressing ↓ twice quickly should go two relics, not one.
  const pending = useRef<number | null>(null);

  useEffect(() => {
    const list = relics[world];
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const { activeIndex, jumpToRelic, setWorld } = useTimeline.getState();
      if (e.key === "Escape") {
        setWorld(null);
        return;
      }
      const base = pending.current !== null && pending.current !== activeIndex ? pending.current : activeIndex;
      let next: number | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") next = base + 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") next = base - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = list.length - 1;
      if (next === null) return;

      e.preventDefault(); // stop the browser's own scroll, we do it properly instead
      next = Math.max(0, Math.min(list.length - 1, next));
      pending.current = next;
      jumpToRelic(list[next].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [world]);
}
