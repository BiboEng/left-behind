// A marker on the surface at every relic's real landing coordinates. Click one to fly there;
// hover one to see what it is.
//
// The markers are CHILDREN of the globe group (see CameraRig), so when the globe turns they turn
// with it and stay glued to the right spot. They sit at radius 1.003, a hair above the surface
// (radius 1), so they don't flicker by fighting the sphere for the same pixels.
//
// Three looks, so the globe itself reads as a timeline:
//   already visited (earlier in time) → small solid dot
//   still to come (later in time)     → small hollow ring
//   the one in focus                  → bigger dot + slow pulse
import { Html, useCursor } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, type Mesh, Quaternion, RingGeometry, SphereGeometry, Vector3 } from "three";
import { relics } from "../data";
import { useTimeline } from "../state/timeline";
import type { Relic, World } from "../types/relic";
import { year } from "../ui/format";
import { worlds } from "../worlds";
import { CALIBRATION, calibrating } from "./calibration";
import { narrowScreenFactor } from "./framing";
import { latLonToVector3 } from "./geo";

const SURFACE = 1.003;
const Z = new Vector3(0, 0, 1);
const MARKER_RADIUS = 0.005;
const ACTIVE_SCALE = 1.8; // the active marker is drawn 1.8× bigger
const HOVER_SCALE = 1.5;
// The dots are only a few pixels wide, too small to hit with a finger or even a mouse. Each one
// gets an invisible, much bigger sphere around it that catches the pointer instead.
const HIT_RADIUS = 0.035;

export function SiteMarkers({ world }: { world: World }) {
  const config = worlds[world];
  const list = relics[world];
  const activeIndex = useTimeline((s) => s.activeIndex);
  // On phones the camera is further away (framing.ts), so grow the markers to match.
  const k = useThree((s) => narrowScreenFactor(s.size.width, s.size.height));

  // Shapes shared by every marker: changing relic or hovering only changes scale and color,
  // never rebuilds geometry on the graphics card.
  const shapes = useMemo(
    () => ({
      dot: new SphereGeometry(MARKER_RADIUS, 16, 16),
      ring: new RingGeometry(MARKER_RADIUS * 0.75, MARKER_RADIUS * 1.25, 32),
      hit: new SphereGeometry(HIT_RADIUS, 8, 8),
    }),
    [],
  );
  useEffect(() => () => Object.values(shapes).forEach((g) => g.dispose()), [shapes]); // free GPU memory

  const placed = useMemo(
    () =>
      list.map((relic) => {
        const position = latLonToVector3(relic.location.lat, relic.location.lon, SURFACE, config.lonOffsetDeg);
        // Turn a flat ring so it lies on the surface: point its face (+Z) along the surface normal.
        const facing = new Quaternion().setFromUnitVectors(Z, position.clone().normalize());
        return { relic, position, facing };
      }),
    [list, config.lonOffsetDeg],
  );

  return (
    <group>
      {placed.map((m, i) => (
        <Marker
          key={m.relic.id}
          relic={m.relic}
          position={m.position}
          facing={m.facing}
          state={i === activeIndex ? "active" : i < activeIndex ? "past" : "future"}
          color={config.accent}
          size={k}
          shapes={shapes}
        />
      ))}
      {placed[activeIndex] && !calibrating && (
        <PulseRing
          position={placed[activeIndex].position}
          facing={placed[activeIndex].facing}
          color={config.accent}
          size={k}
        />
      )}
      {calibrating && <CalibrationMarker world={world} lonOffsetDeg={config.lonOffsetDeg} size={k} />}
    </group>
  );
}

interface MarkerProps {
  relic: Relic;
  position: Vector3;
  facing: Quaternion;
  state: "past" | "active" | "future";
  color: string;
  size: number;
  shapes: { dot: SphereGeometry; ring: RingGeometry; hit: SphereGeometry };
}

const worldPos = new Vector3();
const toCamera = new Vector3();

