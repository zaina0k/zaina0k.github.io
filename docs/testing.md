# Testing

**Status:** Living document.

There is no automated test suite for the site. Verification is a small set of instruments, each of which proves something narrow. This file says what each one can and cannot see, so nothing is called "verified" on the strength of the wrong tool.

## The instruments

Figures are from a run on 2026-11-05.

| Instrument | Catches | Does NOT catch |
|---|---|---|
| `npm run check` (`astro check`) | Type errors in `.ts`/`.tsx`, type and syntax errors in `.astro` frontmatter and templates, content-collection type mismatches. Last run: 35 files, 0 errors, 3 hints. | Whether a page looks right or works. A component can type-check and render nothing. It does not run the build, so a runtime failure in a page is invisible to it. Hints are not failures, and a clean run still carried a deprecated-API hint. |
| `npm run build` (`astro build`) | Content frontmatter that violates the Zod schema (the build fails), broken imports, a page that throws while rendering, an image that cannot be processed. Last run: 15 pages. | That the output looks right, that internal links resolve, that the contact form works (the key is only read in the browser), that anything behaves in a browser, or anything about hosting. A page can build and be wrong. |
| A type check on its own (`npx tsc --noEmit`) | `.ts`/`.tsx` errors. | `.astro` files, which it cannot read at all; that is why `astro check` is the type check for this repo. |
| `npm run preview` plus a browser look | What a person sees on the page you opened, at the window size you used, in the theme you chose. Layout, theme toggle, an island hydrating. | Every page you did not open. Other viewport sizes. The other theme. Search engines and social cards. Whether production (`zainaltaf.dev`) differs from preview. |
| `bin/test_check_changelog.sh` | The changelog checker's decisions against a scratch repo. | Whether the entry is any good; a reworded old entry counts (a documented limit). |
| `bin/test_merge_guard.sh` | The Claude merge guard's allow/deny decisions on 22 command shapes. | Whether Claude Code calls the hook (that is configuration); command shapes nobody thought of. |
| `bin/conventions_audit.sh` | Secrets or `.env` in the tree, phone and date-of-birth patterns in committed text, a missing changelog entry, unfiled TODOs, oversized files. | Anything it has no pattern for. A personal detail written in an unusual form passes. It reads text; it does not read images or the PDF. |
| `git status`, `git diff`, `git log` | What is actually staged and committed. | Whether it is correct. |

## Two rules

**A syntax check is not a correctness check.** `astro check` passing means the code is well-formed and type-consistent. Before reporting a change done, build it and look at it in a browser.

**Show the verifier can fail.** A tool that reports "no problems" is only evidence if it is capable of reporting a problem. For anything that sweeps and says "clean", feed it a known-bad case and confirm it complains before trusting a clean run. `bin/test_merge_guard.sh --self-check` is the worked example: it runs the suite against a deliberately broken guard and requires failures.

## Before reporting a checkpoint done

1. `npm run check` and `npm run build` both pass, and say so with the figures.
2. For anything visual, open the page with `npm run preview`, in both themes.
3. `bin/test_check_changelog.sh` and `bin/test_merge_guard.sh` if the guards changed.
4. `bin/conventions_audit.sh`.
5. Say plainly what you did not check.
