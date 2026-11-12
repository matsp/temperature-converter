---
type: Runbook
title: Commands
description: Test, build and run commands.
tags: [runbook]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-temperature-converter.md
    title: Plan decisions
    last_modified: 2026-11-12
  - id: des
    resource: ../../raw/2026-11-12-ui-designer-design-temperature-converter.md
    title: Design note
    last_modified: 2026-11-12
---

# Commands

* Test (also CI job `ci`): `node --test "test/**/*.test.js"`. Page tests need headless Chrome, path in `CHROME`; CI uses `google-chrome`.[^plan]
* Build: none.
* Run: open `index.html` in a browser.
* Screenshots: `node design/shoot.mjs` (Node 22 or newer, no dependencies).[^des]

[^plan]: Plan decisions note.
[^des]: Design note note.
