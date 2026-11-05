# Roadmap

**Status:** Living document. Phases are ordered by sequence, not date; nothing here is a schedule.
**Read first:** [prd.md](prd.md) for what each ID means.

## Phase 0: Site built and live (done)

Delivers: the home, projects, about, contact and CV pages, theming, redirects from the old site, and deployment to `zainaltaf.dev`.
Satisfies: PF1 to PF11.
Done means: the site is live and builds from `main`. It was built and migrated from a Jekyll site before this file existed; the git history is the record.

## Phase 1: Working agreement in the repo (this checkpoint, CP-16)

Delivers: `CLAUDE.md`, the `docs/` set, branching into `dev`, the changelog merge guards, the `.claude/` settings and skills.
Done means: it is merged into `dev` with the owner's approval. Merging to `main` and the workflow change in [deployment.md](deployment.md) are separate decisions.

## Phase 2: v1 definition (current, blocked)

Delivers: agreed v1 success criteria and an out-of-scope list in [prd.md](prd.md).
Blocked on: the owner reacting to the draft PF12 to PF17. TBD, ask owner.

## Observed, not scheduled

Found while setting up checks; none is a requirement until the owner says so.

- `npm run check` reports 3 hints: two uses of a deprecated Zod method (`z.string().url()`) in `src/content.config.ts`, and one `<script>` in `src/pages/index.astro` that Astro treats as `is:inline`.
- Several images in `public/` are 4 to 8 MB. `bin/conventions_audit.sh` lists them.
- Astro, `@astrojs/react` and TypeScript each have a newer major on npm (see [architecture.md](architecture.md)).
- The Pages workflow redeploys on tooling-only pushes (proposal in [deployment.md](deployment.md)).
