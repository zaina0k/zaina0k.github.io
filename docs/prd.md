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

Acceptance criteria for these are not backfilled. TBD, ask owner: whether they should be written, or only for changes from here on.

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
