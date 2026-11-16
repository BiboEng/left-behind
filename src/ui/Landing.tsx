// The front door: one strong archive image, one question, two clear ways in.
import { type CSSProperties } from "react";
import { relics } from "../data";
import { evidenceCases, signalMedia, signalSources } from "../data/signal";
import { openSignal } from "../state/router";
import { useTimeline } from "../state/timeline";
import type { World } from "../types/relic";
import { worlds } from "../worlds";
import { CreditsButton } from "./Credits";
import { year } from "./format";
import MissionIndex from "./MissionIndex";
import OfflinePack from "./OfflinePack";
import "./landing.css";

const WORLD_IMAGE: Record<World, keyof typeof signalMedia> = { moon: "apolloLander", mars: "spiritSoil" };

export default function Landing() {
  const setWorld = useTimeline((s) => s.setWorld);
  const mode = useTimeline((s) => s.mode);
  const hero = signalMedia.insightSelfie;
  const total = relics.moon.length + relics.mars.length;
  const showWays = () => document.getElementById("ways-in")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="landing documentary-landing">
      <header className="site-header">
        <span className="wordmark display">Left Behind</span>
        <nav aria-label="Main">
          <button onClick={() => openSignal()}>Investigations</button>
          <button onClick={() => setWorld("moon")}>Moon</button>
          <button onClick={() => setWorld("mars")}>Mars</button>
          <MissionIndex className="nav-search" />
          <CreditsButton className="nav-quiet" />
        </nav>
      </header>

      <section className="hero" aria-labelledby="landing-title">
        <div className="hero-text">
          <p className="label">A NASA open-data documentary · Moon and Mars</p>
          <h1 id="landing-title" className="display">Left Behind</h1>
          <p className="hero-question display">What survives the last signal?</p>
          <p className="hero-deck">NASA's machines on the Moon and Mars have gone silent. Their photographs, measurements and recordings are still changing what we know.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => openSignal()}>Start investigating <span className="arrow" aria-hidden>→</span></button>
            <button className="btn" onClick={showWays}>Choose a world</button>
          </div>
          <p className="hero-meta">{evidenceCases.length} investigations · {total} machines · no sign-in</p>
        </div>
        <figure className="hero-figure">
          <div className="hero-frame"><img src={hero.path} alt={hero.alt} fetchPriority="high" /></div>
          <figcaption>
            InSight's final selfie, 24 April 2022. <a href={signalSources[hero.source].url} target="_blank" rel="noreferrer">{hero.credit}</a>
          </figcaption>
        </figure>
      </section>

      <section className="ways" id="ways-in" aria-labelledby="ways-title">
        <h2 id="ways-title" className="display">Three ways in</h2>
        <div className="ways-grid">
          <button className="way surface" onClick={() => openSignal()}>
            <img src={signalMedia.rangerLast.path} alt="" loading="lazy" />
            <span className="label">Investigations · After the Signal</span>
            <strong className="display">Four records that outlived their machines</strong>
            <span className="way-text">A last photograph, a scar in the soil, a marsquake and an Apollo mystery. Then build your own exhibition.</span>
            <span className="way-go">Begin <span className="arrow" aria-hidden>→</span></span>
          </button>
          {(["moon", "mars"] as World[]).map((w) => {
            const list = relics[w];
            return <button key={w} className="way surface" onClick={() => setWorld(w)} style={{ "--accent": worlds[w].accent } as CSSProperties}>
              <img src={signalMedia[WORLD_IMAGE[w]].path} alt="" loading="lazy" />
              <span className="label">The atlas · {list.length} machines · {year(list[0].arrived)}–{year(list[list.length - 1].arrived)}</span>
              <strong className="display">{worlds[w].name}</strong>
              <span className="way-text">{worlds[w].tagline}</span>
              <span className="way-go">Travel through time <span className="arrow" aria-hidden>→</span></span>
            </button>;
          })}
        </div>
        {/* Right under the choices it affects, not down in the footer. */}
        <p className="ways-reading">
          {mode === "reading" ? "Reading mode is on: Moon and Mars open as text, without the 3D globe." : "Prefer text only?"}{" "}
          <button className="link" aria-pressed={mode === "reading"}
            onClick={() => useTimeline.getState().setMode(mode === "reading" ? "globe" : "reading")}>
            {mode === "reading" ? "Use the globe" : "Read without 3D"}
          </button>
        </p>
      </section>

      <OfflinePack />

      <footer className="site-footer">
        <a className="link" href="/classroom/" target="_blank" rel="noreferrer">Classroom guide</a>
        <span>Real NASA records. Sources stay attached.</span>
      </footer>
    </main>
  );
}
