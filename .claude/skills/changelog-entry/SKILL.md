---
name: changelog-entry
description: Adds an entry to docs/CHANGELOG.md in this project's format (one "- " line, plain language, PF id where one exists). Use whenever a checkpoint changes something a visitor would notice or changes how the repo is worked on. A merge into main is refused without one.
---

# Changelog entry

`docs/CHANGELOG.md` is hand-written, never generated from `git log`. Two guards refuse a merge into `main` unless the branch being merged adds at least one new entry line, because that merge deploys the public site.

## Rules

- Categories: `Added`, `Changed`, `Fixed`, `Deprecated`, `Removed`, `Security`.
- An entry is **one line starting `- `**. The checker counts those lines, so do not wrap an entry across bullets.
- Say what is true now, for someone who has not seen the diff. Not which files moved.
- Cite the requirement in parentheses where one exists: `(PF3)`.
- Only what a visitor would notice, or what changes how the repo is worked on. Do not invent an entry for a change nobody would see.
- No personal details, no secrets, nothing from a private source. This file is public.

## Steps

1. Look at what the branch changed: `git log --oneline dev..HEAD` and `git diff --stat dev...HEAD`.
2. Open `docs/CHANGELOG.md`. Under `## [Unreleased]`, find or create the right `### Category` heading.
3. Add the entry. Commit it **on the branch being merged**, before the merge, with the branch's `Checkpoint:` trailer.
4. Check: `bin/check_changelog.sh --base dev --incoming HEAD` should exit 0.

## When there is truly nothing to say

A merge that changes nothing a visitor would notice gets no invented entry. The owner may merge with `SKIP_CHANGELOG_CHECK=1` as a stated way through. Say so to the owner rather than choosing it yourself.

## Dry run

If asked to "dry run", print the entry you would add and where, and write nothing.
