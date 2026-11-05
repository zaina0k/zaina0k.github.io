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

## Candidate checkpoints (not started; each needs a personal-detail check)

Proposed for later; none is scheduled and none starts without the owner. Each **needs a personal-detail check** before anything is copied into this public repo: read it for phone numbers, addresses, dates of birth and anything else not meant to be published.

1. **Lift two parts of the old planning blueprint:** its "Decisions still needed" list and its asset and image standards.
2. **Copy the portable design-language document** into `docs/`.
3. **Port two skills:** one for adding a new project page, one for keeping `README.md` in step with the code.
4. **Deal with the 19 oversized images** (3 to 9 MB, listed in `bin/conventions_audit.baseline`) **and the 3 `astro check` hints** (below).
5. **The `deploy.yml` change** (`paths-ignore` plus a `concurrency` group): a **proposal only**, written up in [deployment.md](deployment.md). `.github/` is not touched without the owner's separate approval.
6. **Decide the `reference-transaction` hook** that would close the human-terminal routes around the branch guard ([git-workflow.md](git-workflow.md)).

## Observed, not scheduled

Found while setting up checks; none is a requirement until the owner says so.

- `npm run check` reports 3 hints: two uses of a deprecated Zod method (`z.string().url()`) in `src/content.config.ts`, and one `<script>` in `src/pages/index.astro` that Astro treats as `is:inline`.
- Several images in `public/` are 4 to 8 MB. `bin/conventions_audit.sh` lists them.
- Astro, `@astrojs/react` and TypeScript each have a newer major on npm (see [architecture.md](architecture.md)).
- The Pages workflow redeploys on tooling-only pushes (proposal in [deployment.md](deployment.md)).
