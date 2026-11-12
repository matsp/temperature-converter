---
type: Testing
title: Test strategy
description: How logic and page behaviour are tested.
tags: [testing,ci]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-temperature-converter.md
    title: Plan decisions
    last_modified: 2026-11-12
---

# Test strategy

* Pure logic (`converter.js`, `display.js`) is tested in Node.[^plan]
* Page behaviour is tested in headless Chrome over the DevTools protocol with Node built-ins (WebSocket, fetch), the same pattern as `design/shoot.mjs`.[^plan]
* CI sets `CHROME=google-chrome` (preinstalled on ubuntu-latest).[^plan]
* `node --test "test/**/*.test.js"` exits 0 with zero tests, so CI was green on the plan branch before any code existed.[^plan]

See [Commands](../runbook/commands.md) and the [headless Chrome gotcha](../gotchas/headless-chrome-minimum-width.md).

[^plan]: Plan decisions note.
