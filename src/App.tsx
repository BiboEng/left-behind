// Landing screen until a world is picked, then the 3D globe with the overlay on top.
// Engine (3D): src/engine/** · Interface (HTML): src/ui/** · see docs/ENGINE.md
import type { CSSProperties } from "react";
import Experience from "./engine/Experience";
import { useTimeline } from "./state/timeline";
import Landing from "./ui/Landing";
import Overlay from "./ui/Overlay";
import { worlds } from "./worlds";

export default function App() {
  const world = useTimeline((s) => s.world);

  if (!world) return <Landing />;

  return (
    // key={world}: switching worlds builds a fresh scene, so the scroll starts at the first relic.
    <main className="experience" key={world} style={{ "--accent": worlds[world].accent } as CSSProperties}>
      <Experience world={world} />
      <Overlay world={world} />
    </main>
  );
}
