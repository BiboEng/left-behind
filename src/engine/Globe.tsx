// The planet itself: a sphere wearing a NASA map.
//
// A "texture" is just an image wrapped around the sphere. NASA global maps are equirectangular
// (longitude left→right, latitude top→bottom), which is exactly how three.js wraps a SphereGeometry,
// so no extra math is needed. geo.ts uses the same convention to place markers.
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useMemo } from "react";
import { SRGBColorSpace, type Texture, Vector2 } from "three";
import type { Relief, WorldConfig } from "../worlds/types";

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

/**
 * Textured sphere. useTexture "suspends" while downloading, so wrap it in <Suspense>.
 *
 * Relief: a NORMAL MAP stores, per pixel, which way the ground faces (made from NASA elevation data
 * by scripts/make-normal-map.mjs). The sphere stays perfectly round; only the LIGHTING changes, so
 * crater rims facing the sun brighten and slopes facing away darken. It's cheap (one extra
 * texture, no extra triangles) and it's real topography, not a painted effect.
 */
function TexturedGlobe({ texture, relief }: { texture: string; relief?: Relief | null }) {
  const gl = useThree((s) => s.gl);
  const urls = useMemo(() => (relief ? [texture, relief.normalMap] : [texture]), [texture, relief]);

  // Runs once the images are loaded, before they're sent to the graphics card.
  const prepare = useCallback(
    (loaded: Texture | Texture[]) => {
      const [color, normal] = Array.isArray(loaded) ? loaded : [loaded];
      // The color map is a photo, so tell three.js it's in sRGB; otherwise it looks washed out.
      // (The normal map is data, not a photo: it keeps the default "no color space".)
      color.colorSpace = SRGBColorSpace;
      // Anisotropy keeps the maps sharp near the planet's edge, where the surface is seen at an angle.
      const anisotropy = gl.capabilities.getMaxAnisotropy();
      for (const t of [color, normal]) {
        if (!t) continue;
        t.anisotropy = anisotropy;
        t.needsUpdate = true;
      }
    },
    [gl],
  );
  const [color, normal] = useTexture(urls, prepare) as Texture[];
  const strength = relief?.strength ?? 0;
  const normalScale = useMemo(() => new Vector2(strength, strength), [strength]);

  return (
    <mesh>
      <sphereGeometry args={[1, SEGMENTS, SEGMENTS]} />
      {/* roughness 1 + metalness 0 = dusty rock, no shiny highlight (realistic, no glow) */}
      <meshStandardMaterial
        map={color}
        normalMap={normal ?? null}
        normalScale={normalScale}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

export function Globe({ config }: { config: WorldConfig }) {
  if (!config.texture) return <PlainGlobe color={config.baseColor} />;
  return <TexturedGlobe texture={config.texture} relief={config.relief} />;
}
