import { useState } from "react";
import { signalSources, type EvidenceMedia } from "../../data/signal";

export default function ArchiveFigure({ media, className = "", eager = false }: { media: EvidenceMedia; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <figure className={`archive-figure ${className}`}>
    {failed ? <div className="archive-missing" role="status">
      The archive image is unavailable. Its description and source remain below.
      <button type="button" className="back" onClick={() => setFailed(false)}>Retry image</button>
    </div> : <img src={media.path} alt={media.alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} />}
    <figcaption>
      <p>{media.caption}</p>
      <a href={signalSources[media.source].url} target="_blank" rel="noreferrer">{media.credit} <span aria-hidden>↗</span></a>
    </figcaption>
  </figure>;
}
