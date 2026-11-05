# Deployment

**Status:** Living document. Describes what exists; the proposal at the end is **not applied**.

## Where it runs

GitHub Pages, at https://zainaltaf.dev. The custom domain is set by `public/CNAME`. **The repository is public**: verified by the owner with `gh repo view zaina0k/zaina0k.github.io` (visibility PUBLIC) on 2026-11-05.

## How it deploys

`.github/workflows/deploy.yml` runs on **every push to `main`** and on manual dispatch:

1. Check out, set up Node 22 with the npm cache.
2. `npm ci`, then `npm run build`, with `PUBLIC_WEB3FORMS_KEY` taken from the repository secret of the same name.
3. Upload `./dist` as the Pages artifact, then `actions/deploy-pages`.

There is no test or type-check step in CI. `npm run check` and `npm run build` are run by hand before a merge into `main` (`docs/git-workflow.md`).

Merges into `dev` do not deploy. **A push to `main` is a public release**, and is never done without the owner's say-so. Claude's settings deny every `git push`.

## Secrets

| Name | Where | Public? |
|---|---|---|
| `PUBLIC_WEB3FORMS_KEY` | GitHub repository secret; local `.env` for development | **Yes in effect.** The `PUBLIC_` prefix inlines it into the client bundle, so anyone can read it from the shipped JavaScript. Web3Forms keys are designed for browser use. |

`.env.example` is the blank template and is tracked. Real `.env*` files are gitignored and denied to Claude. No other secret exists. Do not paste a secret into any file under version control.

## Running locally

```bash
npm install
cp .env.example .env     # then add the key, if testing the contact form
npm run dev              # http://localhost:4321
npm run build && npm run preview
```

## Rollback

TBD, ask owner. The usual route would be reverting the merge commit on `main` and pushing, which redeploys the previous site.

## Proposal: stop tooling-only merges redeploying the site (NOT APPLIED)

The workflow redeploys on any push to `main`, including pushes that only change docs or tooling. Proposed change to the `on:` block and an added `concurrency:` block. **`deploy.yml` has not been touched; this needs the owner's separate approval.**

```diff
 on:
   push:
     branches: [main]
+    paths-ignore:
+      - 'docs/**'
+      - '.claude/**'
+      - 'bin/**'
+      - '.githooks/**'
+      - '*.md'
   workflow_dispatch:

+concurrency:
+  group: pages
+  cancel-in-progress: false
+
 permissions:
```

Notes: `paths-ignore` only skips a run when every changed file matches; a push mixing docs and `src/` still deploys. `cancel-in-progress: false` lets a running deploy finish rather than leave Pages half-updated.
