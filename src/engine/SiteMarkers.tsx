// A small dot on the surface at every relic's real landing coordinates.
//
// The markers are CHILDREN of the globe group (see CameraRig), so when the globe turns they turn
// with it and stay glued to the right spot. They sit at radius 1.003, a hair above the surface
// (radius 1), so they don't flicker by fighting the sphere for the same pixels.
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, type Mesh, Quaternion, Vector3 } from "three";
import { relics } from "../data";
import { useTimeline } from "../state/timeline";
import type { World } from "../types/relic";
import { worlds } from "../worlds";
import { CALIBRATION, calibrating } from "./calibration";
import { narrowScreenFactor } from "./framing";
import { latLonToVector3 } from "./geo";

const SURFACE = 1.003;
const Z = new Vector3(0, 0, 1);

export function SiteMarkers({ world }: { world: World }) {
  const config = worlds[world];
  const list = relics[world];
  const activeIndex = useTimeline((s) => s.activeIndex);
  // On phones the camera is further away (framing.ts), so grow the markers to match.
  const k = useThree((s) => narrowScreenFactor(s.size.width, s.size.height));

  const placed = useMemo(
    () =>
      list.map((r) => {
        const position = latLonToVector3(r.location.lat, r.location.lon, SURFACE, config.lonOffsetDeg);
        // Turn a flat ring so it lies on the surface: point its face (+Z) along the surface normal.
        const facing = new Quaternion().setFromUnitVectors(Z, position.clone().normalize());
        return { id: r.id, position, facing };
      }),
    [list, config.lonOffsetDeg],
  );

  return (
    <group>
      {placed.map((m, i) => (
        <mesh key={m.id} position={m.position} scale={k}>
          <sphereGeometry args={[i === activeIndex ? 0.009 : 0.005, 16, 16]} />
          {/* meshBasicMaterial ignores lighting, so markers stay readable on the night side */}
          <meshBasicMaterial color={config.accent} transparent opacity={i === activeIndex ? 1 : 0.55} />
        </mesh>
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
