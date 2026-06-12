/**
 * Generates branded 1200×630 OG images for each project.
 * Output: public/og/<slug>.png
 *
 * Each card shows:
 *   - Project title (large, cream)
 *   - Category badge
 *   - Tech tags (up to 4)
 *   - Site URL + accent bar
 *
 * Palette mirrors the site's olive/cream theme.
 * Run: node scripts/gen-project-og-images.mjs
 */

import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = join(__dirname, '../public/og');

mkdirSync(OUT_DIR, { recursive: true });

const W = 1200;
const H = 630;

const BG     = '#2C3A1E';
const ACCENT = '#8FA05A';
const TEXT   = '#F5F0E8';
const MUTED  = '#A8B89A';
const BADGE  = '#3D5228';

const projects = [
  {
    slug: 'elo-ranking',
    title: 'Elo Ranking System',
    subtitle: 'Competitive Rating Engine',
    category: 'Personal Project',
    tags: ['Python', 'Flask', 'SQLite', 'REST API'],
  },
  {
    slug: 'lets-hack-leicester',
    title: "Let's Hack Leicester",
    subtitle: 'Hackathon Winner',
    category: 'Hackathon',
    tags: ['Python', 'OpenCV', 'ML', 'Real-time'],
  },
  {
    slug: 'morgan-stanley-challenge',
    title: 'Morgan Stanley Challenge',
    subtitle: 'Trading Algorithm',
    category: 'Competition',
    tags: ['Python', 'Algorithms', 'Finance', 'Data'],
  },
  {
    slug: 'sign-language-translator',
    title: 'Sign Language Translator',
    subtitle: 'Real-time CV System',
    category: 'Personal Project',
    tags: ['Python', 'TensorFlow', 'OpenCV', 'CNN'],
  },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function tagBadges(tags, startX, y) {
  const TAG_H = 34;
  const PAD_X = 16;
  const CHAR_W = 11.5;
  let x = startX;
  return tags
    .slice(0, 4)
    .map((tag) => {
      const w = tag.length * CHAR_W + PAD_X * 2;
      const badge = `
        <rect x="${x}" y="${y}" width="${w}" height="${TAG_H}" rx="6" fill="${BADGE}" />
        <text x="${x + PAD_X}" y="${y + 22}"
          font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size="15" font-weight="500"
          fill="${ACCENT}">${escapeXml(tag)}</text>`;
      x += w + 10;
      return badge;
    })
    .join('');
}

for (const { slug, title, subtitle, category, tags } of projects) {
  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}" />

  <!-- Left accent bar -->
  <rect x="0" y="0" width="6" height="${H}" fill="${ACCENT}" />

  <!-- Dot-grid texture -->
  ${Array.from({ length: 14 }, (_, col) =>
    Array.from({ length: 10 }, (_, row) =>
      `<circle cx="${100 + col * 80}" cy="${50 + row * 60}" r="1.2" fill="${ACCENT}" opacity="0.12" />`
    ).join('')
  ).join('')}

  <!-- Category badge -->
  <rect x="76" y="140" width="${category.length * 10 + 32}" height="32" rx="6" fill="${BADGE}" />
  <text x="92" y="162"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="14" font-weight="600" letter-spacing="2"
    fill="${ACCENT}" text-anchor="start">${escapeXml(category.toUpperCase())}</text>

  <!-- Project title -->
  <text x="76" y="270"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="68" font-weight="700" letter-spacing="-2"
    fill="${TEXT}">${escapeXml(title)}</text>

  <!-- Subtitle -->
  <text x="78" y="325"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="26" font-weight="400"
    fill="${MUTED}">${escapeXml(subtitle)}</text>

  <!-- Divider -->
  <rect x="76" y="365" width="60" height="3" fill="${ACCENT}" rx="2" />

  <!-- Tech tag badges -->
  ${tagBadges(tags, 76, 388)}

  <!-- Site URL -->
  <text x="78" y="580"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="20" font-weight="400" letter-spacing="1"
    fill="${MUTED}" opacity="0.6">zainaltaf.dev</text>
</svg>`.trim();

  const outPath = join(OUT_DIR, `${slug}.png`);
  await sharp(Buffer.from(svg))
    .resize(W, H)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`Generated: ${outPath}`);
}
