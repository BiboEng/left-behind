// A deliberate documentary route: real records first, interpretations and uncertainty alongside.
import { useEffect, useRef } from "react";
import { caseById, evidenceCases, signalMedia, type CaseId, type SignalChapter } from "../../data/signal";
import { openAtlas, openSignal } from "../../state/router";
import { useTimeline } from "../../state/timeline";
import MissionIndex from "../MissionIndex";
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
  const order: SignalChapter[] = ["intro", ...evidenceCases.map((c) => c.id), "exhibit"];
  const progress = Math.max(0, order.indexOf(chapter)) / (order.length - 1);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${item?.title ?? (chapter === "exhibit" ? "Your exhibition" : "After the Signal")} | Left Behind`;
    main.current?.scrollTo(0, 0);
    main.current?.querySelector<HTMLElement>("#signal-heading")?.focus({ preventScroll: true });
    // On narrow screens the stepper scrolls sideways: keep the current chapter in view.
    const steps = main.current?.querySelector<HTMLElement>(".chapter-steps");
    const current = steps?.querySelector<HTMLElement>("[aria-current]");
    if (steps && current) steps.scrollLeft = current.offsetLeft - (steps.clientWidth - current.offsetWidth) / 2;
    return () => { document.title = previousTitle; };
  }, [chapter, item]);

  return <main className="signal-shell" ref={main}>
    <button className="signal-skip" onClick={() => main.current?.querySelector<HTMLElement>("#signal-heading")?.focus()}>Skip to investigation</button>
    <header className="site-header signal-site-header">
      <button className="wordmark display" onClick={openAtlas}>Left Behind</button>
      <nav aria-label="Main">
        <button aria-current="page" onClick={() => openSignal("intro")}>The story</button>
        <button onClick={() => useTimeline.getState().setWorld("moon")}>Moon</button>
        <button onClick={() => useTimeline.getState().setWorld("mars")}>Mars</button>
        <MissionIndex className="nav-search" />
        <CreditsButton className="nav-quiet" />
      </nav>
    </header>
    <nav className="chapter-steps" aria-label="After the Signal chapters">
      <ol>
        <li><button aria-current={chapter === "intro" ? "page" : undefined} onClick={() => openSignal("intro")}>
          <span className="step-num">Prologue</span><span className="step-name">The question</span>
        </button></li>
        {evidenceCases.map((entry, i) => <li key={entry.id}><button aria-current={chapter === entry.id ? "page" : undefined} onClick={() => openSignal(entry.id)}>
          <span className="step-num">Act {i + 1}{cards.includes(entry.id) && <span className="step-kept" aria-label=", kept in your exhibition"> · kept</span>}</span>
          <span className="step-name">{entry.shortTitle}</span>
        </button></li>)}
        <li><button aria-current={chapter === "exhibit" ? "page" : undefined} onClick={() => openSignal("exhibit")}>
          <span className="step-num">Finale · {cards.length}/{evidenceCases.length}</span><span className="step-name">Your exhibition</span>
        </button></li>
      </ol>
      <div className="chapter-progress" aria-hidden><span style={{ width: `${progress * 100}%` }} /></div>
    </nav>
    <div className="signal-body">
      <div className="signal-content">
        {chapter === "intro" ? <Introduction /> : chapter === "exhibit" ? <Exhibition /> : item ? <Investigation key={item.id} item={item} /> : null}
        <footer className="signal-footer">
          {(chapter === "intro" || chapter === "exhibit") && <OfflinePack />}
          <p>Real NASA records, credited where they appear. Interpretations are editorial; sources and limits stay attached. <CreditsButton className="text-link" /></p>
        </footer>
      </div>
    </div>
  </main>;
}

function Introduction() {
  return <article className="signal-introduction">
    <p className="eyebrow">Prologue</p>
    <h1 id="signal-heading" tabIndex={-1}>They went silent.<br /><span>Their evidence didn't.</span></h1>
    <p className="signal-lead">A photograph cut short. A scar in the soil. A tremor from another world. A lander that kept shaking after everyone left. The hardware stayed behind, but these records made it home.</p>
    <div className="intro-feature">
      <ArchiveFigure media={signalMedia.insightSelfie} eager />
      <div>
        <h2>When does a mission really end?</h2>
        <p>In four short acts, look at a real NASA record, decide what it shows, then reveal what scientists concluded and where the evidence stops. Keep the stories that change your mind. At the end, they become an exhibition you can share or print.</p>
        <button className="btn btn-primary" onClick={() => openSignal("ranger")}>Begin Act 1 <span className="arrow" aria-hidden>→</span></button>
        <p className="intro-note">No timers, no scores. Sound is optional.</p>
      </div>
    </div>
    <h2 className="acts-title">The four acts</h2>
    <ol className="intro-cases">
      {evidenceCases.map((item, i) => <li key={item.id}><button onClick={() => openSignal(item.id)}>
        <span className="act-number" aria-hidden>{i + 1}</span>
        <img src={signalMedia[item.media].path} alt="" loading="lazy" />
        <span className="act-text">
          <span className="act-meta">{item.world === "moon" ? "The Moon" : "Mars"} · {item.date}</span>
          <strong>{item.shortTitle}</strong>
          <span>{item.question}</span>
        </span>
        <span className="intro-arrow" aria-hidden>→</span>
      </button></li>)}
    </ol>
  </article>;
}
