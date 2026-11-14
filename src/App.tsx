// STARTER APP — proves the setup works. Phase 1 replaces this with the real engine
// (see docs/ENGINE.md): src/engine/** for the 3D globe, src/ui/** for the overlay.
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { relics } from "./data";
import { useTimeline } from "./state/timeline";
import { worlds } from "./worlds";

export default function App() {
  const world = useTimeline((s) => s.world);
  const setWorld = useTimeline((s) => s.setWorld);

  if (!world) {
    return (
      <main className="landing">
        <h1>Left Behind</h1>
        <p>Pick a world. Scroll through everything humanity has left there, from the first crash to today.</p>
        <div className="choices">
          {(["moon", "mars"] as const).map((w) => (
            <button key={w} onClick={() => setWorld(w)} style={{ borderColor: worlds[w].accent }}>
              {worlds[w].name}
              <small>{relics[w].length} relics</small>
            </button>
          ))}
        </div>
      </main>
    );
  }

  const config = worlds[world];
  return (
    <main className="experience">
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
        <color attach="background" args={["#000"]} />
        <Stars radius={80} depth={40} count={4000} factor={3} fade />
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 2, 5]} intensity={2.5} />
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color={config.baseColor} />
        </mesh>
        <OrbitControls enablePan={false} />
      </Canvas>
      <div className="overlay">
        <button onClick={() => setWorld(null)}>← Back</button>
        <p>
          Starter globe for {config.name}. Setup works! Phase 1 turns this into the scroll-through-time engine.
        </p>
      </div>
    </main>
  );
}
