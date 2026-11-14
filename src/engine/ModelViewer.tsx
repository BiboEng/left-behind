// A small, separate 3D view inside the story card for hero relics' NASA models (.glb).
// It's its own <Canvas>, so it has nothing to do with the globe; StoryCard only mounts it for the
// active hero, so at most one model is ever loaded at a time.
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

export default function ModelViewer({ path, label }: { path: string; label: string }) {
  return (
    <div className="model-viewer" role="img" aria-label={`3D model of ${label}, rotating. Drag to turn it.`}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 35 }}>
        <Suspense fallback={null}>
          {/* Stage centers the model, scales the camera to fit, and adds soft studio lighting. */}
          <Stage environment={null} intensity={1.2} shadows={false} adjustCamera={1.2}>
            <Model path={path} />
          </Stage>
        </Suspense>
        <ambientLight intensity={0.6} />
        {/* Zoom off so the mouse wheel keeps scrolling the timeline instead. */}
        <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
