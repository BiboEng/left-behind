// Landing screen until a world is picked, then the 3D globe with the overlay on top.
// Engine (3D): src/engine/** · Interface (HTML): src/ui/** · see docs/ENGINE.md
import type { CSSProperties } from "react";
import Experience from "./engine/Experience";
import Credits from "./ui/Credits";
import ErrorBoundary from "./ui/ErrorBoundary";
import { useTimeline } from "./state/timeline";
import Landing from "./ui/Landing";
import Overlay from "./ui/Overlay";
import { worlds } from "./worlds";

export default function App() {
  const world = useTimeline((s) => s.world);

  return (
    <>
      {world ? (
        // key={world}: switching worlds builds a fresh scene, so the scroll starts at the first relic.
        <main className="experience" key={world} style={{ "--accent": worlds[world].accent } as CSSProperties}>
          {/* No WebGL (old device, blocked GPU): keep the cards and rail usable without the globe. */}
          <ErrorBoundary
            fallback={<p className="no-3d muted">The 3D globe can't run in this browser. The timeline still works.</p>}
          >
            <Experience world={world} />
          </ErrorBoundary>
          <Overlay world={world} />
        </main>
      ) : (
        <Landing />
      )}
      {/* Outside the overlay, so scrolling the credits never scrolls the timeline. */}
      <Credits />
    </>
  );
}
