// URL validation stays separate from the catalog so the landing page does not download the dataset.
export const LUNAR_MONTHS = ["1976-08", "1976-09", "1976-10", "1976-11", "1976-12", "1977-01", "1977-02", "1977-03", "1977-04"] as const;
export type LunarDirection = "all" | "module" | "other";
export interface LunarView {
  month: string;
  direction: LunarDirection;
  tight: boolean;
  eventId: string;
}
export const DEFAULT_LUNAR_VIEW: LunarView = { month: "all", direction: "all", tight: true, eventId: "" };
const keys = ["moonMonth", "moonDirection", "moonQuality", "moonEvent"] as const;
export function parseLunarView(params: URLSearchParams): LunarView {
  const month = params.get("moonMonth");
  const direction = params.get("moonDirection");
  const eventId = params.get("moonEvent") ?? "";
  return {
    month: LUNAR_MONTHS.includes(month as typeof LUNAR_MONTHS[number]) ? month! : "all",
    direction: direction === "module" || direction === "other" ? direction : "all",
    tight: params.get("moonQuality") !== "all",
    eventId: /^\d{6}-\d{2}-M\d{1,4}$/.test(eventId) ? eventId : "",
  };
}
export function clearLunarView(params: URLSearchParams) { keys.forEach((key) => params.delete(key)); }
export function writeLunarView(params: URLSearchParams, view: LunarView) {
  clearLunarView(params);
  if (view.month !== "all") params.set("moonMonth", view.month);
  if (view.direction !== "all") params.set("moonDirection", view.direction);
  if (!view.tight) params.set("moonQuality", "all");
  if (view.eventId) params.set("moonEvent", view.eventId);
}
