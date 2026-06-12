/**
 * Rasterises public/favicon.svg into three PNG sizes:
 *   public/favicon-16x16.png   — browser tab fallback
 *   public/favicon-32x32.png   — browser tab / taskbar
 *   public/apple-touch-icon.png — 180×180, iOS home screen & Safari bookmarks
 *
 * Run: node scripts/gen-favicons.mjs
 * Requires: sharp (installed as an Astro transitive dependency)
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG_PATH = join(__dirname, '../public/favicon.svg');
const OUT_DIR  = join(__dirname, '../public');

const sizes = [
  { size: 16,  name: 'favicon-16x16.png' },
  { size: 32,  name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

const svgBuffer = readFileSync(SVG_PATH);

for (const { size, name } of sizes) {
  const outPath = join(OUT_DIR, name);
  await sharp(svgBuffer)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`Generated: ${outPath} (${size}×${size})`);
}
