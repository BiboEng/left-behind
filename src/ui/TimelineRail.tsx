// The year rail on the left: one stop per relic, oldest at the top. Click a stop to jump there.
// On phones it's hidden and the slim progress bar (ProgressBar) takes its place.
import { useEffect, useRef } from "react";
import { useShownIndex, useTimeline } from "../state/timeline";
import type { Relic } from "../types/relic";
import { year } from "./format";

export default function TimelineRail({ list }: { list: Relic[] }) {
  // During a jump the rail highlights the destination right away.
  const activeIndex = useShownIndex();
  const jumpToRelic = useTimeline((s) => s.jumpToRelic);
  const activeItem = useRef<HTMLLIElement>(null);

  // On short windows the rail scrolls: keep the active stop in view.
  useEffect(() => {
    activeItem.current?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <nav className="rail" aria-label="Timeline">
      <ol>
        {list.map((r, i) => {
          const state = i === activeIndex ? "active" : i < activeIndex ? "past" : "future";
          return (
            <li key={r.id} className={state} ref={i === activeIndex ? activeItem : undefined}>
              <button
                onClick={() => jumpToRelic(r.id)}
                aria-current={i === activeIndex ? "step" : undefined}
                aria-label={`${year(r.arrived)}: ${r.name}`}
              >
                <span className="dot" aria-hidden />
                <span className="year mono">{year(r.arrived)}</span>
                {/* Always rendered; CSS shows it for the active stop, and on hover/focus for the rest. */}
                <span className="rail-name">{r.name}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ProgressBar() {
  const progress = useTimeline((s) => s.progress);
  return (
    <div className="progress" aria-hidden>
      <div style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
