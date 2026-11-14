// How much to pull the camera back on tall, narrow (portrait) screens.
//
// The camera's field of view is fixed VERTICALLY, so on a phone held upright the planet would be
// cropped to a patch of ground. We move the camera back by this factor, and scale the markers up by
// the same factor so they stay the same size on screen. 1 on landscape screens, up to 2.4 on phones.
export function narrowScreenFactor(width: number, height: number): number {
  return Math.min(Math.max(height / width, 1), 2.4);
}
