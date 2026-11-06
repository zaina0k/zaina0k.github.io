# Product requirements

**Status:** Living document. First drafted 2026-11-05.
**Read first:** [overview.md](overview.md).

## How to read this file

Every requirement has a stable ID, `PF<n>` (portfolio feature), assigned once and never reused. IDs are sequential in the order recorded, not the order they ship. When a requirement changes, the old text is struck through in place with a note on what changed and why; it is never silently edited or deleted. Cite IDs in commits (`Refs: PF3`), in `docs/CHANGELOG.md`, and in code comments where useful.

Status values: **Built** (in the codebase, cited), **Proposed** (a draft for the owner to react to), **TBD** (needs an owner decision), **Deferred**.

**Do not invent requirements.** If a behaviour is not here, it is not in scope. Where something is ambiguous, stop and ask. If two documents contradict each other, quote both places and say so.

## Part 1: Already built (backfilled from the code, 2026-11-05)

| ID | Requirement | Status | Where |
|---|---|---|---|
| PF1 | Home page introducing the owner, with featured projects. | Built | `src/pages/index.astro`, `FeaturedProjects.astro` |
| PF2 | Projects index that visitors can filter. | Built | `src/pages/projects/index.astro`, `ProjectFilter.tsx` |
| PF3 | One page per project, generated from a Markdown file whose frontmatter must satisfy the schema; the build fails otherwise. | Built | `src/content/projects/*.md`, `src/content.config.ts`, `src/pages/projects/[slug].astro` |
| PF4 | Project media carousel (images and YouTube) on project pages. | Built | `MediaCarousel.tsx` |
| PF5 | About page. | Built | `src/pages/about.astro` |
| PF6 | Contact page with a form that sends messages through Web3Forms. | Built | `src/pages/contact.astro`, `ContactForm.tsx` |
| PF7 | CV page with an in-page PDF viewer and a download link. | Built | `src/pages/cv.astro`, `public/cv.pdf` |
| PF8 | Dark and light theme, switchable by the visitor. | Built | `ThemeToggle.tsx`, `src/styles/global.css` |
| PF9 | Basic discoverability: sitemap, page titles and descriptions, Open Graph metadata. | Built | `@astrojs/sitemap`, `BaseLayout.astro` |
| PF10 | Old project URLs from the previous site redirect to their new pages. | Built | `redirects` in `astro.config.mjs` |
| PF11 | Served from `zainaltaf.dev` on GitHub Pages, deployed from `main`. | Built | `public/CNAME`, `.github/workflows/deploy.yml` |

### Acceptance criteria for PF1 to PF11

Written 2026-11-05, **only from what could be checked in the repository**: the build output in `dist/`, the source, and one deliberate build failure. "Verified" means that. **Nothing here was checked in a browser, on the live site, or by a person looking at it**, so what a page looks like and how it behaves for a visitor is not claimed. Anything that could not be checked is marked **TBD, ask owner**.

| ID | Verified (build output / source) | TBD, ask owner |
|---|---|---|
| PF1 | `/` builds, with the title "Home \| Zain Altaf". The featured section is built from every project whose `featured` frontmatter is `true`. | What the page must say about the owner; how it should look. |
| PF2 | `/projects/` builds and includes the `ProjectFilter` island (`client:load`). Selecting several groups matches a project in **any** of them; counts update live; results are paginated (`src/lib/filter.ts`). | The page size; whether the filter works as intended in a browser; which groups should exist. |
| PF3 | Each of the 9 files in `src/content/projects/` produces `/projects/<slug>/`. A frontmatter value outside the schema fails the build: changing one project's `category` to an invalid value made `npm run build` stop with `InvalidContentEntryDataError` (tested and reverted 2026-11-05). | Whether every project's content is complete and accurate; whether the schema is the right contract. |
| PF4 | Project pages include `MediaCarousel` (`client:visible`). It accepts items of type `image` or `youtube`, and the source handles arrow keys, Escape and touch swipes. | Whether it works in a browser and on a phone. |
| PF5 | `/about/` builds, with the title "About \| Zain Altaf". | Whether the content is current and accurate. |
| PF6 | `/contact/` builds with the `ContactForm` island (`client:visible`). The form requires a name, a valid-looking email and a message before it sends. It posts to `https://api.web3forms.com/submit` with `PUBLIC_WEB3FORMS_KEY`, and shows success or error states. | **That a message reaches the owner.** This needs a live key and a real submission, which was not done. Where messages go. |
| PF7 | `/cv/` builds, embeds `/cv.pdf` and has a download link. `public/cv.pdf` exists. | Whether the CV is current; how the viewer behaves on a phone. |
| PF8 | The toggle cycles Light, Dark, System. It adds or removes the `dark` class; Light and Dark are stored under `theme` in `localStorage`, System clears it and follows the system's colour-scheme preference live. An inline script in `BaseLayout.astro` applies it before first paint. | Whether both themes look right and meet contrast (see PF14). |
| PF9 | `sitemap-index.xml` and `sitemap-0.xml` are generated (14 URLs). Six pages sampled (home, about, contact, cv, projects index, one project) each have a `<title>`, a description, `og:title` and a canonical link. | Whether all 15 pages have them (only six were sampled); whether the descriptions are good; how the Open Graph cards look when shared. |
| PF10 | The 7 old slugs configured in `astro.config.mjs` each build to a redirect page. Five targets were read from the output: four map to the new slugs and `/projects/unity_flappy_bird/` to `/projects/`. The other two follow the config. | How the redirects behave for a visitor on GitHub Pages; whether any old URL is missing from the list. |
| PF11 | `public/CNAME` contains `zainaltaf.dev` and is copied into `dist/`. The workflow in `.github/workflows/deploy.yml` runs on every push to `main`. | That the live site is currently serving the latest `main`: not checked, because nothing was requested from the live site. |

## Part 2: v1 success criteria

**TBD, ask owner.** The owner has not decided what "v1 done" means. The list below is a **DRAFT for the owner to react to**; none of it is agreed.

| ID | Draft criterion | Status |
|---|---|---|
| PF12 | A recruiter can find who the owner is, the best projects and the CV within one click of the home page. | Proposed |
| PF13 | Every project page meets the content schema and has a summary, role, tech stack and status. | Proposed |
| PF14 | Text meets WCAG AA contrast in both themes. | Proposed |
| PF15 | The contact form delivers a message to the owner. | Proposed |
| PF16 | The site builds and deploys from `main` with no manual steps. | Proposed |
| PF17 | No personal detail (phone number, home address, date of birth) is published unless the owner has said it is meant to be. | Proposed |

## Part 3: Out of scope

**TBD, ask owner.** Nothing has been decided. Candidate items to confirm or strike: a blog, accounts or logins, a CMS, analytics or tracking, comments, multi-language support, a backend of any kind.

## Revision log

| Date | Change |
|---|---|
| 2026-11-05 | File created. PF1 to PF11 backfilled from the code; PF12 to PF17 proposed; out-of-scope left TBD. |
| 2026-11-05 | Acceptance criteria written for PF1 to PF11 from what is verifiable in the repository only; the rest marked TBD, ask owner. |
