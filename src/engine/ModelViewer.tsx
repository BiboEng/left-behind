// Models load only when requested. Draco decoders ship locally rather than relying on a CDN.
import { Environment, Html, Lightformer, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { useReducedMotion } from "../state/reducedMotion";

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path, "/decoders/");
  return <primitive object={scene} />;
}

export default function ModelViewer({ path, label }: { path: string; label: string }) {
  const reduced = useReducedMotion();
  const [rotate, setRotate] = useState(true);
  const spinning = rotate && !reduced;
  return (
    <div role="group" aria-label={`3D model of ${label}`}>
      <div className="model-viewer">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 35 }}>
          <color attach="background" args={["#14171c"]} />
          <Suspense fallback={<Html center><span className="model-loading mono">Loading NASA model…</span></Html>}>
            {/* Metallic spacecraft need something to reflect. Generate studio lighting locally:
                no HDR/CDN request, and no changes to NASA's original model materials. */}
            <Environment resolution={128}>
              <color attach="background" args={["#39414c"]} />
              <Lightformer intensity={3} position={[0, 4, 4]} scale={[6, 6, 1]} target={[0, 0, 0]} />
              <Lightformer intensity={2} position={[-4, 1, -2]} scale={[4, 5, 1]} target={[0, 0, 0]} />
            </Environment>
            <Stage environment={null} intensity={1.2} shadows={false} adjustCamera={1}>
              <Model path={path} />
            </Stage>
          </Suspense>
          <ambientLight intensity={0.6} />
          <OrbitControls makeDefault autoRotate={spinning} autoRotateSpeed={1.5} enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
      <div className="model-controls">
        <span>Drag to turn</span>
        <button className="back" aria-pressed={spinning} disabled={reduced} onClick={() => setRotate(!rotate)}>
          {reduced ? "Reduced motion" : spinning ? "Pause rotation" : "Rotate model"}
        </button>
      </div>
    </div>
  );
}
