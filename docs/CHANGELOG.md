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

### Changed

- The repository root is now the `zainaltaf-portfolio/` folder itself instead of a `website/` subfolder inside it, so the project's files sit at the top level. Every tracked path, branch and the `origin` remote are unchanged; the deployed site, its build and the Pages workflow are unaffected. Local planning notes that sit in `docs/` are gitignored by name. No visitor-facing change.

### Fixed

- The merge/branch guard hook no longer silently stops enforcing when Claude is launched from the wrong directory; it now resolves itself safely or refuses the affected git commands loudly, and CLAUDE.md and docs/git-workflow.md now say which guard enforces what and that the git hooks are shared across worktrees. No visitor-facing change.

### Added

- The repo now has a written working agreement for Claude Code sessions: a lean `CLAUDE.md`, a `docs/` set (overview, requirements, architecture, roadmap, testing, git workflow, deployment), three-level branching (`cp/<n>-<slug>` into `dev` into `main`), a pair of guards that refuse a merge into `main` with no changelog entry, and a second pair that refuse a commit made directly on `main` or `dev`. No visitor-facing change.
