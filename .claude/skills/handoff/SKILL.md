---
name: handoff
description: Writes the current session's state to docs/handoffs/ (gitignored), derived from git rather than memory, so a new session can resume without re-deriving decisions. Use at a session boundary or when the owner asks to hand off.
---

# Handoff

Context compaction keeps facts and loses reasoning. A handoff file lets the next session read why, not guess.

## Derive from git, not memory

Run these at the moment of writing and base the note on their output:

```bash
git status
git log --oneline -10
git diff --stat
git worktree list
```

## The file

Write `docs/handoffs/YYYY-MM-DD-<slug>.md`. That directory is **gitignored on purpose**: handoffs name in-progress work and must never be committed.

```markdown
# Handoff: <slug>

**Date:** YYYY-MM-DD
**Branch / worktree:** <branch> at <path>
**Checkpoint:** CP-<n> - <name>

## Where this left off
<one paragraph from git status/log. Name the commits made. Uncommitted work needs a stated reason.>

## Decisions made this session
<anything settled in conversation and not yet in docs/>

## Open questions
<ambiguities not yet resolved; cite PF ids>

## Next step
<one concrete action>
```

## Rules

- Record state; never invent a requirement or fact.
- No secrets, no personal details, even though the file is gitignored.
- If the handoff conflicts with `docs/prd.md`, the handoff is stale and the PRD wins.
- If other sessions share the checkout (`git worktree list`, `ListAgents`), say so in the note.

## Dry run

If asked to "dry run", print the note and write no file.
