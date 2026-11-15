// Scroll → which relic → turn the globe to face it.
//
// Key idea: the CAMERA never moves sideways. It sits on the +Z axis looking at the center, and we
// ROTATE THE GLOBE so the active landing site faces it. That keeps north up automatically and means
// we only ever have to animate one rotation plus one distance (the zoom).
import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { type Group, Quaternion } from "three";
import { relics } from "../data";
import { useTimeline } from "../state/timeline";
import { useReducedMotion } from "../state/reducedMotion";
import type { World } from "../types/relic";
import { worlds } from "../worlds";
import { CALIBRATION, calibrating } from "./calibration";
import { narrowScreenFactor } from "./framing";
import { faceSiteQuaternion } from "./geo";
import { registerScrollElement } from "./scrollBridge";

// Camera distance from the planet's center (radius 1). Close on a site, pulled back between sites.
const DIST_AT_SITE = 2.3;
const DIST_BETWEEN_EXTRA = 0.9; // → 3.2 halfway between two sites
const DIST_CALIBRATE = 2.6;

// "smoothTime" for maath's damping: roughly how many seconds it takes to catch up. Higher = floatier.
const TURN_SMOOTH = 0.25;
const ZOOM_SMOOTH = 0.3;

// Fraction of the scroll between two sites where the globe holds still on a site (half at each end),
// so you can read the card with the site centered instead of the globe always being mid-turn.
const DWELL = 0.4;

/** Raw 0→1 progress between two sites → 0 while dwelling, eases 0→1 in the middle, 1 while dwelling. */
function dwell(raw: number) {
  const x = Math.min(Math.max((raw - DWELL / 2) / (1 - DWELL), 0), 1);
  return x * x * (3 - 2 * x); // "smoothstep": starts and ends gently
}

