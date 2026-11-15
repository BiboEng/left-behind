// Reproducible display data from NASA's unchanged WAV; no synthesis or calibrated seismic claims.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function waveformFromWav(bytes, bins = 256) {
  if (bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("Expected a RIFF WAV file");
  }
  let format, pcm;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const name = bytes.toString("ascii", offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (start + size > bytes.length) throw new Error("Truncated WAV chunk");
    if (name === "fmt ") {
      if (size < 16) throw new Error("Incomplete WAV format");
      format = {
        encoding: bytes.readUInt16LE(start), channels: bytes.readUInt16LE(start + 2),
        sampleRate: bytes.readUInt32LE(start + 4), blockAlign: bytes.readUInt16LE(start + 12),
        bitsPerSample: bytes.readUInt16LE(start + 14),
      };
    }
    if (name === "data") pcm = bytes.subarray(start, start + size);
    offset = start + size + (size % 2);
  }
  if (!format || !pcm || format.encoding !== 1 || format.bitsPerSample !== 16 || format.channels !== 2
      || format.blockAlign !== 4 || !format.sampleRate || pcm.length % 4) {
    throw new Error("Expected complete stereo 16-bit PCM");
  }
  const frames = pcm.length / format.blockAlign;
  if (!Number.isInteger(bins) || bins < 1 || bins > frames) throw new Error("Invalid bin count");
  const channels = Array.from({ length: 2 }, () => Array(bins).fill(0));
  let maximum = 0;
  for (let frame = 0; frame < frames; frame++) {
    const bin = Math.min(bins - 1, Math.floor(frame * bins / frames));
    for (let channel = 0; channel < 2; channel++) {
      const value = Math.abs(pcm.readInt16LE(frame * 4 + channel * 2));
      channels[channel][bin] = Math.max(channels[channel][bin], value);
      maximum = Math.max(maximum, value);
    }
  }
  return {
    sha256: createHash("sha256").update(bytes).digest("hex"),
    sampleRate: format.sampleRate, frames, duration: frames / format.sampleRate, bins,
    method: "Peak absolute PCM sample per equal time bin; both channels divided by one shared maximum. Display amplitude only, not calibrated ground motion.",
    channels: channels.map((samples) => samples.map((value) => maximum ? Number((value / maximum).toFixed(5)) : 0)),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = new URL("../public/evidence/insight-sol128.wav", import.meta.url);
  const output = new URL("../src/data/insight-waveform.json", import.meta.url);
  const result = waveformFromWav(readFileSync(input));
  writeFileSync(output, JSON.stringify(result) + "\n");
  console.log("NASA audio waveform:", result.frames, "frames,", result.duration.toFixed(3), "seconds,", result.sha256);
}
