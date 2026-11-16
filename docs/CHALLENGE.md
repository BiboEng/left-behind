# Challenge alignment

## Official challenge

[Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/)
is a 2026 NASA Space Apps challenge.

Its objective is a story-driven educational tool for school-age and casual space enthusiasts:
explain the hardware NASA left behind, why it was sent, and the scientific discoveries it enabled.
An interactive 3D timeline is one of the explicitly suggested formats. A project may tell the
story of **some or all** of the hardware; a complete inventory and deep-space coverage are not required.

This is the direct match to Left Behind's existing concept and NASA-only repository contract.
The team's selected challenge in its Space Apps registration is not stored in this repository.

## How the experience responds

| Challenge goal | Implemented response |
| --- | --- |
| Make mission history engaging | Chronological, NASA-textured Moon/Mars globes; documentary stories and world introductions/endings |
| Connect engineering with science | Mission facts, launch/landing context, and six source-linked learning questions about photos, staging, water evidence, quakes and flight |
| Use real historical/scientific data | 22 relic records with source URLs, NASA imagery and reported coordinates; uncertainty labels for targets and approximate positions |
| Show how the hardware worked | Eight optional NASA model references, with descriptions explaining generic, twin-mission and pre-damage models |
| Reach younger and casual audiences | Searchable mission index, simple question feedback and a reading mode with no WebGL requirement |
| Keep claims traceable | Per-photo/model credits, mission sources, an aggregate Credits dialog and a human-verification release gate |
| Connect hardware to a surviving discovery | After the Signal investigates Ranger/Spirit imagery and InSight audio, separating observation, interpretation and limits |
| Give visitors a role in the story | Reader-curated exhibitions, share URLs, print/PDF and source notes retain citations and uncertainty |

The educational prompts are an initial learning layer, not a tested curriculum. No classroom
learning outcomes or user-research results have been measured.

## NASA resources used

The challenge's [official Resources tab](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/?tab=resources)
lists NSSDCA and mission resources for Apollo, Surveyor, Pathfinder, Spirit/Opportunity,
Viking, InSight and Ingenuity. Left Behind uses those records to build each mission's dates,
purpose, status and story, then connects the mission to its location, imagery and hardware.
It is an application of the records, rather than a list of external links.

Additional actual project inputs include LRO LROC/LOLA, MRO HiRISE, Viking/USGS mosaics,
MOLA elevation, NASA's image library and NASA 3D Resources. Exact sources and credits are in
[NASA_DATA.md](NASA_DATA.md), each relic's JSON and the in-app Credits screen.

## Judging and submission reference

The official [2026 Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)
scores Impact, Creativity, Validity, Relevance and Presentation. These are criteria, not a promise
of an award. Accuracy, clear source attribution and an understandable demo matter alongside the visuals.

The [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/)
requires a high-level summary, detailed description, final-project link, short demo, resource
references and SI/AI-use disclosure. The demo is **up to 7 slides, including the title/introduction,
or a video of 30 seconds or less**. Judges need public links that work without sign-in.

The repository and fork may be private. A private GitHub PR is a development review link and
does not satisfy public final-project/demo access. Deployment is a separate team action; no
deployment or Space Apps submission is performed by these changes.

The guide gives a global project-submission deadline of **15 November 2026, 11:59 p.m. in the
Local Event's time zone** (Universal Event uses the Team Owner's local time). Local judging may
have an earlier deadline. Confirm the applicable event time on the official guide.

## Scientific limits

- All relic facts were checked against their linked sources on 15 November 2026 (docs/VERIFY.md).
- Mars Polar Lander and Deep Space 2 are shown at target regions, not recovered sites.
- Other approximate markers explain which nearby feature the coordinate represents.
- The Apollo model is a generic Lunar Module, and the MER model represents the shared rover design.
- Reference models show hardware design, not the damage or exact present-day condition.
- Pathfinder is a standard entry because NASA publishes no Pathfinder 3D model; every hero entry has one.
- Remote NASA imagery and source pages require a network connection. Text and bundled models
  do not depend on live API calls; this is not an offline/PWA application.

## Development assistance

See the README and [SUBMISSION.md](SUBMISSION.md) for the AI-assistance disclosure, including the
AI-proposed After the Signal extension. The current guide asks teams to originate their solution idea;
the team has reviewed this contribution against that guidance and confirmed the disclosure. Questions and investigations link to
cited NASA sources. No human source-verification flags were changed by the assistant.

[COMPETITION_STRATEGY.md](COMPETITION_STRATEGY.md) records prior-winner research, Best Use of
Storytelling positioning, implemented rubric evidence and remaining human steps.
