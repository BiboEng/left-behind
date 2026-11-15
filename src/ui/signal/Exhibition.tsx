import { useRef, useState } from "react";
import { exhibitionText } from "../../data/exhibition";
import { caseById, evidenceCases, signalAudio, signalMedia, signalSources } from "../../data/signal";
import { openSignal, signalUrl } from "../../state/router";
import { DEFAULT_EXHIBIT_TITLE, MAX_CAPTION, MAX_TITLE, useSignal } from "../../state/signal";
import ArchiveFigure from "./ArchiveFigure";

export default function Exhibition() {
  const cards = useSignal((s) => s.cards);
  const title = useSignal((s) => s.title);
  const caption = useSignal((s) => s.caption);
  const [copied, setCopied] = useState("");
  const [fallback, setFallback] = useState(false);
  const linkInput = useRef<HTMLInputElement>(null);
  const url = signalUrl("exhibit").href;
  const selected = cards.flatMap((id) => { const item = caseById.get(id); return item ? [item] : []; });

  const copy = async () => {
    setCopied("");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setFallback(false);
    } catch {
      setFallback(true);
    }
  };
  const download = () => {
    const blob = new Blob([exhibitionText({ cards, title, caption })], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "left-behind-exhibition.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  return <article className="exhibition">
    <header className="exhibition-heading">
      <p className="eyebrow">The final act <span> / </span> Curated by you</p>
      <h1 id="signal-heading" tabIndex={-1}>The machines stay.<br />The story travels.</h1>
      <p className="signal-lead">Choose the evidence worth carrying forward. Give it a title, leave a question, and share a small exhibition with its sources intact.</p>
    </header>
    <section className="exhibit-editor no-print" aria-label="Curate your exhibition">
      <fieldset>
        <legend>Choose your stories <span className="mono">{cards.length} / {evidenceCases.length}</span></legend>
        <div className="exhibit-choices">
          {evidenceCases.map((item) => <label key={item.id}>
            <input type="checkbox" checked={cards.includes(item.id)} onChange={() => useSignal.getState().toggleCard(item.id)} />
            <span><span className="eyebrow">{item.number} · {item.world === "moon" ? "Moon" : "Mars"}</span><strong>{item.shortTitle}</strong></span>
          </label>)}
        </div>
      </fieldset>
      <div className="exhibit-inputs">
        <label>Exhibition title
          <input value={title} maxLength={MAX_TITLE} onChange={(e) => useSignal.getState().setTitle(e.target.value)}
            placeholder={DEFAULT_EXHIBIT_TITLE} />
        </label>
        <label>Your caption or question <span className="muted">— optional; included in your shared link</span>
          <textarea rows={3} value={caption} maxLength={MAX_CAPTION}
            onChange={(e) => useSignal.getState().setCaption(e.target.value)}
            placeholder="What does it mean for a mission to succeed?" />
          <span className="input-limit mono">{caption.length} / {MAX_CAPTION}</span>
        </label>
      </div>
      <div className="exhibit-actions">
        <button className="signal-button primary" disabled={!cards.length} onClick={copy}>{copied === url ? "Exhibition link copied" : "Copy exhibition link"} <span aria-hidden>↗</span></button>
        <button className="signal-button" disabled={!cards.length} onClick={() => window.print()}>Print / Save PDF</button>
        <button className="signal-button" disabled={!cards.length} onClick={download}>Download source notes</button>
      </div>
      <p className="collection-note" role="status">{copied === url ? "Your link contains these stories, title and caption. It can be opened without an account." : fallback ?
        "Automatic copying is unavailable. Select the link below and copy it." :
        "Your choices are encoded in the link. No account, tracking or server upload is needed. Anyone with the link can read your caption."}</p>
      {fallback && <label className="share-fallback">Copy this exhibition URL
        <input ref={linkInput} value={url} readOnly onFocus={() => linkInput.current?.select()} />
        <button className="back" onClick={() => { linkInput.current?.focus(); linkInput.current?.select(); }}>Select link</button>
      </label>}
    </section>

    <section className="exhibit-preview" aria-label="Your exhibition preview">
      <p className="eyebrow">Left Behind <span> / </span> After the Signal <span> / </span> {cards.length} archival {cards.length === 1 ? "story" : "stories"}</p>
      <h2>{title.trim() || DEFAULT_EXHIBIT_TITLE}</h2>
      {caption.trim() && <div className="reader-caption"><p className="eyebrow">Reader's caption · not a NASA statement</p><p>{caption}</p></div>}
      {!cards.length && <div className="empty-exhibit">
        <p>Every exhibition begins with a piece of evidence. Choose a story above or start with Ranger 7.</p>
        <button className="signal-button" onClick={() => openSignal("ranger")}>Inspect the first record <span aria-hidden>→</span></button>
      </div>}
      <div className="exhibit-cards">
        {selected.map((item) => <article className="exhibit-card" key={item.id}>
          <ArchiveFigure media={signalMedia[item.media]} />
          <div className="exhibit-card-text">
            <p className="eyebrow">{item.world === "moon" ? "Moon" : "Mars"} <span> / </span> {item.date}</p>
            <h3>{item.exhibitLabel}</h3>
            <p>{item.legacy}</p>
            <dl>
              <div><dt>Observed</dt><dd>{item.observation}</dd></div>
              <div><dt>Interpreted</dt><dd>{item.interpretation}</dd></div>
              <div><dt>Still limited</dt><dd>{item.limit}</dd></div>
            </dl>
            <details className="exhibit-source-list" open>
              <summary>Follow the evidence</summary>
              <ul>{item.sources.map((key) => <li key={key}><a href={signalSources[key].url} target="_blank" rel="noreferrer">{signalSources[key].title}</a></li>)}</ul>
              {item.id === "insight" && <p><strong>Audio credit:</strong> {signalAudio.credit}. {signalAudio.processing}</p>}
            </details>
            <button className="text-link no-print" onClick={() => openSignal(item.id)}>Reopen this investigation <span aria-hidden>↗</span></button>
          </div>
        </article>)}
      </div>
      <p className="exhibit-print-url">Open this exhibition: {url}</p>
      <p className="exhibit-review-note">Editorial text was drafted with AI assistance and linked to NASA sources. Human source verification remains pending.</p>
    </section>
    <details className="classroom-guide no-print">
      <summary>Bring this into a classroom</summary>
      <div>
        <h2>A suggested 15-minute investigation</h2>
        <p><strong>Before (2 minutes):</strong> Ask whether a mission that ends in a crash can still succeed. Keep the first answers.</p>
        <p><strong>Investigate (8 minutes):</strong> Assign one record to each small group. Ask them to name one observation, one scientific interpretation and one thing the record cannot establish. Sound is optional; the waveform and description carry the audio investigation.</p>
        <p><strong>Share (5 minutes):</strong> Assemble an exhibition, print it or open its link, and return to the opening question. Ask which evidence changed an answer.</p>
        <p>These are suggested activities, not a validated curriculum or measured learning result. No student names or sign-in are needed.</p>
        <button className="signal-button" disabled={!cards.length} onClick={() => window.print()}>Print the evidence exhibition</button>
      </div>
    </details>
  </article>;
}
