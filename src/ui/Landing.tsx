// Title screen: pick a world.
import { useTexture } from "@react-three/drei";
import { type CSSProperties, useEffect } from "react";
import { relics } from "../data";
import { useTimeline } from "../state/timeline";
import type { World } from "../types/relic";
import { worlds } from "../worlds";
import { CreditsButton } from "./Credits";
import { year } from "./format";

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
      <h1>Left Behind</h1>
      <p>Pick a world. Scroll through everything humanity has left there, from the first crash to today.</p>
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
              <small>
                {list.length} relics
                {first && last && ` · ${year(first.arrived)} – ${year(last.arrived)}`}
              </small>
            </button>
          );
        })}
      </div>
      <CreditsButton className="credits-link" />
    </main>
  );
}
