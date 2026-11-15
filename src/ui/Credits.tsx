// The Credits screen: every globe texture, NASA archive, 3D model and photo we use, built from
// the data (src/data/credits.ts), so new relics are credited without touching this file.
//
// It's a native <dialog> opened with showModal(): the browser keeps keyboard focus inside it,
// closes it on Esc, and blocks clicks to the globe behind it. It's rendered outside the overlay
// (see App.tsx), so scrolling the credits never scrolls the timeline.
import { useEffect, useMemo, useRef } from "react";
import { buildCredits, type DatasetUse } from "../data/credits";
import { useCredits } from "../state/credits";

export default function Credits() {
  const open = useCredits((s) => s.open);
  return open ? <CreditsDialog /> : null;
}

/** Small text button that opens the credits (title screen and top bar). */
export function CreditsButton({ className }: { className?: string }) {
  const setOpen = useCredits((s) => s.setOpen);
  return (
    <button className={className} onClick={() => setOpen(true)}>
      Credits
    </button>
  );
}

function CreditsDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const setOpen = useCredits((s) => s.setOpen);
  const credits = useMemo(() => buildCredits(), []);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="credits"
      aria-labelledby="credits-title"
      // "close" fires for the Close button, Esc and backdrop clicks alike.
      onClose={() => setOpen(false)}
      // A click on the dialog element itself (not its content) is a click on the dimmed backdrop.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <header className="credits-head">
        <h2 id="credits-title">Credits</h2>
        <button className="back" onClick={() => ref.current?.close()} autoFocus>
          Close
        </button>
      </header>

      <div className="credits-body">
        <p className="credits-lead">
          Everything in Left Behind is real. The globes, photos, models and facts come from NASA open data and from
          the agencies that flew each mission.
        </p>

        {credits.textures.length > 0 && (
          <section>
            <h3>Globes</h3>
            <ul className="credit-list">
              {credits.textures.map((t) => (
                <li key={t.world}>
                  <strong>{t.name}</strong>
                  <a href={t.url} target="_blank" rel="noreferrer">
                    {t.credit}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3>Data archives</h3>
          <ul className="credit-list">
            {credits.datasets.map((use) => (
              <li key={use.dataset.url}>
                <a href={use.dataset.url} target="_blank" rel="noreferrer">
                  {use.dataset.name}
                </a>
                <span className="credit-count mono">{describeUse(use)}</span>
              </li>
            ))}
          </ul>
          {credits.otherSources > 0 && (
            <p className="credits-note">
              Plus {credits.otherSources} sources from other space agencies, journals and news outlets, linked on each
              relic's card.
            </p>
          )}
        </section>

        {credits.models.length > 0 && (
          <section>
            <h3>3D models</h3>
            <ul className="credit-list">
              {credits.models.map((m) => (
                <li key={m.relic.id}>
                  <strong>{m.relic.name}</strong>
                  <a href={m.url} target="_blank" rel="noreferrer">
                    {m.credit}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3>Photos ({credits.photoCount})</h3>
          {credits.photos.map((group) => (
            <div key={group.world} className="photo-group">
              <h4>{group.name}</h4>
              <dl className="photo-credits">
                {group.relics.map(({ relic, images }) => (
                  <div key={relic.id}>
                    <dt>{relic.name}</dt>
                    <dd>
                      <ul>
                        {images.map((img) => (
                          <li key={img.url}>
                            <a href={img.sourceUrl} target="_blank" rel="noreferrer">
                              {img.credit}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </section>

        <section>
          <h3>Made by</h3>
          <p className="credits-note">
            Ibrahim and Rayan, for a NASA open data hackathon. Built with React, three.js, React Three Fiber and drei.
          </p>
          <p className="credits-note">
            Left Behind is not affiliated with or endorsed by NASA. Every image and model belongs to the owner credited
            above.
          </p>
        </section>
      </div>
    </dialog>
  );
}

/** "12 photos · 4 sources" */
function describeUse(use: DatasetUse): string {
  const parts: [number, string, string][] = [
    [use.textures, "globe texture", "globe textures"],
    [use.models, "3D model", "3D models"],
    [use.photos, "photo", "photos"],
    [use.sources, "source", "sources"],
  ];
  return parts
    .filter(([n]) => n > 0)
    .map(([n, one, many]) => `${n} ${n === 1 ? one : many}`)
    .join(" · ");
}
