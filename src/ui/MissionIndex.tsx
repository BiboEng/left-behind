// The same mission catalogue is available from the title and either world's timeline.
import { useEffect, useMemo, useRef, useState } from "react";
import { relics } from "../data";
import { evidenceCases } from "../data/signal";
import { openSignal } from "../state/router";
import { useTimeline } from "../state/timeline";
import type { RelicStatus, World } from "../types/relic";
import { worlds } from "../worlds";
import { formatDate, STATUS_LABEL } from "./format";

const ALL = [...relics.moon, ...relics.mars];
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export default function MissionIndex({ world, className }: { world?: World; className?: string }) {
  const [open, setOpen] = useState(false);
  // ⌘K / Ctrl+K opens the index from anywhere this button is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)} aria-keyshortcuts="Meta+K Control+K">
        Search <kbd aria-hidden>{isMac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      {open && <IndexDialog initialWorld={world} onClose={() => setOpen(false)} />}
    </>
  );
}

function IndexDialog({ initialWorld, onClose }: { initialWorld?: World; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [world, setWorld] = useState<World | "all">(initialWorld ?? "all");
  const [status, setStatus] = useState<RelicStatus | "all">("all");
  const results = useMemo(() => {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return ALL.filter((r) => {
      const text = [r.name, r.mission, r.headline, r.location.name, r.arrived, ...r.story].join(" ").toLocaleLowerCase();
      return (world === "all" || r.world === world) && (status === "all" || r.status === status)
        && words.every((word) => text.includes(word));
    }).sort((a, b) => a.arrived.localeCompare(b.arrived) || a.id.localeCompare(b.id));
  }, [query, world, status]);
  // The four investigations are searchable too, so the palette reaches the whole experience.
  const chapters = useMemo(() => {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return evidenceCases.filter((c) => {
      const text = [c.title, c.shortTitle, c.question, c.lead, c.observation].join(" ").toLocaleLowerCase();
      return (world === "all" || c.world === world) && words.every((word) => text.includes(word));
    });
  }, [query, world]);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog ref={ref} className="mission-index credits" aria-labelledby="index-title" onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}>
      <header className="credits-head">
        <h2 id="index-title">Mission index</h2>
        <button className="back" onClick={() => ref.current?.close()}>Close</button>
      </header>
      <div className="credits-body">
        <p className="credits-lead">Find a machine or an investigation. Press Esc to close.</p>
        <div className="index-filters">
          <label className="index-search">Search missions
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Try water, Apollo, or 1999" autoFocus />
          </label>
          <label>World
            <select value={world} onChange={(e) => setWorld(e.target.value as World | "all")}>
              <option value="all">Both worlds</option>
              <option value="moon">The Moon</option>
              <option value="mars">Mars</option>
            </select>
          </label>
          <label>Status
            <select value={status} onChange={(e) => setStatus(e.target.value as RelicStatus | "all")}>
              <option value="all">Every outcome</option>
              {Object.entries(STATUS_LABEL).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
        </div>
        {chapters.length > 0 && <>
          <p className="index-count" role="status">Investigations</p>
          <ol className="mission-results">
            {chapters.map((c) => <li key={c.id}>
              <button onClick={() => { ref.current?.close(); openSignal(c.id); }}>
                <span className="mission-result-meta">After the Signal · Act {c.number}</span>
                <strong>{c.title}</strong>
                <span>{c.question}</span>
              </button>
            </li>)}
          </ol>
        </>}
        <p className="index-count" role="status">{results.length} of {ALL.length} machines</p>
        {results.length ? (
          <ol className="mission-results">
            {results.map((r) => (
              <li key={r.id}>
                <button onClick={() => {
                  ref.current?.close();
                  useTimeline.getState().jumpToRelic(r.id);
                }}>
                  <span className="mission-result-meta mono">{worlds[r.world].name} · {formatDate(r.arrived)} · {STATUS_LABEL[r.status]}</span>
                  <strong>{r.name}</strong>
                  <span>{r.headline}</span>
                </button>
              </li>
            ))}
          </ol>
        ) : <p className="muted">No relics match. Try a different search or clear the filters.</p>}
        <p className="credits-note">A selection of NASA hardware, not a complete inventory. Each story links to its evidence.</p>
      </div>
    </dialog>
  );
}
