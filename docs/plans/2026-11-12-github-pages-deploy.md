# GitHub Pages deployment Implementation Plan

> **For agentic workers:** Executed by the Hermes coding team via Kanban: engineer per card, code-reviewer per card, qa-engineer per plan.

**Goal:** Every merge to `main` publishes the converter to `https://matsp.github.io/temperature-converter/`, after CI is green, with only the files the page needs; guard tests keep the page deployable (relative assets, published file set, workflow wiring).

**Architecture:** A second workflow, `.github/workflows/deploy.yml` (name `Deploy`), triggers on `workflow_run` of the `CI` workflow on `main` and deploys only when that run concluded `success` and came from a `push`. It checks out the exact commit CI tested (`workflow_run.head_sha`), copies the six page entries into `_site/`, and publishes with the official actions (`configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`). A final step fetches the page, scripts, stylesheet and fonts from the live URL (curl with retries) so a 404 fails the run. `workflow_dispatch` allows a manual redeploy. No build step, no secrets.

**Already on this plan branch (architect, CI/CD setup):** `.github/workflows/deploy.yml` (new), `.github/workflows/ci.yml` (`timeout-minutes: 10`, `--test-timeout=10000`), AGENTS.md (deployment line, test command). The engineer does not rewrite these; Task 1 adds tests that pin them.

**Tech Stack:** GitHub Actions, GitHub Pages; Node ≥ 24 built-in test runner (`node:test`, `node:assert/strict`, `node:fs`, `node:path`). No packages, no YAML parser: the tests read the workflow files as text.

**Spec:** `docs/specs/2026-11-12-temperature-converter-design.md`, section "Deployment: GitHub Pages". Nothing visible to users changes; DESIGN.md and the Deep Shade look are untouched.

## One-time manual step (Mats, repo admin, before the plan PR is merged)

GitHub → `matsp/temperature-converter` → Settings → Pages → Build and deployment → Source: **GitHub Actions**. Nothing else (no branch, no custom domain). No GitHub Actions secrets are needed.

Why before the merge: merging the plan PR puts `deploy.yml` on `main`; the CI run of that merge triggers the first deploy. With Pages not enabled, `configure-pages` fails the run. (If that happens: enable Pages, then Actions → Deploy → Run workflow.)

## Global Constraints

- Published set is exactly `index.html`, `converter.js`, `display.js`, `app.js`, `styles.css`, `fonts/`; tests, docs, design/, knowledge/ are not published.
- All asset references in `index.html` and `styles.css` are relative (no leading `/`, no `//`, no scheme), so the page works from `file://` and under the `/temperature-converter/` sub-path.
- Deploy only after CI is green on `main`; a failed deploy is a failed `Deploy` run.
- Tests fail fast: `node --test --test-timeout=10000 "test/**/*.test.js"`; every CI job has `timeout-minutes: 10`.
- Out of scope: other hosting, custom domain, any change to page behaviour or look.

## Review Focus

1. **Deploying an untested commit.** `workflow_run` runs on the default branch's latest workflow file; the checkout must use `github.event.workflow_run.head_sha`, and the job must skip when CI failed or came from a pull request.
2. **Absolute asset paths.** `/styles.css` works from a domain root but 404s under the project sub-path and breaks `file://`; the guard test must catch it in both `index.html` and `styles.css`.
3. **Published set drift.** A new asset (another script or font) that is referenced but not in the `cp` line would 404 only on the live site; the test ties references to the staged set and the smoke-check list to the staged files.

---

## File Structure

| File | Responsibility |
|---|---|
| `.github/workflows/deploy.yml` | Deploy workflow (done on this branch). |
| `.github/workflows/ci.yml` | CI job `ci` (timeouts added on this branch). |
| `test/deploy.test.js` | Task 1: guard tests for assets and workflows, plain text parsing. |
| `README.md` | Task 1: live URL and how to run locally. |

---

### Task 1: Deployment guard tests and README

**Files:**
- Create: `test/deploy.test.js`
- Modify: `README.md`

**Helpers (in the test file, pure, take strings so they can be tested on fixtures):**
- `stagedEntries(deployYml: string) -> string[]` — the words between `cp -r` and `_site/` on the staging line.
- `assetRefs(html: string, css: string) -> string[]` — every `href="…"` and `src="…"` value in the HTML plus every `url(…)` value (quotes stripped) in the CSS, in order of appearance.
- `isRelative(ref: string) -> boolean` — false when the ref starts with `/` (covers `//`) or with a scheme (`/^[a-z][a-z0-9+.-]*:/i`, covers `http:`, `https:`, `data:`, `file:`).
- `smokePaths(deployYml: string) -> string[]` — the words after `for f in` up to `; do` on the smoke-check line, `""` kept as the empty string.

