/**
 * Generates branded placeholder thumbnails for each project.
 * Run once (or re-run to regenerate): node scripts/gen-thumbnails.mjs
 *
 * Output: src/assets/thumbnails/<slug>.png  (800×450, 16:9)
 * Replace individual files with real screenshots when available.
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../src/assets/thumbnails');
mkdirSync(OUT_DIR, { recursive: true });

const W = 800;
const H = 450;

const projects = [
  {
    slug: 'sign-language-translator',
    title: 'Sign Language Translator',
    subtitle: 'Real-Time Hand Gesture Recognition',
    accent: '#5A8FA0',
  },
  {
    slug: 'elo-ranking',
    title: 'Elo Ranking System',
    subtitle: 'Competitive Rating Engine',
    accent: '#8F5AA0',
  },
  {
    slug: 'morgan-stanley-challenge',
    title: 'Morgan Stanley Challenge',
    subtitle: 'Algorithmic Trading Bot',
    accent: '#A08F5A',
  },
  {
    slug: 'lets-hack-leicester',
    title: "Let's Hack Leicester",
    subtitle: 'Collaborative Project Platform',
    accent: '#5AA07A',
  },
];

const BG   = '#1E2A1A';
const TEXT = '#F5F0E8';
const MUTED = '#A8B89A';

for (const { slug, title, subtitle, accent } of projects) {
  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}" />

  <!-- Accent bar left -->
  <rect x="0" y="0" width="5" height="${H}" fill="${accent}" />

  <!-- Dot grid texture -->
  ${Array.from({ length: 10 }, (_, col) =>
    Array.from({ length: 10 }, (_, row) =>
      `<circle cx="${60 + col * 75}" cy="${30 + row * 44}" r="1" fill="${accent}" opacity="0.15" />`
    ).join('')
  ).join('')}

  <!-- Accent circle decoration -->
  <circle cx="${W - 80}" cy="${H - 80}" r="120" fill="${accent}" opacity="0.07" />

  <!-- Title -->
  <text x="50" y="${H / 2 - 20}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="36" font-weight="700" letter-spacing="-0.5"
    fill="${TEXT}">${title}</text>

  <!-- Subtitle -->
  <text x="50" y="${H / 2 + 22}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="20" font-weight="400"
    fill="${MUTED}">${subtitle}</text>

  <!-- Domain -->
  <text x="50" y="${H - 36}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="14" font-weight="400" letter-spacing="1"
    fill="${accent}" opacity="0.8">zainaltaf.dev</text>
</svg>
`.trim();

  const outPath = join(OUT_DIR, `${slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`Generated: ${outPath}`);
}
