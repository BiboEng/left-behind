// The card for the relic in focus: photos, who/when/where, the story, quick facts, the hero
// model, and sources. Desktop: a panel on the right. Phone: a bottom sheet (see index.css).
import { useState } from "react";
import ModelViewer from "../engine/ModelViewer";
import type { Relic, RelicImage } from "../types/relic";
import ErrorBoundary from "./ErrorBoundary";
import { formatCoords, formatDate, STATUS_LABEL } from "./format";

export default function StoryCard({ relic, index, total }: { relic: Relic; index: number; total: number }) {
  return (
    // key = relic id: React builds a fresh card per relic, which restarts the fade-in
    // and resets the photo gallery and the card's scroll position.
    <article className="story-card" key={relic.id} aria-live="polite" aria-labelledby={`title-${relic.id}`}>
      {relic.images.length > 0 && <Gallery images={relic.images} />}

      <div className="story-body">
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

        {relic.model && (
          <figure className="model">
            <ErrorBoundary fallback={<p className="muted">3D model unavailable.</p>}>
              <ModelViewer path={relic.model.path} label={relic.name} />
            </ErrorBoundary>
            <figcaption className="credit">
              3D model: <a href={relic.model.sourceUrl} target="_blank" rel="noreferrer">{relic.model.credit}</a>
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

        {/* Only in `npm run dev`: a reminder that a human still has to check this relic. */}
        {import.meta.env.DEV && !relic.verified && <p className="unverified mono">Unverified (dev only)</p>}
      </div>
    </article>
  );
}

/** Main photo plus small thumbnails to switch between up to 3 photos. */
function Gallery({ images }: { images: RelicImage[] }) {
  const [current, setCurrent] = useState(0);
  const [broken, setBroken] = useState<Set<number>>(() => new Set());
  const img = images[current];

  return (
    <figure className="gallery">
      {broken.has(current) ? (
        <div className="photo photo-missing">Photo unavailable</div>
      ) : (
        <img
          className="photo"
          src={img.url}
          alt={img.caption}
          loading="lazy"
          onError={() => setBroken((b) => new Set(b).add(current))}
        />
      )}
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
