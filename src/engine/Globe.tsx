// The planet itself: a sphere wearing a NASA map.
//
// A "texture" is just an image wrapped around the sphere. NASA global maps are equirectangular
// (longitude left→right, latitude top→bottom), which is exactly how three.js wraps a SphereGeometry,
// so no extra math is needed. geo.ts uses the same convention to place markers.
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useMemo } from "react";
import { SRGBColorSpace, type Texture } from "three";
import type { WorldConfig } from "../worlds/types";

// 128 × 128 segments: smooth enough that the edge of the planet looks round when zoomed in.
const SEGMENTS = 128;

/** Plain colored sphere: used when a world has no texture yet, and while the texture loads. */
export function PlainGlobe({ color }: { color: string }) {
  return (
    <mesh>
      <sphereGeometry args={[1, SEGMENTS, SEGMENTS]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  );
}

/** Textured sphere. useTexture "suspends" while downloading, so wrap it in <Suspense>. */
function TexturedGlobe({ texture, bumpMap }: { texture: string; bumpMap?: string | null }) {
  const gl = useThree((s) => s.gl);
  const urls = useMemo(() => (bumpMap ? [texture, bumpMap] : [texture]), [texture, bumpMap]);

  // Runs once the images are loaded, before they're sent to the graphics card.
  const prepare = useCallback(
    (loaded: Texture | Texture[]) => {
      const color = Array.isArray(loaded) ? loaded[0] : loaded;
      // The color map is a photo, so tell three.js it's in sRGB; otherwise it looks washed out.
      color.colorSpace = SRGBColorSpace;
      // Anisotropy keeps the map sharp near the planet's edge, where the surface is seen at an angle.
      color.anisotropy = gl.capabilities.getMaxAnisotropy();
      color.needsUpdate = true;
    },
    [gl],
  );
  const [color, bump] = useTexture(urls, prepare) as Texture[];

  return (
    <mesh>
      <sphereGeometry args={[1, SEGMENTS, SEGMENTS]} />
      {/* roughness 1 + metalness 0 = dusty rock, no shiny highlight (realistic, no glow) */}
      <meshStandardMaterial
        map={color}
        bumpMap={bump ?? null}
        bumpScale={bump ? 0.6 : 0}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

export function Globe({ config }: { config: WorldConfig }) {
  if (!config.texture) return <PlainGlobe color={config.baseColor} />;
  return <TexturedGlobe texture={config.texture} bumpMap={config.bumpMap} />;
}
