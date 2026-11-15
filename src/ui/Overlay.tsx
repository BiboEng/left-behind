// Everything drawn ON TOP of the 3D canvas: header with Back, the rail, the story card.
//
// The overlay covers the whole screen but has `pointer-events: none` (index.css), so mouse wheel
// and touch go straight through to the globe's scroller. Only the buttons, rail and card take
// clicks. Wheel events over the card are forwarded to the timeline unless the card itself can
// still scroll in that direction.
import { type WheelEvent, useEffect, useState } from "react";
import { relics } from "../data";
import { CALIBRATION, calibrating } from "../engine/calibration";
import { scrollTimelineBy } from "../engine/scrollBridge";
import { useCredits } from "../state/credits";
import { goHome } from "../state/router";
import { useShownIndex, useTimeline } from "../state/timeline";
import type { Relic, World } from "../types/relic";
import { worlds } from "../worlds";
import { year } from "./format";
import { CreditsButton } from "./Credits";
import StoryCard from "./StoryCard";
import TimelineRail, { ProgressBar } from "./TimelineRail";
import YearCounter from "./YearCounter";

export default function Overlay({ world }: { world: World }) {
  const config = worlds[world];
  const list = relics[world];
  // During a jump this is the destination, so the card doesn't flash every relic on the way.
  const shownIndex = Math.min(useShownIndex(), list.length - 1);
  const relic = list[shownIndex];
  const direction = useDirection(shownIndex);

  useKeyboard(world);

  return (
    <div className="overlay" onWheel={forwardWheel}>
      <header className="topbar">
        <button className="back" onClick={goHome}>
          <span aria-hidden>‹</span> Back
        </button>
        <p className="title">
          Left Behind <span className="sep">·</span> {config.name}
        </p>
        {relic && <YearCounter year={year(relic.arrived)} className="current-year mono" />}
        <CreditsButton className="back topbar-credits" />
      </header>
      <ProgressBar />

      {/* Screen readers hear one short line per relic, not the whole card. */}
      <p className="sr-only" aria-live="polite">
        {relic && `${year(relic.arrived)}: ${relic.name}`}
      </p>

      {calibrating ? (
        <CalibrationNote world={world} />
      ) : (
        <>
          <TimelineRail list={list} />
          <ScrollHint />
          <StepNav list={list} index={shownIndex} />
          {relic && <StoryCard relic={relic} index={shownIndex} total={list.length} direction={direction} />}
        </>
      )}
    </div>
  );
}

/** +1 when the last change moved forward in time, -1 when it moved back (drives the card slide). */
function useDirection(index: number): 1 | -1 {
  const [state, setState] = useState({ index, direction: 1 as 1 | -1 });
  if (state.index !== index) setState({ index, direction: index > state.index ? 1 : -1 });
  return state.direction;
}

/** "Scroll to travel through time" on the first relic, gone for good after the first scroll. */
function ScrollHint() {
  const moved = useTimeline((s) => s.progress > 0.01 || s.target !== null);
  // Remember it: scrolling back to the first relic shouldn't bring the hint back.
  const [dismissed, setDismissed] = useState(false);
  if (moved && !dismissed) setDismissed(true);
  if (dismissed || moved) return null;
  return (
    <p className="scroll-hint" aria-hidden>
      <span className="hint-desktop">Scroll to travel forward in time</span>
      <span className="hint-touch">Swipe the globe to travel in time</span>
      <span className="hint-arrow">↓</span>
    </p>
  );
}

/** Phone only (hidden on desktop by CSS): previous / next relic buttons above the bottom sheet. */
function StepNav({ list, index }: { list: Relic[]; index: number }) {
  const jumpToRelic = useTimeline((s) => s.jumpToRelic);
  const prev = list[index - 1];
  const next = list[index + 1];
  return (
    <nav className="step-nav" aria-label="Previous and next relic">
      {prev ? (
        <button onClick={() => jumpToRelic(prev.id)} aria-label={`Previous: ${prev.name}`}>
          <span aria-hidden>‹</span> {year(prev.arrived)}
        </button>
      ) : (
        <span />
      )}
      {next && (
        <button onClick={() => jumpToRelic(next.id)} aria-label={`Next: ${next.name}`}>
          {year(next.arrived)} <span aria-hidden>›</span>
        </button>
      )}
    </nav>
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
  useEffect(() => {
    const list = relics[world];
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      // The Credits screen handles its own keys (Esc closes it, arrows scroll it).
      if (useCredits.getState().open) return;
      if (e.key === "Escape") {
        goHome();
        return;
      }
      // Arrow keys inside the story card scroll its text, like on any page. PageUp/Down still step.
      const inCard = e.target instanceof Element && e.target.closest(".story-card");
      if (inCard && (e.key === "ArrowDown" || e.key === "ArrowUp")) return;

      const { activeIndex, target, jumpToRelic } = useTimeline.getState();
      // While still gliding to an earlier key press, count from where we're heading, so pressing ↓
      // twice quickly goes two relics. `target` clears itself when the glide ends or the user
      // scrolls by hand, so it never goes stale.
      const base = target ?? activeIndex;
      let next: number | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") next = base + 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") next = base - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = list.length - 1;
      if (next === null) return;

      e.preventDefault(); // stop the browser's own scroll, we do it properly instead
      next = Math.max(0, Math.min(list.length - 1, next));
      jumpToRelic(list[next].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [world]);
}
