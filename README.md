# Zain Altaf — Portfolio Website

Personal portfolio site for Zain Altaf, a software engineer and Computer Science graduate (University of Leicester). Statically generated and deployed to GitHub Pages.

**Live site:** https://zainaltaf.dev

## Tech stack

- [Astro](https://astro.build) — static site generation, file-based routing, content collections
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling, dark/light theme via `darkMode: 'class'`
- [React](https://react.dev) — used only for interactive "islands" (theme toggle, contact form)
- Markdown + typed frontmatter (Astro Content Collections) — drives the project case studies

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
├── public/                  # Static files served as-is (favicon, CNAME, og-image)
├── src/
│   ├── content/
│   │   ├── config.ts        # Content Collection schemas (typed frontmatter)
│   │   └── projects/        # One Markdown file per project case study
│   ├── pages/               # File-based routing (index, about, contact, projects/[slug])
│   ├── layouts/             # Page wrappers (BaseLayout: header, footer, SEO head)
│   ├── components/          # Reusable UI — .astro for static, .tsx for interactive islands
│   ├── styles/              # Tailwind directives + CSS custom properties (theme colours)
│   └── assets/              # Images, CV PDF, video assets
├── astro.config.mjs
└── package.json
```

## Content model

Each project lives in `src/content/projects/<slug>.md` with a typed frontmatter schema (validated at build time by `src/content/config.ts`). To add a new project, copy an existing entry, fill in the required fields (`title`, `summary`, `techStack`, `role`, etc.), and Astro will pick it up automatically — the build fails with a clear error if a required field is missing.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that runs `npm ci`, builds the site with `astro build`, and deploys the `dist/` output to GitHub Pages. The custom domain (`zainaltaf.dev`) is configured via the `CNAME` file in `public/`.

## Theming

Dark/light mode is handled by a React island (`ThemeToggle`) that toggles a `dark` class on `<html>`; Tailwind's `darkMode: 'class'` strategy and CSS custom properties in `global.css` handle the colour swap. Default follows system preference and persists to `localStorage`.
