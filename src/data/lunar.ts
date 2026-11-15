import catalog from "./lunar-catalog.json";
import type { LunarView } from "./lunar-view";

export interface LunarEvent {
  id: string;
  bearing: number;
  variance: number;
  arrivals: readonly string[];
}
export const lunarEvents: readonly LunarEvent[] = catalog.events;
export const lunarProvenance = {
  title: "Apollo 17 LSPE Grade-A thermal moonquake catalog",
  credit: "Francesco Civilini, Allen Husker and Renee Weber · NASA-funded research · CaltechDATA, CC0",
  url: "https://data.caltech.edu/records/d7mk4-f8t44",
  doi: "https://doi.org/10.22002/d7mk4-f8t44",
  original: "https://data.caltech.edu/records/d7mk4-f8t44/files/GradeA_thermal_mq_catalog_final.csv?download=1",
  sha256: catalog.sha256,
  path: "/evidence/apollo17-catalog.csv",
  code: "https://github.com/civilinifr/thermal_mq_analysis/blob/main/P15_assess_catalog.py",
};
export const fromModuleSector = (bearing: number) => bearing > 80 && bearing < 120;
export function filterLunarEvents(view: LunarView, events: readonly LunarEvent[] = lunarEvents) {
  return events.filter((event) =>
    (view.month === "all" || event.arrivals[0].startsWith(view.month)) &&
    (!view.tight || event.variance <= 50) &&
    (view.direction === "all" || fromModuleSector(event.bearing) === (view.direction === "module")));
}
/** Eighteen equal 20° bins, clockwise from north, as in the published direction calculation. */
export function lunarHistogram(events: readonly LunarEvent[]) {
  const bins = Array<number>(18).fill(0);
  for (const event of events) bins[Math.floor(event.bearing / 20)]++;
  return bins;
}
// Retain the catalog's six fractional digits for relative times, including across midnight.
export function arrivalMicroseconds(value: string) {
  const [seconds, fraction] = value.split(".");
  return Date.parse(seconds + "Z") * 1000 + Number(fraction);
}
export function relativeArrivals(event: LunarEvent) {
  const times = event.arrivals.map(arrivalMicroseconds);
  const first = Math.min(...times);
  return times.map((time) => (time - first) / 1_000_000);
}
export function lunarReceipt(view: LunarView, event: LunarEvent | undefined, url: string) {
  const events = filterLunarEvents(view);
  const lines = [
    "LEFT BEHIND / AFTER THE SIGNAL", "APOLLO 17 · THE MACHINE IN THE MEASUREMENT", "",
    `Reopen this view: ${url}`, "",
    `Month: ${view.month}; direction: ${view.direction}; azimuth variance: ${view.tight ? "≤ 50" : "all published values"}`,
    `Selected: ${events.length} of ${lunarEvents.length} published events. Each event is counted once, not four times.`,
    "Module sector: strictly greater than 80° and less than 120°, following the authors' comparison code.", "",
    "20° DIRECTION BINS (clockwise from north)",
    ...lunarHistogram(events).map((count, i) => `${i * 20}°–${(i + 1) * 20}°: ${count}`), "",
  ];
  if (event && events.some((entry) => entry.id === event.id)) {
    lines.push(`EVENT ${event.id}`, `Published direction (geo1 theta_mean): ${event.bearing}°`,
      `Published azimuth variance (geo1 theta_variance): ${event.variance}`,
      "ARRIVALS (catalog clock, reproduced as published; relative to the earliest sensor)",
      ...event.arrivals.map((time, i) => `Geo ${i + 1}: ${time}; +${relativeArrivals(event)[i].toFixed(6)} s`), "");
  }
  lines.push("INTERPRETATION AND LIMITS",
    "Civilini, Husker and Weber associated a directional population of morning vibrations with heating and expansion of the abandoned Apollo 17 lander base.",
    "A direction sector alone does not prove the source of an individual event. The catalog contains derived arrival picks and direction estimates, not raw waveforms, distances or a live feed.",
    "The ≤50 variance filter follows a plotting cutoff in the authors' code; it is not a confidence percentage. This exploratory view does not reproduce every exclusion in their paper.",
    "Counts are detections in a selected Grade-A catalog, not the total number of moonquakes or a measure of seismic risk. No new source locations are calculated here.", "",
    "PROVENANCE", lunarProvenance.title, lunarProvenance.credit, lunarProvenance.doi,
    `Original: ${lunarProvenance.original}`, `SHA-256: ${lunarProvenance.sha256}`,
    "Four sensor rows grouped by event ID. Direction and variance use geo1, consistently with the authors' assessment code.",
    lunarProvenance.code,
    "Research context: https://www.caltech.edu/about/news/the-lunar-alarm-clock-new-study-characterizes-regular-moonquakes",
    "NASA instrument: https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument%3Alspe.a17a&version=1.2",
    "AI-assisted educational interpretation. Human source review is pending. No NASA endorsement.");
  return lines.join("\n") + "\n";
}