export function CameraRig({ world, children }: { world: World; children: ReactNode }) {
  const config = worlds[world];
  const reducedMotion = useReducedMotion();
  const list = relics[world];
  const n = list.length;

  const scroll = useScroll();
  const globe = useRef<Group>(null);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  // One "face this site" rotation per relic, computed once (geo.ts is tested, so we trust it).
  const siteQuats = useMemo(
    () => list.map((r) => faceSiteQuaternion(r.location.lat, r.location.lon, config.lonOffsetDeg)),
    [list, config.lonOffsetDeg],
  );
  const calibrationQuat = useMemo(() => {
    const p = CALIBRATION[world];
    return faceSiteQuaternion(p.lat, p.lon, config.lonOffsetDeg);
  }, [world, config.lonOffsetDeg]);
  const target = useMemo(() => new Quaternion(), []);

  // Start already facing the first site, so the globe doesn't spin in on load.
  // Reads the screen size once via get() rather than depending on it: on a resize we don't want
  // to snap back to the first site; useFrame below already adjusts the distance smoothly.
  const get = useThree((s) => s.get);
  useLayoutEffect(() => {
    const s = useTimeline.getState();
    const start = calibrating ? calibrationQuat : siteQuats[s.target ?? s.activeIndex];
    if (globe.current && start) globe.current.quaternion.copy(start);
    const { width, height } = get().size;
    camera.position.set(0, 0, (calibrating ? DIST_CALIBRATE : DIST_AT_SITE) * narrowScreenFactor(width, height));
  }, [camera, calibrationQuat, siteQuats, get]);

  // Let the HTML overlay forward mouse-wheel events to the timeline (see scrollBridge.ts).
  // If the user grabs the scroll (wheel, touch, drag) during a jump, the jump is over: stop
  // holding the card on the jump's destination (see `target` in state/timeline.ts).
  useEffect(() => {
    const el = scroll.el;
    registerScrollElement(el);
    const takeOver = () => useTimeline.getState().clearTarget();
    const opts = { passive: true };
    el.addEventListener("wheel", takeOver, opts);
    el.addEventListener("touchstart", takeOver, opts);
    el.addEventListener("pointerdown", takeOver, opts);
    return () => {
      registerScrollElement(null);
      el.removeEventListener("wheel", takeOver);
      el.removeEventListener("touchstart", takeOver);
      el.removeEventListener("pointerdown", takeOver);
    };
  }, [scroll.el]);

  // A jump has ended when the scroll position stops changing for a moment (the smooth scroll
  // arrived, or the browser cancelled it). Tracked in useFrame below.
  const lastTop = useRef(-1);
  const lastMove = useRef(0);

  // Slide the globe out from under the story card: on desktop the card covers the right side, on
  // phones it's a bottom sheet. setViewOffset shifts the picture without moving the camera, so the
  // site still faces us dead-on.
  useEffect(() => {
    const { width, height } = size;
    const mobile = width < 760;
    const x = mobile ? 0 : Math.min(200, width * 0.12);
    const y = mobile ? height * 0.23 : 0; // the bottom sheet covers ~46% of the screen
    camera.setViewOffset(width, height, x, y, width, height);
    return () => camera.clearViewOffset();
  }, [camera, size]);

  // Jumps (rail clicks, keyboard): scroll the page to that relic and let the normal scroll logic
  // below animate the globe. We wait one frame because drei attaches its scroll <div> to the page
  // in an effect that runs after ours, and before then it has no height to scroll.
  const jumpTo = useTimeline((s) => s.jumpTo);
  useEffect(() => {
    if (!jumpTo) return;
    const frame = requestAnimationFrame(() => {
      const index = list.findIndex((r) => r.id === jumpTo);
      const el = scroll.el;
      if (index >= 0 && n > 1) {
        const top = (index / (n - 1)) * (el.scrollHeight - el.clientHeight);
        el.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
      }
      lastMove.current = performance.now(); // give the smooth scroll a moment to start
      useTimeline.getState().clearJump();
    });
    return () => cancelAnimationFrame(frame);
  }, [jumpTo, list, n, scroll.el, reducedMotion]);

  // Runs every frame (~60×/s).
  useFrame((state, delta) => {
    const g = globe.current;
    if (!g) return;

    let dist = DIST_AT_SITE;
    if (calibrating) {
      target.copy(calibrationQuat);
      dist = DIST_CALIBRATE;
    } else if (n > 0) {
      // offset goes 0 → 1 from top to bottom of drei's invisible scroll <div>. We read the div's
      // scrollTop ourselves instead of drei's scroll.offset: with @react-three/fiber 9.8, the Canvas
      // takes its event hookup back from drei on re-render, so drei stops hearing scroll events and
      // scroll.offset stays at 0 (scrolling did nothing). The damping below still smooths it.
      const el = scroll.el;
      const max = el.scrollHeight - el.clientHeight;
      const offset = max > 0 ? Math.min(Math.max(el.scrollTop / max, 0), 1) : 0;

      // f is a "fractional relic index": f = 2.4 means "40% of the way from relic 2 to relic 3".
      const f = n > 1 ? offset * (n - 1) : 0;
      const i = Math.min(Math.floor(f), Math.max(n - 2, 0));
      const t = n > 1 ? dwell(f - i) : 0;

      // slerp = "spherical blend" between two rotations; t=0 faces site i, t=1 faces site i+1.
      target.slerpQuaternions(siteQuats[i], siteQuats[Math.min(i + 1, n - 1)], t);
      // sin(π·t) is 0 at each site and 1 halfway: pull back in between, move in on arrival.
      dist = DIST_AT_SITE + DIST_BETWEEN_EXTRA * Math.sin(Math.PI * t);
      if (reducedMotion) {
        target.copy(siteQuats[Math.round(f)]);
        dist = DIST_AT_SITE;
      }

      // Tell the UI where we are. The store ignores values that didn't change, so this is cheap.
      const store = useTimeline.getState();
      store.setActiveIndex(Math.round(f));
      store.setProgress(Math.round(offset * 1000) / 1000);

      // End a jump when the scroll reaches the destination. Fallback: the scroll has been still for
      // a full second (the browser cancelled it). Wheel/touch take-overs are handled above.
      const now = performance.now();
      if (el.scrollTop !== lastTop.current) {
        lastTop.current = el.scrollTop;
        lastMove.current = now;
      }
      if (store.target !== null && !store.jumpTo && n > 1) {
        const targetTop = (store.target / (n - 1)) * max;
        const arrived = Math.abs(el.scrollTop - targetTop) < 2;
        if (arrived || now - lastMove.current > 1000) store.clearTarget();
      }
    }

    // Pull back on tall phone screens so the planet isn't cropped (see framing.ts).
    dist *= narrowScreenFactor(state.size.width, state.size.height);

    // Damping = glide toward the target instead of snapping to it.
    if (reducedMotion) {
      g.quaternion.copy(target);
      camera.position.setZ(dist);
    } else {
      easing.dampQ(g.quaternion, target, TURN_SMOOTH, delta);
      easing.damp(camera.position, "z", dist, ZOOM_SMOOTH, delta);
    }
  });

  return <group ref={globe}>{children}</group>;
}
