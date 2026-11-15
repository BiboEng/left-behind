// AI-assisted with Devin. Isolate retry timers so switching relics/photos cancels stale work.
import { useEffect, useState } from "react";
import type { RelicImage } from "../types/relic";

const MAX_RETRIES = 2;

export default function Photo({ image }: { image: RelicImage }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  const exhausted = state === "failed" && attempt >= MAX_RETRIES;
  useEffect(() => {
    if (state !== "failed" || attempt >= MAX_RETRIES) return;
    const timer = window.setTimeout(() => {
      setAttempt((n) => n + 1);
      setState("loading");
    }, 700 * (attempt + 1));
    return () => window.clearTimeout(timer);
  }, [state, attempt]);

  const url = new URL(image.url);
  if (attempt) url.searchParams.set("retry", String(attempt));

  return <div className="photo-frame">
    {exhausted ? <div className="photo photo-missing">
      <p>Photo unavailable. The story and NASA source are still here.</p>
      <button className="back" onClick={() => { setAttempt(0); setState("loading"); }}>Retry photo</button>
      <a href={image.sourceUrl} target="_blank" rel="noreferrer">Open NASA source <span aria-hidden>↗</span></a>
    </div> : <>
      {state !== "loaded" && <span className="photo-loading mono" role="status">Loading NASA photo…</span>}
      {/* The caption immediately below describes this image without repeating it to screen readers. */}
      <img key={attempt} className={`photo ${state === "loaded" ? "loaded" : ""}`}
        src={url.href} alt="" loading="lazy"
        onLoad={() => setState("loaded")} onError={() => setState("failed")} />
    </>}
  </div>;
}
