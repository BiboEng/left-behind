// Title screen: pick a world.
import { useTexture } from "@react-three/drei";
import { type CSSProperties, useEffect } from "react";
import { relics } from "../data";
import { useTimeline } from "../state/timeline";
import type { World } from "../types/relic";
import { worlds } from "../worlds";
import { CreditsButton } from "./Credits";
import { year } from "./format";
import MissionIndex from "./MissionIndex";

const CHOICES: World[] = ["moon", "mars"];

export default function Landing() {
  const setWorld = useTimeline((s) => s.setWorld);

  // Start downloading both globe textures while the visitor reads the title, so the planet
  // appears already textured instead of as a plain sphere that pops in a second later.
  useEffect(() => {
    // Same URL list as Globe.tsx asks for, so the download is shared rather than repeated.
    for (const w of CHOICES) {
      const { texture, relief } = worlds[w];
      if (texture) useTexture.preload(relief ? [texture, relief.normalMap] : [texture]);
    }
  }, []);

  return (
    <main className="landing">
      <p className="landing-kicker mono">An atlas of NASA hardware on other worlds</p>
      <h1>Left Behind</h1>
      <p>Every landing leaves a story. Explore the machines that stayed on the Moon and Mars through NASA imagery, real coordinates, and the evidence they sent home.</p>
      <div className="choices">
        {CHOICES.map((w) => {
          const list = relics[w];
          const first = list[0];
          const last = list[list.length - 1];
          return (
            <button
              key={w}
              className="choice"
              onClick={() => setWorld(w)}
              style={{ "--accent": worlds[w].accent } as CSSProperties}
            >
              <span className="choice-name">{worlds[w].name}</span>
              <span className="choice-tagline">{worlds[w].tagline}</span>
              <small>
                {list.length} relics
                {first && last && ` · ${year(first.arrived)} – ${year(last.arrived)}`}
              </small>
            </button>
          );
        })}
      </div>
      <p className="landing-scope mono">{relics.moon.length + relics.mars.length} selected relics · NASA open data · No account needed</p>
      <div className="landing-actions">
        <MissionIndex className="credits-link" />
        <CreditsButton className="credits-link" />
      </div>
    </main>
  );
}
