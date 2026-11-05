# Deployment

**Status:** Living document. Describes what exists, including the workflow change applied on 2026-11-05 (CP-20), which has not yet run.

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

## Workflow change: tooling-only pushes no longer redeploy (APPLIED, not yet observed)

Applied on `cp/20-pages-workflow` at the owner's approval on 2026-11-05. It was previously a proposal. Two additions to `.github/workflows/deploy.yml`; nothing else in the workflow changed (same two jobs, same build steps, same secret):

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

How it behaves, from GitHub's documented rules for filter patterns:

- `paths-ignore` skips a run only when **every** changed file matches. A push that mixes docs with `src/` or `public/` still deploys.
- `*` does not match `/`, so `*.md` covers Markdown at the repo root (such as `README.md`) and **not** project pages under `src/content/projects/`, which still deploy.
- `cancel-in-progress: false` lets a running deploy finish rather than leave Pages half-updated; a second one queues.
- `workflow_dispatch` is unaffected.

**Not yet observed:** the YAML parses and the structure was checked, but the workflow has not run with these changes. The first push to `main` after this merge is the first run under it. The workflow remains a protected file: any further change needs the owner's separate approval.
