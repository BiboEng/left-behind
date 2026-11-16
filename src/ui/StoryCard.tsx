// The card for the relic in focus: photos, who/when/where, the story, quick facts, the hero
// model, and sources. Desktop: a panel on the right. Phone: a bottom sheet (see index.css).
import { lazy, Suspense, useState } from "react";
import Photo from "./Photo";
import ExplorerQuestion from "./ExplorerQuestion";
const ModelViewer = lazy(() => import("../engine/ModelViewer"));
import type { Relic, RelicImage } from "../types/relic";
import ErrorBoundary from "./ErrorBoundary";
import { formatCoords, formatDate, shortName, STATUS_LABEL, year } from "./format";
import { worlds } from "../worlds";
import { useTimeline } from "../state/timeline";
import { evidenceCases } from "../data/signal";
import { openSignal } from "../state/router";

interface Props {
  relic: Relic;
  index: number;
  total: number;
  /** The next stop in time, for the "Next stop" button at the end of the card (none on the last). */
  next?: Relic;
  /** 1 = moving forward in time (card slides up from below), -1 = moving back (slides down) */
  direction: 1 | -1;
}

export default function StoryCard({ relic, index, total, next, direction }: Props) {
  const [showModel, setShowModel] = useState(false);
  const reading = useTimeline((s) => s.mode === "reading");
  const investigation = evidenceCases.find((c) => c.relicId === relic.id);
  return (
    // key = relic id: React builds a fresh card per relic, which restarts the slide-in
    // and resets the photo gallery and the card's scroll position.
    <article
      className={`story-card ${direction > 0 ? "enter-forward" : "enter-back"}`}
      key={relic.id}
      aria-labelledby={`title-${relic.id}`}
    >
      {relic.images.length > 0 && <Gallery images={relic.images} />}

      <div className="story-body">
        {index === 0 && <aside className="chapter-note">
          <p className="kicker">The journey begins</p>
          <p>{worlds[relic.world].intro}</p>
        </aside>}
        <p className="kicker">
          {index + 1} of {total} · {worlds[relic.world].name}
        </p>
        <h2 id={`title-${relic.id}`}>{relic.name}</h2>
        <p className="mission">{relic.mission}</p>

        <dl className="meta">
          <div>
            <dt>Arrived</dt>
            <dd>{formatDate(relic.arrived)}</dd>
          </div>
          {relic.lastContact && (
            <div>
              <dt>Last contact</dt>
              <dd>{formatDate(relic.lastContact)}</dd>
            </div>
          )}
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`status status-${relic.status}`}>{STATUS_LABEL[relic.status]}</span>
            </dd>
          </div>
          <div className="wide">
            <dt>Site</dt>
            <dd>
              {relic.location.name}
              <br />
              <span className="coords">{formatCoords(relic.location.lat, relic.location.lon)}</span>
              {relic.location.precision && relic.location.precision !== "reported" && (
                <span className="location-note">
                  <strong>{relic.location.precision === "target" ? "Target region · position unknown" : "Approximate location"}</strong>
                  {relic.location.note}
                </span>
              )}
            </dd>
          </div>
        </dl>

        <p className="headline">{relic.headline}</p>
        {investigation && <button className="investigate-link" onClick={() => openSignal(investigation.id)}>
          <span className="label">Investigation · Act {Number(investigation.number)}</span>
          <span>{investigation.title}</span>
          <span className="arrow" aria-hidden>→</span>
        </button>}
        {relic.story.map((paragraph, i) => (
          <p key={i} className="story">
            {paragraph}
          </p>
        ))}

        {relic.facts.length > 0 && (
          <dl className="facts">
            {relic.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <ExplorerQuestion relicId={relic.id} />

        {relic.model && (
          <figure className="model">
            {!reading && (showModel ? (
              <ErrorBoundary fallback={<p className="muted">3D model unavailable. Open the NASA source below.</p>}>
                <Suspense fallback={<p className="muted" role="status">Loading model viewer…</p>}>
                  <ModelViewer path={relic.model.path} label={relic.name} />
                </Suspense>
              </ErrorBoundary>
            ) : <button className="back model-load" onClick={() => setShowModel(true)}>Explore NASA's 3D model</button>)}
            <figcaption className="credit">
              3D model: <a href={relic.model.sourceUrl} target="_blank" rel="noreferrer">{relic.model.credit}</a>
              {relic.model.description && <span className="model-description">{relic.model.description}</span>}
            </figcaption>
          </figure>
        )}

        {relic.sources.length > 0 && (
          <section className="sources">
            <h3>Sources</h3>
            <ul>
              {relic.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* An explicit way on at the end of the card, so finishing a story is a choice rather than
            one scroll too many. */}
        {next && <button className="next-stop" onClick={() => useTimeline.getState().jumpToRelic(next.id)}>
          <span className="label">Next stop · {year(next.arrived)}</span>
          <span>{shortName(next.name)}</span>
          <span className="arrow" aria-hidden>→</span>
        </button>}

        {index === total - 1 && <aside className="chapter-note journey-end">
          <p className="kicker">The story continues</p>
          <p>{worlds[relic.world].outro}</p>
          <div className="journey-actions">
            <button className="btn btn-primary" onClick={() => useTimeline.getState().setWorld(relic.world === "moon" ? "mars" : "moon")}>
              Travel to {relic.world === "moon" ? "Mars" : "the Moon"} <span className="arrow" aria-hidden>→</span>
            </button>
            <button className="btn" onClick={() => openSignal()}>Open the investigations</button>
          </div>
        </aside>}
        {/* Only in `npm run dev`: a reminder that a human still has to check this relic. */}
        {import.meta.env.DEV && !relic.verified && <p className="unverified mono">Unverified (dev only)</p>}
      </div>
    </article>
  );
}

/** Main photo plus small thumbnails to switch between up to 3 photos. */
function Gallery({ images }: { images: RelicImage[] }) {
  const [current, setCurrent] = useState(0);
  const img = images[current];

  return (
    <figure className="gallery">
      <Photo key={img.url} image={img} />
      <figcaption>
        {img.caption}{" "}
        <span className="credit">
          <a href={img.sourceUrl} target="_blank" rel="noreferrer">
            {img.credit}
          </a>
        </span>
      </figcaption>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((im, i) => (
            <button
              key={im.url}
              className={i === current ? "active" : ""}
              onClick={() => setCurrent(i)}
              aria-label={`Photo ${i + 1} of ${images.length}`}
              aria-pressed={i === current}
            >
              <img src={im.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
