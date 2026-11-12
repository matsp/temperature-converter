# Plan decisions: GitHub Pages deployment (architect, 2026-11-12)

Plan: `docs/plans/2026-11-12-github-pages-deploy.md`.

- Deploy is a separate workflow `Deploy` triggered by `workflow_run` of `CI` on `main`, guarded by `conclusion == 'success'` and `event == 'push'`. Checkout uses `workflow_run.head_sha` so the deployed commit is the one CI tested.
  - Rejected: deploy job inside ci.yml with `needs: ci` (works, but mixes PR CI and deploy permissions `pages: write`/`id-token: write` in one file). Rejected: deploy on plain `push` (would deploy before/without green CI).
- Staging is an inline `cp -r index.html converter.js display.js app.js styles.css fonts _site/`, no script: the workflow depends on nothing that is not already on `main`, so it can land with the plan PR.
- Smoke check after `deploy-pages`: curl with retries for the page, three scripts, stylesheet and three fonts; a 404 fails the run.
- Gotcha: if Pages is not enabled (Settings → Pages → Source "GitHub Actions"), `configure-pages` fails. Mats enables it before the plan PR merges; recovery is a manual `workflow_dispatch` run.
- CI gained `timeout-minutes: 10` and `--test-timeout=10000` (team rule; suite runs in ~5 s locally, 40 tests).
- Guard tests (`test/deploy.test.js`) read workflow YAML as text, no parser, keeping the repo dependency-free.
- No secrets needed.
