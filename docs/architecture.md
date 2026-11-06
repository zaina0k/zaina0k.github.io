# Architecture

**Status:** Living document. Versions below are what `package.json` and `node_modules` held on 2026-11-05.

## Stack

| Layer | Choice | Version | Why |
|---|---|---|---|
| Framework | Astro (static output) | 6.4.4 | Content-first pages, file-based routing, zero JS by default. |
| Interactive bits | React islands via `@astrojs/react` | React 19.2.7, integration 5.0.7 | Used only where a page needs state: theme toggle, contact form, media carousel, project filter. |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, plus `@tailwindcss/typography` | 4.3.0 | Utility-first; dark/light theme through a custom variant. No Sass, no vendored theme CSS. |
| Language | TypeScript (strict, `astro/tsconfigs/strict`) | 6.0.3 | Types for content and islands. |
| Checks | `@astrojs/check` | 0.9.9 | `npm run check`. |
| Fonts | Inter and JetBrains Mono, self-hosted via `@fontsource` | | No third-party font requests. |
| Images | `sharp` (build-time optimisation) | 0.34.5 | |
| SEO | `@astrojs/sitemap` | 3.7.3 | |
| Node | `>=22.12.0` (the Pages workflow uses Node 22) | | |

Newer majors exist on npm (Astro 7, `@astrojs/react` 7, TypeScript 7). They are not adopted; an upgrade is its own checkpoint.

## Layout

```
src/
  pages/            index, about, contact, cv, 404, projects/index, projects/[slug]
  layouts/          BaseLayout.astro
  components/       .astro (static) and .tsx (islands)
  content/projects/ one Markdown file per project
  content.config.ts the Zod schema for a project (the contract)
  assets/           images processed at build time
  styles/global.css Tailwind entry and theme tokens
public/             files served as-is: CNAME, Zain Altaf CV.pdf, favicons, OG images, project media
scripts/            one-off generators (favicons, OG images, thumbnails) using sharp
```

## Content model

Each project is `src/content/projects/<slug>.md`. The frontmatter schema is in `src/content.config.ts` and is the contract: title, a summary of at most 160 characters, a category (`hackathon`, `personal` or `competition`), a status (`planned`, `in-progress`, `shipped`, `archived`), start and end dates (an end date must be at least a day after the start), tech stack, skills, optional media, and so on. A file that violates it fails the build.

## Data flow

Everything resolves at build time into static HTML in `dist/`. At runtime the only outbound call is the contact form, which posts from the visitor's browser to Web3Forms using `PUBLIC_WEB3FORMS_KEY`. That key is embedded in the shipped JavaScript by design (its `PUBLIC_` prefix); treat it as public.

## Constraints

- No Sass, no jQuery, no vendored theme CSS.
- Islands are for interactivity only; static content stays in `.astro` files.
- No server-side code.
- Do not add a dependency without asking the owner. TBD, ask owner: whether that should be relaxed for dev-only tooling.
