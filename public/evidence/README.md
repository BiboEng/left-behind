# Bundled NASA evidence

Source metadata, descriptions, captions, credits and processing notes are in src/data/signal.ts,
beside the records, and in Credits.

| File | Record | Credit |
| --- | --- | --- |
| ranger-first.webp | https://images.nasa.gov/details/PIA02975 | NASA/JPL |
| ranger-last.webp | https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/ra7_p200.html | NASA/JPL, NSSDC archive, CP1002 |
| spirit-soil.webp | https://images.nasa.gov/details/PIA09491 | NASA/JPL/Cornell |
| insight-selfie.webp | https://images.nasa.gov/details/PIA25287 | NASA/JPL-Caltech |
| insight-last.webp | https://images.nasa.gov/details/PIA25680 | NASA/JPL-Caltech |
| insight-sol128.wav | https://science.nasa.gov/resource/first-likely-marsquake-heard-by-nasas-insight/ | NASA/JPL-Caltech/CNES/IPGP/Imperial College London |

Images were converted to WebP; the selfie was resized to 1600 px wide. The last Ranger frames
are the archive's enhanced composite, including its original black unreceived regions.
No synthetic details were added. Spirit's published colour image is not a chemical map.

The stereo WAV is an unchanged NASA file:
https://assets.science.nasa.gov/content/dam/science/psd/mars/downloadable_items/4/42692_insight_quake_sol128.wav

SHA-256: 4ce9b036927aeca94802a19a8e475d8f1a630fcb6170784a09408c555f926323

NASA accelerated the vibrations 60×. This is not microphone audio or calibrated raw SEIS
telemetry. It contains wind-related vibration, a likely marsquake and arm movement.
The file contains 48,002 stereo frames at 1,200 Hz (40.001666… seconds).

insight-sol128-playback.wav is a separate stereo PCM16 copy resampled to 16,000 Hz with FFmpeg
for browser compatibility. The source's unusual 1,200 Hz rate failed native Chrome playback.
NASA's 60× speed and pitch are retained. The copy lasts 40.001688 seconds (within one output
sample of the original), uses 2.56 MB, and is not the source of the plotted waveform.

Run npm run signal:audio to regenerate this copy; install FFmpeg only for this optional
regeneration step. Normal builds and tests use the committed asset and do not require FFmpeg.
It was generated with FFmpeg 4.4.2/libswresample 3.9.100, PCM16 stereo, 16,000 Hz, metadata removed,
bitexact flags, no gain/normalization or event selection. See scripts/build-signal-audio.mjs.

Run npm run signal:waveform from the repository root to regenerate src/data/insight-waveform.json.
The script computes peak absolute PCM sample per equal time bin, normalizing both channels with
one shared maximum. This is display amplitude only. Tests recompute every peak and verify the
original audio checksum. No event segmentation, quake detection or ground-motion calibration is performed.

## Apollo 17: a machine in the measurement

`apollo17-catalog.csv` is an unchanged copy of `GradeA_thermal_mq_catalog_final.csv` from
[Civilini, Husker and Weber's CaltechDATA archive, v2.0](https://doi.org/10.22002/d7mk4-f8t44),
published 24 October 2024 under CC0. The v2 update corrects hourly SAC timestamps; this CSV is
identical to v1 (published MD5 `b17645fb59c08f9f0a6a3c2e723ba13f`). Original download:
https://data.caltech.edu/records/d7mk4-f8t44/files/GradeA_thermal_mq_catalog_final.csv?download=1

SHA-256: `c3ee72f706b1f8bbbced6ee81f98ed10f3e23c8bb99616242f89a6ff2d3ba82d`.

Run `npm run lunar:catalog` to reproduce `src/data/lunar-catalog.json`. It groups 13,000 sensor
rows into 3,250 events, preserves all four published arrival strings and takes event direction
and variance from geo1, consistently with the authors' assessment code. One geo4 direction
differs in the source; no source row is corrected or discarded. Catalog coverage is 15 August
1976–25 April 1977, as represented by the actual rows, rather than the dates in the news summary.

The explorer's 80° < direction < 120° comparison and azimuth-variance ≤50 option follow
[the authors' assessment script](https://github.com/civilinifr/thermal_mq_analysis/blob/main/P15_assess_catalog.py).
It does not reproduce every manual exclusion in that analysis. The cutoff is not a confidence
percentage. These are cataloged picks and estimated directions, not raw waveforms or new
source locations. Direction alone does not identify an individual event's source. Relative
arrival times retain microsecond precision; the display does not imply matching measurement accuracy.

NASA's [LSPE instrument record](https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument%3Alspe.a17a&version=1.2)
documents the four-geophone network. The lander-heating interpretation is credited to
[Civilini, Husker and Weber, summarized by Caltech in 2023](https://www.caltech.edu/about/news/the-lunar-alarm-clock-new-study-characterizes-regular-moonquakes).

`apollo17-lander.webp`: NASA/JSC, photograph by Eugene A. Cernan, AS17-134-20382.
Source: https://images.nasa.gov/details/as17-134-20382 . Original copy:
https://images-assets.nasa.gov/image/as17-134-20382/as17-134-20382~medium.jpg .
Resized to 900 × 900 and converted to WebP; no synthetic detail or measurement overlay.
