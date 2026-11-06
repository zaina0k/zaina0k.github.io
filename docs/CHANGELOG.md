# Changelog

All notable changes to the portfolio site and the way it is built are recorded here, hand-written, in [Keep a Changelog](https://keepachangelog.com/) style. It is never generated from `git log`: each entry is a statement about what the site or the repo now does, written for someone who has not seen the diff.

**Conventions**

- Categories: `Added`, `Changed`, `Fixed`, `Deprecated`, `Removed`, `Security`.
- One entry per change a visitor would notice, or that changes how the repo is worked on. Plain language: what is true now, not which files moved.
- Cite the requirement ID from `docs/prd.md` in parentheses where one exists, e.g. `(PF3)`.
- Every entry is a single line starting `- `. The merge guards (`bin/check_changelog.sh`) count those lines.
- A merge into `main` needs at least one new entry on the branch being merged, because that merge deploys the public site (`docs/git-workflow.md`). The `changelog-entry` skill writes it.
- Entries before 2026-11 are not backfilled; the git history is the record.

## [Unreleased]

### Added

- The theme button now cycles Light, Dark and System; System follows the visitor's device setting and updates if it changes (PF8).

### Fixed

- The main image in a project's gallery now shows the whole picture instead of cropping its edges, so screenshots and diagrams are no longer cut off.

### Changed

- The About page now shows the same profile photo as the home page in both light and dark mode, instead of a separate photo and sketch.
- The working agreement now says to use a plain branch in the main checkout by default, and a worktree only for a significantly large feature while another session or feature is open in the repo. No visitor-facing change.
- Claude's project permissions are now only a deny list (push, bulk staging, `--no-verify`, stash, workflow runs, secrets, and edits to the deploy workflow) plus the guard hook; the allow-list lives in the owner's global settings, and git switch, checkout, merge and config no longer prompt. No visitor-facing change.
- The site's visual design and colour scheme now use the Dark Blue and Indigo style system (`#4f46e5` primary, `#0891b2` cyan secondary, `#f4f6f9` light surfaces, and `#1e1e2e` / `#13131f` dark navy surfaces) across the header, footer, cards, KPI metrics, badges, filters, forms, and all pages in both light and dark themes. (PF1, PF2, PF3, PF5, PF6, PF7, PF8, PF9)
- The CV on `/cv/` and the `/cv.pdf` download are now the current edition. (PF7)
- The Pages workflow no longer redeploys the site for pushes that only change docs, Claude tooling, scripts, git hooks or root-level Markdown, and a second deploy now waits for a running one instead of overlapping it. The build, the secret and the deploy steps are unchanged. No visitor-facing change.
- The repository root is now the `zainaltaf-portfolio/` folder itself instead of a `website/` subfolder inside it, so the project's files sit at the top level. Every tracked path, branch and the `origin` remote are unchanged; the deployed site, its build and the Pages workflow are unaffected. Local planning notes that sit in `docs/` are gitignored by name. No visitor-facing change.

### Fixed

- The merge/branch guard hook no longer silently stops enforcing when Claude is launched from the wrong directory; it now resolves itself safely or refuses the affected git commands loudly, and CLAUDE.md and docs/git-workflow.md now say which guard enforces what and that the git hooks are shared across worktrees. No visitor-facing change.

### Added

- The Predicting Crime Severity project page now shows eleven captioned charts in its carousel (data exploration, clustering and the model comparison) and uses the cluster map as its card thumbnail, replacing the "media coming soon" placeholder; its title no longer carries the module code. (PF3, PF4)
- The repo now has a written working agreement for Claude Code sessions: a lean `CLAUDE.md`, a `docs/` set (overview, requirements, architecture, roadmap, testing, git workflow, deployment), three-level branching (`cp/<n>-<slug>` into `dev` into `main`), a pair of guards that refuse a merge into `main` with no changelog entry, and a second pair that refuse a commit made directly on `main` or `dev`. No visitor-facing change.
