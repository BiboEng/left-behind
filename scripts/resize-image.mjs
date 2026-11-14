// Resize / convert an image (JPG, PNG or TIFF) to a web-friendly JPG.
// Works the same on Mac and Windows:
//   npm run resize -- <input> <output.jpg> [width]
// Example (Moon globe texture, 4096 px wide):
//   npm run resize -- downloads/lroc_color_16bit_srgb_4k.tif public/moon/moon-color.jpg 4096
import sharp from "sharp";

const [input, output, width = "4096"] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: npm run resize -- <input> <output.jpg> [width]");
  process.exit(1);
}
sharp.cache(false);
const info = await sharp(input, { limitInputPixels: false })
  .resize({ width: Number(width), withoutEnlargement: true })
  .toColourspace("srgb")
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(output);
console.log(`Saved ${output} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
