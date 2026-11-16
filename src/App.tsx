import { type CSSProperties, lazy, Suspense, useEffect } from "react";
import Credits from "./ui/Credits";
import ErrorBoundary from "./ui/ErrorBoundary";
import { useTimeline } from "./state/timeline";
import { useSignal } from "./state/signal";
import Landing from "./ui/Landing";
import Overlay from "./ui/Overlay";
import { worlds } from "./worlds";

// The landing and reading mode don't download the globe renderer.
const Experience = lazy(() => import("./engine/Experience"));
const SignalRoom = lazy(() => import("./ui/signal/SignalRoom"));

export default function App() {
  const chapter = useSignal((s) => s.chapter);
  const world = useTimeline((s) => s.world);
  const reading = useTimeline((s) => s.mode === "reading");
  return (
    <>
      {chapter ? <Suspense fallback={<p className="signal-loading" role="status">Opening the investigations…</p>}>
        <SignalRoom chapter={chapter} />
      </Suspense> : world ? (
        <main className={`experience ${reading ? "reading-mode" : ""}`} key={world}
          style={{ "--accent": worlds[world].accent } as CSSProperties}>
          {!reading && <ErrorBoundary fallback={<GlobeFallback />}>
            <Suspense fallback={<p className="globe-loading mono" role="status">Preparing the globe… You can read while it loads.</p>}>
              <Experience world={world} />
            </Suspense>
          </ErrorBoundary>}
          <Overlay world={world} />
        </main>
      ) : <Landing />}
      <Credits />
    </>
  );
}

function GlobeFallback() {
  useEffect(() => { useTimeline.getState().setMode("reading"); }, []);
  return <p role="status">The globe is unavailable. Opening reading mode…</p>;
}
