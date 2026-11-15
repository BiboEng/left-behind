# Left Behind

A NASA open data hackathon project by **Ibrahim** (owns the Moon) and **Rayan** (owns Mars).
**Deadline: 2 days.** Prefer simple, working and finished over clever.

The user picks **Moon** or **Mars**. A realistic NASA-textured globe appears. Scrolling down moves
forward in time: the globe turns to the real landing coordinates of each piece of hardware humanity
left there (crashed probes, landers, rovers, a helicopter), from the very first arrival to the most
recent. Each stop has a card with real NASA photos, a short documentary-style story, quick facts,
sources, and, for hero relics, a spinning NASA 3D model.

## Key docs
- `docs/PLAN.md`: loose backlog of what is done and what is left (no phases, no assignments)
- `docs/ENGINE.md`: how the 3D works (keep it this simple)
- `docs/DATA_CONTRACT.md`: the relic JSON format and voice
- `docs/RELICS.md`: the 25 relics to research
- `docs/NASA_DATA.md`: every NASA dataset we use, and how to credit it

## Stack
Vite + React 19 + TypeScript · three.js via `@react-three/fiber` + `@react-three/drei` · `maath` for
smoothing · `zustand` for shared state · Vitest · Vercel. Runs on **Mac and plain Windows (PowerShell)**:
use npm scripts and Node, not bash-only commands, in anything the humans have to run.

## Commands
- `npm run dev`: dev server, http://localhost:5173
- `npm run build`: typecheck + production build
- `npm run preview`: serve the production build at http://localhost:4173 (`-- --host` for phones)
- `npm test`: data contract + geo math tests
- `npm run test:final`: also fails on placeholders, unverified relics, missing photos or hero models
- `npm run resize -- <in> <out.jpg> [width]`: resize/convert NASA images and textures (works on Mac and Windows)

## How we work
There are **no fixed phases or task assignments** anymore: Ibrahim and Rayan work from prompts and
pick whatever is most useful next (see the backlog in `docs/PLAN.md`). Some skills and agents still
mention phases (P0–P5), "Day 1" or PLAN.md phase checkboxes; ignore those parts. Everything else
they say still applies.

## Who owns what
| Path | Owner |
|---|---|
| `src/data/moon/**`, `src/worlds/moon.ts`, `public/moon/**`, `src/ui/Landing.tsx` | Ibrahim |
| `src/data/mars/**`, `src/worlds/mars.ts`, `public/mars/**`, `src/ui/Credits.tsx` | Rayan |
| `src/engine/**`, other `src/ui/**` | Ibrahim builds them on Day 1; after that, either of you, but say so in the commit message |
| `src/types/**`, `src/state/**`, `src/data/index.ts`, `src/worlds/types.ts`, `CLAUDE.md`, `.claude/**`, `docs/**`, `package.json` | Shared. Tell your teammate before changing |

When working for one person, don't edit the other person's world files. If something there needs
to change, stop and say what, so they can be told.

## Contracts
1. **Data**: `src/types/relic.ts` + `docs/DATA_CONTRACT.md`. Import from `src/data/index.ts`.
2. **State**: `src/state/timeline.ts`. The engine writes `progress` and `activeIndex` and clears `jumpTo`.
   The UI sets `world` and calls `jumpToRelic()`.
3. **World config**: `src/worlds/<world>.ts` (texture, colors, intro and outro text, `lonOffsetDeg`).
4. **Geo math**: `src/engine/geo.ts` is tested; use it, don't rewrite it.

## Rules
- **Facts must be real and sourced.** No invented dates, numbers or quotes. If unsure, leave it out
  and keep `verified: false`. Only a human sets `verified: true`.
- **NASA open data is required**: credit every photo, model and texture, and keep `docs/NASA_DATA.md`
  and the Credits screen up to date. Don't use the NASA logo as our branding.
- Story voice: **documentary narrator**, third person (see `docs/DATA_CONTRACT.md`).
- Style: realistic NASA. Black space, real textures, restrained typography, no cartoon glow.
- Both humans are **new to 3D**. When you build 3D code, add short comments explaining *why*, and
  finish by telling them what to look at in the browser.
- Before saying anything is done: `npm run build` and `npm test` pass.
- Git: everyone works on `main`, in their own files. Use `/sync` to commit, pull and push.
  Never force-push. Never deploy unless someone runs `/deploy`.

## Agents (`.claude/agents/`)
- `nasa-historian`: researches a relic and writes its JSON with NASA photos and sources
- `world-builder`: the 3D globe, camera, markers, textures, models (explains 3D as it goes)
- `ui-engineer`: cards, rail, landing, credits, mobile, accessibility
- `qa-tester`: runs every check and reports problems (doesn't fix them)

## Skills
`/start-phase <ibrahim|rayan>` · `/add-relic <moon|mars> <names…>` · `/sync` · `/preview` · `/deploy`
