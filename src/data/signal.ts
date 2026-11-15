// AI-assisted with Devin. Editorial interpretation is separate from observation; source review stays human.
export const CASE_IDS = ["ranger", "spirit", "insight", "apollo"] as const;
export type CaseId = typeof CASE_IDS[number];
export type SignalChapter = "intro" | CaseId | "exhibit";

export const signalSources = {
  apolloInstrument: {
    title: "NASA PDS: Apollo 17 Lunar Seismic Profiling Experiment",
    url: "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument%3Alspe.a17a&version=1.2",
  },
  apolloCatalog: {
    title: "Civilini, Husker & Weber: Apollo 17 seismic catalog, CaltechDATA v2.0 (CC0)",
    url: "https://data.caltech.edu/records/d7mk4-f8t44",
  },
  apolloResearch: {
    title: "Caltech: the lunar alarm clock, NASA-funded study (7 September 2023)",
    url: "https://www.caltech.edu/about/news/the-lunar-alarm-clock-new-study-characterizes-regular-moonquakes",
  },
  apolloPhoto: {
    title: "NASA Image Library: Apollo 17, AS17-134-20382",
    url: "https://images.nasa.gov/details/as17-134-20382",
  },
  rangerCatalog: {
    title: "NSSDC: Ranger 7 impact frames, CP1002",
    url: "https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/ra7_p200.html",
  },
  rangerHistory: {
    title: "NASA History: Ranger 7 photographs the Moon",
    url: "https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/",
  },
  rangerFirst: {
    title: "NASA Image Library: PIA02975",
    url: "https://images.nasa.gov/details/PIA02975",
  },
  spiritChemistry: {
    title: "JPL: Spirit unearths evidence of a wetter past (21 May 2007)",
    url: "https://www.jpl.nasa.gov/news/mars-rover-spirit-unearths-surprise-evidence-of-wetter-past/",
  },
  spiritPhoto: {
    title: "NASA Image Library: PIA09491",
    url: "https://images.nasa.gov/details/PIA09491",
  },
  insightSound: {
    title: "NASA: First likely marsquake, Sol 128 (23 April 2019)",
    url: "https://science.nasa.gov/resource/first-likely-marsquake-heard-by-nasas-insight/",
  },
  insightInterior: {
    title: "JPL: InSight reveals the deep interior of Mars (22 July 2021)",
    url: "https://www.jpl.nasa.gov/news/nasas-insight-reveals-the-deep-interior-of-mars/",
  },
  insightRetirement: {
    title: "JPL: InSight mission retirement (21 December 2022)",
    url: "https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/",
  },
  insightSelfie: {
    title: "NASA Image Library: InSight's final selfie, PIA25287",
    url: "https://images.nasa.gov/details/PIA25287",
  },
  insightLast: {
    title: "NASA Image Library: one of InSight's final images, PIA25680",
    url: "https://images.nasa.gov/details/PIA25680",
  },
} as const;
export type SignalSourceId = keyof typeof signalSources;

export interface EvidenceMedia {
  path: string;
  original: string;
  source: SignalSourceId;
  credit: string;
  alt: string;
  caption: string;
  processing: string;
}

