# Rayan: catch-up context

Snapshot as of **14 Nov 2026** (commit `158ec1f`). Read this once, then work from `CLAUDE.md` and
`docs/PLAN.md`. You can also tell Claude: *"Read RAYAN.md and CLAUDE.md, then help me with the next Mars task."*

## The project in one paragraph

**Left Behind** is our NASA open data hackathon entry (deadline: 2 days). You pick the Moon or Mars, a
NASA-textured 3D globe appears, and scrolling moves forward in time. The globe turns to the real landing
spot of each piece of hardware humanity left there, and a card shows real NASA photos, a short
documentary-style story, facts and sources. Hero relics also get a spinning NASA 3D model.
Ibrahim does the Moon, you do Mars, but **anyone can now edit any file**.

## What changed since the plan you saw

- **Phases and task assignments are retired.** Ignore `/start-phase`, "Day 1", "P0–P5" and the
  per-person steps in `START-HERE.md`. Pick whatever is most useful from `docs/PLAN.md`.
- **No file ownership.** The `// OWNER:` comments and the ownership check in `/sync` are leftovers. To
  avoid merge conflicts, say in chat what you're working on and `/sync` often.
- **The Mars research is already done** (Ibrahim ran it with Claude). Your job now is mostly to
  **check it, finish it and polish it**, not to start from scratch.

## Where Mars stands

| Item | State |
|---|---|
| Engine (globe, scroll, markers, card, timeline rail, keyboard) | ✅ Done, shared by both worlds |
| Mars texture | ✅ `public/mars/mars-color.jpg`, Viking MDIM 2.1 color mosaic, 4096 × 2048, calibrated on Olympus Mons (`lonOffsetDeg: 0`) |
| 12 Mars relics in `src/data/mars/` | ✅ Written, each with 2–3 NASA photos and sources. ❌ **none verified** |
| Credits screen | ✅ Built automatically from the data (`src/ui/Credits.tsx`) |
| Mars tagline, intro, outro (`src/worlds/mars.ts`) | ❌ Still `TODO (Rayan)` placeholders |
| Hero 3D models | ❌ None yet. Mars heroes: Viking 1, Pathfinder, Spirit, InSight, Ingenuity |

`npm test` passes (27 passed, 4 skipped). `npm run test:final` **will fail** until every relic is
verified and every hero has a model.

## Your Mars to-do list (in a sensible order)

1. **Verify the 12 relics.** For each file in `src/data/mars/`, open its `sources`, check the dates,
   coordinates, numbers and story against them, and fix anything wrong. Only then set
   `"verified": true`. Claude is not allowed to do this step; it has to be a human.
   Relics: Mars 3, Viking 1, Mars Pathfinder, Mars Polar Lander, Beagle 2, Spirit, Opportunity,
   Phoenix, Schiaparelli, InSight, Ingenuity, Zhurong.
2. **Write the Mars tagline, intro and outro** in `src/worlds/mars.ts`: documentary narrator voice,
   third person (see `docs/DATA_CONTRACT.md`). Outro idea from `docs/RELICS.md`: Curiosity and
   Perseverance are still working there. **Check their current status before writing it.**
3. **Hero models.** Download the NASA `.glb` from https://science.nasa.gov/3d-resources/, optimize it
   (`npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp`,
   keep it under ~5 MB), put it in `public/mars/models/`, and set `model` in the relic's JSON.
   - **Mars Pathfinder:** NASA has no Pathfinder model. Either find a NASA model that fits or change its
     `tier` to `"standard"`, otherwise `test:final` fails.
4. **Read every Mars card** from start to end in the browser and fix anything awkward.
5. Shared polish (with Ibrahim): landing screen, a loading screen so textures don't pop in, then
   `/preview` on a laptop and a phone, then `/deploy` at the very end.

## Running it

```
git pull --rebase
npm install
npm run dev          # http://localhost:5173
```

- Calibration check: http://localhost:5173/?calibrate puts a red dot on Olympus Mons; it should sit on the volcano.
- If `npm run dev` complains about a missing native module (rolldown, sharp…), delete `node_modules`
  and `package-lock.json`, then `npm install` again. Ibrahim is on Windows, so this can happen after a pull.
- Before saying anything is done: `npm run build` and `npm test` both pass.

## Handy commands in Claude

- `/add-relic mars <name>`: research a new relic (stretch ideas: Mars 2, Viking 2, Curiosity's sky crane, Perseverance's parachute)
- `/sync`: commit, pull Ibrahim's work, run the tests, push. Never force-push.
- `/preview`: production build on your laptop and phone
- `/deploy`: only at the very end, when you both agree

## Rules worth remembering

- **Facts must be real and sourced.** If unsure, leave it out and keep `verified: false`.
- **Credit every NASA photo, model and texture**; the Credits screen picks them up from the JSON.
  If you use a new NASA archive, add it to `DATASETS` in `src/data/credits.ts`.
- Realistic NASA style: black space, real textures, no cartoon glow. No NASA logo as our branding.
- Don't use the archived Mars Rover Photos API.
