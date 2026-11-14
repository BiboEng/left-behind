// OWNER: Ibrahim. Title screen: pick a world. (Polished with frontend-design in P3.)
import { relics } from "../data";
import { useTimeline } from "../state/timeline";
import type { World } from "../types/relic";
import { worlds } from "../worlds";

const CHOICES: World[] = ["moon", "mars"];

export default function Landing() {
  const setWorld = useTimeline((s) => s.setWorld);

  return (
    <main className="landing">
      <h1>Left Behind</h1>
      <p>Pick a world. Scroll through everything humanity has left there, from the first crash to today.</p>
      <div className="choices">
        {CHOICES.map((w) => (
          <button key={w} onClick={() => setWorld(w)} style={{ borderColor: worlds[w].accent }}>
            {worlds[w].name}
            <small>{relics[w].length} relics</small>
          </button>
        ))}
      </div>
    </main>
  );
}
