# Using Left Behind

A detailed guide to everything the app can do. For an overview, see the [README](../README.md).

## After the Signal (investigations)

- Four investigations: Ranger 7's incomplete photographs, Spirit's silica discovery, InSight's recorded vibrations and an Apollo 17 seismic mystery.
- Separate observation from interpretation, reveal scientific limits and inspect NASA sources.
- Keep stories and build an exhibition. Copy its link, print/Save PDF or download source notes.
- Direct links: `#signal/ranger`, `#signal/spirit`, `#signal/insight`, `#signal/apollo` and `#signal/exhibit`.
- In Apollo's **Find the machine in the measurement**, compare the published directions of 3,250 events, filter by month and estimate quality, and inspect four sensors' arrival picks. Share the exact view or download its evidence receipt with counts, picks, methods, checksum and limits.
- InSight plays a browser-compatible resampling of NASA's 60× stereo sonification. The unchanged original drives the waveform.

## The atlas

- Choose the Moon or Mars, then scroll through the timeline, use the labeled Previous / Next buttons, or the **Next stop** button at the end of each story. **Investigations** in the top bar opens After the Signal from any screen.
- Open **Search** (Ctrl K / ⌘K) to find stories, dates and places across both worlds, or filter by world and mission status. Enter opens the top result.
- Select **Read without 3D** under the world choices, or **Reading mode** while exploring. All stories and navigation work without WebGL, and a WebGL failure also opens reading mode.
- Share a selected relic using the browser URL, for example `/?view=reading#mars/ingenuity`. Browser Back and Forward restore the location.
- Six **Think like an explorer** questions connect mission engineering to scientific evidence, with feedback and a NASA reference.
- Eight hero entries offer optional NASA 3D reference models. Models load only on request; rotation can be paused and respects reduced-motion preferences.
- Every photo and model links to its source. Target regions and approximate positions are labeled; a target marker does not mean lost hardware has been found.

### Keyboard

- Arrow keys, Page Up / Down, Home / End: navigate the timeline.
- Ctrl K / ⌘K: search.
- Esc: close dialogs (use **Home** to leave the globe).
- Shortcuts pause while a dialog or form control has focus.

## Offline pack

**Save offline pack** on the landing screen or in the evidence-room footer saves all four investigations, both audio WAVs, the Apollo catalog, fonts and exhibition tools on the device. NASA websites and atlas media still need a connection.

- A service worker is registered only after the visitor opts in.
- Offline saving works on HTTPS or localhost in the production build (`npm run build`, then `npm run preview`). Open the page while online, save, wait for **Saved for offline use**, then disconnect and reload.
- A content fingerprint pins each saved edition. Every resource is fetched with SHA-256 Subresource Integrity, so a missing-file HTML fallback cannot be mistaken for evidence.
- A downloaded update offers **Reload to open the new edition**; it does not interrupt an exhibition.
- **Remove saved pack** unregisters this app's worker and removes only its caches.
- Audio seeking uses local HTTP byte-range responses.
- Browser storage can be cleared or evicted; confirm the saved status before travelling.

## Data scripts

| Command | What it does |
| --- | --- |
| `npm run lunar:catalog` | Rebuilds the Apollo catalog's browser view from the unchanged CC0 CSV (Civilini, Husker and Weber's NASA-funded study). No new source locations are calculated. |
| `npm run signal:waveform` | Rebuilds InSight's sample-derived waveform display. |
| `npm run signal:audio` | Regenerates the committed playback audio. Requires FFmpeg; normal builds do not. |

## Validation

```text
npm test
npm run lint
npm run build
npm run test:final
```

The first three validate data contracts, coordinates, credits, embedded GLB resources, timeline state, routing and the production bundle. GitHub Actions runs them on every pull request.

`npm run test:final` is a stricter release gate: it also requires human source verification and a model for every hero entry. Every relic is marked verified; each fact was checked against its linked sources on 15 November 2026 (see [VERIFY.md](VERIFY.md) and [EVIDENCE.md](EVIDENCE.md)).
