import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function filesIn(directory, base = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? filesIn(join(directory, entry.name), `${base}${entry.name}/`)
    : [`${base}${entry.name}`]);
}

export function buildOfflinePack(directory) {
  const worker = readFileSync(new URL("../src/offline/worker.js", import.meta.url), "utf8");
  if (!worker.includes("/* EVIDENCE_PACK */ null")) throw new Error("Offline worker is missing its build-time manifest marker.");
  const files = ["index.html", "favicon.svg", ...filesIn(join(directory, "assets")).map((file) => `assets/${file}`),
    ...filesIn(join(directory, "evidence")).filter((file) => /\.(webp|wav|csv)$/.test(file)).map((file) => `evidence/${file}`)].sort();
  const hash = createHash("sha256").update(worker);
  const integrity = {};
  let bytes = 0;
  for (const file of files) {
    if (!existsSync(join(directory, file))) throw new Error(`Missing offline evidence: ${file}`);
    const contents = readFileSync(join(directory, file));
    hash.update(file).update(contents);
    integrity[`/${file}`] = `sha256-${createHash("sha256").update(contents).digest("base64")}`;
    bytes += contents.byteLength;
  }
  if (bytes > 15_000_000) throw new Error("Offline evidence pack exceeds the 15 MB budget; review new assets before shipping.");
  const version = hash.digest("hex").slice(0, 16);
  const pack = { version, bytes, files: [...files.map((file) => `/${file}`), "/offline-pack.json"], integrity };
  const manifest = JSON.stringify(pack);
  const manifestIntegrity = `sha256-${createHash("sha256").update(manifest).digest("base64")}`;
  writeFileSync(join(directory, "offline-pack.json"), manifest);
  writeFileSync(join(directory, "offline-sw.js"), worker.replace("/* EVIDENCE_PACK */ null", JSON.stringify({ ...pack, manifestIntegrity })));
  console.log(`Offline evidence: ${files.length + 1} local files, ${(bytes / 1_000_000).toFixed(1)} MB · edition ${version}`);
  return pack;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildOfflinePack(resolve("dist"));
