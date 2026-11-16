# Plan

**No fixed phases or task assignments anymore.** Ibrahim and Rayan work from prompts and pick
whatever is most useful next. This file is just a loose backlog: tick or delete items as they get
done, add new ones as they come up.

## Done
- [x] Project set up, on GitHub
- [x] Engine: globe, camera, markers, story card, timeline rail, keyboard, scroll
- [x] Moon texture (NASA CGI Moon Kit)
- [x] Moon relics researched: Ranger 7, Surveyor 1, Surveyor 3, Apollo 11, Apollo 15, Apollo 17, LCROSS
- [x] Mars relics researched: all 12 in `docs/RELICS.md`
- [x] NASA-only cleanup: removed Luna 2, Luna 9, Lunokhod 1, Mars 3, Beagle 2, Schiaparelli, Zhurong;
      added Ranger 7, Surveyor 1, LCROSS, Viking 2, Deep Space 2, Curiosity sky crane, Perseverance parachute
- [x] Mars texture (Viking MDIM 2.1 color mosaic), calibrated on Olympus Mons
- [x] Credits screen (`src/ui/Credits.tsx`), built automatically from the data

## Still to do (any order)
- [ ] Verify every relic: open its sources, then set `verified: true` (humans only). Checklist: `docs/VERIFY.md`
- [x] Added Lunar Prospector, GRAIL Ebb and Flow, LADEE (15 Nov, unverified)
- [ ] More Moon relics (NASA only): Apollo 12 Intrepid, Apollo 14 Antares, Apollo 16 Orion
- [x] Delete the `placeholder-*` files in `src/data/moon/` and `src/data/mars/`
- [x] Hero models (8). Pathfinder moved to `standard`: NASA has no Pathfinder model
- [ ] Taglines, intros and outros in `src/worlds/moon.ts` and `src/worlds/mars.ts`
- [ ] Landing screen polish; loading screen so textures don't pop in
- [ ] Read every card start to end and fix anything awkward
- [ ] Test: `/preview` on both laptops and a phone; `npm run test:final` passes
- [x] Deployed: https://left-behind-mu.vercel.app (Vercel project `left-behind`)
- [x] Demo: 7-slide deck at https://left-behind-mu.vercel.app/demo/ (Space Apps allows 7 slides or 30 s of video, not 1–2 minutes)
- [ ] Submit on the Space Apps team page before 11:59 p.m. ET, 15 Nov 2026 (fields in `docs/SUBMISSION.md`)
