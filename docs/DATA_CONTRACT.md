# Data contract

Everything reads relics through `src/data/index.ts` (`relics.moon`, `relics.mars`, sorted
oldest → newest). Each relic is **one JSON file**:

```
src/data/moon/<id>.json   ← Ibrahim
src/data/mars/<id>.json   ← Rayan
```

One file per relic means you can research several at once (parallel agents) and never edit the
same file as your teammate. The type is in `src/types/relic.ts`.

## Fields

| Field | Rule |
|---|---|
| `id` | kebab-case, unique, **same as the file name** (`apollo-11-eagle`) |
| `world` | `"moon"` or `"mars"`, must match its folder |
| `tier` | `"hero"` (gets a NASA 3D model, ~4 per world) or `"standard"` |
| `name` | the object: "Apollo 11 Lunar Module Eagle (descent stage)" |
| `mission`, `agency` | "Apollo 11", "NASA" |
| `arrived` | `YYYY-MM-DD` (UTC) it reached the surface |
| `lastContact` | optional, `YYYY-MM-DD` it went silent; not before `arrived` |
| `status` | `crashed` (accident) · `impacted` (crashed on purpose) · `lost` (contact lost unexpectedly) · `retired` (ended as planned / wore out) · `abandoned` (left behind on purpose) |
| `location` | `{ name, lat, lon, precision?, note? }`: degrees, latitude north-positive, **longitude east-positive, -180..180**. `precision` is `reported` (default), `approximate`, or `target`; the latter two require a `note` explaining what the marker represents. A target is not located hardware. |
| `headline` | one line, ≤ 90 characters |
| `story` | **2–3** short paragraphs (≤ ~70 words each), **documentary narrator**, third person |
| `facts` | 1–5 `{ label, value }` |
| `images` | 0–3 real photos: `{ url, caption, credit, sourceUrl }`. At least 1 by the end (see NASA_DATA.md) |
| `model` | heroes only: `{ path: "/<world>/models/<file>.glb", credit, sourceUrl, description? }`; file must exist in `public/`. Describe generic, twin-mission, or pre-damage models explicitly; do not imply a reconstruction of the surviving relic. Self-contained GLB, below 10 MB. |
| `sources` | at least 1 `{ title, url }`, https, official where possible |
| `verified` | `true` only after a **human** opened the sources and checked the facts |

## Voice: documentary narrator

Third person, calm and specific, like a museum placard read by a documentary narrator. Lead
with the moment, end with what's left there now.

> On 20 July 1969, the descent stage of Eagle became a launch pad. Its upper half lifted away
> carrying Armstrong and Aldrin; the lower half stayed, gold foil and all, in the Sea of Tranquility.
>
> It is still there, ringed by footprints, a fallen flag and a laser reflector that scientists
> on Earth still aim at today.

(This is a style example only. Every fact in the real entry must come from a source.)

## Tests

- `npm test` checks every rule above on every file.
- `npm run test:final` also fails if any **placeholder** file remains, any relic is **unverified**,
  any relic has **no photo**, or any **hero has no model**. It must pass before deploying.
