import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { buildOfflinePack } from "../../scripts/build-offline-pack.mjs";

const directories: string[] = [];
afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })));

it("pins the whole documentary edition, including unvisited chapters, without caching remote or atlas media", () => {
  const directory = mkdtempSync(join(tmpdir(), "evidence-pack-"));
  directories.push(directory);
  for (const path of ["assets", "evidence", "models"]) mkdirSync(join(directory, path));
  for (const path of ["index.html", "favicon.svg", "assets/entry.js", "assets/LunarLab-test.js", "assets/style.css", "assets/font.woff2", "evidence/audio.wav", "evidence/source.csv", "evidence/photo.webp", "models/atlas.glb", "evidence/README.md"]) writeFileSync(join(directory, path), path);
  const pack = buildOfflinePack(directory);
  expect(pack.files).toEqual(["/assets/LunarLab-test.js", "/assets/entry.js", "/assets/font.woff2", "/assets/style.css", "/evidence/audio.wav", "/evidence/photo.webp", "/evidence/source.csv", "/favicon.svg", "/index.html", "/offline-pack.json"]);
  expect(JSON.parse(readFileSync(join(directory, "offline-pack.json"), "utf8"))).toEqual(pack);
  const worker = readFileSync(join(directory, "offline-sw.js"), "utf8");
  const embedded = JSON.parse(worker.match(/const PACK = (.+);/)![1]);
  expect(embedded).toMatchObject(pack);
  const digest = (bytes: Buffer) => `sha256-${createHash("sha256").update(bytes).digest("base64")}`;
  for (const file of pack.files.filter((file) => file !== "/offline-pack.json")) expect(pack.integrity[file]).toBe(digest(readFileSync(join(directory, file.slice(1)))));
  expect(embedded.manifestIntegrity).toBe(digest(readFileSync(join(directory, "offline-pack.json"))));
  expect(worker).not.toContain("/* EVIDENCE_PACK */ null");
  expect(buildOfflinePack(directory)).toEqual(pack);
  // An identical-sized change must still produce a fresh edition.
  writeFileSync(join(directory, "index.html"), "INDEX.HTML");
  expect(buildOfflinePack(directory).version).not.toBe(pack.version);
  writeFileSync(join(directory, "assets/oversized.js"), Buffer.alloc(15_000_001));
  expect(() => buildOfflinePack(directory)).toThrow("15 MB budget");
});
