# Project submission draft

Describes implemented behavior. Paste each section into the matching field on the team's Project
page, review facts and SI attribution, and check the
[official guide](https://www.spaceappschallenge.org/resources/project-submission-guide/).
Deadline: **Sunday 15 November 2026, 11:59 p.m. Guelph time (ET)**. Only clicking
**Submit for Judging** counts; saving progress does not.

## Project name

Left Behind: After the Signal

## High-level summary

NASA's machines may stop transmitting, but their evidence can keep working. Left Behind is an
interactive documentary about hardware left on the Moon and Mars. Visitors inspect Ranger 7's
unfinished photographs, follow the discovery exposed by Spirit's damaged wheel, hear InSight's
recorded ground vibrations, and revisit an Apollo 17 catalog to investigate vibrations associated
with an abandoned lander. Each investigation separates observation, interpretation and scientific
limits. Visitors then curate a source-linked exhibition they can share, print or bring into a
classroom, including without an internet connection after saving the evidence room. A 22-story globe atlas connects these surviving records to the machines and places that
produced them.

## Final project link

https://left-behind-mu.vercel.app

Public, no sign-in. Checked on the live deployment: the landing page, `#signal/apollo`, `#mars/insight`, a
shared exhibition link and the offline save (29 files, all integrity-checked).

## Demo link

https://left-behind-mu.vercel.app/demo/

A seven-slide deck (the limit includes the title slide), hosted with the project, so it needs no sign-in.
Slide 1 embeds a 29-second captioned walkthrough recorded from the live site, also available on its own at
https://left-behind-mu.vercel.app/demo/left-behind-demo.mp4 (MP4/H.264, silent, under the 30-second limit).
If you prefer to submit the video as the demo, use that link, or upload the MP4 to YouTube as Public or Unlisted.
It shows the team name, members and challenge, as the guide requires. Use the arrow keys to move
between slides. A PDF copy is in `docs/demo-deck.pdf` if a file upload is needed elsewhere.
The deck shows no faces or voices: Space Apps forbids the likeness of anyone under 18.

## Detailed description

Left Behind answers “Abandoned but not Forgotten” by following NASA equipment's scientific role
after its operational life. Visitors investigate four records and preserve a story with its sources attached.

Ranger 7 shows that destruction can be a mission's planned conclusion. An archive composite preserves
two incomplete final camera frames. The interaction explains what their surface detail can establish
and why an image cannot measure ground strength.

Spirit shows how damage can unexpectedly expose a clue. Visitors compare bright disturbed soil with
an explanation of the Alpha Particle X-ray Spectrometer's approximately 90% silica finding.
Water-related geological interpretations are distinguished from a claim of life.

InSight connects a silent lander to a surviving record. A browser-compatible copy of NASA's stereo
Sol 128 WAV plays locally. It is resampled from 1,200 to 16,000 Hz with FFmpeg, retaining NASA's speed,
pitch and stereo channels. The unchanged original remains downloadable and is the waveform source.
A reproducible script parses its 48,002 stereo PCM frames into 256 peak-amplitude bins per channel.
Visitors can inspect either channel and seek through the clip. NASA's 60× acceleration, the mixture
of seismic and other vibrations, and the absence of calibrated ground-motion units are stated beside
the display. No new quake detection or interior inversion is claimed.

Each investigation links to the hardware in a NASA-textured Moon/Mars atlas with 22 selected relic
stories, mission facts, imagery and optional 3D reference models. Search and a renderer-independent
reading mode support visitors who prefer text or cannot use WebGL.

Apollo 17 reverses the question: what if the equipment became part of the measurement? Visitors
compare 3,250 selected LSPE seismic events from Civilini, Husker and Weber's published catalog.
They can filter by month, direction and estimate quality, remove the lunar-module direction sector,
and compare the four published sensor-arrival picks behind an event. A shareable investigation
URL and downloadable evidence receipt preserve the filters, counts, picks, sources and limits.
The unchanged CC0 CSV is bundled with a pinned SHA-256. The explorer reproduces catalog results;
it calculates no new source locations, and a direction match does not prove an event's source.

The final exhibition is the visitor's contribution. Selected stories retain observations, interpretations,
limits and citations. Visitors can add a title and reader question, copy a share URL, print/Save PDF
and download plain-text source notes. No account or backend database is required. Reader captions
are explicitly distinct from NASA statements.

On the live site, Lighthouse (mobile) scores 97–98 for performance and 100 for accessibility, best
practices and SEO. The application uses React, TypeScript, Vite, Zustand, Three.js, React Three Fiber and drei. Vitest
checks data contracts, routing/history, source/media integrity, waveform and catalog reproducibility.
An optional offline pack saves every chapter, local evidence asset, audio, catalog, font and exhibition
tool. Each edition is content-fingerprinted, and SHA-256 integrity checks verify every downloaded
resource before the complete batch is saved. Updates wait for an explicit reload. Offline audio
seeking uses byte-range responses. External source websites and atlas media still need a connection.

The audience is school-age explorers and casual space enthusiasts. A printable 45-minute teacher guide
and student worksheet (https://left-behind-mu.vercel.app/classroom/) fits Ontario Grade 6 Science and
Technology (Strand E: Space) and Grade 9 Science (SNC1W, Strand E). It asks students to separate
observations from interpretations and to name what further evidence they need. These are intended
benefits, not measured classroom outcomes; the next step is a trial with students in Guelph.

The story also reaches home. Phoenix carried the Canadian Space Agency's weather station, which detected
snow falling on Mars, and Curiosity carries Canada's APXS spectrometer, whose science team is led from
the University of Guelph. Spirit's investigation shows how the same kind of instrument kept making
discoveries after Spirit fell silent.

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
- [NASA PDS: Apollo 17 Lunar Seismic Profiling Experiment](https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument%3Alspe.a17a&version=1.2)
- [NASA-funded Apollo 17 research: Caltech's lunar alarm clock](https://www.caltech.edu/about/news/the-lunar-alarm-clock-new-study-characterizes-regular-moonquakes)
- [Civilini, Husker and Weber's LSPE catalog, CaltechDATA v2.0, CC0](https://data.caltech.edu/records/d7mk4-f8t44)
- [Apollo 17 photograph, NASA/JSC, AS17-134-20382](https://images.nasa.gov/details/as17-134-20382)
- Atlas: NASA Image and Video Library, NSSDCA mission catalog, LRO LROC/LOLA,
  MRO HiRISE, Viking/USGS imagery, MOLA and NASA 3D Resources. See [NASA_DATA.md](NASA_DATA.md).

Credits appear in the application and exported notes. Audio credit:
NASA/JPL-Caltech/CNES/IPGP/Imperial College London. The original audio is unchanged and drives the
waveform; browser playback uses a disclosed 16,000 Hz resampling. The envelope is a described display
transformation, not a calibrated measurement.

The LSPE catalog is a published research product from NASA instrument records. The educational
view counts events once, groups four sensor rows per event, and preserves source direction estimates
and arrival picks. These are described transformations, not AI-generated scientific measurements.

## Space Agency Partner data

- [Canadian Space Agency: Phoenix Mars Mission](https://www.asc-csa.gc.ca/eng/astronomy/mars/phoenix/):
  Canada's meteorological station on Phoenix, whose lidar detected snow falling from clouds about 4 km up.
- [Canadian Space Agency: APXS, Canada's contribution to Curiosity](https://www.asc-csa.gc.ca/eng/astronomy/mars/apxs.asp):
  the CSA-funded spectrometer whose science team is led by Ralf Gellert of the University of Guelph. Spirit's
  investigation links its silica result to this successor instrument.

## Other references and tools

React, TypeScript, Vite, Zustand, Three.js, React Three Fiber, drei, maath, Inter, Sharp,
Vitest, jsdom and Oxlint. Google Draco decoder provenance/licensing is bundled.
Exact versions are in the lockfile; in-app Credits identifies all image/model owners.

## SI/AI disclosure draft

Ibrahim and Rayan originated the NASA hardware documentary-atlas concept. Devin, a Cognition AI
development assistant, researched sources and prior projects, proposed the After the Signal
extension, and assisted its interaction design, code, tests, documentation and draft prose.
The original atlas was also improved with AI assistance. On 15 November, Claude (Anthropic) assisted
with deployment, an offline-mode fix, the demo deck and 29-second captioned screen recording, the
classroom guide and worksheet, the Canadian Space Agency connection text, the visual redesign, three added Moon relics, a fact-by-fact source check, and submission drafting.
The team must review this contribution against current SI guidance; do not describe the extension
as wholly human-conceived.

No generative images, video scenes, voices, models or scientific measurements were created. The demo
video is a real screen recording of the project with typed captions; it contains no AI-generated imagery
or audio.
NASA imagery/audio are credited archive assets. The waveform is computed from the supplied WAV,
not generated by an AI model. Reader captions are user-authored. Relic facts were checked one by one against their linked NASA sources on 15 November 2026 (see docs/VERIFY.md and docs/EVIDENCE.md).

## 30-second demo script

| Time | Show | Suggested narration |
| --- | --- | --- |
| 0–4 s | Landing and dusty InSight selfie | “The machines went silent. Their evidence didn't.” |
| 4–8 s | Ranger final frames → Spirit's disturbed soil | “An unfinished photograph. A broken wheel. A surviving clue.” |
| 8–12 s | Play InSight; seek the waveform | “A silent lander left a record of a moving planet.” |
| 12–21 s | Apollo: compare all directions and lander sector | “On the Moon, an abandoned lander became a seismic source. Inspect the published catalog.” |
| 21–27 s | Four-story exhibition and saved-offline status | “Compare the records. Keep their limits. Take your story offline.” |
| 27–30 s | Exhibition and project title | “Left Behind. NASA stories that keep working.” |

Show actual behavior. Keep the “about 90%,” “60×” and scientific limits visible where possible.
Avoid invented user statistics, global-first claims or a claim that this one clip reveals Mars's core.

## Final submission steps

1. **Human source review**: done. Every relic was checked against its sources on 15 November 2026
   ([VERIFY.md](VERIFY.md)).
2. **SI disclosure**: the guide says SI tools "should not be used to come up with your idea". The
   atlas concept is yours; After the Signal was proposed by Devin. Describe this accurately in the SI field.
3. **Team page**: confirm both members are registered for the Guelph Local Event and appear on the
   Members tab. Edit the Project tab and paste the fields above. The team name is **Space Agents**
   (slides 1 and 7 of `public/demo/index.html` and `docs/demo-deck.pdf`).
4. **Links**: open both links in a private window to confirm they work without signing in.
5. Optional but recommended by Space Apps: request a FortiGuard Web Filter classification for
   `left-behind-mu.vercel.app` (category: Education) so judges' networks do not block it.
6. Tick both checkboxes and click **Submit for Judging** before 11:59 p.m. ET. A confirmation banner
   appears when it worked. You can edit and resubmit until the deadline.
