// Compatibility playback asset only. The original NASA WAV remains the waveform's source of truth.
// FFmpeg is needed only to regenerate this committed asset, not to build or use the app.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const original = fileURLToPath(new URL("../public/evidence/insight-sol128.wav", import.meta.url));
const playback = fileURLToPath(new URL("../public/evidence/insight-sol128-playback.wav", import.meta.url));
const result = spawnSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-nostdin", "-i", original,
  "-map_metadata", "-1", "-ar", "16000", "-ac", "2", "-c:a", "pcm_s16le",
  "-fflags", "+bitexact", "-flags:a", "+bitexact", "-y", playback,
], { stdio: "inherit" });
if (result.error) {
  console.error("Install FFmpeg from https://ffmpeg.org/download.html to regenerate the playback copy.");
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);
console.log("Created stereo 16,000 Hz playback copy. NASA's 60× speed is retained; original source unchanged.");
