// A tiny bridge so the HTML overlay can scroll the timeline.
//
// drei's <ScrollControls> creates its own invisible scrolling <div> on top of the canvas. Wheel
// events over the story card or the rail never reach that div (they're not inside it), so the
// overlay forwards them here. CameraRig registers the div when it mounts.
import { useTimeline } from "../state/timeline";

let scrollEl: HTMLElement | null = null;

export function registerScrollElement(el: HTMLElement | null) {
  scrollEl = el;
}

/** Scroll the timeline by a number of pixels (positive = forward in time). */
export function scrollTimelineBy(pixels: number) {
  // The user took over: stop holding the card on an old jump destination.
  useTimeline.getState().clearTarget();
  scrollEl?.scrollBy({ top: pixels });
}
