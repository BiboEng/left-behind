// A view into published results, not a new moonquake detector or a location solver.
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_LUNAR_VIEW, LUNAR_MONTHS, type LunarDirection } from "../../data/lunar-view";
import { filterLunarEvents, fromModuleSector, lunarEvents, lunarHistogram, lunarProvenance, lunarReceipt, relativeArrivals } from "../../data/lunar";
import { signalUrl } from "../../state/router";
import { useLunar } from "../../state/lunar";
import "./lunar.css";

const directions: readonly [LunarDirection, string][] = [["all", "All directions"], ["module", "Only the lander sector"], ["other", "Remove the lander sector"]];
const number = (value: number) => value.toLocaleString("en-US");
const monthLabel = (month: string) => new Date(month + "-01T00:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
function point(degrees: number, radius: number) {
  const angle = degrees * Math.PI / 180;
  return `${180 + Math.sin(angle) * radius},${180 - Math.cos(angle) * radius}`;
}
function petal(index: number, count: number, maximum: number) {
  const start = index * 20 + 1;
  const end = (index + 1) * 20 - 1;
  // Annular sector area, rather than radius, is proportional to event count.
  const radius = Math.sqrt(38 ** 2 + (138 ** 2 - 38 ** 2) * count / Math.max(1, maximum));
  return `M ${point(start, 38)} L ${point(start, radius)} A ${radius},${radius} 0 0 1 ${point(end, radius)} L ${point(end, 38)} A 38,38 0 0 0 ${point(start, 38)} Z`;
}

export default function LunarLab() {
  const view = useLunar((s) => s.view);
  const setView = useLunar((s) => s.setView);
  const [copied, setCopied] = useState("");
  const [showLink, setShowLink] = useState(false);
  const link = useRef<HTMLInputElement>(null);
  const base = useMemo(() => filterLunarEvents({ ...view, direction: "all" }), [view]);
  const events = useMemo(() => filterLunarEvents(view), [view]);
  const bins = lunarHistogram(events);
  const maximum = Math.max(1, ...lunarHistogram(base));
  const index = Math.max(0, events.findIndex((event) => event.id === view.eventId));
  const event = events[index];
  const delays = event ? relativeArrivals(event) : [];
  const lastArrival = Math.max(0.001, ...delays);
  const url = signalUrl("apollo").href;

  // Shared IDs may be nonexistent or excluded by the filters. Select an actual visible event.
  useEffect(() => {
    if (view.eventId !== (event?.id ?? "")) setView({ eventId: event?.id ?? "" });
  }, [view.eventId, event?.id, setView]);
  const filter = (update: Partial<typeof view>) => setView({ ...update, eventId: "" });
  const copy = async () => {
    setCopied("");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setShowLink(false);
    } catch { setShowLink(true); }
  };
  const download = () => {
    const blob = new Blob([lunarReceipt(view, event, url)], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "apollo17-evidence-receipt.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  return <section className="lunar-lab" aria-labelledby="lunar-lab-title">
    <header className="lunar-lab-heading">
      <p className="eyebrow">Return to the archive <span> / </span> Apollo 17 · LSPE</p>
      <h2 id="lunar-lab-title">Find the machine<br />in the measurement.</h2>
      <p>What changes when one direction disappears? Compare the catalog, then inspect the four sensor arrivals behind a single event.</p>
    </header>
    <dl className="lunar-stats">
      <div><dt>Published events</dt><dd>{number(lunarEvents.length)}</dd></div>
      <div><dt>In this view</dt><dd aria-live="polite" aria-atomic="true">{number(events.length)}</dd></div>
      <div><dt>Sensor picks per event</dt><dd>4</dd></div>
    </dl>
    <div className="lunar-controls">
      <label className="lunar-month">Catalog month<select value={view.month} onChange={(e) => filter({ month: e.target.value })}>
        <option value="all">All nine months</option>
        {LUNAR_MONTHS.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
      </select></label>
      <label className="lunar-quality"><input type="checkbox" checked={view.tight} onChange={(e) => filter({ tight: e.target.checked })} />
        <span>Use tighter direction estimates<small>Published azimuth variance ≤ 50. This is not a confidence percentage.</small></span>
      </label>
    </div>
    <div className="lunar-direction" role="group" aria-label="Compare event directions">
      {directions.map(([value, label]) => <button key={value} className="signal-button" aria-pressed={view.direction === value}
        onClick={() => filter({ direction: value })}>{label}</button>)}
    </div>
    <p className="lunar-sector-note">The highlighted sector is strictly between 80° and 120°. The researchers used this range to compare signals from the lunar module's direction. A direction match alone does not identify an event's source.</p>

    <div className="lunar-workbench">
      <div className="lunar-direction-panel">
        <figure className="lunar-rose">
          <svg viewBox="0 0 360 360" role="img" aria-labelledby="lunar-rose-title lunar-rose-desc">
            <title id="lunar-rose-title">Published arrival directions: {number(events.length)} events</title>
            <desc id="lunar-rose-desc">Eighteen 20-degree bins, clockwise from north. Petal area shows event count. Exact counts are available in the table below. Highlighted petals mark the lander-direction sector.</desc>
            {[70, 105, 138].map((r) => <circle key={r} cx="180" cy="180" r={r} className="rose-guide" />)}
            <path d="M 180 35 V 325 M 35 180 H 325" className="rose-guide" />
            {bins.map((count, i) => <path key={i} d={petal(i, count, maximum)} className={fromModuleSector(i * 20 + 10) ? "rose-module" : "rose-other"}>
              <title>{i * 20}°–{(i + 1) * 20}°: {number(count)} events</title>
            </path>)}
            <text x="180" y="23" textAnchor="middle">N · 0°</text><text x="350" y="184" textAnchor="end">E</text>
            <text x="180" y="347" textAnchor="middle">S · 180°</text><text x="10" y="184">W</text>
            <text x="180" y="181" className="rose-count" textAnchor="middle">{number(events.length)}</text>
            <text x="180" y="197" className="rose-center-label" textAnchor="middle">EVENTS</text>
          </svg>
          <figcaption><span className="lunar-key"><i />80°–120° sector <i />Other directions</span>
            Petal area represents count, not distance or shaking strength. The scale stays fixed across the three direction comparisons for the chosen month and quality filter.</figcaption>
        </figure>
        <details className="lunar-bin-table"><summary>Read the exact chart values</summary>
          <table><caption>Selected events in 20° bins; clockwise from north</caption><thead><tr><th scope="col">Direction</th><th scope="col">Events</th></tr></thead>
            <tbody>{bins.map((count, i) => <tr key={i}><th scope="row">{i * 20}°–{(i + 1) * 20}°</th><td>{number(count)}</td></tr>)}</tbody>
          </table>
        </details>
      </div>

      <section className="lunar-event" aria-labelledby="lunar-event-title">
        <p className="eyebrow">One event. Four arrivals.</p>
        <h3 id="lunar-event-title">Follow a single vibration.</h3>
        <p>A geophone measures motion in the ground. Slightly different arrival times helped the researchers estimate a direction.</p>
        {event ? <>
          <label>Published event<select value={event.id} onChange={(e) => setView({ eventId: e.target.value })}>
            {events.map((entry) => <option key={entry.id} value={entry.id}>{entry.id} · {entry.arrivals[0].slice(0, 10)}</option>)}
          </select></label>
          <div className="lunar-event-nav">
            <button className="signal-button" disabled={index === 0} onClick={() => setView({ eventId: events[index - 1].id })}>← Previous event</button>
            <span className="mono">{number(index + 1)} / {number(events.length)}</span>
            <button className="signal-button" disabled={index === events.length - 1} onClick={() => setView({ eventId: events[index + 1].id })}>Next event →</button>
          </div>
          <dl className="lunar-event-facts"><div><dt>Estimated direction</dt><dd>{event.bearing}°</dd></div><div><dt>Azimuth variance</dt><dd>{event.variance}</dd></div></dl>
          <div className="lunar-arrivals" aria-hidden="true">{delays.map((delay, i) => <div key={i}>
            <span>Geo {i + 1}</span><span className="arrival-track"><i style={{ left: `${delay / lastArrival * 100}%` }} /></span><span>+{delay.toFixed(3)} s</span>
          </div>)}</div>
          <p className="lunar-small">Timing diagram, not a waveform. Zero is the earliest of these four picks.</p>
          <div className="lunar-arrival-table"><table><caption>Arrival picks for {event.id} · {event.arrivals[0].slice(0, 10)}</caption>
            <thead><tr><th scope="col">Sensor</th><th scope="col">Catalog clock</th><th scope="col">After first</th></tr></thead>
            <tbody>{event.arrivals.map((time, i) => <tr key={i}><th scope="row">Geo {i + 1}</th><td>{time.slice(11)}</td><td>+{delays[i].toFixed(6)} s</td></tr>)}</tbody>
          </table></div>
          <p className="lunar-small">Picks retain the catalog's precision; this does not imply matching measurement accuracy. Times are reproduced as published.</p>
        </> : <p role="status">No events match these filters. Choose another month, include all direction estimates, or reset the view.</p>}
      </section>
    </div>

    <aside className="lunar-conclusion">
      <p className="eyebrow">What changes the story</p>
      <h3>The instrument was listening to its neighbour.</h3>
      <p>The study connected regular morning vibrations to the lander base heating and expanding. Those tremors were tiny. Their significance was the source: the equipment had become part of the environment being studied.</p>
      <p>This chart alone cannot establish that explanation. The researchers also examined timing, waveforms and the site's geometry. The result belongs to their study; this explorer lets the evidence be examined again.</p>
      <a href="https://www.caltech.edu/about/news/the-lunar-alarm-clock-new-study-characterizes-regular-moonquakes" target="_blank" rel="noreferrer">Read the research story at Caltech ↗</a>
    </aside>
    <div className="lunar-actions no-print">
      <button className="signal-button primary" onClick={copy}>{copied === url ? "Investigation link copied" : "Copy investigation link"}</button>
      <button className="signal-button" onClick={download}>Download evidence receipt</button>
      <button className="text-link" onClick={() => setView({ ...DEFAULT_LUNAR_VIEW })}>Reset the view</button>
    </div>
    <p className="lunar-small" role="status">{copied === url ? "The link preserves these filters and this selected event." : showLink ? "Automatic copying is unavailable. Select the link and copy it." : "Share this view or take its exact counts, arrival picks, sources and limits with you."}</p>
    {showLink && <label className="share-fallback no-print">Copy this investigation URL<input ref={link} readOnly value={url} onFocus={(e) => e.target.select()} />
      <button className="signal-button" onClick={() => { link.current?.focus(); link.current?.select(); }}>Select investigation link</button></label>}
    <details className="lunar-method"><summary>Source, methods and limits</summary>
      <p>{lunarProvenance.credit}. The unchanged CSV has 13,000 rows, grouped into 3,250 events. Each is counted once. Direction and variance use geo1; all four arrival picks are preserved. No source locations are recalculated.</p>
      <p>The quality option uses the authors' ≤50 azimuth-variance plotting cutoff. This view does not reproduce every manual exclusion in the paper. Counts are selected catalog detections, not all moonquakes, a confidence percentage or seismic risk.</p>
      <p><a href={lunarProvenance.doi} target="_blank" rel="noreferrer">CaltechDATA v2.0 ↗</a> · <a href={lunarProvenance.code} target="_blank" rel="noreferrer">Authors' comparison method ↗</a> · <a href={lunarProvenance.path} download>Download unchanged CSV (2.73 MB)</a></p>
      <p className="lunar-checksum">SHA-256: {lunarProvenance.sha256}</p>
    </details>
  </section>;
}