**Step 1: Write the failing helper tests** (each fails first because the helper does not exist yet):

| Test name | Input | Expected |
|---|---|---|
| `stagedEntries reads the cp line` | `"  mkdir _site\n  cp -r index.html fonts _site/\n"` | `["index.html", "fonts"]` |
| `stagedEntries without a cp line` | `"steps: []"` | `[]` |
| `assetRefs reads html and css` | html `<link rel="stylesheet" href="styles.css"><script src="app.js"></script>`, css `src: url("fonts/a.ttf") format("truetype"); x: url(b.png)` | `["styles.css", "app.js", "fonts/a.ttf", "b.png"]` |
| `isRelative accepts relative refs` | `styles.css`, `fonts/a.ttf`, `./app.js` | `true` each |
| `isRelative rejects absolute refs` | `/styles.css`, `//cdn.example/x.css`, `https://fonts.googleapis.com/css`, `data:font/ttf;base64,AA` | `false` each |
| `smokePaths reads the for list` | `for f in "" app.js fonts/a.ttf; do` | `["", "app.js", "fonts/a.ttf"]` |

Run: `node --test --test-timeout=10000 test/deploy.test.js > /tmp/<card id>-tests.log 2>&1; tail -n 15 /tmp/<card id>-tests.log` → fails (helpers undefined). Write the helpers, run again → pass.

**Step 2: Write the repo guard tests** (they read the real files: `index.html`, `styles.css`, `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`, directory `fonts/`):

| Test name | Check | Assertion message on failure |
|---|---|---|
| `deploy publishes exactly the page files` | `stagedEntries(deploy.yml)` sorted equals `["app.js", "converter.js", "display.js", "fonts", "index.html", "styles.css"]` | default deepEqual diff |
| `page assets are relative` | every ref from `assetRefs(index.html, styles.css)` passes `isRelative` | `absolute asset reference: <ref>` |
| `page assets are published` | every ref exists on disk (resolved from the repo root; `styles.css` sits at the root) and its first path segment is in `stagedEntries` | `not published: <ref>` |
| `smoke check covers every published file` | `smokePaths(deploy.yml)` contains `""` and every staged file: the five root files plus `fonts/<name>` for each file in `fonts/` | `not smoke-checked: <path>` |
| `deploy runs only after green CI on main` | deploy.yml text contains each of: `workflows: [CI]`, `branches: [main]`, `github.event.workflow_run.conclusion == 'success'`, `github.event.workflow_run.event == 'push'`, `ref: ${{ github.event.workflow_run.head_sha`, `timeout-minutes: 10`, `actions/deploy-pages@v4` | `deploy.yml lacks: <snippet>` |
| `ci fails fast` | ci.yml text contains `name: CI`, `timeout-minutes: 10`, `--test-timeout=10000` | `ci.yml lacks: <snippet>` |

These pin files that already exist, so they pass at once. Prove each can fail: temporarily change `href="styles.css"` to `href="/styles.css"` in `index.html` (→ `absolute asset reference: /styles.css`), drop `fonts` from the `cp` line (→ `not published: fonts/Barlow-Medium.ttf` and the exact-set test fails), drop `fonts/Barlow-Medium.ttf` from the smoke list (→ `not smoke-checked: fonts/Barlow-Medium.ttf`); revert each and note the observed messages in your raw note.

**Step 3: README.** Replace the content of `README.md` with exactly:

```markdown
# temperature-converter

Type a temperature in Celsius, Fahrenheit or Kelvin; the other two follow.

Live: https://matsp.github.io/temperature-converter/

Run locally: open `index.html` in a browser. Tests: `node --test --test-timeout=10000 "test/**/*.test.js"` (Node 24 or newer, headless Chrome in `CHROME`).
```

**Step 4: Full suite and commit.** `node --test --test-timeout=10000 "test/**/*.test.js" > /tmp/<card id>-tests.log 2>&1; tail -n 15 /tmp/<card id>-tests.log` → all pass (40 existing + 12 new). Commit `test: deployment guard tests; README live URL`.

---

## Verification after merge (qa-engineer)

On the live URL `https://matsp.github.io/temperature-converter/`, after the feature PR is merged and the `Deploy` run is green:

| Check | Expected |
|---|---|
| Type `0` in Celsius | Fahrenheit `32`, Kelvin `273.15` |
| Type `100` in Celsius | Fahrenheit `212`, Kelvin `373.15` |
| Type `-40` in Celsius | Fahrenheit `−40` |
| Network log of a fresh load | `index.html`, `styles.css`, three scripts, three fonts all 200; no 404s; no request outside `matsp.github.io` |
| `index.html` from `file://` (local clone of `main`) | same three examples work, Deep Shade fonts load |
| Latest `Deploy` run | green, including the smoke-check step |
