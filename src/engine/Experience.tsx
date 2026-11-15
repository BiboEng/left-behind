// The whole 3D scene for one world: canvas, scroll, lights, stars, and the turning globe.
//
// <ScrollControls pages={n + 1}> makes an invisible page that is (n + 1) screens tall. Scrolling it
// doesn't move anything by itself; CameraRig reads how far down you are and turns the globe.
import { ScrollControls, Stars, useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useTimeline } from "../state/timeline";
import { relics } from "../data";
import type { World } from "../types/relic";
import ErrorBoundary from "../ui/ErrorBoundary";
import { worlds } from "../worlds";
import { CameraRig } from "./CameraRig";
import { Globe, PlainGlobe } from "./Globe";
import { SiteMarkers } from "./SiteMarkers";

export default function Experience({ world }: { world: World }) {
  const config = worlds[world];
  const n = relics[world].length;

  return (
    <>
    <Canvas
      className="experience-canvas"
      dpr={[1, 2]} // sharp on retina screens, but never more than 2× (performance)
      camera={{ position: [0, 0, 2.3], fov: 40, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
    >
      <ContextRecovery />
      <color attach="background" args={["#000"]} />

      {/* The "Sun": one light from the upper left, so craters and the edge of the planet get shadow.
          It doesn't rotate with the globe, so the site facing us is always lit. */}
      <directionalLight position={[-4, 2, 5]} intensity={2.4} />
      {/* A little fill light so the night side isn't pitch black. */}
      <ambientLight intensity={0.08} />
      {/* Static, colorless stars: realistic, no twinkle. */}
      <Stars radius={100} depth={50} count={5000} factor={3} saturation={0} fade speed={0} />

      {/* scrollbarWidth none: hide the native scrollbar of drei's invisible scroll layer */}
      <ScrollControls pages={n + 1} damping={0.2} style={{ scrollbarWidth: "none" }}>
        <CameraRig world={world}>
          {/* Show a plain sphere while the NASA texture downloads, instead of an empty screen.
              If the texture fails to load (missing file, network), the ErrorBoundary keeps the plain
              sphere instead of the error taking down the whole page. */}
          <ErrorBoundary fallback={<PlainGlobe color={config.baseColor} />}>
            <Suspense fallback={<PlainGlobe color={config.baseColor} />}>
              <Globe config={config} />
            </Suspense>
          </ErrorBoundary>
          <SiteMarkers world={world} />
        </CameraRig>
      </ScrollControls>
    </Canvas>
    <LoadingStatus />
    </>
  );
}

function LoadingStatus() {
  const { active, progress } = useProgress();
  return active ? <p className="globe-loading mono" role="status">Loading NASA surface maps · {Math.round(progress)}%</p> : null;
}

function ContextRecovery() {
  const canvas = useThree((s) => s.gl.domElement);
  useEffect(() => {
    const lost = (e: Event) => {
      e.preventDefault();
      useTimeline.getState().setMode("reading");
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [canvas]);
  return null;
}
