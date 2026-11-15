// A deliberate documentary route: real records first, interpretations and uncertainty alongside.
import { useEffect, useRef } from "react";
import { caseById, evidenceCases, signalMedia, type CaseId, type SignalChapter } from "../../data/signal";
import { openAtlas, openSignal } from "../../state/router";
import { useSignal } from "../../state/signal";
import { CreditsButton } from "../Credits";
import OfflinePack from "../OfflinePack";
import ArchiveFigure from "./ArchiveFigure";
import Exhibition from "./Exhibition";
import Investigation from "./Investigation";
import "./signal.css";

export default function SignalRoom({ chapter }: { chapter: SignalChapter }) {
  const cards = useSignal((s) => s.cards);
  const main = useRef<HTMLElement>(null);
  const item = caseById.get(chapter as CaseId);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${item?.title ?? (chapter === "exhibit" ? "Your exhibition" : "After the Signal")} | Left Behind`;
    main.current?.scrollTo(0, 0);
    main.current?.querySelector<HTMLElement>("#signal-heading")?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [chapter, item]);

  return <main className="signal-shell" ref={main}>
    <button className="signal-skip" onClick={() => main.current?.querySelector<HTMLElement>("#signal-heading")?.focus()}>Skip to investigation</button>
    <header className="signal-header">
      <button className="signal-brand" onClick={openAtlas}>Left Behind <span>After the Signal</span></button>
      <div><button className="back" onClick={openAtlas}>Explore the atlas <span aria-hidden>↗</span></button>
        <CreditsButton className="back" /></div>
    </header>
    <div className="signal-body">
      <nav className="signal-nav" aria-label="After the Signal chapters">
        <p className="eyebrow">The evidence room</p>
        <button aria-current={chapter === "intro" ? "page" : undefined} onClick={() => openSignal("intro")}>
          <span className="nav-number">00</span><span className="nav-label">The question</span>
        </button>
        {evidenceCases.map((entry) => <button key={entry.id} aria-current={chapter === entry.id ? "page" : undefined}
          aria-label={`Act ${entry.number}: ${entry.shortTitle}`} onClick={() => openSignal(entry.id)}>
          <span className="nav-number">{entry.number}</span><span className="nav-label">{entry.shortTitle}
            {cards.includes(entry.id) && <small>In your exhibition</small>}</span>
          {cards.includes(entry.id) && <span className="nav-collected" aria-label="Collected">•</span>}
        </button>)}
        <button className="nav-exhibit" aria-current={chapter === "exhibit" ? "page" : undefined} onClick={() => openSignal("exhibit")}>
          <span className="nav-number">{cards.length}/{evidenceCases.length}</span><span className="nav-label">Your exhibition</span>
        </button>
        <p className="nav-footnote">Four investigations.<br />A mission can outlive<br />its hardware.</p>
      </nav>
      <div className="signal-content">
        {chapter === "intro" ? <Introduction /> : chapter === "exhibit" ? <Exhibition /> : item ? <Investigation key={item.id} item={item} /> : null}
        <footer className="signal-footer">
          <OfflinePack />
          <p>Real NASA records. Human questions.</p>
          <p>Photographs and audio are credited at the point of use. Interpretations are editorial; sources and limits stay attached.</p>
          <CreditsButton className="text-link" />
        </footer>
      </div>
    </div>
  </main>;
}

function Introduction() {
  return <article className="signal-introduction">
    <p className="eyebrow">An interactive documentary <span> / </span> Moon + Mars</p>
    <h1 id="signal-heading" tabIndex={-1}>They went silent.<br /><span>Their evidence didn't.</span></h1>
    <p className="signal-lead">A photograph cut short. A scar in the soil. A tremor from another world. The hardware stayed behind, but these records made it home.</p>
    <div className="intro-feature">
      <ArchiveFigure media={signalMedia.insightSelfie} eager />
      <div>
        <p className="eyebrow">The question worth bringing back</p>
        <h2>When does a mission really end?</h2>
        <p>Inspect four real records. Separate what was measured from what it means. Return to an Apollo archive, then build an exhibition about what survives the last signal.</p>
        <button className="signal-button primary" onClick={() => openSignal("ranger")}>Open the first record <span aria-hidden>→</span></button>
        <p className="intro-note">No timers. No scores. Listen, look closely, and keep the evidence that changes your view.</p>
      </div>
    </div>
    <div className="intro-cases">
      {evidenceCases.map((item) => <button key={item.id} onClick={() => openSignal(item.id)}>
        <span className="eyebrow">{item.number} <span> / </span> {item.world === "moon" ? "Moon" : "Mars"}</span>
        <strong>{item.shortTitle}</strong><span>{item.question}</span><span className="intro-arrow" aria-hidden>↗</span>
      </button>)}
    </div>
  </article>;
}
