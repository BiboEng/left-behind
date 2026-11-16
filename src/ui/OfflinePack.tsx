import { useEffect, useState } from "react";
import { activeWorker, isEvidenceWorker, OFFLINE_CACHE_PREFIX, workerMessage } from "../offline/client";
import "./offline.css";

type Status = "checking" | "available" | "saving" | "saved" | "removing" | "unsupported" | "error";

// A production-only pack: a development server has no stable edition to preserve.
export default function OfflinePack() {
  return import.meta.env.DEV ? null : <OfflinePackControl />;
}

function OfflinePackControl() {
  const supported = "serviceWorker" in navigator && window.isSecureContext;
  const [status, setStatus] = useState<Status>(supported ? "checking" : "unsupported");
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const [updateReady, setUpdateReady] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [size, setSize] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supported) return;
    let alive = true;
    const network = () => setOnline(navigator.onLine);
    window.addEventListener("online", network);
    window.addEventListener("offline", network);
    fetch("/offline-pack.json").then((response) => response.ok ? response.json() : null).then((pack) => {
      if (alive && Number.isFinite(pack?.bytes)) setSize(` · ${(pack.bytes / 1_000_000).toFixed(1)} MB`);
    }).catch(() => {});
    navigator.serviceWorker.getRegistration("/").then(async (existing) => {
      if (!alive) return;
      if (existing && isEvidenceWorker(existing)) {
        setRegistration(existing);
        const complete = existing.active && (await workerMessage(existing.active, "VERIFY_PACK")).complete;
        if (alive) setStatus(complete ? "saved" : "available");
        // A downloaded update waits; visitors decide when a running documentary reloads.
        existing.update().catch(() => {});
      } else setStatus("available");
    }).catch(() => { if (alive) setStatus("available"); });
    return () => { alive = false; window.removeEventListener("online", network); window.removeEventListener("offline", network); };
  }, [supported]);

  useEffect(() => {
    if (!registration) return;
    const workers = new Set<ServiceWorker>();
    const check = () => {
      setUpdateReady(Boolean(registration.waiting));
      if (registration.installing && !workers.has(registration.installing)) {
        workers.add(registration.installing);
        registration.installing.addEventListener("statechange", check);
      }
    };
    registration.addEventListener("updatefound", check);
    check();
    return () => {
      registration.removeEventListener("updatefound", check);
      workers.forEach((worker) => worker.removeEventListener("statechange", check));
    };
  }, [registration]);

  async function save() {
    setStatus("saving"); setError(""); setNotice("");
    try {
      const existing = await navigator.serviceWorker.getRegistration("/");
      if (existing && !isEvidenceWorker(existing)) throw new Error("Another offline application is already installed at this address.");
      const current = await navigator.serviceWorker.register("/offline-sw.js", { scope: "/", type: "module", updateViaCache: "none" });
      setRegistration(current);
      const worker = await activeWorker(current);
      let result = await workerMessage(worker, "VERIFY_PACK");
      if (!result.complete) result = await workerMessage(worker, "SAVE_PACK");
      if (!result.complete) throw new Error("The complete evidence pack could not be saved.");
      setStatus("saved");
    } catch (failure) {
      setError(`${failure instanceof Error ? failure.message : "Offline saving failed."} Check the connection and available browser storage, then retry.`);
      setStatus("error");
    }
  }

  async function remove() {
    setStatus("removing"); setError("");
    try {
      const existing = await navigator.serviceWorker.getRegistration("/");
      if (existing && isEvidenceWorker(existing)) await existing.unregister();
      await Promise.all((await caches.keys()).filter((key) => key.startsWith(OFFLINE_CACHE_PREFIX)).map((key) => caches.delete(key)));
      setRegistration(undefined); setUpdateReady(false); setStatus("available");
      setNotice("Offline pack removed from this browser.");
    } catch { setStatus("error"); setError("The saved pack could not be removed. Please retry."); }
  }

  function update() {
    if (!registration?.waiting) return;
    navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), { once: true });
    registration.waiting.postMessage({ type: "APPLY_UPDATE" });
  }

  const busy = status === "saving" || status === "removing" || status === "checking";
  return <section className="offline-pack" aria-label="Offline evidence pack">
    <div><p className="offline-kicker mono">Take the evidence with you</p>
      <h2>Investigations that travel.</h2>
      <p className="offline-explanation">Save all four investigations, the NASA audio, Apollo catalog and exhibition tools in this browser. NASA source websites and atlas media still need a connection.</p>
    </div>
    <div className="offline-controls">
      <p className="offline-status" role="status">{status === "saved" ? `${online ? "Saved for offline use" : "You’re offline · saved edition ready"}.` : status === "saving" ? "Saving all four investigations… Keep this page open." : status === "removing" ? "Removing saved evidence…" : status === "checking" ? "Checking this browser’s saved evidence…" : status === "unsupported" ? "Offline saving isn’t supported in this browser." : notice || (online ? "Optional. No account needed." : "Connect to save an offline edition.")}</p>
      {supported && <div className="offline-buttons">
        {status === "saved" ? <button onClick={remove}>Remove saved pack</button> : <button disabled={busy || !online} onClick={save}>{status === "saving" ? "Saving…" : status === "error" ? "Retry saving" : `Save offline pack${size}`}</button>}
        {updateReady && <button disabled={busy} onClick={update}>Reload to open the new edition</button>}
      </div>}
      {error && <p className="offline-error" role="alert">{error}</p>}
      <p className="offline-note">Saved on this device only. The browser may clear saved files; check “Saved for offline use” before travelling.</p>
    </div>
  </section>;
}