export const signalMedia = {
  apolloLander: {
    path: "/evidence/apollo17-lander.webp",
    original: "https://images-assets.nasa.gov/image/as17-134-20382/as17-134-20382~medium.jpg",
    source: "apolloPhoto",
    credit: "NASA/JSC · Eugene A. Cernan · AS17-134-20382",
    alt: "Harrison Schmitt stands beside the flag at Taurus–Littrow, with the Apollo 17 lunar module at the left and the rover behind him.",
    caption: "13 December 1972. The crew would leave the next day. Challenger's descent stage remained, near the seismic experiment the astronauts deployed.",
    processing: "Resized to 900 × 900 and converted to WebP; no synthetic detail or measurement overlay.",
  },
  rangerFirst: {
    path: "/evidence/ranger-first.webp",
    original: "https://images-assets.nasa.gov/image/PIA02975/PIA02975~orig.jpg",
    source: "rangerFirst",
    credit: "NASA/JPL · PIA02975",
    alt: "Ranger 7's early photograph shows the Moon's cratered terrain from far above.",
    caption: "31 July 1964. The first view: lunar terrain before the spacecraft reached the surface.",
    processing: "WebP conversion; no synthetic detail.",
  },
  rangerLast: {
    path: "/evidence/ranger-last.webp",
    original: "https://nssdc.gsfc.nasa.gov/imgcat/hires/ra7_p200.gif",
    source: "rangerCatalog",
    credit: "NASA/JPL · NSSDC archive · CP1002",
    alt: "Two incomplete black-and-white photographs. Unreceived portions remain black beside and below the visible lunar surface.",
    caption: "The last P3 (top) and P1 (bottom) frames, exposed 0.19 and 0.39 seconds before impact. Transmission stopped before either frame finished.",
    processing: "NASA's enhanced archival composite, converted to WebP. Black areas are part of the archive image.",
  },
  spiritSoil: {
    path: "/evidence/spirit-soil.webp",
    original: "https://images-assets.nasa.gov/image/PIA09491/PIA09491~orig.jpg",
    source: "spiritPhoto",
    credit: "NASA/JPL/Cornell · PIA09491",
    alt: "A pale patch of disturbed soil runs through reddish terrain in the furrow made by Spirit's dragging wheel.",
    caption: "Gertrude Weise, May 2007. A dragging wheel exposed bright soil; instruments, rather than its colour, established the silica result.",
    processing: "WebP conversion of NASA's published colour image; no added measurement overlay.",
  },
  insightSelfie: {
    path: "/evidence/insight-selfie.webp",
    original: "https://images-assets.nasa.gov/image/PIA25287/PIA25287~large.jpg",
    source: "insightSelfie",
    credit: "NASA/JPL-Caltech · PIA25287",
    alt: "InSight's final selfie shows its instrument deck and solar panels coated in Martian dust.",
    caption: "24 April 2022. InSight's final selfie. The mission ended in December of that year.",
    processing: "Resized to 1600 pixels wide and converted to WebP.",
  },
  insightLast: {
    path: "/evidence/insight-last.webp",
    original: "https://images-assets.nasa.gov/image/PIA25680/PIA25680~orig.jpg",
    source: "insightLast",
    credit: "NASA/JPL-Caltech · PIA25680",
    alt: "The domed wind and thermal shield over InSight's seismometer sits on a dusty Martian plain.",
    caption: "11 December 2022. One of InSight's last images: the shield protecting the instrument that listened through the ground.",
    processing: "WebP conversion; no synthetic detail.",
  },
} as const satisfies Record<string, EvidenceMedia>;

export const signalAudio = {
  path: "/evidence/insight-sol128-playback.wav",
  sourcePath: "/evidence/insight-sol128.wav",
  original: "https://assets.science.nasa.gov/content/dam/science/psd/mars/downloadable_items/4/42692_insight_quake_sol128.wav",
  source: "insightSound" as const,
  credit: "NASA/JPL-Caltech/CNES/IPGP/Imperial College London",
  processing: "NASA accelerated the vibrations 60× to make them audible. The browser playback copy is resampled from 1,200 to 16,000 Hz with FFmpeg, retaining that speed and pitch. The unchanged original is retained for the waveform. Left: very broad band sensors; right: short period sensors.",
  description: "Nonverbal audio contains wind-related vibration, the first likely marsquake, and movement of the robotic arm. It is a sonification of ground vibrations, not a microphone recording. The waveform provides a visual alternative to listening.",
};

export interface EvidenceCase {
  id: CaseId;
  relicId: string;
  number: string;
  world: "moon" | "mars";
  date: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  question: string;
  lead: string;
  observation: string;
  interpretation: string;
  limit: string;
  legacy: string;
  exhibitLabel: string;
  reflection: string;
  media: keyof typeof signalMedia;
  sources: readonly SignalSourceId[];
}

