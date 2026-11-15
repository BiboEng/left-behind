# Plan

**No fixed phases or task assignments anymore.** Ibrahim and Rayan work from prompts and pick
whatever is most useful next. This file is just a loose backlog: tick or delete items as they get
done, add new ones as they come up.

## Done
- [x] Project set up, on GitHub
- [x] Engine: globe, camera, markers, story card, timeline rail, keyboard, scroll
- [x] Moon texture (NASA CGI Moon Kit)
- [x] Moon relics researched: Luna 2, Luna 9, Surveyor 3, Apollo 11, Lunokhod 1, Apollo 15, Apollo 17
- [x] Mars relics researched: all 12 in `docs/RELICS.md`

## Still to do (any order)
- [ ] Verify every relic: open its sources, then set `verified: true` (humans only)
- [ ] More Moon relics: Lunokhod 2, Lunar Prospector, LCROSS, Vikram (Chandrayaan-2), SLIM, Resilience
- [x] Delete the `placeholder-*` files in `src/data/moon/` and `src/data/mars/`
- [ ] Hero models: download the NASA `.glb`, optimize, put in `public/<world>/models/`, set `model` in the JSON
      (Moon: Apollo Lunar Module · Mars: Viking lander, Mars Exploration Rover, InSight, Ingenuity;
      NASA has no Pathfinder model)
- [ ] Mars texture (Viking color mosaic) in `public/mars/`, set in `src/worlds/mars.ts`, calibration check (Olympus Mons)
- [ ] Credits screen `src/ui/Credits.tsx`: every NASA dataset, photo and model credit, pulled from the data
- [ ] Taglines, intros and outros in `src/worlds/moon.ts` and `src/worlds/mars.ts`
- [ ] Landing screen polish; loading screen so textures don't pop in
- [ ] Read every card start to end and fix anything awkward
- [ ] Test: `/preview` on both laptops and a phone; `npm run test:final` passes
- [ ] Deploy (`/deploy`), record a 1–2 minute video, submit (live URL, repo, video, NASA data used)
