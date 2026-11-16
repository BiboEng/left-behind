# Left Behind: After the Signal

## Award position

**Primary target: Best Use of Storytelling.** The project responds to the hardware-storytelling
challenge; this award is a positioning target, not a separately selected challenge or a promised result.

The central idea is **They went silent. Their evidence didn't.** Visitors follow a discovery from
hardware, through a real NASA record, to an interpretation and its limits, then carry it into
an exhibition of their own. The existing 22-story atlas supplies context and scale.

NASA's [2026 judging guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)
assesses Impact, Creativity, Validity, Relevance and Presentation. Local awards and official Global
Nominee selection are separate. Winning in Guelph alone does not guarantee entry into Global Judging.

## Prior-winner research

These are NASA's published descriptions. The lessons are our interpretation, not a judge's
explanation of why each project won.

| Project | Verified award and published work | Lesson applied here |
| --- | --- | --- |
| Astro Sweepers, 2025 | Galactic Impact; an end-to-end orbital-debris compliance and risk-intelligence platform using public orbital data | Finish the user journey. Our journey ends in a usable exhibition, share link, print artifact and source notes. |
| HerCode Space, A Solar Tale, 2025 | Best Use of Storytelling; NASA heliophysics through stories and illustrations for children, classrooms, libraries and outreach | Give a defined audience an emotional throughline and an educational purpose. |
| LunarTech Ensemble, 2023 | Best Use of Science; website and immersive game explaining Apollo lunar seismic data | Make the NASA records essential to the interaction. |
| Spacebee, 2023 | Best Use of Technology; Apollo moonquake locations, types, dates and ALSEP data plots | Preserve the instrument-to-record connection and explain the display. |
| TeamVoyagers, 2023 | Best Storytelling; an interactive water-cycle game | Let interaction advance an understandable scientific story. |

Sources:
- [NASA: 2025 Global Winners](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/)
- [Space Apps: meet the 2025 winners](https://www.spaceappschallenge.org/2025/meet-the-2025-global-winners/)
- [Astro Sweepers project selected by Rayan](https://www.spaceappschallenge.org/2025/find-a-team/astro-sweepers-we-catch-what-space-leaves-behind/?tab=project)
- [NASA: 2023 Global Winners](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/)

A globe and waveform are established formats. Our proposed distinction is the evidence-to-exhibition
story: an unfinished photograph, a clue exposed by damage, and a record outliving its instrument.
The fourth chapter adds a reversal: abandoned equipment itself became a source recorded by
nearby equipment. Visitors can return to a published Apollo 17 catalog and compare that source's
direction, with reproducible event counts and four-sensor arrival picks. We have not established a world-first claim.

## Implementation

1. **The invitation.** InSight's final selfie and “What survives the last signal?” lead into the
   evidence room. Both the new story and existing atlas remain directly accessible.
2. **Ranger 7: an ending by design.** Switch between NASA's first view and the composite of its
   incomplete final frames. Investigate why an intentional impact can be a successful mission.
3. **Spirit: an accidental clue.** Compare wheel-disturbed soil with the APXS result: about 90% silica.
   Distinguish brightness, chemistry, water-related processes and the absence of evidence for life.
4. **InSight: a surviving record.** Play NASA's actual stereo Sol 128 WAV, inspect either channel's
   computed waveform, and seek through it. NASA's 60× acceleration and the display method are visible.
5. **Evidence discipline.** Every case separates observation, interpretation and limits. Source
   links and media credits stay beside the record.
6. **The visitor's contribution.** Keep stories, title an exhibition, add a reader question, and
   share a URL. Print/PDF and text exports retain citations and uncertainty.
7. **Wider context.** Jump into the relevant atlas relic. Mission search, reading mode, models,
   approximate-location labels and aggregate Credits remain available.
8. **Apollo 17: the machine becomes the signal.** Revisit Civilini, Husker and Weber's NASA-funded
   analysis of LSPE data. Compare 3,250 cataloged events by month, direction and estimate quality;
   inspect each event's four published arrival picks. The direction comparison has a fixed scale.
   The share URL and downloadable receipt retain the exact filters, event, counts and provenance.
   A direction match is not presented as proof of an individual event's source.

The evidence room requires no WebGL. Six images and the unchanged InSight source audio total less than
750 kB; a separate 2.56 MB, 16,000 Hz playback WAV avoids native-browser failures with the source's
unusual 1,200 Hz rate. The resampling is disclosed beside the player and in exports. Both copies
are local. Visitors can explicitly save the full evidence room for offline use: all four chapters,
audio, catalog and exhibition tools. The bounded pack excludes remote NASA websites and atlas
media. Downloaded editions wait for a user-triggered reload so a presentation is not interrupted.

The Apollo catalog's 13,000 original sensor rows are grouped into 3,250 events. Its derived view
loads only when the Apollo chapter is opened (about 128 kB gzip). The original 2.73 MB CSV remains
available for download. The checksum and every derived entry are checked automatically. Credits
distinguish NASA's instrument, the researchers' published result and our educational presentation.

## Rubric evidence

| Criterion | Inspectable product evidence | Remaining evidence to earn |
| --- | --- | --- |
| Impact | Classroom exhibition, reader question, print/PDF and source-note export | Trial with intended visitors; no measured learning outcomes are claimed. |
| Creativity | Three meanings of “left behind” ending in a reader-curated exhibition | Show the complete narrative and accurately attribute creative decisions. |
| Validity | NASA sources, explicit limits, checksum-pinned audio, reproducible peaks and automated checks | Human review of draft text and all relic sources. |
| Relevance | NASA hardware, why it was sent, discoveries enabled and what survives | Confirm the team's registered challenge. |
| Presentation | Documentary design, real records, accessible alternatives and a complete beginning/middle/ending | Publish public project/demo links and check them without signing in. |

## Scientific contract

- The editorial interpretation is not a new scientific finding.
- Ranger's images are separate camera views, not a continuous zoom or simulated descent.
- Spirit's soil colour alone does not establish silica, water or life.
- The InSight clip contains wind-related vibration, a likely marsquake and arm movement.
  It is NASA's sonification, not a Martian-air microphone recording or calibrated raw SEIS data.
- The waveform is peak absolute PCM sample per equal time bin, with one shared maximum across channels.
  A script regenerates it and a test checks the original audio checksum and every plotted peak.
- Exhibition exports retain limitations with conclusions.
- Only a human may set source-verification flags.

## Submission and attribution

[SUBMISSION.md](SUBMISSION.md) contains draft fields, NASA resources, AI disclosure and a 30-second
demo script. The [official guide](https://www.spaceappschallenge.org/resources/project-submission-guide/)
allows a video of 30 seconds or less or up to seven slides including its title. Both project and
demo must be publicly accessible. A private development PR does not satisfy that requirement.

Ibrahim and Rayan originated the NASA hardware documentary atlas. Devin proposed the After the
Signal extension and assisted research, interaction design, implementation, tests and prose.
The 2026 guide permits SI tools but says they should not originate the solution idea. The team
has reviewed this contribution against that guidance and confirmed it is disclosed accurately. Do not describe
the extension as solely human-conceived. NASA images/audio/models are credited source assets.

Human source review, SI-guidance review, public demo and deployment are done. The remaining team
work is visitor testing and official submission. Confirm Guelph's local judging/nomination schedule.
Deployment and submission are separate actions and are not performed by this contribution.
