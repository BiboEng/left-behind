// The year rail on the left: one stop per relic, oldest at the top. Click a stop to jump there.
// On phones it's hidden and the slim progress bar (ProgressBar) takes its place.
import { useTimeline } from "../state/timeline";
import type { Relic } from "../types/relic";
import { year } from "./format";

export default function TimelineRail({ list }: { list: Relic[] }) {
  const activeIndex = useTimeline((s) => s.activeIndex);
  const jumpToRelic = useTimeline((s) => s.jumpToRelic);

  return (
    <nav className="rail" aria-label="Timeline">
      <ol>
        {list.map((r, i) => {
          const state = i === activeIndex ? "active" : i < activeIndex ? "past" : "future";
          return (
            <li key={r.id} className={state}>
              <button
                onClick={() => jumpToRelic(r.id)}
                aria-current={i === activeIndex ? "step" : undefined}
                aria-label={`${year(r.arrived)}: ${r.name}`}
                title={r.name}
              >
                <span className="dot" aria-hidden />
                <span className="year mono">{year(r.arrived)}</span>
                {i === activeIndex && <span className="rail-name">{r.name}</span>}
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
