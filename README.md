# Left Behind

**They went silent. Their evidence didn't.**

An interactive documentary about NASA hardware left on the Moon and Mars. **After the Signal**
invites visitors to investigate archive images and seismic audio, then curate a source-linked
exhibition to share or print. The companion atlas explores 19 relic stories through NASA imagery,
a scroll-through-time globe and an accessible reading mode.

A NASA Space Apps project by **Ibrahim and Rayan**, responding to
[Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/).

## Run locally

Use Node.js 22 and npm. These commands work on macOS and Windows:

```text
npm ci
npm run dev
```

Build and serve the production version:

```text
npm run build
npm run preview
```

## Explore

- Enter **After the Signal**: Ranger 7's incomplete photographs, Spirit's silica discovery, InSight's recorded vibrations and an Apollo 17 seismic mystery.
- Separate observation from interpretation, reveal scientific limits and inspect NASA sources.
- Keep stories and build an exhibition. Copy its link, print/Save PDF or download source notes.
- Direct links include #signal/ranger, #signal/spirit, #signal/insight, #signal/apollo and #signal/exhibit.
- In Apollo's **Find the machine in the measurement**, compare the published directions of 3,250 events, filter by month and estimate quality, and inspect four sensors' arrival picks. Share the exact view or download its evidence receipt with counts, picks, methods, checksum and limits.
- Rebuild the catalog's browser view with `npm run lunar:catalog`. The unchanged CC0 CSV from Civilini, Husker and Weber's NASA-funded study is included; this explorer calculates no new source locations.
- **Save offline pack** on the landing screen or in the evidence-room footer saves all four investigations, both audio WAVs, the Apollo catalog, fonts and exhibition tools on this device. It registers a service worker only after the visitor opts in. NASA websites and atlas media still need a connection.
- Offline saving works on HTTPS or localhost in the production build (`npm run build`, then `npm run preview`). Open the page while online, save, wait for **Saved for offline use**, then disconnect and reload. An unvisited Apollo chapter and the original catalog download are included. Audio seeking uses local HTTP byte-range responses.
- A content fingerprint pins each saved edition; every resource is fetched with SHA-256 Subresource Integrity so a missing-file HTML fallback cannot be mistaken for evidence. A downloaded update offers **Reload to open the new edition**; it does not interrupt an exhibition. **Remove saved pack** unregisters this app's worker and removes only its caches. Browser storage can be cleared or evicted; confirm the saved status before travelling.
- InSight plays a browser-compatible resampling of NASA's 60× stereo sonification. The unchanged original drives the waveform.
- Rebuild its sample-derived display with `npm run signal:waveform`. Regenerating the committed playback copy uses `npm run signal:audio` and requires FFmpeg; normal builds do not.

- Choose the Moon or Mars, then scroll through the timeline or use the labeled Previous / Next buttons.
- Open **Mission index** to search stories, dates and places, or filter by world and mission status.
- Select **Read without 3D** before choosing a world, or **Reading mode** while exploring. All stories and navigation work without WebGL. A WebGL failure also opens reading mode.
- Share a selected relic using the browser URL. For example: `/?view=reading#mars/ingenuity`. Browser Back and Forward restore the location.
- Use the arrow keys, Page Up / Down, or Home / End to navigate. Keyboard shortcuts pause while a dialog or form control has focus.
- Six **Think like an explorer** questions connect mission engineering to scientific evidence, with feedback and a NASA reference.
- Eight hero entries offer optional NASA 3D reference models. Models load only on request; rotation can be paused and respects reduced-motion preferences.
- Every photo/model links to its source. Target regions and approximate positions are labeled; a target marker does not mean lost hardware has been found.

The globe uses real NASA/USGS textures. Small marker symbols and 3D reference models are illustrative, not photographs of the surviving hardware. This is a curated selection, not a complete inventory of objects in space.

## Validate

```text
npm test
npm run lint
npm run build
npm run test:final
```

The first three checks validate data contracts, coordinates, credits, embedded GLB resources,
timeline state, routing, and the production bundle. Pull requests run them in GitHub Actions.

**The final check is a stricter release gate.** It also requires human source verification and a
model for every hero entry. Every hero now has a NASA model (Pathfinder became a standard entry because
NASA publishes no Pathfinder model), so the only remaining failure is human source verification
(`verified: false`). Use [docs/VERIFY.md](docs/VERIFY.md). Do not mark sources verified without human review.

Live: https://left-behind-steel.vercel.app · Demo deck: https://left-behind-steel.vercel.app/demo/ · 29-second video: https://left-behind-steel.vercel.app/demo/left-behind-demo.mp4

## Project documentation

- [Start here](START-HERE.md)
- [Engine architecture](docs/ENGINE.md)
- [Relic data contract](docs/DATA_CONTRACT.md)
- [NASA data and attribution](docs/NASA_DATA.md)
- [Challenge alignment and submission reference](docs/CHALLENGE.md)
- [Global award strategy and prior-winner research](docs/COMPETITION_STRATEGY.md)
- [Submission draft and 30-second demo script](docs/SUBMISSION.md)

## AI assistance

Ibrahim and Rayan defined the project concept and original direction. Devin (Cognition) assisted
with mission discovery, narrative polish, reading-mode/navigation changes and model integration,
and proposed and implemented After the Signal, including interaction design, draft prose, tests and
documentation. The team must review this contribution against current Space Apps SI guidance and
disclose it accurately. New educational text is an AI-assisted draft grounded in linked NASA sources
and still needs human review. NASA photos, audio, textures and models are credited source assets,
not AI-generated media.
