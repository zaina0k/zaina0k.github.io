---
name: conventions-audit
description: Greps the working tree for violations of this repo's rules that grep can catch (secrets or .env, personal details, missing changelog entry, unfiled TODOs, oversized files), then a short judgement pass for what grep cannot. Use before reporting a checkpoint done, and before any merge into main. The repo and its host are public.
---

# Conventions audit

Run `bin/conventions_audit.sh`. It is read-only and exits 1 on any FAIL. WARN never fails.

```bash
bin/conventions_audit.sh
bin/test_conventions_audit.sh   # only when the script itself changed
```

## What the script checks (stack-agnostic, enabled)

| # | Check | Result |
|---|---|---|
| 1 | `.env*` (other than `.env.example`), key and credential files in the tree; secret-shaped strings in text | FAIL |
| 2 | Phone-number patterns; date-of-birth, home-address and postcode patterns | FAIL |
| 2 | Email addresses beyond the allowlist | WARN: confirm it is meant to be public |
| 3 | No new `docs/CHANGELOG.md` entry on this branch (skipped on `main` and `dev`) | FAIL |
| 4 | `TODO`/`FIXME`/`XXX` with no `#<issue>` | FAIL |
| 5 | New file over the limit: 512 KB text, 2 MB image or PDF | FAIL; files in `bin/conventions_audit.baseline` are known debt and only noted |

## What it cannot see

It reads text. A detail inside an image, the CV PDF or a binary passes. A personal detail in an unusual form passes. A clean run says the patterns are absent, not that the repo is safe. When a change adds a page, content file, image or the CV, **look at it**, and if it holds a personal detail the owner has not said is meant to be published, stop and ask.

## Judgement pass (not grep-able)

- Does anything added reveal a phone number, home address, date of birth, or similar personal detail, in any form, including image alt text or a PDF?
- Does anything added look like a secret or credential, or tell the reader where one lives?
- Does the change touch `.github/workflows/`? That needs the owner's separate approval.
- Does the change need a `docs/` update (`architecture.md`, `deployment.md`, `prd.md`)?

## Stack-specific checks: PROPOSED, NOT ENABLED

Fill in once the owner agrees. Each would be a function in the script, with a planted-failure case in `bin/test_conventions_audit.sh`.

- **Pages:** every `src/pages/**/*.astro` passes a title and description to `BaseLayout`.
- **Content:** every `src/content/projects/*.md` passes `npm run build` (the schema is the contract); a project's `summary` is at most 160 characters.
- **Islands:** every `client:*` directive is on a `.tsx` component that needs interactivity; static content stays in `.astro`.
- **Tailwind:** no raw hex or `rgb()` colours in components outside the theme tokens in `src/styles/global.css`.
- **Images:** content images use Astro's `<Image>` or a processed `src/assets` import, and have `alt` text.
- **Dependencies:** `package.json` gained no dependency the owner has not approved.

## Dry run

The first time this skill is used in a new checkout, run the script and report its output as is.
