// Reproduce a small browser view of the published catalog; never reclassify the researchers' events.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const CATALOG_SHA256 = "c3ee72f706b1f8bbbced6ee81f98ed10f3e23c8bb99616242f89a6ff2d3ba82d";
export function catalogFromCsv(bytes) {
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== CATALOG_SHA256) throw new Error("Apollo catalog checksum differs from the published source. Review before regenerating.");
  const [header, ...lines] = bytes.toString("utf8").trimEnd().split(/\r?\n/);
  const columns = header.split(",");
  const groups = new Map();
  for (const line of lines) {
    // This pinned numeric catalog has no quoted CSV fields; reject those rather than misread them.
    const cells = line.split(",");
    if (line.includes('"') || cells.length !== columns.length) throw new Error("Unexpected catalog CSV format");
    const row = Object.fromEntries(columns.map((name, i) => [name, cells[i]]));
    const rows = groups.get(row.evid) ?? new Map();
    if (rows.has(row.geophone)) throw new Error("Duplicate event/geophone");
    rows.set(row.geophone, row);
    groups.set(row.evid, rows);
  }
  const events = [...groups].map(([id, rows]) => {
    const first = rows.get("geo1");
    const arrivals = [1, 2, 3, 4].map((n) => rows.get(`geo${n}`)?.ft_arrival_time);
    const bearing = Number(first?.theta_mean);
    const variance = Number(first?.theta_variance);
    if (rows.size !== 4 || !first || arrivals.some((s) => !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{6}$/.test(s ?? "")) ||
        !Number.isFinite(bearing) || bearing < 0 || bearing >= 360 || !Number.isFinite(variance) || variance < 0) {
      throw new Error(`Incomplete or invalid published event: ${id}`);
    }
    // Use geo1's event-level direction fields consistently, as in the authors' assessment script.
    // One geo4 direction field differs in the original; the source file stays completely unchanged.
    return { id, bearing, variance, arrivals };
  }).sort((a, b) => a.arrivals[0].localeCompare(b.arrivals[0]));
  return { sha256, rows: lines.length, events };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = catalogFromCsv(readFileSync(new URL("../public/evidence/apollo17-catalog.csv", import.meta.url)));
  writeFileSync(new URL("../src/data/lunar-catalog.json", import.meta.url), JSON.stringify(result) + "\n");
  console.log(`Apollo 17: ${result.events.length} events, ${result.rows} sensor rows; ${result.sha256}`);
}
