# Project submission draft

Describes implemented behavior. Replace the two public links after publishing, review facts and
SI attribution, and check the [official guide](https://www.spaceappschallenge.org/resources/project-submission-guide/).

## Project name

Left Behind: After the Signal

## High-level summary

NASA's machines may stop transmitting, but their evidence can keep working. Left Behind is an
interactive documentary about hardware left on the Moon and Mars. Visitors inspect Ranger 7's
unfinished photographs, follow the discovery exposed by Spirit's damaged wheel, and hear InSight's
recorded ground vibrations. Each investigation separates observation, interpretation and scientific
limits. Visitors then curate a source-linked exhibition they can share, print or bring into a
classroom. A 19-story globe atlas connects these surviving records to the machines and places that
produced them.

## Final project link

Add the approved public deployment URL. Check the landing, a direct #signal/insight link and
a shared exhibition without authentication.

## Demo link

Add a public video of 30 seconds or less or a deck of at most seven slides including its title.
A long browser-test recording is development evidence, not a compliant submission demo.

## Detailed description

Left Behind answers “Abandoned but not Forgotten” by following NASA equipment's scientific role
after its operational life. Visitors investigate three records and preserve a story with its sources attached.

Ranger 7 shows that destruction can be a mission's planned conclusion. An archive composite preserves
two incomplete final camera frames. The interaction explains what their surface detail can establish
and why an image cannot measure ground strength.

Spirit shows how damage can unexpectedly expose a clue. Visitors compare bright disturbed soil with
an explanation of the Alpha Particle X-ray Spectrometer's approximately 90% silica finding.
Water-related geological interpretations are distinguished from a claim of life.

InSight connects a silent lander to a surviving record. NASA's supplied stereo Sol 128 WAV plays locally.
A reproducible script parses 48,002 stereo PCM frames into 256 peak-amplitude bins per channel.
Visitors can inspect either channel and seek through the clip. NASA's 60× acceleration, the mixture
of seismic and other vibrations, and the absence of calibrated ground-motion units are stated beside
the display. No new quake detection or interior inversion is claimed.

Each investigation links to the hardware in a NASA-textured Moon/Mars atlas with 19 selected relic
stories, mission facts, imagery and optional 3D reference models. Search and a renderer-independent
reading mode support visitors who prefer text or cannot use WebGL.

The final exhibition is the visitor's contribution. Selected stories retain observations, interpretations,
limits and citations. Visitors can add a title and reader question, copy a share URL, print/Save PDF
and download plain-text source notes. No account or backend database is required. Reader captions
are explicitly distinct from NASA statements.

The application uses React, TypeScript, Vite, Zustand, Three.js, React Three Fiber and drei. Vitest
checks data contracts, routing/history, source/media integrity and waveform reproducibility. Core
evidence images/audio are bundled locally. Source pages and some atlas imagery need a connection;
the application is not an offline product.

The audience is school-age explorers and casual space enthusiasts. The classroom guide asks visitors
to distinguish observations from interpretations and ask what further evidence they need. These are
intended benefits, not measured classroom outcomes.

## NASA data

- [Ranger impact frames, NSSDC CP1002](https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/ra7_p200.html)
- [NASA history: Ranger 7](https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/)
- [Ranger first image, PIA02975](https://images.nasa.gov/details/PIA02975)
- [JPL: Spirit's silica discovery](https://www.jpl.nasa.gov/news/mars-rover-spirit-unearths-surprise-evidence-of-wetter-past/)
- [Spirit disturbed soil, PIA09491](https://images.nasa.gov/details/PIA09491)
- [NASA: InSight's first likely marsquake and audio](https://science.nasa.gov/resource/first-likely-marsquake-heard-by-nasas-insight/)
- [JPL: InSight and the deep interior](https://www.jpl.nasa.gov/news/nasas-insight-reveals-the-deep-interior-of-mars/)
- [JPL: InSight retirement](https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/)
- [Final selfie, PIA25287](https://images.nasa.gov/details/PIA25287)
- [One of InSight's last images, PIA25680](https://images.nasa.gov/details/PIA25680)
- Atlas: NASA Image and Video Library, NSSDCA mission catalog, LRO LROC/LOLA,
  MRO HiRISE, Viking/USGS imagery, MOLA and NASA 3D Resources. See [NASA_DATA.md](NASA_DATA.md).

Credits appear in the application and exported notes. Audio credit:
NASA/JPL-Caltech/CNES/IPGP/Imperial College London. Audio is unchanged; the envelope is a
described display transformation, not a calibrated measurement.

## Other references and tools

React, TypeScript, Vite, Zustand, Three.js, React Three Fiber, drei, maath, Inter, Sharp,
Vitest, jsdom and Oxlint. Google Draco decoder provenance/licensing is bundled.
Exact versions are in the lockfile; in-app Credits identifies all image/model owners.

## SI/AI disclosure draft

Ibrahim and Rayan originated the NASA hardware documentary-atlas concept. Devin, a Cognition AI
development assistant, researched sources and prior projects, proposed the After the Signal
extension, and assisted its interaction design, code, tests, documentation and draft prose.
The original atlas was also improved with AI assistance. The team must review this contribution
against current SI guidance; do not describe the extension as wholly human-conceived.

No generative images, video scenes, voices, models or scientific measurements were created.
NASA imagery/audio are credited archive assets. The waveform is computed from the supplied WAV,
not generated by an AI model. Reader captions are user-authored. Human source verification remains pending.

## 30-second demo script

| Time | Show | Suggested narration |
| --- | --- | --- |
| 0–4 s | Landing and dusty InSight selfie | “The machines went silent. Their evidence didn't.” |
| 4–9 s | Ranger final frames; reveal interpretation | “An unfinished photograph. A spacecraft designed to crash.” |
| 9–14 s | Spirit image → instrument result | “A broken wheel exposed a clue. Instruments connected it to water.” |
| 14–21 s | Play InSight; seek the waveform | “A silent lander left a record of a moving planet.” |
| 21–27 s | Select stories; show sourced exhibition | “Follow the evidence. Keep its limits. Curate what survives.” |
| 27–30 s | Exhibition and project title | “Left Behind. NASA stories that keep working.” |

Show actual behavior. Keep the “about 90%,” “60×” and scientific limits visible where possible.
Avoid invented user statistics, global-first claims or a claim that this one clip reveals Mars's core.

## Final submission steps

Human-review sources and SI disclosure; confirm the registered challenge and Guelph's global-nomination
process; replace both public links and test them without signing in; use an allowed demo length;
include resource and tool references; submit through the official team page. Saving a draft or
opening a development PR does not submit the project.
