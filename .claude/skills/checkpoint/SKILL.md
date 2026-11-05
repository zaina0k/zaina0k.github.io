---
name: checkpoint
description: Produces the four-part checkpoint report (built / decided / doc issues / not done) from the branch's actual git state, and checks the changelog and docs are still accurate first. Use when a checkpoint's work is finished, or the owner asks to "checkpoint" or wrap up the current branch.
---

# Checkpoint

Run this before telling the owner a checkpoint is done. It produces the report `CLAUDE.md` promises and catches the two ways a checkpoint goes quietly stale: an undocumented change, and a doc that no longer matches the code.

## 1. Read the real state; do not rely on conversation memory

```bash
git status
git log --oneline dev..HEAD
git diff --stat dev...HEAD
git worktree list
```

(`dev..HEAD` is this branch's commits. If `dev` does not exist yet, use `main`.)

## 2. Checks

- **Committed as built, or in one lump?** Compare the commit list with the diff. One commit for many concerns, or several commits stamped within a minute of the report, did not follow `docs/git-workflow.md`. Say so in part 4 of the report. Do not quietly commit the pile and present a tidy history.
- **Anything uncommitted?** `git status` should be clean, or every remaining file has a nameable reason (for example, another session's work in a shared checkout; never stage that).
- **Does every commit carry** `Checkpoint: CP-<n> - <name>` and no AI-attribution line? `git log dev..HEAD --format=%B | grep -c "Checkpoint:"` against the commit count; `grep -ci "co-authored"` must be 0.
- **Changelog entry?** If anything a visitor would notice, or anything about how the repo is worked on, changed, `docs/CHANGELOG.md` needs an entry on this branch (use the `changelog-entry` skill).
- **`docs/prd.md` revision log** updated if a requirement was added, changed or clarified.
- **`CLAUDE.md`, `docs/architecture.md`, `docs/deployment.md` still true?** A new dependency, page, script or workflow change belongs in them.
- **Verification:** run what `docs/testing.md` lists for the change (at least `npm run check` and `npm run build`; `bin/conventions_audit.sh`). Report the figures, and failures plainly.

## 3. Report: four parts, in this order

1. **What was built.** Cite files and `PF<n>` IDs.
2. **What was decided that the docs do not cover,** and where it is now recorded.
3. **Anything believed wrong or unclear in the docs.** Flag it; do not route around it.
4. **What is not done yet,** including anything deferred and why, and anything not verified.

Name the branch and its `Checkpoint: CP-<n>` trailer so the report traces to the commits.

## Stops

This skill never merges and never pushes. Merging into `dev` waits for the owner; merging `dev` into `main` and pushing wait again, because that deploys the public site.
