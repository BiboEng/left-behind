export const OFFLINE_CACHE_PREFIX = "left-behind-evidence-";
export function isEvidenceWorker(registration: ServiceWorkerRegistration) {
  return [registration.active, registration.waiting, registration.installing].some((worker) => worker?.scriptURL === new URL("/offline-sw.js", window.location.origin).href);
}

export function workerMessage(worker: ServiceWorker, type: "VERIFY_PACK" | "SAVE_PACK"): Promise<{ complete: boolean; error?: boolean }> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => { channel.port1.close(); reject(new Error("Offline saving timed out")); }, 120_000);
    channel.port1.onmessage = (event) => {
      window.clearTimeout(timer);
      channel.port1.close();
      resolve(event.data);
    };
    worker.postMessage({ type }, [channel.port2]);
  });
}

export function activeWorker(registration: ServiceWorkerRegistration): Promise<ServiceWorker> {
  if (registration.active?.state === "activated") return Promise.resolve(registration.active);
  const worker = registration.installing ?? registration.waiting ?? registration.active;
  if (!worker) return Promise.reject(new Error("No offline worker"));
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => { worker.removeEventListener("statechange", change); reject(new Error("Offline installation timed out")); }, 120_000);
    const change = () => {
      if (worker.state !== "activated" && worker.state !== "redundant") return;
      window.clearTimeout(timer);
      worker.removeEventListener("statechange", change);
      if (worker.state === "activated") resolve(worker);
      else reject(new Error("Offline installation failed"));
    };
    worker.addEventListener("statechange", change);
    change();
  });
}
