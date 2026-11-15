# Source verification checklist

Only a human may set `"verified": true`. For each relic, open the sources, tick each line that matches, fix anything that does not, then set the flag in the JSON file. Then run `npm run test:final`.

**Fastest path:** open [EVIDENCE.md](EVIDENCE.md). For 178 of the 186 numbers in the facts, it quotes the exact sentence from the relic's own sources, so most boxes take a few seconds. The 5 marked ✗ sit on JPL pages that block scripted reads, so open those by hand.

AI pre-check (15 Nov, not a substitute for your review): key numbers were compared with sources for every
relic. Spot-checked directly against NSSDCA/HiRISE: LCROSS masses (Centaur about 2,000 kg, LCROSS 534 kg
dry), Surveyor 3 mass (296 kg) and Viking 1's HiRISE image (acquired 22 November 2006). No mismatches found.

Tip: split the list. Ibrahim takes the Moon and Rayan takes Mars. Spend about 5 minutes on each relic, and check the numbers and dates first, because judges will look at those.

## Moon

### Ranger 7

File: `src/data/moon/ranger-7.json` · verified: **false**

- [ ] Arrived 1964-07-31, last contact 1964-07-31, status `impacted`
- [ ] Site: Mare Cognitum (the Known Sea), between Mare Nubium and Oceanus Procellarum (-10.634, -20.677)
- [ ] Launched: 28 July 1964, Cape Canaveral, on an Atlas-Agena B
- [ ] Impact: 31 July 1964, 13:25:48 UT, at 2.62 km/s
- [ ] Pictures returned: 4,308, all in the final 17 minutes
- [ ] Mass: 365.7 kg
- [ ] Crater left behind: About 14 m wide
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Ranger 7 (1964-041A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-041A)
- [NASA History: 60 Years Ago, Ranger 7 Photographs the Moon](https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/)
- [LROC: Making an Impact on History (Ranger 7 crater)](https://lroc.im-ldi.com/images/52)
- [NASA Image Library: First Image of the Moon taken by a U.S. Spacecraft (PIA02975)](https://images.nasa.gov/details/PIA02975)

### Surveyor 1 lander

File: `src/data/moon/surveyor-1.json` · verified: **false**

- [ ] Arrived 1966-06-02, last contact 1967-01-07, status `retired`
- [ ] Site: Oceanus Procellarum (Ocean of Storms), north of the crater Flamsteed (-2.4745, -43.3398)
- [ ] Landed: 2 June 1966, 06:17:36 UT
- [ ] First: U.S. soft landing on the Moon
- [ ] Mass at landing: 294.3 kg
- [ ] Pictures returned: 11,240
- [ ] Mission ended: 13 July 1966; engineering contacts until 7 January 1967
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Surveyor 1 (1966-045A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A)
- [NASA Image Library: Surveyor 1, America's First Soft Lunar Landing (PIA12910)](https://images.nasa.gov/details/PIA12910)
- [NASA Image Library: Surveyor 1 Shadow (PIA02976)](https://images.nasa.gov/details/PIA02976)

### Surveyor 3 lander

File: `src/data/moon/surveyor-3.json` · verified: **false**

- [ ] Arrived 1967-04-20, last contact 1967-05-04, status `abandoned`
- [ ] Site: Oceanus Procellarum (Ocean of Storms), beside the Apollo 12 site (-3.0162, -23.418)
- [ ] Final touchdown: 20 April 1967, 00:04 UTC
- [ ] Mass at landing: 296 kg
- [ ] Pictures returned: 6,326
- [ ] Brought home by Apollo 12: About 10 kg, including the TV camera and scoop
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Surveyor 3](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A)
- [NASA Science: Surveyor 3](https://science.nasa.gov/mission/surveyor-3/)
- [LROC: Apollo 12 Fifty-first Anniversary](https://lroc.im-ldi.com/images/1135)
- [LROC: Surveyor Crater, Before and After](https://lroc.im-ldi.com/images/609)

### Apollo 11 Lunar Module Eagle (descent stage)

File: `src/data/moon/apollo-11-eagle.json` · verified: **false**

- [ ] Arrived 1969-07-20, last contact 1969-07-21, status `abandoned`
- [ ] Site: Tranquility Base, Mare Tranquillitatis (Sea of Tranquility) (0.67416, 23.47314)
- [ ] Touchdown: 20 July 1969, 20:17:40 UTC
- [ ] Left behind: 21 July 1969, when the ascent stage lifted off at 17:54:01 UTC
- [ ] Lunar Module mass: 15,103 kg at launch (both stages, with propellant)
- [ ] Laser reflector: 100 fused-silica corner cubes in a 46 cm panel
- [ ] Plaque: "Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind."
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Apollo 11 Lunar Module / EASEP (1969-059C)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C)
- [NSSDCA: 30th anniversary of Apollo 11](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_11_30th.html)
- [NASA ILRS: Apollo 11 lunar retroreflector](https://ilrs.gsfc.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html)
- [NASA: Apollo 11 mission](https://www.nasa.gov/mission/apollo-11/)
- [NASA History (ALSJ): Six Flags on the Moon: What is Their Current Condition?](https://www.nasa.gov/wp-content/uploads/static/history/alsj/ApolloFlags-Condition.html)

### Apollo 15 Lunar Module Falcon (descent stage) and Lunar Roving Vehicle

File: `src/data/moon/apollo-15-falcon.json` · verified: **false**

- [ ] Arrived 1971-07-30, last contact 1971-08-02, status `abandoned`
- [ ] Site: Hadley–Apennine, at the foot of the Apennine Mountains (26.13239, 3.6333)
- [ ] Landed: 30 July 1971, 22:16 UTC
- [ ] Crew on the surface: David R. Scott, James B. Irwin
- [ ] Time on the Moon: 66 hours 55 minutes
- [ ] Distance driven by the rover: 27.8 km
- [ ] Samples returned: 77.3 kg of rock and soil
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA: Apollo 15 Lunar Module / ALSEP](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C)
- [NSSDCA: Apollo Lunar Roving Vehicle](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html)
- [LROC: Apollo 15, A Mission of Many Firsts](https://lroc.im-ldi.com/images/1198)
- [NASA Science: Memorial to Fallen Astronauts on the Moon](https://science.nasa.gov/resource/memorial-to-fallen-astronauts-on-the-moon)
- [NSSDCA: Apollo 15 mission overview](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo15info.html)

### Apollo 17 Lunar Module Challenger (descent stage) and Lunar Roving Vehicle

File: `src/data/moon/apollo-17-challenger.json` · verified: **false**

- [ ] Arrived 1972-12-11, last contact 1972-12-14, status `abandoned`
- [ ] Site: Taurus–Littrow valley, on the southeastern rim of Mare Serenitatis (20.1911, 30.7723)
- [ ] Landed: 11 December 1972, 19:54:57 UTC
- [ ] Crew on the surface: Eugene A. Cernan, Harrison H. Schmitt
- [ ] Time on the Moon: 75 hours, including 22 h 4 min of moonwalks
- [ ] Distance driven by the rover: 35.9 km
- [ ] Samples returned: 110.4 kg of rock and soil
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA: Apollo 17 Lunar Module / ALSEP](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C)
- [NASA: Apollo 17 mission details](https://www.nasa.gov/missions/apollo/apollo-17-mission-details/)
- [NSSDCA: Apollo Lunar Roving Vehicle](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html)
- [NASA: 50 Years Ago, Apollo 17 Heads Home to Earth](https://www.nasa.gov/history/50-years-ago-apollo-17-heads-home-to-earth/)
- [LROC: Exploring the Apollo 17 Site](https://lroc.im-ldi.com/images/72)
- [LROC: Apollo 17 Remains Unchallenged After Fifty Years](https://lroc.im-ldi.com/images/1278)
- [NASA: Apollo 17 mission page](https://www.nasa.gov/mission/apollo-17/)
- [NASA Image Library: S72-55169, the plaque left on Challenger's ladder](https://images.nasa.gov/details/S72-55169)

### Lunar Prospector

File: `src/data/moon/lunar-prospector.json` · verified: **false**

- [ ] Arrived 1999-07-31, last contact 1999-07-31, status `impacted`
- [ ] Site: Shoemaker crater, near the lunar south pole (-87.7, 42) — shown as approximate
- [ ] Launched: 7 January 1998, 02:28:44 UT, on an Athena 2
- [ ] Discovery: Hydrogen at both poles, announced March 1998: evidence of water ice
- [ ] Mass: 296.4 kg fully fueled
- [ ] Impact: 31 July 1999, 09:52:02 UT, at about 1.69 km/s
- [ ] Passenger: Part of the ashes of geologist Eugene Shoemaker
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Lunar Prospector (1998-001A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1998-001A)
- [NASA Science: Lunar Prospector](https://science.nasa.gov/mission/lunar-prospector/)

### LCROSS shepherding spacecraft and its Centaur upper stage

File: `src/data/moon/lcross.json` · verified: **false**

- [ ] Arrived 2009-10-09, last contact 2009-10-09, status `impacted`
- [ ] Site: Cabeus crater, near the lunar south pole (Centaur impact point) (-84.678, -48.725)
- [ ] Launched: 18 June 2009, with the Lunar Reconnaissance Orbiter, on an Atlas V
- [ ] Centaur impact: 9 October 2009, 11:31:19 UT, about 2.5 km/s
- [ ] LCROSS impact: 11:35:36 UT, about four minutes later
- [ ] Mass: Centaur about 2,000 kg; LCROSS 534 kg dry
- [ ] Result: Water confirmed in Cabeus, announced 13 November 2009
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: LCROSS (2009-031B)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-031B)
- [NASA Science: LCROSS](https://science.nasa.gov/mission/lcross/)
- [NASA press release, 13 November 2009: LCROSS Impact Data Indicates Water on Moon (NSSDCA copy)](https://nssdc.gsfc.nasa.gov/planetary/text/lcross_pr_20091113.txt)
- [NASA Science: LCROSS impact site (LRO LOLA)](https://science.nasa.gov/image-detail/20110615lcross)

### GRAIL twin probes Ebb and Flow

File: `src/data/moon/grail-ebb-and-flow.json` · verified: **false**

- [ ] Arrived 2012-12-17, last contact 2012-12-17, status `impacted`
- [ ] Site: Unnamed mountain in the Moon's northern highlands (75.62, -26.63)
- [ ] Launched: 10 September 2011, 13:08:52 UT, both on one Delta II
- [ ] Formation: Tandem polar orbits about 50 km up, 175–225 km apart
- [ ] Mass: 202.4 kg each, fully fueled
- [ ] Result: The most detailed gravity map of any world at the time, revealing hidden mascons
- [ ] Impact: 17 December 2012, at about 1.68 km/s; site 75.62° N, 26.63° W
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: GRAIL-A, Ebb (2011-046A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-046A)
- [NSSDCA Master Catalog: GRAIL-B, Flow (2011-046B)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-046B)
- [NASA Science: GRAIL (Ebb and Flow)](https://science.nasa.gov/mission/grail/)
- [NASA Image Library: GRAIL Final Resting Spot (PIA16603)](https://images.nasa.gov/details/PIA16603)

### LADEE lunar orbiter

File: `src/data/moon/ladee.json` · verified: **false**

- [ ] Arrived 2014-04-18, last contact 2014-04-18, status `impacted`
- [ ] Site: Lunar far side, near the eastern rim of Sundman IV crater (NSSDCA) (11.8494, -93.2506)
- [ ] Launched: 7 September 2013, 03:27 UTC (6 September, 11:27 p.m. EDT), on a Minotaur V
- [ ] Science orbit: About 50 km up, for about 5 months
- [ ] Mass: About 383 kg, including 135 kg of fuel
- [ ] Also tested: Lunar Laser Communications Demonstration: data by laser
- [ ] Impact: 18 April 2014, between 04:30 and 05:22 UT, at about 1,700 m/s
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: LADEE (2013-047A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2013-047A)
- [NASA Science: LADEE](https://science.nasa.gov/mission/ladee/)
- [NASA Image Library: LADEE Preparations (exosphere explainer)](https://images.nasa.gov/details/GSFC_20171208_Archive_e001395)

## Mars

### Viking 1 Lander (Thomas A. Mutch Memorial Station)

File: `src/data/mars/viking-1-lander.json` · verified: **false**

- [ ] Arrived 1976-07-20, last contact 1982-11-11, status `lost`
- [ ] Site: Western Chryse Planitia (22.27, -47.95)
- [ ] Touchdown: 20 July 1976, 11:53:06 UT
- [ ] Time in contact: About 6 years and 4 months (July 1976 to November 1982)
- [ ] Power: Two plutonium-238 radioisotope generators
- [ ] Why it went silent: A battery-charging update overwrote its antenna-pointing data
- [ ] First seen from orbit: November 2006, by HiRISE on Mars Reconnaissance Orbiter
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Viking 1 Lander](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C)
- [NASA Science: Viking 1](https://science.nasa.gov/mission/viking-1/)
- [JPL: Attempts to Communicate to Viking Lander 1 Concluded (1983)](https://www.jpl.nasa.gov/news/attempts-to-communicate-to-viking-lander-1-concluded/)
- [JPL Publication 82-107: The Viking Lander Monitor Mission, May 1980 to March 1983 (NASA NTRS)](https://ntrs.nasa.gov/citations/19830017477)
- [HiRISE: Viking Lander 1 (Thomas Mutch Memorial Station), PSP_001521_2025](https://www.uahirise.org/PSP_001521_2025)
- [HiRISE: Viking Lander 1 on the 40th Anniversary of the Smithsonian's National Air and Space Museum](https://www.uahirise.org/ESP_046170_2025)

### Viking 2 Lander (Gerald A. Soffen Memorial Station)

File: `src/data/mars/viking-2-lander.json` · verified: **false**

- [ ] Arrived 1976-09-03, last contact 1980-04-11, status `retired`
- [ ] Site: Utopia Planitia, about 200 km west of the crater Mie (47.6673, 134.2809)
- [ ] Landed: 3 September 1976, Utopia Planitia
- [ ] Lander mass: 572 kg
- [ ] Worked for: 1,281 Martian days
- [ ] Switched off: 11 April 1980, after its batteries failed
- [ ] Distance from Viking 1: About 6,460 km
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Viking 2 Lander (1975-083C)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C)
- [NASA Science: Viking 2](https://science.nasa.gov/mission/viking-2/)
- [NASA Photojournal: Viking Lander 2 Gerald A. Soffen Memorial Station Imaged from Orbit (PIA01882)](https://science.nasa.gov/photojournal/viking-lander-2-gerald-a-soffen-memorial-station-imaged-from-orbit)
- [NASA Photojournal: Frost at the Viking Lander 2 Site (PIA00573)](https://science.nasa.gov/photojournal/frost-at-the-viking-lander-2-site)

### Mars Pathfinder lander (Carl Sagan Memorial Station) and Sojourner rover

File: `src/data/mars/mars-pathfinder.json` · verified: **false**

- [ ] Arrived 1997-07-04, last contact 1997-09-27, status `retired`
- [ ] Site: Ares Vallis, Chryse Planitia (19.097, -33.254)
- [ ] Touchdown: 4 July 1997, 16:56:55 UT
- [ ] First rover on Mars: Sojourner (10.6 kg), rolled onto the surface on 6 July 1997
- [ ] Design life vs. actual: Lander: 30 days, lasted nearly 3 times longer. Rover: 7 days, lasted 12 times longer
- [ ] Data returned: More than 16,500 lander images, 550 rover images and more than 15 chemical analyses
- [ ] Sojourner's drive: About 100 m in total, never more than about 12 m from the lander
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Mars Pathfinder Rover / Lander (1996-068A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A)
- [NASA Science: Mars Pathfinder](https://science.nasa.gov/mission/mars-pathfinder/)
- [JPL: Mars Pathfinder Winds Down After Phenomenal Mission (4 November 1997)](https://www.jpl.nasa.gov/news/mars-pathfinder-winds-down-after-phenomenal-mission/)
- [NASA History: 25 Years Ago, Mars Pathfinder Launches to Mars to Deploy Sojourner, the First Planetary Rover](https://www.nasa.gov/history/25-years-ago-mars-pathfinder-launches-to-mars-to-deploy-sojourner-the-first-planetary-rover/)
- [JPL: New NASA Orbiter Sees Details of 1997 Pathfinder Site (11 January 2007)](https://www.jpl.nasa.gov/news/new-nasa-orbiter-sees-details-of-1997-pathfinder-site/)
- [HiRISE: Mars Pathfinder Site (PSP_001890_1995)](https://www.uahirise.org/PSP_001890_1995)
- [NASA Image Library: Sojourner at "Moe" - Color (PIA00967), final transmission and mission end](https://images.nasa.gov/details/PIA00967)

### Deep Space 2 microprobes Amundsen and Scott

File: `src/data/mars/deep-space-2.json` · verified: **false**

- [ ] Arrived 1999-12-03, last contact 1999-12-03, status `lost`
- [ ] Site: Target area near the south polar layered terrain (never found) (-73, 150) — shown as target
- [ ] Launched: 3 January 1999, Cape Canaveral, aboard Mars Polar Lander
- [ ] Names: Amundsen and Scott, after the first explorers to reach the South Pole
- [ ] Goal: Survive impact, penetrate the soil and test a sensor for subsurface water
- [ ] Target: About 73° S, 210° W (150° E)
- [ ] Fate: Never heard from after separation
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NASA Science: Mars Polar Lander / Deep Space 2](https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/)
- [NSSDCA: Mars Polar Lander and Deep Space 2 Landing Sites](https://nssdc.gsfc.nasa.gov/planetary/mars/polar_lander/mpl_ds2_landsite.html)
- [JPL: Mars Penetrator Probes Named for Pioneering Polar Explorers](https://www.jpl.nasa.gov/news/mars-penetrator-probes-named-for-pioneering-polar-explorers/)
- [JPL Special Review Board: Report on the Loss of the Mars Polar Lander and Deep Space 2 Missions (22 March 2000), NASA NTRS](https://ntrs.nasa.gov/citations/20000061966)

### Mars Polar Lander

File: `src/data/mars/mars-polar-lander.json` · verified: **false**

- [ ] Arrived 1999-12-03, last contact 1999-12-03, status `lost`
- [ ] Site: South polar layered terrain (targeted site; never found) (-76.1, 164.7) — shown as target
- [ ] Launched: 3 January 1999, Cape Canaveral, on a Delta II
- [ ] Last contact: 3 December 1999, about 20:00 UTC, just before atmospheric entry
- [ ] Lander mass: 290 kg
- [ ] Probable cause: A false touchdown signal shut off the engines about 40 m above the surface
- [ ] Targeted site: About 76° S, 195° W (165° E), near the south polar cap
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Mars Polar Lander](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1999-001A)
- [NASA Science: Mars Polar Lander / Deep Space 2](https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/)
- [NSSDCA: Mars Polar Lander and Deep Space 2 Landing Sites](https://nssdc.gsfc.nasa.gov/planetary/mars/polar_lander/mpl_ds2_landsite.html)
- [JPL news releases, 3 December 1999 (landing-day status and best-estimate site)](https://www.jpl.nasa.gov/nmp/ds2/news/pressreleases/mpl991203.html)
- [JPL Special Review Board: Report on the Loss of the Mars Polar Lander and Deep Space 2 Missions (JPL D-18709, 22 March 2000), NASA NTRS](https://ntrs.nasa.gov/citations/20000061966)
- [NASA Photojournal PIA02349: Mars Polar Lander, The Search Begins](https://science.nasa.gov/photojournal/mars-polar-lander-the-search-begins)
- [NASA Photojournal PIA03044: Mars Polar Lander NOT Found](https://science.nasa.gov/photojournal/mars-polar-lander-not-found)

### Spirit rover (MER-A)

File: `src/data/mars/spirit.json` · verified: **false**

- [ ] Arrived 2004-01-04, last contact 2010-03-22, status `retired`
- [ ] Site: Troy, beside Home Plate, Columbia Hills, Gusev crater (-14.6004, 175.5254)
- [ ] Landed: 4 January 2004, 04:35 UTC (3 January, 20:35 PST)
- [ ] Planned mission: 90 sols (about three months)
- [ ] Distance driven: 7.73 km
- [ ] Images returned: More than 124,000
- [ ] Mission ended: 25 May 2011, after the last attempts to contact it
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Mars Exploration Rover A, Spirit (2003-027A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A)
- [NASA Science: Mars Exploration Rover Spirit](https://science.nasa.gov/mission/mer-spirit/)
- [JPL: NASA's Spirit Rover Completes Mission on Mars (25 May 2011)](https://www.jpl.nasa.gov/news/nasas-spirit-rover-completes-mission-on-mars/)
- [JPL: Mars Rover Spirit Unearths Surprise Evidence of Wetter Past (21 May 2007)](https://www.jpl.nasa.gov/news/mars-rover-spirit-unearths-surprise-evidence-of-wetter-past/)
- [NASA Photojournal: Orbital View of Spirit at Troy (PIA12205)](https://science.nasa.gov/photojournal/orbital-view-of-spirit-at-troy/)
- [NASA Photojournal: Spirit Traverse Map, Sol 2471 (PIA13730)](https://science.nasa.gov/photojournal/spirit-traverse-map-sol-2471/)
- [HiRISE: Spirit, Spirit, Shining Bright (ESP_021925_1650, 2011)](https://www.uahirise.org/ESP_021925_1650)
- [PDS Geosciences Node MER Analyst's Notebook: Spirit traverse data (final position)](https://an.rsl.wustl.edu/mera/AN/pages/mer/mer_traverse.htm)

### Opportunity rover (MER-B)

File: `src/data/mars/opportunity.json` · verified: **false**

- [ ] Arrived 2004-01-25, last contact 2018-06-10, status `lost`
- [ ] Site: Perseverance Valley, western rim of Endeavour crater, Meridiani Planum (-2.3309, -5.349)
- [ ] Landed: 25 January 2004, 04:54 UTC (24 January in California)
- [ ] Planned mission: 90 sols and about 1,000 meters of driving
- [ ] Distance driven: 45.16 km (28.06 miles)
- [ ] Images returned: More than 217,000
- [ ] Mission ended: 13 February 2019, after its last signal on 10 June 2018 (sol 5,111)
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NASA Science: Mars Exploration Rover Opportunity](https://science.nasa.gov/mission/mer-opportunity/)
- [JPL: NASA's Opportunity Rover Mission on Mars Comes to End (13 February 2019)](https://www.jpl.nasa.gov/news/nasas-opportunity-rover-mission-on-mars-comes-to-end/)
- [JPL: NASA Long-Lived Mars Opportunity Rover Sets Off-World Driving Record (28 July 2014)](https://www.jpl.nasa.gov/news/nasa-long-lived-mars-opportunity-rover-sets-off-world-driving-record/)
- [NSSDCA: MER-B Opportunity](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A)
- [NASA: Opportunity Rover Surpasses Marathon Distance (PIA19157)](https://images.nasa.gov/details/PIA19157)
- [HiRISE: Opportunity Rover in Western Endeavour Crater (ESP_056955_1775, 2018)](https://www.uahirise.org/ESP_056955_1775)
- [PDS Geosciences Node MER Analyst's Notebook: Opportunity traverse data (final position)](https://an.rsl.wustl.edu/mera/AN/pages/mer/mer_traverse.htm)

### Phoenix Mars Lander

File: `src/data/mars/phoenix.json` · verified: **false**

- [ ] Arrived 2008-05-25, last contact 2008-11-02, status `retired`
- [ ] Site: Green Valley, Vastitas Borealis (northern arctic plains) (68.2188, -125.7492)
- [ ] Touchdown: 25 May 2008, 23:38 UT
- [ ] A first: First successful landing in a polar region of Mars
- [ ] Working life: Planned for at least 90 Martian days; worked for more than five months
- [ ] Pictures returned: More than 25,000
- [ ] Last signal: 2 November 2008, relayed by NASA's Mars Odyssey orbiter
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NSSDCA Master Catalog: Phoenix Mars Lander (2007-034A)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A)
- [NASA Science: Mars Phoenix](https://science.nasa.gov/mission/mars-phoenix/)
- [JPL: NASA's Phoenix Spacecraft Reports Good Health After Mars Landing (25 May 2008)](https://www.jpl.nasa.gov/news/nasas-phoenix-spacecraft-reports-good-health-after-mars-landing/)
- [JPL: Bright Chunks at Phoenix Lander's Mars Site Must Have Been Ice (19 June 2008)](https://www.jpl.nasa.gov/news/bright-chunks-at-phoenix-landers-mars-site-must-have-been-ice/)
- [JPL: NASA Spacecraft Confirms Martian Water, Mission Extended (31 July 2008)](https://www.jpl.nasa.gov/news/nasa-spacecraft-confirms-martian-water-mission-extended/)
- [JPL: Mars Phoenix Lander Finishes Successful Work on Red Planet (10 November 2008)](https://www.jpl.nasa.gov/news/mars-phoenix-lander-finishes-successful-work-on-red-planet/)
- [JPL: Phoenix Mars Lander is Silent, New Image Shows Damage (24 May 2010)](https://www.jpl.nasa.gov/news/phoenix-mars-lander-is-silent-new-image-shows-damage/)
- [NASA Photojournal: Ice on Mars - Now You See It (PIA10910)](https://science.nasa.gov/photojournal/ice-on-mars-now-you-see-it/)
- [HiRISE: Phoenix Lander after One Mars Year (ESP_017716_2485)](https://www.uahirise.org/ESP_017716_2485)
- [PDS Geosciences Node Phoenix Analyst's Notebook: Landing Site (68.2188 N, 234.2508 E, IAU 2000 areocentric)](https://an.rsl.wustl.edu/phx2008/help/landing_site.htm)
- [Canadian Space Agency: Phoenix Mars Mission, Canada's meteorological station](https://www.asc-csa.gc.ca/eng/astronomy/mars/phoenix/)

### Curiosity's sky crane (Mars Science Laboratory descent stage)

File: `src/data/mars/curiosity-sky-crane.json` · verified: **false**

- [ ] Arrived 2012-08-06, last contact 2012-08-06, status `impacted`
- [ ] Site: Gale crater, about 650 m from where Curiosity landed (-4.624, 137.402) — shown as approximate
- [ ] Landing: 6 August 2012 (UTC), Gale crater
- [ ] Flew after setting the rover down: About 650 m before hitting the ground
- [ ] First seen from orbit: 7 August 2012, by HiRISE (ESP_028269_1755)
- [ ] Why it crashed: On purpose: it was programmed to fly away from the rover
- [ ] Canadian connection: The rover it lowered carries Canada's APXS spectrometer, led from the University of Guelph
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NASA Photojournal: Changes in Scars From 2012 Mars Landing (PIA19159)](https://science.nasa.gov/photojournal/changes-in-scars-from-2012-mars-landing)
- [NASA Science: Inspecting Curiosity's Descent Stage Crash Site (PIA16023)](https://science.nasa.gov/resource/inspecting-curiositys-descent-stage-crash-site/)
- [HiRISE: Bits and Pieces (ESP_028269_1755), the sky crane impact site](https://www.uahirise.org/ESP_028269_1755)
- [NASA Science: Mars Science Laboratory (Curiosity)](https://science.nasa.gov/mission/msl-curiosity/)
- [Canadian Space Agency: The APXS instrument, Canada's contribution to Curiosity](https://www.asc-csa.gc.ca/eng/astronomy/mars/apxs.asp)

### InSight lander

File: `src/data/mars/insight.json` · verified: **false**

- [ ] Arrived 2018-11-26, last contact 2022-12-15, status `retired`
- [ ] Site: Elysium Planitia (4.5024, 135.6234)
- [ ] Landed: 26 November 2018, 11:52:59 a.m. PST (19:52:59 UTC)
- [ ] Marsquakes recorded: 1,319
- [ ] Mars's core: Molten, about 1,830 km in radius
- [ ] Heat probe ("the mole"): Reached about 40 cm of a planned 5 m
- [ ] Last contact: 15 December 2022; mission declared over on 21 December
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NASA Science: InSight Lander](https://science.nasa.gov/mission/insight/)
- [JPL: NASA Retires InSight Mars Lander Mission After Years of Science (21 December 2022)](https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/)
- [JPL: NASA's InSight Reveals the Deep Interior of Mars (22 July 2021)](https://www.jpl.nasa.gov/news/nasas-insight-reveals-the-deep-interior-of-mars/)
- [JPL: NASA Mars Orbiter Spots Retired InSight Lander to Study Dust Movement (16 December 2024)](https://www.jpl.nasa.gov/news/nasa-mars-orbiter-spots-retired-insight-lander-to-study-dust-movement/)
- [HiRISE: InSight Lander, ESP_057939_1845 (6 December 2018)](https://www.uahirise.org/ESP_057939_1845)
- [Golombek et al. (2020), Location and Setting of the Mars InSight Lander, Instruments, and Landing Site, Earth and Space Science](https://doi.org/10.1029/2020EA001248)

### Ingenuity Mars Helicopter

File: `src/data/mars/ingenuity.json` · verified: **false**

- [ ] Arrived 2021-02-18, last contact 2024-01-25, status `retired`
- [ ] Site: "Valinor Hills", Ingenuity's final airfield (Flight 72), Jezero crater (18.4973, 77.3225)
- [ ] First flight: 19 April 2021: 39.1 seconds, up to 3 meters high
- [ ] Planned: Up to 5 test flights over 30 days
- [ ] Flown: 72 flights, 128.8 minutes in the air, about 17 km
- [ ] Size: 1.8 kg, rotor blades spanning about 1.2 m
- [ ] Final flight: Flight 72, 18 January 2024; mission ended 25 January 2024
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NASA Science: Ingenuity Mars Helicopter](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/)
- [JPL: After Three Years on Mars, NASA's Ingenuity Helicopter Mission Ends (25 January 2024)](https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/)
- [JPL: NASA's Ingenuity Mars Helicopter Team Says Goodbye … for Now (16 April 2024)](https://www.jpl.nasa.gov/news/nasas-ingenuity-mars-helicopter-team-says-goodbye-for-now/)
- [JPL: NASA Performs First Aircraft Accident Investigation on Another World (11 December 2024)](https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/)
- [NASA Photojournal: Ingenuity's Hard Landing (PIA26482)](https://science.nasa.gov/photojournal/ingenuitys-hard-landing/)
- [NASA Photojournal: Perseverance's Mastcam-Z Video of Ingenuity's First Full Flight (PIA24521)](https://science.nasa.gov/photojournal/perseverances-mastcam-z-video-of-ingenuitys-first-full-flight/)
- [NASA Mars 2020 map data: Ingenuity flight waypoints (Flight 72 position)](https://mars.nasa.gov/mmgis-maps/M20/Layers/json/m20_heli_waypoints.json)

### Perseverance's parachute and backshell

File: `src/data/mars/perseverance-parachute.json` · verified: **false**

- [ ] Arrived 2021-02-18, status `abandoned`
- [ ] Site: Jezero crater, around Perseverance's landing site (18.465, 77.43) — shown as approximate
- [ ] Parachute: 21.5 m wide, the biggest ever deployed on Mars
- [ ] Hidden message: "DARE MIGHTY THINGS" in binary, plus JPL's GPS coordinates
- [ ] Released: About 2.1 km above the surface
- [ ] Hit the ground at: About 126 km/h
- [ ] Photographed by Ingenuity: 19 April 2022, Flight 26, from 8 m up
- [ ] Story paragraphs match the sources (no invented numbers or quotes)

Sources:
- [NASA: NASA's Mars Helicopter Spots Gear That Helped Perseverance Rover Land (27 April 2022)](https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasas-mars-helicopter-spots-gear-that-helped-perseverance-rover-land/)
- [NASA Image Library: Mars Decoder Ring (PIA24431)](https://images.nasa.gov/details/PIA24431)
- [NASA Image Library: Debris Field for Perseverance Landing Gear Seen from Mars Helicopter (PIA25218)](https://images.nasa.gov/details/PIA25218)
- [HiRISE: Perseverance Hardware One Day after Landing (ESP_068294_1985)](https://www.uahirise.org/ESP_068294_1985)

## After the Signal investigations

These are in `src/data/signal.ts` (no verified flag). Check each observation, interpretation and limit against its listed sources, including Spirit's Canadian connection note (CSA APXS page).

## Optional addition

NASA named the GRAIL impact site after Sally K. Ride in December 2012. It was left out because no readable NASA source was confirmed today. Add it to the GRAIL story only with a NASA source link.
