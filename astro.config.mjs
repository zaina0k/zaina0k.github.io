// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://zainaltaf.dev',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    // Old Jekyll project slugs → new Astro slugs
    '/projects/elo_ranking/':             '/projects/elo-ranking/',
    '/projects/LetsHackLeicester2024/':   '/projects/lets-hack-leicester/',
    '/projects/MSCodingChallenge2024/':   '/projects/morgan-stanley-challenge/',
    '/projects/sign_language_translator/': '/projects/sign-language-translator/',
    // Old projects not in new site → projects index
    '/projects/unity_flappy_bird/':       '/projects/',
    '/projects/unity_pizza_delivery/':    '/projects/',
    '/projects/unity_snowboarder/':       '/projects/',
  },
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});