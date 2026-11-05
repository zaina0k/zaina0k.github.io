# Overview

**Status:** Living document.

## What this is

Zain Altaf's personal portfolio website, live at https://zainaltaf.dev. It collects what an employer or recruiter would want to know about him in one place: who he is, what he has built, his CV, and how to get in touch.

## Who it is for

Employers and recruiters, viewing it publicly. There are no accounts, no logins and no private pages.

## What it contains

Four pages and a CV page, with no blog:

| Page | Route |
|---|---|
| Home | `/` |
| Projects (index, filterable, and one page per project) | `/projects/`, `/projects/<slug>/` |
| About | `/about/` |
| Contact | `/contact/` |
| CV | `/cv/` (viewer) and `/cv.pdf` (download) |

Plus a 404 page. Project pages are generated from Markdown files with typed frontmatter.

## Principles that should survive change

1. **The site is public, so everything committed is published.** Personal details and secrets are never committed without the owner saying so (see `CLAUDE.md`).
2. **Static.** No server, no database. Anything dynamic runs in the visitor's browser or at a third party.
3. **Content is data.** Projects are Markdown files checked against a schema; the build fails loudly if one is wrong.
4. **Deploying is a deliberate act.** A merge into `main` followed by a push is the release.

## Related

- Requirements: [prd.md](prd.md)
- How it is built: [architecture.md](architecture.md)
- Where it runs: [deployment.md](deployment.md)
