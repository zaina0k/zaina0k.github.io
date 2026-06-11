/**
 * Generates public/og-default.png — the fallback OG image for all pages.
 * Run once (or re-run to regenerate): node scripts/gen-og-image.mjs
 *
 * Palette mirrors the site's olive/cream theme:
 *   background  #2C3A1E  (dark olive)
 *   accent      #8FA05A  (muted olive green)
 *   text        #F5F0E8  (cream)
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public/og-default.png');

const W = 1200;
const H = 630;

const BG    = '#2C3A1E';
const ACCENT = '#8FA05A';
const TEXT  = '#F5F0E8';
const MUTED = '#A8B89A';

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}" />

  <!-- Subtle accent bar along the left edge -->
  <rect x="0" y="0" width="6" height="${H}" fill="${ACCENT}" />

  <!-- Noise-like dot grid for texture (every 40px) -->
  ${Array.from({ length: 16 }, (_, col) =>
    Array.from({ length: 16 }, (_, row) =>
      `<circle cx="${80 + col * 70}" cy="${40 + row * 38}" r="1.2" fill="${ACCENT}" opacity="0.18" />`
    ).join('')
  ).join('')}

  <!-- Status dot + label -->
  <circle cx="80" cy="220" r="7" fill="${ACCENT}" opacity="0.9" />
  <text x="98" y="226"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="18" font-weight="600" letter-spacing="3"
    fill="${MUTED}" text-anchor="start">CS GRADUATE · OPEN TO OPPORTUNITIES</text>

  <!-- Name -->
  <text x="76" y="320"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="80" font-weight="700" letter-spacing="-2"
    fill="${TEXT}">Zain Altaf</text>

  <!-- Tagline -->
  <text x="78" y="380"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="28" font-weight="400"
    fill="${MUTED}">Engineer · Problem solver · Builder</text>

  <!-- Divider -->
  <rect x="76" y="415" width="80" height="3" fill="${ACCENT}" rx="2" />

  <!-- URL -->
  <text x="78" y="460"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="22" font-weight="400" letter-spacing="1"
    fill="${MUTED}" opacity="0.7">zainaltaf.dev</text>
</svg>
`.trim();

await sharp(Buffer.from(svg))
  .resize(W, H)
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`Generated: ${OUT}`);
