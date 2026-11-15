// A deliberately bounded, opt-in documentary cache. No remote sites, reader URLs or atlas media.
// Vite's production build replaces the marker with the exact files and edition fingerprint.
const PACK = /* EVIDENCE_PACK */ null;
const PREFIX = "left-behind-evidence-";

export function parseByteRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(size) || size <= 0) return null;
  const first = match[1] ? Number(match[1]) : null;
  const last = match[2] ? Number(match[2]) : null;
  if ((first !== null && !Number.isSafeInteger(first)) || (last !== null && !Number.isSafeInteger(last))) return null;
  const start = first === null ? Math.max(0, size - last) : first;
  const end = first === null || last === null ? size - 1 : Math.min(last, size - 1);
  return start <= end && start < size && (first !== null || last > 0) ? { start, end } : null;
}

/**
 * Which saved file answers a same-origin GET, or null to leave it to the network.
 * Only the app shell ("/" and "/index.html") is served from the pack for page loads; the app routes
 * with query strings and hashes on that one path. Other pages on the site, such as the /demo/ deck,
 * must load normally instead of being replaced by the saved app shell.
 */
export function offlineCacheKey(pathname, mode, paths) {
  if (mode === "navigate") return pathname === "/" || pathname === "/index.html" ? "/index.html" : null;
  return paths.has(pathname) ? pathname : null;
}

export async function byteRangeResponse(request, response) {
  const bytes = await response.arrayBuffer();
  const range = parseByteRange(request.headers.get("Range"), bytes.byteLength);
  const headers = new Headers(response.headers);
  headers.delete("Content-Encoding");
  headers.set("Accept-Ranges", "bytes");
  if (!range) {
    headers.set("Content-Range", `bytes */${bytes.byteLength}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${bytes.byteLength}`);
  headers.set("Content-Length", String(range.end - range.start + 1));
  return new Response(bytes.slice(range.start, range.end + 1), { status: 206, headers });
}

if (typeof self !== "undefined" && PACK) {
  const name = `${PREFIX}${PACK.version}`;
  const paths = new Set(PACK.files);
  async function save() {
    const cache = await caches.open(name);
    // SRI verifies the actual bytes before addAll's atomic commit. A host's HTML fallback
    // can return 200 for a missing CSV; response.ok alone would falsely certify that pack.
    await cache.addAll(PACK.files.map((path) => new Request(path, {
      cache: "reload", credentials: "same-origin",
      integrity: path === "/offline-pack.json" ? PACK.manifestIntegrity : PACK.integrity[path],
    })));
  }
  async function complete() {
    if (!await caches.has(name)) return false;
    const cache = await caches.open(name);
    return (await Promise.all(PACK.files.map((path) => cache.match(path, { ignoreVary: true })))).every(Boolean);
  }
  self.addEventListener("install", (event) => {
    event.waitUntil(save().catch(async (error) => { await caches.delete(name); throw error; }));
    // An update waits for the visitor's Reload button; don't replace a running exhibition.
  });
  self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
      await Promise.all((await caches.keys()).filter((key) => key.startsWith(PREFIX) && key !== name).map((key) => caches.delete(key)));
      await self.clients.claim();
    })());
  });
  self.addEventListener("message", (event) => {
    if (event.data?.type === "APPLY_UPDATE") { self.skipWaiting(); return; }
    if (!["VERIFY_PACK", "SAVE_PACK"].includes(event.data?.type)) return;
    event.waitUntil((async () => {
      try {
        if (event.data.type === "SAVE_PACK") await save();
        event.ports[0]?.postMessage({ complete: await complete(), version: PACK.version });
      } catch { event.ports[0]?.postMessage({ complete: false, error: true }); }
    })());
  });
  self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== "GET" || url.origin !== self.location.origin) return;
    const key = offlineCacheKey(url.pathname, request.mode, paths);
    if (!key) return;
    event.respondWith((async () => {
      const cache = await caches.open(name);
      // Serve one coherent saved edition, including its lazy chunks. Updates are explicit.
      // Only static path keys are used: exhibition captions and shared URLs are never cached.
      const cached = await cache.match(key, { ignoreVary: true });
      if (!cached) return fetch(request);
      return request.headers.has("Range") ? byteRangeResponse(request, cached) : cached;
    })());
  });
}
