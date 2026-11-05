# Git workflow — checkpoints

**Status:** Living document. Binding.
**Remote:** `origin` (GitHub Pages repo). A push to `main` deploys the public site.

## The model

Three levels. Commits are only ever written on a feature branch.

| Level | Role |
|---|---|
| Feature branch `cp/<n>-<slug>` | Where commits are written. Cut from `dev`, merged back into `dev` with `--no-ff`. Never deleted, squashed or rebased after merging. Other kinds: `fix/<slug>`, `docs/<slug>`, `chore/<slug>`. |
| `dev` | Integration line. Receives `--no-ff` merges only. Never rewritten. |
| `main` | The deployed line. Receives `--no-ff` merges from `dev` at a natural completion point. Never committed to directly. |

Why: the merge commit is what shows, in history, where a piece of work started and ended.

## Numbering a checkpoint

Allocate the number at the moment you cut the branch, from the log, never from memory:

```bash
git log --all --oneline --grep="Checkpoint: CP-" | head -1
```

Take the highest `CP-<n>` and add one.

## Commit format

```
<type>(<scope>): <subject>

<body: why, not what - the diff shows what>

Checkpoint: CP-<n> - <name>
Refs: PF<n>
```

- `type` is `feat`, `fix`, `docs`, `chore`, `style` or `content`; it should agree with the branch kind.
- The `Checkpoint:` trailer is on every commit, merge commits included.
- `Refs: PF<n>` appears when the commit touches a requirement in `docs/prd.md`; omit it otherwise.
- **No AI attribution lines of any kind.** Commits are authored by the owner only.

## Commit as you build

- Before writing code, list the commits, one line each.
- Commit each piece as soon as it is complete and verified. Crossing from one concern to another (code to docs, feature to fix) is a commit boundary.
- Stage explicit paths. Never `git add -A` or `git add .`: another session may have unrelated changes in the same checkout.
- Only `git commit` is unprompted. Merging, pushing and anything destructive need the owner's say-so.

## Merging

```bash
git switch dev
git merge --no-ff cp/16-some-slug     # the merge commit is the marker
```

Merging `dev` into `main` is the release. Before it:

1. `docs/CHANGELOG.md` must have a new entry on the branch being merged. **Enforced** by the two guards below.
2. `npm run check` and `npm run build` must pass in the branch being merged. **A manual step. Nothing enforces it:** no hook runs them and the Pages workflow has no check or test step (`docs/deployment.md`), so a broken build is caught only by the deploy itself failing. Enforcing it would mean either a hook that runs the build (slow, and the owner chose against it) or a CI step (a workflow change that needs the owner's separate approval).
3. The owner approves. Then push, which the owner or an explicit instruction does. See `docs/deployment.md`.

### The changelog gate

A merge into `main` is refused unless the incoming side adds at least one entry line to `docs/CHANGELOG.md`. Two guards share one checker, `bin/check_changelog.sh`:

- `.githooks/pre-merge-commit`: any terminal. Enable once per clone: `git config core.hooksPath .githooks`; that one setting enables both hooks. Git has no hook that runs before a merge starts, so a refusal leaves the merge resolved but uncommitted: `git merge --abort`, add the entry on the branch, merge again. It does not run for fast-forward merges, which is why the workflow is always `--no-ff`.
- `bin/claude_merge_guard.sh`: a Claude Code `PreToolUse` hook that refuses a merge into `main` before it starts, and refuses one without `--no-ff`. It is also the branch guard (next section).

Both fail open when they cannot parse something. A release that changes nothing a visitor would notice is let through deliberately with `SKIP_CHANGELOG_CHECK=1 git merge ...`. Merges into `dev` carry no changelog requirement.

## The branch guard: nothing is committed on `main` or `dev`

Two more guards enforce "commits go on a feature branch":

- `.githooks/pre-commit` refuses a non-merge commit when the current branch is `main` or `dev`. Merge commits are allowed: a clean `--no-ff` merge never runs this hook, and a conflicted merge finished with `git commit` is recognised by `MERGE_HEAD`. It also stops `git commit --amend` there.
- `bin/claude_merge_guard.sh` stops the same thing before a Claude-run command executes, using the same per-segment branch tracking as the merge guard, and also covers commands the hook cannot see (below). It additionally refuses a merge into `dev` without `--no-ff`.

**Escape: `SKIP_BRANCH_GUARD=1`**, as an environment prefix (`SKIP_BRANCH_GUARD=1 git commit ...`). It is for the one-time bootstrap and genuine emergencies only. It is not a convenience, and when it is used the owner is told.

### Other ways a commit can land on `main` or `dev`

Tested on 2026-11-05 in scratch repositories (`bin/test_merge_guard.sh` pins each result).

| Route | `pre-commit` hook | Claude guard |
|---|---|---|
| `git commit`, including from a worktree that has `dev` or `main` checked out | Blocked | Blocked |
| `git commit --amend` | Blocked | Blocked |
| `git merge --squash` then `git commit` | Blocked | Blocked |
| `git merge --no-ff` | Allowed (a merge commit, as intended) | Allowed (changelog check applies on `main`) |
| Finishing a conflicted merge with `git commit` | Allowed (`MERGE_HEAD`) | Allowed |
| `git commit --no-verify` | **Not seen** (the flag skips hooks) | Blocked |
| `git cherry-pick` | **Not seen** (cherry-pick does not run `pre-commit`) | Blocked |
| `git revert` | **Not seen** | Blocked |
| `git rebase` while on the branch | **Not seen** | Blocked |
| `git merge --ff-only` (or any fast-forward) | **Not seen** (no commit is made, the ref just moves) | Blocked (merge without `--no-ff`) |
| `git commit-tree` + `git update-ref`, `git branch -f`, `git reset` | **Not seen** | `update-ref` and `branch -f` on `main`/`dev` blocked; `git reset` is not covered |

So against a human at a terminal the hook is a guard rail, not a lock: five routes get past it. The Claude guard covers those routes for commands Claude runs. Closing the human routes would take a `reference-transaction` hook, which sees every ref update. It is **not built**: it would also block the documented rollback (`git revert` of a merge commit on `main`) and the bootstrap's `git branch dev main`, so it needs the owner's decision.

Rollback note: reverting a bad release on `main` therefore needs `SKIP_BRANCH_GUARD=1` for the revert commit, or a `cp/`-style branch with a `--no-ff` merge of the revert. The latter is preferred.

## Worktrees

A second session must never share a checkout with the first. Use a worktree:

```bash
git worktree list                                              # check first
git worktree add .claude/worktrees/cp-16-slug -b cp/16-slug dev
cd .claude/worktrees/cp-16-slug
# reuse dependencies without reinstalling:
ln -s ../../../node_modules node_modules
```

`.claude/worktrees/` is gitignored. Do not `cd` out of a worktree into another checkout and then run a state-changing git command.

## One-time bootstrap exceptions (CP-16)

These are exceptions, not precedents.

1. **`dev` was created from the existing `main`** (`6e53a84`) with `git branch dev main`, with no commit. The repo had 221 commits on `main` only. That history is untouched.
2. **Numbering started at CP-16, not CP-1.** The log contained no `Checkpoint:` trailers, but earlier work was tracked as CP-1 to CP-15 in local planning notes. The "read the log" rule would have produced CP-1 and collided with those.
3. **Earlier commits carry no trailers.** They are not rewritten.
4. **`SKIP_BRANCH_GUARD=1` exists for this kind of one-off.** It was not needed during CP-16: the work was done on `cp/16-claude-structure` in a worktree.
