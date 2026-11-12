---
type: Testing
title: Test strategy
description: How logic and page behaviour are tested.
tags: [testing,ci]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T22:00:00+00:00 }
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
