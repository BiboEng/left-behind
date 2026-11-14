# The 2-day plan

**Ibrahim owns the Moon. Rayan owns Mars.** Each of you does your world end to end: research,
photos, texture, models, intro and outro. On Day 1 Ibrahim builds the shared engine while Rayan
researches, so nobody waits for anybody.

Times are rough. If a phase runs long, cut from the stretch goals in `docs/RELICS.md`, not from testing.

```
            IBRAHIM (Moon)                      RAYAN (Mars)
DAY 1  ┌─ P0 Setup ─────────── together, ~45 min ───────────────┐
       │  P1 Build the engine (~4h)     P1 Research Mars (~4h)  │
       │  P2 Research Moon (~3h)        P2 Mars look + Credits  │
DAY 2  │  P3 Polish the Moon (~3h)      P3 Polish Mars (~3h)    │
       ├─ P4 Test together ──────────── ~2h ────────────────────┤
       └─ P5 Deploy (LAST) ──────────── ~1h ────────────────────┘
```

Tick boxes as you go. `/start-phase <ibrahim|rayan>` reads this file to tell you what's next.

---

## P0 · Setup (together, ~45 min)
- [ ] Ibrahim: unzip, `npm install`, `npm run dev` works, pushed to GitHub, Rayan added
- [ ] Rayan: cloned, `npm install`, `npm run dev` works
- [ ] Both: `npm test` passes, `frontend-design` plugin installed, `/` shows the skills
- [ ] Both: read `CLAUDE.md` and this plan

## P1 · Day 1, first half

### Ibrahim · Build the engine (~4h) · agents: `world-builder`, `ui-engineer`
- [ ] Moon texture from the NASA CGI Moon Kit in `public/moon/`, set in `src/worlds/moon.ts`
- [ ] `Experience`, `Globe`, `CameraRig`, `SiteMarkers` per `docs/ENGINE.md`
- [ ] Calibration check passes (Apollo 11 marker on Mare Tranquillitatis)
- [ ] `StoryCard` + `TimelineRail` + Back button, working on the placeholder data for **both** worlds
- [ ] `/sync` so Rayan can pull it

**Done when:** you can pick Moon or Mars, scroll, and the globe glides between the placeholder sites with a card for each.

### Rayan · Research Mars (~4h) · agent: `nasa-historian` · skill: `/add-relic`
- [ ] `/add-relic mars Mars 3, Viking 1, Pathfinder, Mars Polar Lander, Beagle 2, Spirit` (they run in parallel)
- [ ] `/add-relic mars Opportunity, Phoenix, Schiaparelli, InSight, Ingenuity, Zhurong`
- [ ] Open the sources for each one yourself, then mark it `verified: true`
- [ ] Each relic has at least 1 real photo (NASA Image Library / HiRISE)
- [ ] Note which heroes have a NASA 3D model (the historian reports it)
- [ ] Delete the Mars placeholder files, then `/sync`

**Done when:** 12 verified Mars relics with photos are pushed.

## P2 · Day 1, second half

### Ibrahim · Research the Moon (~3h)
- [ ] `/add-relic moon Luna 2, Luna 9, Surveyor 3, Apollo 11, Lunokhod 1, Apollo 15, Apollo 17`
- [ ] `/add-relic moon Lunokhod 2, Lunar Prospector, LCROSS, Vikram Chandrayaan-2, SLIM, Resilience`
- [ ] Verify each one yourself; at least 1 photo each; note models for heroes
- [ ] Delete the Moon placeholder files, then `/sync`

### Rayan · Mars look + Credits (~3h) · agents: `world-builder`, `ui-engineer`
- [ ] `git pull` (or `/sync`) to get Ibrahim's engine
- [ ] Mars texture (Viking color mosaic) in `public/mars/`, set in `src/worlds/mars.ts`
- [ ] Calibration check passes (Olympus Mons marker on the volcano)
- [ ] `src/ui/Credits.tsx`: every NASA dataset, photo and model credit, pulled from the data automatically
- [ ] Mars tagline, intro, outro in `src/worlds/mars.ts`, then `/sync`

**Done when:** Mars looks like Mars, the markers sit in the right places, and Credits lists everything.

## P3 · Day 2 morning: polish your world (~3h each)

### Ibrahim (Moon) + landing screen
- [ ] Hero models: download from NASA 3D Resources, optimize, put in `public/moon/models/`, set `model` in the JSON
- [ ] Moon tagline, intro, outro (what's coming next)
- [ ] Landing screen polished with `frontend-design` (realistic NASA look)
- [ ] Read every Moon card start to end. Fix anything awkward

### Rayan (Mars) + loading
- [ ] Hero models for Mars, same process, in `public/mars/models/`
- [ ] Loading screen (`useProgress` from drei) so the texture doesn't pop in
- [ ] Read every Mars card start to end. Fix anything awkward

Both: `/sync` when done.

## P4 · Test together (~2h)
- [ ] `/preview` on **both** laptops (Mac and Windows): full scroll through the Moon and Mars
- [ ] Phone test: `npm run preview -- --host`, open the Network URL on the same Wi-Fi
- [ ] `npm run test:final` passes (no placeholders, all verified, every relic has a photo, every hero has a model)
- [ ] Fix or cut every bug on the list
- [ ] Rehearse the demo: who talks, which 3 relics to show off

## P5 · Deploy (LAST, ~1h)
- [ ] `/deploy` (Vercel), live URL works on a laptop and a phone
- [ ] Record a 1–2 minute screen capture for the submission
- [ ] Submit: live URL, GitHub repo, video, and which NASA data you used (copy from `docs/NASA_DATA.md`)