/**
 * The pointer ray goes straight through the planet, so it can also hit markers on the far side.
 * Only react if this marker is on the half of the globe facing the camera.
 */
function facesCamera(e: ThreeEvent<PointerEvent | MouseEvent>) {
  e.eventObject.getWorldPosition(worldPos);
  toCamera.copy(e.camera.position).sub(worldPos);
  return worldPos.dot(toCamera) > 0; // surface normal (= position on a sphere) points at the camera
}

function Marker({ relic, position, facing, state, color, size, shapes }: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  // Label on the left when the marker is on the right of the screen, so it isn't hidden by the card.
  const [labelLeft, setLabelLeft] = useState(false);
  const jumpToRelic = useTimeline((s) => s.jumpToRelic);
  useCursor(hovered); // pointer cursor while over a marker

  const scale = size * (state === "active" ? ACTIVE_SCALE : hovered ? HOVER_SCALE : 1);
  const interactive = !calibrating;

  return (
    <group position={position}>
      {state === "future" ? (
        // Hollow ring lying flat on the ground: "not yet".
        <mesh quaternion={facing} scale={scale} geometry={shapes.ring}>
          <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.75} side={DoubleSide} depthWrite={false} />
        </mesh>
      ) : (
        // meshBasicMaterial ignores lighting, so markers stay readable on the night side
        <mesh scale={scale} geometry={shapes.dot}>
          <meshBasicMaterial color={color} transparent opacity={state === "active" || hovered ? 1 : 0.7} />
        </mesh>
      )}

      {interactive && (
        // visible={false}: never drawn, but three.js still tests the pointer ray against its shape.
        <mesh
          geometry={shapes.hit}
          scale={size}
          visible={false}
          onPointerOver={(e) => {
            if (!facesCamera(e)) return;
            e.stopPropagation(); // markers close together: only the nearest one lights up
            setLabelLeft(e.pointer.x > 0); // pointer.x: -1 = left edge of the canvas, +1 = right edge
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            if (!facesCamera(e)) return;
            e.stopPropagation();
            jumpToRelic(relic.id);
          }}
        />
      )}

      {hovered && state !== "active" && (
        // <Html> pins a normal HTML element to a 3D point; it follows the marker as the globe turns.
        // Anchored at its left edge (no `center`), so the label sits to the right of the marker.
        <Html zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
          <div className={`marker-label mono ${labelLeft ? "on-left" : ""}`}>
            <span className="marker-year">{year(relic.arrived)}</span> {relic.name}
          </div>
        </Html>
      )}
    </group>
  );
}

/** A thin ring that slowly expands and fades around the active site, so the eye finds it. */
function PulseRing({
  position,
  facing,
  color,
  size,
}: {
  position: Vector3;
  facing: Quaternion;
  color: string;
  size: number;
}) {
  const ring = useRef<Mesh>(null);
  const reduceMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useFrame(({ clock }) => {
    const m = ring.current;
    if (!m || reduceMotion) return;
    const t = (clock.elapsedTime % 2) / 2; // 0 → 1 every 2 seconds
    m.scale.setScalar(size * (1 + t * 2.5));
    (m.material as { opacity: number }).opacity = 0.8 * (1 - t);
  });

  return (
    <mesh ref={ring} position={position} quaternion={facing} scale={size}>
      <ringGeometry args={[0.012, 0.0145, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} side={DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function CalibrationMarker({ world, lonOffsetDeg, size }: { world: World; lonOffsetDeg: number; size: number }) {
  const point = CALIBRATION[world];
  const position = useMemo(
    () => latLonToVector3(point.lat, point.lon, SURFACE, lonOffsetDeg),
    [point, lonOffsetDeg],
  );
  return (
    <mesh position={position} scale={size}>
      <sphereGeometry args={[0.008, 16, 16]} />
      <meshBasicMaterial color="#ff2a2a" />
    </mesh>
  );
}
