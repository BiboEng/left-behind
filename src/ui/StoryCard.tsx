// The card for the relic in focus: photos, who/when/where, the story, quick facts, the hero
// model, and sources. Desktop: a panel on the right. Phone: a bottom sheet (see index.css).
import { lazy, Suspense, useState } from "react";
import Photo from "./Photo";
import ExplorerQuestion from "./ExplorerQuestion";
const ModelViewer = lazy(() => import("../engine/ModelViewer"));
import type { Relic, RelicImage } from "../types/relic";
import ErrorBoundary from "./ErrorBoundary";
import { formatCoords, formatDate, STATUS_LABEL } from "./format";
import { worlds } from "../worlds";
import { useTimeline } from "../state/timeline";

interface Props {
  relic: Relic;
  index: number;
  total: number;
  /** 1 = moving forward in time (card slides up from below), -1 = moving back (slides down) */
  direction: 1 | -1;
}

export default function StoryCard({ relic, index, total, direction }: Props) {
  const [showModel, setShowModel] = useState(false);
  const reading = useTimeline((s) => s.mode === "reading");
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
          <p className="kicker mono">The journey begins · {worlds[relic.world].name}</p>
          <p>{worlds[relic.world].intro}</p>
        </aside>}
        <p className="kicker mono">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {relic.agency}
        </p>
        <h2 id={`title-${relic.id}`}>{relic.name}</h2>
        <p className="mission">{relic.mission}</p>

        <dl className="meta mono">
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

        {index === total - 1 && <aside className="chapter-note journey-end">
          <p className="kicker mono">The story continues</p>
          <p>{worlds[relic.world].outro}</p>
          <button className="back" onClick={() => useTimeline.getState().setWorld(relic.world === "moon" ? "mars" : "moon")}>
            Explore {relic.world === "moon" ? "Mars" : "the Moon"} <span aria-hidden>→</span>
          </button>
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
