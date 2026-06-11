# Zain Altaf — Portfolio Website

Personal portfolio site for Zain Altaf, a software engineer and Computer Science graduate (University of Leicester). Statically generated and deployed to GitHub Pages.

**Live site:** https://zainaltaf.dev

## Tech stack

- [Astro](https://astro.build) — static site generation, file-based routing, content collections
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling via `@tailwindcss/vite`; dark/light theme via `@custom-variant dark`
- [React](https://react.dev) — used only for interactive "islands" (theme toggle, contact form)
- [Inter](https://fontsource.org/fonts/inter) + [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) — self-hosted via `@fontsource`
- Markdown + typed frontmatter (Astro Content Collections) — drives the project case studies (scaffolded in Checkpoint 3)

## Getting started

```sh
npm install
npm run dev        # starts local dev server at localhost:4321
```

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start local dev server                        |
| `npm run build`   | Build the production site to `./dist/`        |
| `npm run preview` | Preview the production build locally          |
| `npm run astro …` | Run Astro CLI commands (`astro add`, `astro check`) |

## Project structure

```
website/
├── public/                  # Static files served as-is (favicon, CNAME)
├── src/
│   ├── content/             # Not yet scaffolded — Markdown project files + schema added in Checkpoint 3
│   ├── pages/
│   │   ├── index.astro      # Homepage (hero, currently, featured projects, skills, footer CTA)
│   │   ├── about.astro      # About page (stub)
│   │   ├── cv.astro         # CV page (stub — PDF wired in Checkpoint 4)
│   │   ├── contact.astro    # Contact page (stub)
│   │   └── projects/
│   │       └── index.astro  # Projects index (stub — upgraded in Checkpoint 3)
│   ├── layouts/
│   │   └── BaseLayout.astro # Page shell: SEO head, anti-flash script, Header, Footer
│   ├── components/
│   │   ├── Header.astro         # Sticky nav: ZA mark, role badge, links, hamburger, CTA
│   │   ├── Footer.astro         # 3-column footer: branding / project links / connect
│   │   ├── ThemeToggle.tsx      # React island: light/dark toggle, localStorage persistence
│   │   ├── HeroSection.astro    # Hero: status dot, headline, subtitle, CTA buttons, stats
│   │   ├── StatCard.astro       # Reusable stat display (value + label)
│   │   ├── CurrentlySection.astro  # "01 / Now" cards: Building, Learning, Reading
│   │   ├── ProjectCard.astro    # Reusable project card: number, title, year, summary, tags
│   │   ├── FeaturedProjects.astro  # "02 / Projects" section with 4 ProjectCard instances
│   │   ├── SkillsStrip.astro    # "03 / Skills" horizontal keyword rows
│   │   └── FooterCTA.astro      # "Open to opportunities. Let's connect." CTA block
│   └── styles/
│       └── global.css       # Tailwind import, @custom-variant dark, CSS vars, font-family
├── astro.config.mjs
└── package.json
```

## Content model

Project case studies will live in `src/content/projects/<slug>.md` with a typed frontmatter schema validated at build time by `src/content/config.ts`. This is not yet scaffolded — it will be added in the next development phase along with dynamic routing at `/projects/[slug]`.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that runs `npm ci`, builds the site with `astro build`, and deploys the `dist/` output to GitHub Pages. The custom domain (`zainaltaf.dev`) is configured via the `CNAME` file in `public/`.

## Theming

Dark/light mode is handled by a React island (`ThemeToggle`) that toggles a `dark` class on `<html>`. **Light is the default** — first-time visitors always see the light theme; dark is opt-in via the toggle and persists to `localStorage`. An inline `<script>` in `BaseLayout.astro` applies the stored preference before first paint to prevent flash. Colour tokens are CSS custom properties in `global.css`, mapped into Tailwind utilities via `@theme inline`.
