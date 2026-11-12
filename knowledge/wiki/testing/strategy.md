---
type: Testing
title: Test strategy
description: How logic and page behaviour are tested.
tags: [testing,ci]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T23:10:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-temperature-converter.md
    title: Plan decisions
    last_modified: 2026-11-12
  - id: eng
    resource: ../../raw/2026-11-12-engineer-headless-chrome-flakiness.md
    title: Headless Chrome flakiness
    last_modified: 2026-11-12
  - id: qa
    resource: ../../raw/2026-11-12-qa-engineer-temperature-converter.md
    title: QA report
    last_modified: 2026-11-12
  - id: rev
    resource: ../../raw/2026-11-12-ui-designer-review-temperature-converter.md
    title: Design review
    last_modified: 2026-11-12
  - id: dg
    resource: ../../raw/2026-11-12-engineer-deploy-guard-tests.md
    title: Deploy guard tests
    last_modified: 2026-11-12
  - id: ci
    resource: ../../raw/2026-11-12-engineer-ci-chrome-startup.md
    title: CI Chrome startup
    last_modified: 2026-11-12
  - id: qadep
    resource: ../../raw/2026-11-12-qa-github-pages-deploy.md
    title: QA GitHub Pages deploy
    last_modified: 2026-11-12
  - id: pd
    resource: ../../raw/2026-11-12-architect-plan-github-pages-deploy.md
    title: Pages deploy plan decisions
    last_modified: 2026-11-12
---

# Test strategy

* Pure logic (`converter.js`, `display.js`) is tested in Node.[^plan]
* Page behaviour is tested in headless Chrome over the DevTools protocol with Node built-ins (WebSocket, fetch), the same pattern as `design/shoot.mjs`.[^plan]
* CI sets `CHROME=google-chrome` (preinstalled on ubuntu-latest).[^plan]
* `node --test "test/**/*.test.js"` exits 0 with zero tests, so CI was green on the plan branch before any code existed.[^plan]

See [Commands](../runbook/commands.md) and the [headless Chrome gotcha](../gotchas/headless-chrome-minimum-width.md).

[^plan]: Plan decisions note.

## Status and flakiness

* QA on `feat/temperature-converter` at 9ab747b (Node v26.12.1): 40 tests, 40 pass, 0 fail, about 5.3 s; verdict PASS. Not checked: a real iOS device and real google-chrome on CI (the PR's CI run covers the latter).[^qa]
* Page tests need `--disable-dev-shm-usage`, a wait for `about:blank` before navigating, and per-call CDP timeouts; see [page-test flakiness](../gotchas/headless-chrome-page-test-flakiness.md).[^eng]
* The test asserting the input `inputmode` expects `"text"` (see [UX decisions](../design/ux-decisions.md)).[^rev]

[^qa]: QA report.
[^eng]: Engineer note on headless Chrome flakiness.
[^rev]: Design review.

## Deploy guards and CI timeout

* `test/deploy.test.js` (12 tests) reads the workflow YAML and `index.html` as text, no parser, to keep the repo dependency-free. It checks relative asset references, that every referenced file is published (exact set), and that every published file is smoke-checked. The smoke list uses `""` for the page root instead of `index.html`.[^dg][^pd]
* Mutation checks proved the guards: `href="/styles.css"` fails with `absolute asset reference`; dropping `fonts` from the `cp` line fails with `not published: fonts/Barlow-Medium.ttf`; dropping that font from the smoke list fails with `not smoke-checked`.[^dg]
* CI has `timeout-minutes: 10` and runs with `--test-timeout=10000`; the suite takes about 5 s locally.[^pd] A slow `before` hook is reported on every test, see [the gotcha](../gotchas/ci-test-timeout-hides-chrome-startup.md).[^ci]
* QA on `feat/github-pages-deploy`: 52 tests, 52 pass, about 5 s, at 7564f2f and again at 0329fcb after the CI fix; verdict PASS. The live deploy could not be verified before merge, and QA did not query CI itself (no gh CLI or token).[^qadep]

[^dg]: Deploy guard tests note.
[^ci]: Engineer note on CI Chrome startup.
[^qadep]: QA report on the Pages deploy.
[^pd]: Pages deploy plan decisions.
