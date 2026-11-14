// Small display helpers shared by the card and the rail.
import type { RelicStatus } from "../types/relic";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC", // relic dates are UTC; don't let the viewer's time zone shift them a day
});

/** "1969-07-20" → "20 Jul 1969". Partial dates ("1971", "1971-07") are shown as-is. */
export function formatDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : dateFormat.format(d);
}

export const year = (iso: string) => iso.slice(0, 4);

/** 0.674, 23.473 → "0.67° N · 23.47° E" */
export function formatCoords(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns} · ${Math.abs(lon).toFixed(2)}° ${ew}`;
}

export const STATUS_LABEL: Record<RelicStatus, string> = {
  crashed: "Crashed",
  impacted: "Impacted",
  lost: "Contact lost",
  retired: "Mission ended",
  abandoned: "Left behind",
};