export const evidenceCases: readonly EvidenceCase[] = [
  {
    id: "ranger", relicId: "ranger-7", number: "01", world: "moon", date: "31 July 1964",
    eyebrow: "An ending by design",
    title: "The photograph that could not finish.",
    shortTitle: "A photograph",
    question: "Can a spacecraft succeed by crashing?",
    lead: "Ranger 7 had no landing legs. Its task was to send close-up photographs before hitting the Moon. The final frames arrived in pieces. The machine was gone; the evidence had already escaped.",
    observation: "The archived P3 and P1 frames are incomplete. Their exposures were just fractions of a second before impact; the transmission ended at the surface.",
    interpretation: "The returned images helped scientists assess lunar terrain and prepare for the next stages of robotic and human exploration. Destruction was part of this mission's design.",
    limit: "A photograph shows surface appearance, not the strength of the ground underneath. These are separate camera views, not a continuous zoom or a simulation of the descent.",
    legacy: "A machine did not have to survive to make a future landing better informed.",
    exhibitLabel: "An ending can be part of the experiment.",
    reflection: "What would you measure before trusting a place to land?",
    media: "rangerLast",
    sources: ["rangerCatalog", "rangerHistory", "rangerFirst"],
  },
  {
    id: "spirit", relicId: "spirit", number: "02", world: "mars", date: "May 2007",
    eyebrow: "A failure that opened a question",
    title: "The wheel that uncovered a wetter past.",
    shortTitle: "A scar in the soil",
    question: "What could a broken wheel reveal?",
    lead: "One of Spirit's wheels stopped turning. Dragging it disturbed the surface and exposed pale soil. A mechanical problem had opened a window into Mars's past.",
    observation: "The camera shows disturbed, bright soil. Spirit's alpha particle X-ray spectrometer measured a composition of about 90% silica. The thermal emission spectrometer also detected a high-silica signature.",
    interpretation: "The science team linked such a concentrated silica deposit to water-related processes, with acid vapours or a hot spring environment among the proposed origins.",
    limit: "Brightness alone does not establish chemistry. Water-related geology does not establish that Mars had life, and this patch does not uniquely determine how the deposit formed.",
    legacy: "A damaged machine exposed a clue that a working wheel might have passed over.",
    exhibitLabel: "A failure can change what becomes discoverable.",
    reflection: "Which part can you see, and which part needs an instrument?",
    media: "spiritSoil",
    sources: ["spiritChemistry", "spiritPhoto"],
  },
  {
    id: "insight", relicId: "insight", number: "03", world: "mars", date: "6 April 2019 · Sol 128",
    eyebrow: "A record beyond the last signal",
    title: "A silent lander. A planet still speaking.",
    shortTitle: "A tremor",
    question: "What remains when the instrument goes quiet?",
    lead: "InSight did not need to drive. It placed a seismometer on Mars and recorded motion through the ground. Its mission ended in 2022. A record from Sol 128 can still be heard here.",
    observation: "NASA's published stereo clip contains wind-related vibrations, a seismic event described at release as the first likely marsquake, and movement of the lander's arm.",
    interpretation: "Vibrations travelling through a planet carry information about its interior. Across its mission, InSight's seismic observations helped scientists investigate Mars's crust, mantle and core.",
    limit: "This 60× sonification is not sound travelling through Martian air and is not raw, calibrated SEIS telemetry. This one clip alone does not reveal the planet's internal structure.",
    legacy: "The instrument can stop transmitting while its recorded evidence remains available to study.",
    exhibitLabel: "Silence does not erase a scientific record.",
    reflection: "What could another scientist ask of this record in the future?",
    media: "insightLast",
    sources: ["insightSound", "insightInterior", "insightRetirement", "insightLast"],
  },
  {
    id: "apollo", relicId: "apollo-17-challenger", number: "04", world: "moon", date: "1976–77 records · 2023 research",
    eyebrow: "The machine becomes the signal",
    title: "The lander that shook after everyone left.",
    shortTitle: "An unexpected source",
    question: "What if the equipment was part of the measurement?",
    lead: "Apollo 17 left a lander base and four geophones on the Moon. Decades later, researchers returned to their seismic records. Some vibrations pointed toward an unexpected source: the abandoned lander itself.",
    observation: "The published Grade-A catalog contains 3,250 events, each with arrival picks at four geophones and an estimated direction. A concentration appears in the direction the researchers associated with the lunar module.",
    interpretation: "Civilini, Husker and Weber connected regular morning vibrations to heating and expansion of Apollo 17's lander base. A machine left behind had become a source of seismic signals, preserved by another instrument left nearby.",
    limit: "Direction alone does not establish the source of an individual event. The catalog contains selected detections and derived estimates, not raw waveforms, an earthquake-risk map or a live record. The explorer does not recalculate source locations or reproduce every exclusion in the paper.",
    legacy: "A machine can become part of the question its instruments were sent to answer.",
    exhibitLabel: "An archive can make an abandoned machine speak again.",
    reflection: "How would you distinguish a planet's behaviour from the equipment used to observe it?",
    media: "apolloLander",
    sources: ["apolloInstrument", "apolloCatalog", "apolloResearch", "apolloPhoto"],
  },
];

export const caseById = new Map(evidenceCases.map((item) => [item.id, item]));
