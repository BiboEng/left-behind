// Turn a NASA elevation grid into a NORMAL MAP for the globe, so craters, volcanoes and canyons
// catch the light. Works the same on Mac and Windows:
//
//   npm run normal-map -- <input> <output.jpg> --format <svs-lola|pds-mola> [--width 2048] [--exaggerate 6]
//
// Moon (NASA SVS CGI Moon Kit, LOLA, https://svs.gsfc.nasa.gov/4720):
//   npm run normal-map -- ldem_16_uint.tif public/moon/moon-normal.jpg --format svs-lola
// Mars (MGS MOLA MEGDR 16 px/deg, NASA PDS Geosciences Node):
//   npm run normal-map -- megt90n000eb.img public/mars/mars-normal.jpg --format pds-mola
//
// What a normal map is: for every pixel, the direction the ground faces, stored as a color
// (red = east/west tilt, green = north/south tilt, blue = straight up). three.js uses it to
// light each pixel as if the surface were bumpy, without adding any geometry. We compute it from
// the 16-bit heights (not from an 8-bit image), so smooth plains don't show stair-step bands.
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const format = opt("format");
const outW = Number(opt("width", "2048"));
// Real slopes are gentle at globe scale (one pixel is several km wide), so exaggerate them a bit.
const exaggerate = Number(opt("exaggerate", "6"));

if (!input || !output || !["svs-lola", "pds-mola"].includes(format)) {
  console.error("Usage: npm run normal-map -- <input> <output.jpg> --format <svs-lola|pds-mola> [--width 2048] [--exaggerate 6]");
  process.exit(1);
}

/** Heights in meters, row 0 = 90°N, centered on 0° longitude with east to the right (like our textures). */
async function readHeights() {
  if (format === "svs-lola") {
    // 16-bit unsigned TIFF in half-meters, offset by +20,000 so every value is positive (SVS 4720 notes).
    // Already centered on 0° longitude.
    // toColourspace("grey16") keeps all 16 bits (other paths quietly drop to 8-bit values).
    const { data, info } = await sharp(input, { limitInputPixels: false })
      .toColourspace("grey16")
      .raw({ depth: "ushort" })
      .toBuffer({ resolveWithObject: true });
    const px = new Uint16Array(data.buffer, data.byteOffset, info.width * info.height);
    const h = new Float32Array(px.length);
    for (let i = 0; i < px.length; i++) h[i] = (px[i] - 20000) * 0.5;
    return { h, w: info.width, hgt: info.height, radius: 1737400 };
  }
  // PDS MOLA MEGDR .img: raw signed 16-bit big-endian meters, 5760 × 2880 at 16 px/deg.
  // It starts at 0°E (centered on 180°), so shift it half a turn to center it on 0° like the texture.
  const buf = await readFile(input);
  const w = 5760;
  const hgt = 2880;
  if (buf.length !== w * hgt * 2) throw new Error(`expected ${w * hgt * 2} bytes (16 px/deg MEGDR), got ${buf.length}`);
  const h = new Float32Array(w * hgt);
  for (let y = 0; y < hgt; y++) {
    for (let x = 0; x < w; x++) {
      const src = buf.readInt16BE((y * w + x) * 2);
      h[y * w + ((x + w / 2) % w)] = src;
    }
  }
  return { h, w, hgt, radius: 3396000 };
}

/** Average the big grid down to the output size (box filter), so small craters blend instead of aliasing. */
function downsample(src, w, hgt, ow, oh) {
  const out = new Float32Array(ow * oh);
  for (let y = 0; y < oh; y++) {
    const y0 = Math.floor((y * hgt) / oh);
    const y1 = Math.max(y0 + 1, Math.floor(((y + 1) * hgt) / oh));
    for (let x = 0; x < ow; x++) {
      const x0 = Math.floor((x * w) / ow);
      const x1 = Math.max(x0 + 1, Math.floor(((x + 1) * w) / ow));
      let sum = 0;
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) sum += src[yy * w + xx];
      out[y * ow + x] = sum / ((y1 - y0) * (x1 - x0));
    }
  }
  return out;
}

const { h: full, w, hgt, radius } = await readHeights();
const ow = outW;
const oh = outW / 2;
const h = downsample(full, w, hgt, ow, oh);

// Ground distance covered by one output pixel, in meters. East-west pixels shrink toward the
// poles (cos latitude); clamp it so the last rows near the poles don't explode.
const dy = (Math.PI * radius) / oh;
const rgb = Buffer.alloc(ow * oh * 3);
for (let y = 0; y < oh; y++) {
  const lat = (0.5 - (y + 0.5) / oh) * Math.PI;
  const dx = (2 * Math.PI * radius * Math.max(Math.cos(lat), 0.05)) / ow;
  const up = Math.max(y - 1, 0);
  const down = Math.min(y + 1, oh - 1);
  for (let x = 0; x < ow; x++) {
    const left = (x - 1 + ow) % ow; // longitude wraps around
    const right = (x + 1) % ow;
    const dhEast = (h[y * ow + right] - h[y * ow + left]) / (2 * dx);
    const dhNorth = (h[up * ow + x] - h[down * ow + x]) / ((down - up) * dy);
    // Surface normal of a height field: tilt away from the uphill direction.
    let nx = -dhEast * exaggerate;
    let ny = -dhNorth * exaggerate;
    let nz = 1;
    const len = Math.hypot(nx, ny, nz);
    nx /= len;
    ny /= len;
    nz /= len;
    const i = (y * ow + x) * 3;
    rgb[i] = Math.round((nx * 0.5 + 0.5) * 255);
    rgb[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
    rgb[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
  }
}

const info = await sharp(rgb, { raw: { width: ow, height: oh, channels: 3 } })
  .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(output);
console.log(`Saved ${output} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
