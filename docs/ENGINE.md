# The engine (simple 3D, built on Day 1)

Neither of us has done 3D before, so the engine is deliberately simple: **one textured globe,
one camera, and the globe turns to face each landing site as you scroll.** No terrain, no flying.
The real coordinates of each relic do the storytelling.

```
┌───────────────────────────────────────────────────────────────┐
│ ‹ Back   LEFT BEHIND · The Moon                 1969 ●        │
│                                                     │         │
│ 1959 ●                 ( globe, turned so      ┌────┴───────┐ │
│ 1966 ●                   the site faces you,   │ photo       │ │
│ 1969 ◉  ← rail           glowing marker on it) │ APOLLO 11   │ │
│ 1971 ○                                         │ headline    │ │
│ 1972 ○                                         │ story…      │ │
│  …                                             │ [3D model]  │ │
│ 2025 ○                                         │ sources     │ │
│                                                └─────────────┘ │
└───────────────────────────────────────────────────────────────┘
          scroll down = forward in time = closer to today
```

## Files

```
src/engine/
  geo.ts            ✅ done + tested: latLonToVector3(), faceSiteQuaternion()
  Experience.tsx    <Canvas> + <ScrollControls pages={relics.length + 1}> + lights + <Stars>
  Globe.tsx         sphere + NASA texture (worlds[world].texture) + terrain normal map (worlds[world].relief)
  SiteMarkers.tsx   a small glowing dot at every relic; the active one pulses
  CameraRig.tsx     reads useScroll(), slerps the globe between sites, writes progress/activeIndex
  ModelViewer.tsx   small separate <Canvas> with <Stage> + <OrbitControls autoRotate> for hero GLBs
src/ui/
  Landing.tsx       title, Moon / Mars choice (Ibrahim)
  StoryCard.tsx     the right-hand card (photos, text, facts, model, sources)
  TimelineRail.tsx  the left-hand year rail; click a year to jump
  Credits.tsx       every NASA dataset, photo and model credit (Rayan)
  IntroOutro.tsx    world intro before the first relic, "this is today" after the last
```

## How it works (give this to Claude when building it)

1. **Scroll → position.** `ScrollControls pages={relics.length + 1}` with `useScroll()` in
   `CameraRig`. `const f = scroll.offset * (relics.length - 1)` gives a float "relic index".
   `activeIndex = Math.round(f)`. Write `progress` and `activeIndex` to `useTimeline` only when they change.
2. **Turning the globe.** For relics `i = floor(f)` and `i + 1`, compute
   `faceSiteQuaternion(lat, lon, config.lonOffsetDeg)` for each, and
   `globe.quaternion.slerpQuaternions(qa, qb, f - i)`. Smooth it with `maath/easing` `dampQ`
   so it glides. North stays up automatically.
3. **Zoom.** Camera distance about 3.2 between sites and about 2.3 when centered on one:
   `dist = 2.3 + 0.9 * Math.sin(Math.PI * (f - i))`. Damp it too.
4. **Markers.** `latLonToVector3(lat, lon, 1.003, lonOffsetDeg)` gives each marker's position, as
   children of the globe group so they turn with it. Use a small emissive sphere or a sprite.
5. **Jumps.** When `jumpTo` is set, find that relic's index and scroll there:
   `scroll.el.scrollTo({ top: (index / (relics.length - 1)) * (scroll.el.scrollHeight - scroll.el.clientHeight), behavior: "smooth" })`,
   then `clearJump()`. The rail and keyboard use this.
6. **Lighting.** One directional "sun" light from the side so craters show, plus a little ambient
   light and `<Stars>`. Realistic NASA style means a black background with no glow on the planet.
7. **Hero models** live in the card, not on the globe (much easier). Load with `useGLTF` inside
   `<Suspense>` and `<Stage environment={null}>`. Only the active card's model is mounted.
8. **Mobile.** The card becomes a bottom sheet, and the rail shrinks to a progress bar.

## Calibration check (do this right after adding a texture!)

Textures can be centered differently. Put a test marker at a known spot and look:

- **Moon:** Apollo 11 at **lat 0.674, lon 23.473**. It must sit on the southwest edge of the dark,
  smooth Mare Tranquillitatis, near the middle of the near side.
- **Mars:** Olympus Mons at **lat 18.65, lon -133.8**. It must sit on the giant volcano.

If it's off by exactly 180°, set `lonOffsetDeg: 180` in `src/worlds/<world>.ts`. If it's mirrored
(east/west flipped), tell Claude: that means the texture's longitude runs the other way.

## Performance
- Globe texture 4096 × 2048 JPG max (≈1–3 MB). `sphereGeometry args={[1, 128, 128]}`.
- Hero GLBs under ~5 MB each after optimizing; the model viewer only mounts for the active hero.
- `dpr={[1, 2]}` on the Canvas.
