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

Run npm run signal:waveform from the repository root to regenerate src/data/insight-waveform.json.
The script computes peak absolute PCM sample per equal time bin, normalizing both channels with
one shared maximum. This is display amplitude only. Tests recompute every peak and verify the
original audio checksum. No event segmentation, quake detection or ground-motion calibration is performed.
