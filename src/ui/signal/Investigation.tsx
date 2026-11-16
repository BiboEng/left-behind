// The reader can inspect the record before revealing its interpretation.
import { lazy, Suspense, useState } from "react";
import { relicById } from "../../data";
import { shortName } from "../format";
import { evidenceCases, signalMedia, signalSources, type EvidenceCase } from "../../data/signal";
import { openSignal } from "../../state/router";
import { useSignal } from "../../state/signal";
import { useTimeline } from "../../state/timeline";
import ArchiveFigure from "./ArchiveFigure";
import SeismicRecord from "./SeismicRecord";

// The catalog is downloaded only when this chapter is opened, never on the landing page.
const LunarLab = lazy(() => import("./LunarLab"));

export default function Investigation({ item }: { item: EvidenceCase }) {
  const cards = useSignal((s) => s.cards);
  const selected = cards.includes(item.id);
  const [revealed, setRevealed] = useState(false);
  const [rangerFrame, setRangerFrame] = useState<"first" | "last">("last");
  const [spiritView, setSpiritView] = useState<"camera" | "chemistry">("camera");
  const next = evidenceCases[evidenceCases.findIndex((entry) => entry.id === item.id) + 1];
  const relic = relicById.get(item.relicId);

  return <article className={`investigation investigation-${item.id}`}>
    <header className="investigation-heading">
      <p className="eyebrow">Act {Number(item.number)} of {evidenceCases.length} <span>·</span> {item.world === "moon" ? "The Moon" : "Mars"} <span>·</span> {item.date}</p>
      <p className="signal-question">{item.question}</p>
      <h1 id="signal-heading" tabIndex={-1}>{item.title}</h1>
      <p className="signal-lead">{item.lead}</p>
    </header>

    <div className="investigation-grid">
      <div className="artifact-column">
        {item.id === "ranger" && <>
          <div className="artifact-tabs" role="group" aria-label="Ranger archive photograph">
            <button aria-pressed={rangerFrame === "first"} onClick={() => setRangerFrame("first")}>First view</button>
            <button aria-pressed={rangerFrame === "last"} onClick={() => setRangerFrame("last")}>Last transmission</button>
          </div>
          <ArchiveFigure key={rangerFrame} media={rangerFrame === "first" ? signalMedia.rangerFirst : signalMedia.rangerLast} eager className="ranger-record" />
          <div className="archive-fact"><span className="archive-number">0.19<span>s</span></span>
            <p>The top frame was exposed this close to impact. Its missing portion is part of the evidence.</p>
          </div>
        </>}
        {item.id === "spirit" && <>
          <div className="artifact-tabs" role="group" aria-label="Spirit evidence view">
            <button aria-pressed={spiritView === "camera"} onClick={() => setSpiritView("camera")}>What the camera saw</button>
            <button aria-pressed={spiritView === "chemistry"} onClick={() => setSpiritView("chemistry")}>What the instrument measured</button>
          </div>
          {spiritView === "camera" ? <ArchiveFigure media={signalMedia.spiritSoil} eager /> :
            <section className="chemistry-record" aria-label="Spirit reported silica measurement">
              <p className="eyebrow">Alpha particle X-ray spectrometer</p>
              <p className="chemistry-number"><span>~</span>90<span>%</span></p>
              <h2>Silica in the analysed soil.</h2>
              <div className="chemistry-bar" role="img" aria-label="About 90 percent silica, as reported by the Spirit science team in May 2007">
                <span />
              </div>
              <p>Reported by the science team in May 2007. This is a rounded composition result, not a value calculated from the photograph.</p>
              <p>The miniature thermal emission spectrometer first identified a high-silica signature; the team then examined the soil with the instrument on Spirit's arm.</p>
              <a href={signalSources.spiritChemistry.url} target="_blank" rel="noreferrer">Read the instrument evidence at JPL ↗</a>
            </section>}
        </>}
        {item.id === "insight" && <SeismicRecord />}
        {item.id === "apollo" && <ArchiveFigure media={signalMedia.apolloLander} eager />}
      </div>

      <div className="evidence-column">
        <section className="evidence-step">
          <p className="step-label"><span>1</span> What arrived on Earth</p>
          <p>{item.observation}</p>
        </section>
        <button className="btn reveal-button" aria-expanded={revealed} aria-controls="evidence-interpretation"
          onClick={() => setRevealed(!revealed)}>
          {revealed ? "Hide what scientists concluded" : "What did scientists conclude?"} <span aria-hidden>{revealed ? "−" : "+"}</span>
        </button>
        <div id="evidence-interpretation" hidden={!revealed}>
          <section className="evidence-step interpretation">
            <p className="step-label"><span>2</span> What it means</p>
            <p>{item.interpretation}</p>
          </section>
          <section className="evidence-step evidence-limit">
            <p className="step-label"><span>3</span> Where the evidence stops</p>
            <p>{item.limit}</p>
          </section>
        </div>
        <section className="evidence-sources" aria-label="Primary sources for this investigation">
          <h2 className="step-label">Sources</h2>
          <ol>{item.sources.map((key) => <li key={key}><a href={signalSources[key].url} target="_blank" rel="noreferrer">{signalSources[key].title} <span aria-hidden>↗</span></a></li>)}</ol>
        </section>
        {item.partner && <aside className="partner-note" aria-label={item.partner.label}>
          <h2 className="eyebrow">{item.partner.label}</h2>
          <p>{item.partner.text}</p>
          <a href={signalSources[item.partner.source].url} target="_blank" rel="noreferrer">{signalSources[item.partner.source].title} <span aria-hidden>↗</span></a>
        </aside>}
        {/* → not ↗: this stays in the app (↗ is kept for links that open a new tab). */}
        <button className="text-link locate-relic" onClick={() => useTimeline.getState().jumpToRelic(item.relicId)}>
          Find {relic ? shortName(relic.name) : "this machine"} on the {item.world === "moon" ? "Moon" : "Mars"} globe <span aria-hidden>→</span>
        </button>
      </div>
    </div>

    {item.id === "apollo" && <Suspense fallback={<p role="status">Opening the Apollo catalog…</p>}><LunarLab /></Suspense>}

    <section className="legacy-panel">
      <p className="eyebrow">What the machine left us</p>
      <h2>{item.legacy}</h2>
      <p>{item.reflection}</p>
      <div className="legacy-actions">
        <button className={`btn ${selected ? "is-collected" : ""}`} aria-pressed={selected}
          onClick={() => useSignal.getState().toggleCard(item.id)}>
          {selected ? "Kept in your exhibition" : "Keep this story"} <span aria-hidden>{selected ? "✓" : "+"}</span>
        </button>
        <button className="btn btn-primary next-act" onClick={() => openSignal(next?.id ?? "exhibit")}>
          {next ? <>Act {Number(next.number)}: {next.shortTitle}</> : "Build your exhibition"} <span className="arrow" aria-hidden>→</span>
        </button>
      </div>
      <p className="collection-note" role="status">{cards.length} of {evidenceCases.length} stories in your exhibition. You choose what to keep.</p>
    </section>
  </article>;
}
