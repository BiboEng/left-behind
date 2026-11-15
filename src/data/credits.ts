// Everything the Credits screen shows, built from the data itself: a new relic, photo, model or
// globe texture is credited automatically. The only hand-written part is DATASETS, the archives
// we pull from, recognized by the web address of each photo, model, texture and source.
import type { Relic, RelicImage, World } from "../types/relic";
import { worlds } from "../worlds";
import { relics } from "./index";

export interface Dataset {
  name: string;
  url: string;
  /** web hosts that belong to this archive */
  hosts: string[];
  /** only URLs whose path starts with this (for archives that share a host) */
  pathPrefix?: string;
}

/** Order matters: the first match wins, so put path-specific entries before their host's general one. */
export const DATASETS: Dataset[] = [
  {
    name: "NASA 3D Resources",
    url: "https://science.nasa.gov/3d-resources/",
    hosts: ["science.nasa.gov"],
    pathPrefix: "/3d-resources",
  },
  { name: "NASA Image and Video Library", url: "https://images.nasa.gov", hosts: ["images.nasa.gov", "images-assets.nasa.gov"] },
  { name: "NASA Scientific Visualization Studio", url: "https://svs.gsfc.nasa.gov", hosts: ["svs.gsfc.nasa.gov"] },
  {
    name: "USGS Astrogeology Science Center (Viking Orbiter mosaics)",
    url: "https://astrogeology.usgs.gov",
    hosts: ["astrogeology.usgs.gov", "planetarymaps.usgs.gov"],
  },
  {
    name: "LROC, the Lunar Reconnaissance Orbiter Camera",
    url: "https://www.lroc.asu.edu",
    hosts: ["www.lroc.asu.edu", "lroc.asu.edu", "lroc.im-ldi.com"],
  },
  {
    name: "HiRISE, on NASA's Mars Reconnaissance Orbiter",
    url: "https://www.uahirise.org",
    hosts: ["www.uahirise.org", "uahirise.org", "hirise.lpl.arizona.edu"],
  },
  { name: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/", hosts: ["nssdc.gsfc.nasa.gov"] },
  {
    name: "NASA Planetary Data System, Geosciences Node",
    url: "https://pds-geosciences.wustl.edu",
    hosts: ["pds-geosciences.wustl.edu", "an.rsl.wustl.edu"],
  },
  { name: "NASA Technical Reports Server", url: "https://ntrs.nasa.gov", hosts: ["ntrs.nasa.gov"] },
  { name: "International Laser Ranging Service (NASA Goddard)", url: "https://ilrs.gsfc.nasa.gov", hosts: ["ilrs.gsfc.nasa.gov"] },
  { name: "NASA Jet Propulsion Laboratory", url: "https://www.jpl.nasa.gov", hosts: ["www.jpl.nasa.gov", "jpl.nasa.gov"] },
  {
    name: "NASA Science, including the Photojournal",
    url: "https://science.nasa.gov",
    hosts: ["science.nasa.gov", "assets.science.nasa.gov", "photojournal.jpl.nasa.gov", "mars.nasa.gov"],
  },
  { name: "NASA.gov", url: "https://www.nasa.gov", hosts: ["www.nasa.gov", "nasa.gov"] },
  {
    name: "Canadian Space Agency (Space Apps partner): Phoenix weather station and Curiosity's APXS",
    url: "https://www.asc-csa.gc.ca/eng/astronomy/mars/",
    hosts: ["www.asc-csa.gc.ca", "asc-csa.gc.ca", "www.csa-asc.gc.ca"],
  },
];

export function datasetFor(url: string): Dataset | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  return DATASETS.find(
    (d) => d.hosts.includes(parsed.hostname) && (!d.pathPrefix || parsed.pathname.startsWith(d.pathPrefix)),
  );
}

export interface DatasetUse {
  dataset: Dataset;
  textures: number;
  photos: number;
  models: number;
  sources: number;
}

export interface Credits {
  /** globe color maps and terrain relief maps */
  textures: { key: string; world: World; name: string; credit: string; url: string }[];
  datasets: DatasetUse[];
  /** sources that aren't a NASA archive (other agencies, journals, press) */
  otherSources: number;
  models: { relic: Relic; credit: string; url: string }[];
  photos: { world: World; name: string; relics: { relic: Relic; images: RelicImage[] }[] }[];
  photoCount: number;
}

const WORLD_ORDER: World[] = ["moon", "mars"];

export function buildCredits(): Credits {
  const uses = new Map<Dataset, DatasetUse>();
  let otherSources = 0;
  const count = (url: string, kind: "textures" | "photos" | "models" | "sources") => {
    const dataset = datasetFor(url);
    if (!dataset) {
      if (kind === "sources") otherSources++;
      return;
    }
    const use = uses.get(dataset) ?? { dataset, textures: 0, photos: 0, models: 0, sources: 0 };
    use[kind]++;
    uses.set(dataset, use);
  };

  const textures: Credits["textures"] = [];
  for (const w of WORLD_ORDER) {
    const config = worlds[w];
    if (config.texture) {
      count(config.textureSourceUrl, "textures");
      textures.push({ key: `${w}-color`, world: w, name: config.name, credit: config.textureCredit, url: config.textureSourceUrl });
    }
    if (config.relief) {
      count(config.relief.sourceUrl, "textures");
      const name = `${config.name}, terrain relief`;
      textures.push({ key: `${w}-relief`, world: w, name, credit: config.relief.credit, url: config.relief.sourceUrl });
    }
  }

  const all = WORLD_ORDER.flatMap((w) => relics[w]);
  const models: Credits["models"] = [];
  for (const relic of all) {
    relic.images.forEach((img) => count(img.sourceUrl, "photos"));
    relic.sources.forEach((s) => count(s.url, "sources"));
    if (relic.model) {
      count(relic.model.sourceUrl, "models");
      models.push({ relic, credit: relic.model.credit, url: relic.model.sourceUrl });
    }
  }

  const photos = WORLD_ORDER.map((w) => ({
    world: w,
    name: worlds[w].name,
    relics: relics[w].filter((r) => r.images.length > 0).map((relic) => ({ relic, images: relic.images })),
  })).filter((group) => group.relics.length > 0);

  // Most-used archives first, but keep DATASETS order between equals.
  const total = (u: DatasetUse) => u.textures + u.photos + u.models + u.sources;
  const datasets = DATASETS.flatMap((d) => (uses.has(d) ? [uses.get(d)!] : [])).sort((a, b) => total(b) - total(a));

  return {
    textures,
    datasets,
    otherSources,
    models,
    photos,
    photoCount: all.reduce((n, r) => n + r.images.length, 0),
  };
}
