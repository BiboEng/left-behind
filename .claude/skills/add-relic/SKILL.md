---
name: add-relic
description: Research and add one or more relics (hardware left on the Moon or Mars) with real NASA photos and sources, as JSON files in src/data/<world>/. Use when someone wants to add or redo relic entries from docs/RELICS.md.
argument-hint: <moon|mars> <relic name>[, <relic name>...]
---

Add relics: $ARGUMENTS

1. Parse the world and the list of names (comma-separated). If the world is missing, infer it and say so.
2. Skip any relic that already has a file in `src/data/<world>/` (unless the person asked to redo it).
3. Launch one `nasa-historian` subagent **per relic, in parallel** (max 6 at a time). Give each:
   the world, the name, its row from `docs/RELICS.md`, and "write `src/data/<world>/<id>.json` per
   `docs/DATA_CONTRACT.md` with 1–3 real NASA photos". Each relic is its own file, so they can't collide.
4. When all are done, run `npm test` and fix contract errors.
5. Show the human one block per relic: headline, arrived → last contact, coordinates, photo
   thumbnails as links, sources, the NASA 3D model link if any, and anything uncertain.
   Ask them to open the sources. Set `verified: true` only on the ones they confirm.
6. If real relics now exist for this world, offer to delete its `placeholder-*` files.
7. Suggest `/sync`.
