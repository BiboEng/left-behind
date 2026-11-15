// An editorial entry into a guided documentary, with the original atlas still one click away.
import { type CSSProperties } from "react";
import { relics } from "../data";
import { signalMedia, signalSources } from "../data/signal";
import { openSignal } from "../state/router";
import { useTimeline } from "../state/timeline";
import type { World } from "../types/relic";
import { worlds } from "../worlds";
import { CreditsButton } from "./Credits";
import { year } from "./format";
import MissionIndex from "./MissionIndex";
import OfflinePack from "./OfflinePack";
import "./landing.css";

const CHOICES: World[] = ["moon", "mars"];

export default function Landing() {
  const setWorld = useTimeline((s) => s.setWorld);
  const mode = useTimeline((s) => s.mode);
  const hero = signalMedia.insightSelfie;

  return (
    <main className="landing documentary-landing">
      <header className="landing-masthead">
        <span className="landing-wordmark">Left Behind</span>
        <span className="mono">A NASA open-data documentary</span>
        <CreditsButton className="credits-link" />
      </header>
      <section className="landing-documentary" aria-labelledby="landing-title">
        <div className="landing-editorial">
          <p className="landing-kicker mono">The hardware stayed. The knowledge travelled.</p>
          <h1 id="landing-title">What survives<br />the last signal?</h1>
          <p className="landing-deck">On the Moon and Mars, machines have gone silent. Their photographs, discoveries and records are still changing the story.</p>
          <button className="landing-primary" onClick={() => openSignal()}>
            <span>Enter After the Signal</span><span aria-hidden>↗</span>
          </button>
          <p className="landing-duration mono">Four investigations · Two worlds · A story to take home</p>
        </div>
        <figure className="landing-archive">
          <img src={hero.path} alt={hero.alt} fetchPriority="high" />
          <figcaption>
            <span className="mono">InSight <span aria-hidden> / </span> 24 April 2022</span>
            <p>The final selfie. The beginning of another way to see what was left behind.</p>
            <a href={signalSources[hero.source].url} target="_blank" rel="noreferrer">{hero.credit} <span aria-hidden>↗</span></a>
          </figcaption>
        </figure>
      </section>
      <section className="landing-atlas" aria-labelledby="atlas-title">
        <div className="atlas-introduction"><p className="landing-kicker mono">Or follow your own orbit</p>
          <h2 id="atlas-title">Explore the atlas.</h2>
          <p>{relics.moon.length + relics.mars.length} selected NASA relics. Real locations, stories, sources and optional 3D models.</p>
        </div>
        <div className="choices">
          {CHOICES.map((w) => {
            const list = relics[w];
            return <button key={w} className="choice" onClick={() => setWorld(w)}
              style={{ "--accent": worlds[w].accent } as CSSProperties}>
              <span className="choice-name">{worlds[w].name}<span aria-hidden>↗</span></span>
              <span className="choice-tagline">{worlds[w].tagline}</span>
              <small>{list.length} relics · {year(list[0].arrived)}–{year(list[list.length - 1].arrived)}</small>
            </button>;
          })}
        </div>
      </section>
      <OfflinePack />
      <footer className="landing-actions">
        <MissionIndex className="credits-link" />
        <button className="credits-link" aria-pressed={mode === "reading"}
          onClick={() => useTimeline.getState().setMode(mode === "reading" ? "globe" : "reading")}>
          {mode === "reading" ? "Reading mode on" : "Read without 3D"}
        </button>
        <span className="mono">No account needed · Sources stay attached</span>
      </footer>
    </main>
  );
}
