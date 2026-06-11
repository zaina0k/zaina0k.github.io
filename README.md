# Zain Altaf — Portfolio Website

Personal portfolio site for Zain Altaf, a software engineer and Computer Science graduate (University of Leicester). Statically generated and deployed to GitHub Pages.

**Live site:** https://zainaltaf.dev

## Tech stack

- [Astro 6](https://astro.build) — static site generation, file-based routing, content collections
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling via `@tailwindcss/vite`; dark/light theme via `@custom-variant dark`
- [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin) — prose styling for project case study content
- [React](https://react.dev) — used only for interactive "islands" (theme toggle, contact form)
- [Inter](https://fontsource.org/fonts/inter) + [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) — self-hosted via `@fontsource`
- [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — generates `sitemap.xml` at build time
- Markdown + typed frontmatter (Astro Content Collections) — drives the project case studies

## Getting started

```sh
npm install
npm run dev        # starts local dev server at localhost:4321
```

## Commands

| Command           | Action                                                      |
| :---------------- | :---------------------------------------------------------- |
| `npm install`     | Install dependencies                                        |
| `npm run dev`     | Start local dev server                                      |
| `npm run build`   | Build the production site to `./dist/`                      |
| `npm run preview` | Preview the production build locally                        |
| `npm run astro …` | Run Astro CLI commands (`astro add`, `astro check`)         |

### One-off scripts

| Script                          | Action                                             |
| :------------------------------ | :------------------------------------------------- |
| `node scripts/gen-og-image.mjs` | Regenerate `public/og-default.png` (1200×630 PNG)  |
| `node scripts/gen-thumbnails.mjs` | Regenerate placeholder project thumbnails        |

## Project structure

```
website/
├── public/
│   ├── CNAME                    # Custom domain → zainaltaf.dev
│   ├── cv.pdf                   # CV served at /cv.pdf
│   ├── favicon.svg / favicon.ico
│   └── og-default.png           # Default OG image (1200×630)
├── scripts/
│   ├── gen-og-image.mjs         # Generates public/og-default.png via sharp
│   └── gen-thumbnails.mjs       # Generates src/assets/thumbnails/*.png via sharp
├── src/
│   ├── assets/
│   │   ├── profile.png          # Profile photo (optimised to WebP at build time)
│   │   └── thumbnails/          # Per-project placeholder images (800×450 PNG)
│   ├── content/
│   │   └── projects/            # One .md file per project case study
│   ├── content.config.ts        # Astro 6 content collection schema (Zod)
│   ├── pages/
│   │   ├── index.astro          # Homepage (hero, currently, projects, skills, CTA)
│   │   ├── about.astro          # About (bio, skills grid, timeline, CTAs)
│   │   ├── cv.astro             # CV (PDF embed + download)
│   │   ├── contact.astro        # Contact (two-column layout + ContactForm)
│   │   └── projects/
│   │       ├── index.astro      # All projects grid
│   │       └── [slug].astro     # Dynamic project detail page
│   ├── layouts/
│   │   └── BaseLayout.astro     # Page shell: full SEO head, anti-flash script, Header, Footer
│   ├── components/
│   │   ├── Header.astro         # Sticky nav: ZA mark, links, hamburger, CTA button
│   │   ├── Footer.astro         # 3-column footer: branding / project links / connect
│   │   ├── ThemeToggle.tsx      # React island: light/dark toggle, localStorage persistence
│   │   ├── ContactForm.tsx      # React island: Web3Forms submission, validation, honeypot
│   │   ├── HeroSection.astro    # Hero: status dot, headline, subtitle, CTA buttons, stats
│   │   ├── StatCard.astro       # Reusable stat display (value + label)
│   │   ├── CurrentlySection.astro  # "01 / Now" cards: Building, Learning, Reading
│   │   ├── ProjectCard.astro    # Project card: number, title, year, summary, tags
│   │   ├── FeaturedProjects.astro  # "02 / Projects" section, collection-driven
│   │   ├── SkillsStrip.astro    # "03 / Skills" horizontal keyword rows
│   │   └── FooterCTA.astro      # "Open to opportunities. Let's connect." CTA block
│   └── styles/
│       └── global.css           # Tailwind import, typography plugin, dark variant, CSS vars
├── astro.config.mjs
└── package.json
```

## Content model

Project case studies live in `src/content/projects/<slug>.md`. The schema is validated at build time by `src/content.config.ts`:

```yaml
title: string                          # Project title
summary: string (max 160 chars)        # Used as meta description
detail: string                         # Two-line card description
date: date                             # ISO date (e.g. 2024-11-03)
sortOrder: number                      # Controls display order
featured: boolean                      # Shown on homepage if true
thumbnail: image (optional)            # Card / OG image (800×450)
heroImage: image (optional)            # Full-width hero (overrides thumbnail for OG)
techStack: string[]                    # Full library names (e.g. "Next.js")
tags: string[] (max 4)                 # Short display tags shown on card
category: "hackathon" | "personal" | "competition"
teamSize: number (optional)
role: string                           # Your role on the project
github: url (optional)
liveDemo: url (optional)
skills: string[]                       # Skills demonstrated
```

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that runs `npm ci`, builds the site with `astro build`, and deploys the `dist/` output to GitHub Pages. The custom domain (`zainaltaf.dev`) is configured via the `CNAME` file in `public/`.

**Required GitHub secret**: `PUBLIC_WEB3FORMS_KEY` — the Web3Forms API key for the contact form. Add it in *Settings → Secrets and variables → Actions* on the GitHub repo. Without it the build passes but the contact form will fail silently at runtime.

## Theming

Dark/light mode is handled by a React island (`ThemeToggle`) that toggles a `dark` class on `<html>`. **Light is the default** — first-time visitors always see the light theme; dark is opt-in via the toggle and persists to `localStorage`. An inline `<script>` in `BaseLayout.astro` applies the stored preference before first paint to prevent flash. Colour tokens are CSS custom properties in `global.css`, mapped into Tailwind utilities via `@theme inline`.
