# NASA open data we use

The hackathon requires NASA open data, so we use it everywhere **and show it**: every card
credits its photo, hero cards credit their 3D model, and the Credits screen lists every dataset below.

| What | Dataset | Used for | Who | Notes |
|---|---|---|---|---|
| Moon globe | **NASA SVS CGI Moon Kit** (LRO LROC color map + LOLA displacement) · https://svs.gsfc.nasa.gov/4720 | Moon texture | Ibrahim | Ready-made 2k JPG: `https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg`. For 4k, download the 4k TIFF and run `npm run resize`. The map is **centered on 0° longitude** (`lonOffsetDeg: 0`). Credit: NASA's Scientific Visualization Studio |
| Mars globe | **Viking global color mosaic** (NASA Viking Orbiter, processed by USGS Astrogeology) · https://astrogeology.usgs.gov/search/map/mars_viking_global_color_mosaic_925m (public domain) | Mars texture | Rayan | Done: `public/mars/mars-color.jpg` (4096 × 2048). The originals are huge TIFFs, so it was fetched ready-sized from the USGS WMS: `https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map&service=WMS&version=1.1.1&request=GetMap&layers=MDIM21_color&styles=&srs=EPSG:4326&bbox=-180,-90,180,90&width=4096&height=2048&format=image/png`, then `npm run resize`. Centered on 0° longitude (`lonOffsetDeg: 0`), calibrated on Olympus Mons. Credit: NASA/JPL/USGS |
| Moon relief | **NASA SVS CGI Moon Kit**, LOLA elevation · https://svs.gsfc.nasa.gov/4720 | Crater relief on the Moon globe | Ibrahim | Done: `public/moon/moon-normal.jpg`. Made from `ldem_16_uint.tif` (5760 × 2880, 16-bit half-meters, offset +20,000, centered on 0°) with `npm run normal-map -- ldem_16_uint.tif public/moon/moon-normal.jpg --format svs-lola`. Credit: NASA's Scientific Visualization Studio |
| Mars relief | **MGS MOLA MEGDR** (NASA PDS Geosciences Node) · https://pds-geosciences.wustl.edu/missions/mgs/megdr.html | Volcano and canyon relief on the Mars globe | Rayan | Done: `public/mars/mars-normal.jpg`. Made from `meg016/megt90n000eb.img` (16 px/deg, signed 16-bit big-endian meters, starts at 0°E so the script shifts it half a turn) with `npm run normal-map -- megt90n000eb.img public/mars/mars-normal.jpg --format pds-mola`. Credit: NASA/GSFC/JPL, MOLA team |
| Relic photos | **NASA Image and Video Library API**: `https://images-api.nasa.gov/search?q=<query>&media_type=image` (no API key needed) | 1–3 photos per relic | both | Use the `~medium.jpg` version: `https://images-assets.nasa.gov/image/<nasa_id>/<nasa_id>~medium.jpg`. Page: `https://images.nasa.gov/details/<nasa_id>` |
| Landing / crash sites from orbit | **LROC** (NASA Lunar Reconnaissance Orbiter Camera) · https://www.lroc.asu.edu | "Seen from orbit" Moon photos | Ibrahim | Great for Apollo sites, Surveyor landers, Ranger and LCROSS impact craters. Credit: NASA/GSFC/Arizona State University |
| Mars hardware from orbit | **HiRISE** (NASA Mars Reconnaissance Orbiter) · https://www.uahirise.org | "Seen from orbit" Mars photos | Rayan | Viking 2, Pathfinder, Phoenix, InSight, Spirit, Curiosity and Perseverance descent hardware. Credit: NASA/JPL-Caltech/University of Arizona |
| 3D models | **NASA 3D Resources** · https://science.nasa.gov/3d-resources/ (GLB) | Hero relic models | both | Optimize with `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp` |
| Mission facts | **NSSDCA Master Catalog** · https://nssdc.gsfc.nasa.gov/nmc/ | Dates, masses, coordinates | both | The first place to check facts |
| More photos | **NASA Photojournal** · https://photojournal.jpl.nasa.gov | PIA images | both | Credits on each page |

**NASA hardware only.** The challenge is to tell the story of NASA equipment left on the Moon and
Mars, so every relic must be a NASA spacecraft or a piece of one (landers, rovers, impactors,
descent stages, parachutes). Do not add Soviet, ESA, ISRO, JAXA, CNSA or commercial hardware.

The Credits screen (`src/ui/Credits.tsx`) is built from the data: globe textures from `src/worlds/*.ts`,
photos and models from each relic. Archives are recognized by web address in `DATASETS` in
`src/data/credits.ts`; if you start using a new NASA archive, add it there.

Rules: NASA images and models are generally free to use, but always credit them, and don't use
the NASA logo ("meatball") or insignia as our branding.

## Avoid
- The **Mars Rover Photos API** (api.nasa.gov) has been archived. Don't build on it.
