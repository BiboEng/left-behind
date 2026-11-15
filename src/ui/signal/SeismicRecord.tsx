// Waveform samples come from the vendored NASA WAV, not an illustrative oscillator.
import { useRef, useState } from "react";
import waveform from "../../data/insight-waveform.json";
import { signalAudio, signalSources } from "../../data/signal";

export default function SeismicRecord() {
  const audio = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [failed, setFailed] = useState(false);
  const [channel, setChannel] = useState<"both" | "vbb" | "sp">("both");
  const seek = (seconds: number) => {
    if (!audio.current || !Number.isFinite(audio.current.duration)) return;
    audio.current.currentTime = Math.min(seconds, audio.current.duration);
    setTime(audio.current.currentTime);
  };
  return <section className="seismic-record" aria-labelledby="seismic-title">
    <div className="record-head">
      <span className="eyebrow">NASA archival audio · SEIS · Sol 128</span>
      <span className="mono">60× speed</span>
    </div>
    <h2 id="seismic-title">Listen through the ground.</h2>
    <p>The vibrations were too slow to hear. NASA sped them up 60 times. Headphones separate the two sensor channels.</p>
    <p className="audio-alternative">Playback copy resampled for browsers; NASA's speed and pitch retained. The waveform uses the unchanged original.</p>
    <div className="record-channel" role="group" aria-label="Waveform channels to display">
      {(["both", "vbb", "sp"] as const).map((value) => <button className="back" key={value}
        aria-pressed={channel === value} onClick={() => setChannel(value)}>
        {value === "both" ? "Both channels" : value === "vbb" ? "Left · VBB" : "Right · SP"}
      </button>)}
    </div>
    <svg className="seismic-plot" viewBox="0 0 640 220" role="img" aria-labelledby="wave-title wave-description"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        seek(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * waveform.duration);
      }}>
      <title id="wave-title">InSight Sol 128: two channels from NASA's audio</title>
      <desc id="wave-description">Peak amplitude in 256 equal time bins per channel, with a shared normalization.
        The complete record is about 40 seconds long at NASA's accelerated playback speed.
        This is a visualization of published audio, not calibrated seismic ground motion.</desc>
      {waveform.channels.map((samples, index) => {
        if ((channel === "vbb" && index === 1) || (channel === "sp" && index === 0)) return null;
        const mid = index === 0 ? 65 : 165;
        return <g key={index} className={index === 0 ? "wave-vbb" : "wave-sp"}>
          <line x1="0" x2="640" y1={mid} y2={mid} className="wave-baseline" />
          {samples.map((peak, i) => <line key={i} x1={(i + 0.5) * 640 / samples.length} x2={(i + 0.5) * 640 / samples.length}
            y1={mid - Math.max(0.6, peak * 42)} y2={mid + Math.max(0.6, peak * 42)} />)}
          <text x="8" y={mid - 48}>{index === 0 ? "VBB · left" : "SP · right"}</text>
        </g>;
      })}
      <line className="wave-playhead" x1={time / waveform.duration * 640} x2={time / waveform.duration * 640} y1="0" y2="220" />
    </svg>
    <label className="audio-seek">
      <span className="mono">Seek through NASA audio <span>{time.toFixed(1)} / {waveform.duration.toFixed(1)} s</span></span>
      <input type="range" min="0" max={waveform.duration} step="0.1" value={time}
        onChange={(e) => seek(Number(e.target.value))} aria-valuetext={`${time.toFixed(1)} seconds of NASA's accelerated audio`} />
    </label>
    <audio ref={audio} controls preload="metadata" src={signalAudio.path}
      aria-label="NASA's InSight Sol 128 seismic sonification at 60 times speed" aria-describedby="audio-alternative"
      onTimeUpdate={() => setTime(audio.current?.currentTime ?? 0)}
      onError={() => setFailed(true)} />
    {failed && <p role="status">Audio could not load. <a href={signalSources.insightSound.url} target="_blank" rel="noreferrer">Open NASA's original</a>.
      {" "}<button className="back" onClick={() => { setFailed(false); audio.current?.load(); }}>Retry audio</button></p>}
    <p id="audio-alternative" className="audio-alternative">{signalAudio.description}</p>
    <details className="record-method"><summary>How to read this waveform</summary>
      <p>{waveform.method} The channel buttons change the displayed traces; playback retains NASA's stereo mix.
        A large peak alone does not identify a marsquake. No event boundaries or quake detections have been inferred here.</p>
      <p>{signalAudio.processing}</p>
      <p><a href={signalSources.insightSound.url} target="_blank" rel="noreferrer">NASA source and description ↗</a>
        {" · "}<a href={signalAudio.sourcePath} download>Download unchanged source WAV</a></p>
      <p className="source-credit">{signalAudio.credit}</p>
    </details>
  </section>;
}
