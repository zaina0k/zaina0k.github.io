# CLAUDE.md

Zain Altaf's personal portfolio, live at https://zainaltaf.dev. Astro 6 + React 19 islands + Tailwind CSS 4 + TypeScript, built to static files and served by GitHub Pages. This file holds rules and pointers only; detail lives in `docs/`.

Launch Claude from the repo root (`zainaltaf-portfolio/`), or from a worktree's own root if you are in one — never from a subdirectory such as `.claude/worktrees/`. *Why: the guard hook resolves relative to the launch directory, and a wrong one weakens the guard silently.*

## Where to look

| File | Answers |
|---|---|
| [docs/overview.md](docs/overview.md) | What is this, who is it for, what principles should survive change? |
| [docs/prd.md](docs/prd.md) | What are the requirements? Each has a stable `PF<n>` ID. v1 criteria are still TBD. |
| [docs/architecture.md](docs/architecture.md) | Stack and versions, folder layout, the content schema, constraints. |
| [docs/roadmap.md](docs/roadmap.md) | What is built, what is current, what is blocked. |
| [docs/git-workflow.md](docs/git-workflow.md) | Branches, commit format, merging, worktrees, the changelog gate. Binding. |
| [docs/testing.md](docs/testing.md) | Each way of checking work, and what it cannot see. |
| [docs/deployment.md](docs/deployment.md) | How it deploys, the one public key, and the paths-ignore / concurrency change (applied, not yet observed). |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Hand-written record of what changed. |

Do not invent requirements. If a behaviour is not in `docs/prd.md`, it is not in scope. If something is ambiguous, stop and ask. If two documents disagree, quote both places and say so.

## Non-negotiable constraints

**Public repo**
- Never commit a phone number, home address, date of birth or other personal detail unless the owner has said it is meant to be published. Ask first. *Why: the repo and the deployed site are public, so a commit is publication.*
- Secrets never appear in the repo, in this file or in `docs/`. `.env*` is gitignored (except `.env.example`) and denied to edit. *Why: git history is permanent and public; a leaked key cannot be un-leaked.*
- Record debt about secrets or credentials in an issue tracker, not in a file that every session loads. *Why: a loaded file is a copy in every context.*

**Deploy**
- Never push. Never create, edit or trigger `.github/workflows/deploy.yml`. Changes to it are proposals the owner approves separately. *Why: a push to `main` deploys a public site, and the workflow is the deploy.*
- Never merge `dev` into `main` without the owner's say-so. *Why: that merge is the release.*

**Process**
- Ask before anything that costs money or reaches a paid or external service, including any added later. State how many calls it will make and a rough cost, then wait. Approval covers the size named, not the task: if the volume grows, ask again. *Why: the amount can be trivial and the consent still wrong.*
- Stage explicit paths only; never `git add -A` or `git add .`. *Why: another session may have uncommitted work in the same checkout.*
- Before any state-changing git operation, run `ListAgents` and `git worktree list`, and never run git in a checkout another session is using. Default to a plain `cp/<n>-<slug>` branch in the main checkout; use a worktree under `.claude/worktrees/` only for a significantly large feature while another session or feature is open in the repo. *Why: two sessions in one checkout overwrite each other's work, but a worktree for every small change adds launch-folder and guard problems for no gain.*
- Nothing is committed directly to `dev` or `main`; commits go on `cp/<n>-<slug>`. `.githooks/pre-commit` blocks a non-merge commit there at the git level; `bin/claude_merge_guard.sh` (a Claude Code hook) blocks the same for Claude-run commands and also catches routes the git hook can't see, such as `--no-verify`, cherry-pick, revert, rebase, or a fast-forward merge. `SKIP_BRANCH_GUARD=1` is for the one-time bootstrap and genuine emergencies only, and the owner is told. *Why: the merge commit is what marks where work began and ended.*

**Code**
- Content is data: projects are Markdown checked by the schema in `src/content.config.ts`; the build fails loudly if one is wrong. *Why: a broken project must not ship quietly.*
- Utility-first Tailwind only. No Sass, no jQuery, no vendored theme CSS. *Why: one styling system keeps the theme and dark mode in one place.*
- React islands only where a page needs state; static content stays in `.astro`. *Why: islands ship JavaScript to every visitor.*
- No new dependency without asking. *Why: each one is code shipped to visitors and a thing to keep patched.*

## Project map

```
src/pages/          index, about, contact, cv, 404, projects/index, projects/[slug]
src/components/     .astro (static) and .tsx (islands: ThemeToggle, ContactForm, MediaCarousel, ProjectFilter)
src/content/projects/*.md   one file per project; schema in src/content.config.ts
src/layouts/        BaseLayout.astro
public/             served as-is (CNAME, Zain-Altaf-CV.pdf, favicons, OG and project images)
.claude/            settings.json (deny list and merge guard; the allow-list is in ~/.claude/settings.json) and skills/
bin/                changelog checker, merge guard, conventions audit, and their tests
```

The only runtime outbound call is the contact form posting from the visitor's browser to Web3Forms with `PUBLIC_WEB3FORMS_KEY`, which is public by design.

## Commands

```bash
npm run dev       # local server, http://localhost:4321
npm run check     # astro check: types and templates
npm run build     # production build to dist/
npm run preview   # serve the build
bin/conventions_audit.sh   # secrets, personal details, changelog, TODOs, file size
```

`npm run check` passing is necessary, never sufficient: build it and look at it. See [docs/testing.md](docs/testing.md).

## How we work: checkpoints

Work happens in numbered checkpoints on a branch `cp/<n>-<slug>` cut from `dev`, merged back with `--no-ff`. Full rules in [docs/git-workflow.md](docs/git-workflow.md). In short:

- **Before writing code, list the commits, one line each.** Commit each piece as soon as it is complete and verified; do not batch. Only `git commit` is unprompted.
- Every commit carries the trailer `Checkpoint: CP-<n> - <name>` (and `Refs: PF<n>` when it touches a requirement).
- A merge into `main` needs a new entry in `docs/CHANGELOG.md` on the branch being merged. `.githooks/pre-merge-commit` enforces it at the git level for any terminal, but not for a fast-forward merge; `bin/claude_merge_guard.sh` enforces it for Claude-run merges and also refuses one into `main` without `--no-ff` before it starts. `.githooks/` is enabled with `git config core.hooksPath .githooks`. `npm run check` and `npm run build` before that merge are a manual step; nothing enforces them. Escape for a release with nothing to announce: `SKIP_CHANGELOG_CHECK=1`.
- Skills in `.claude/skills/`: `checkpoint`, `changelog-entry`, `handoff`, `conventions-audit`.
- Run what `docs/testing.md` supports before calling anything done, and say plainly if something fails.

When a checkpoint ends, report in four parts: **what was built**; **what was decided that the docs do not cover**; **anything believed wrong or unclear in the docs**; **what is not done yet**.

## How to explain it

Plain English first; implementation detail only when asked. Ground an unfamiliar idea in one concrete example from this site (a specific page, a project file, the contact form). When a simplification leaves out something that matters, say what it leaves out.
