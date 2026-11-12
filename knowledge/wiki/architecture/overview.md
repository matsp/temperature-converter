---
type: Architecture
title: Architecture overview
description: Components of the static converter page and how they fit.
tags: [architecture]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-temperature-converter.md
    title: Plan decisions
    last_modified: 2026-11-12
---

# Architecture overview

One static page, no framework, no build step, no runtime dependencies. Opened straight from `file://`.

* `converter.js`: pure conversion, parsing and formatting.
* `display.js`: pure view state (band, figure size, notice, legend).
* `app.js`: DOM wiring only; writes view state into the DOM.
* `styles.css` and `fonts/`: the Deep Shade look, see [DESIGN.md](../../../DESIGN.md).

All logic is pure and tested in Node; `app.js` only writes view state into the DOM.[^plan] `converter.js` and `display.js` use a small UMD wrapper (global `Converter` / `Display` in the browser, `module.exports` in Node) and there is no `package.json`.[^plan]

Scripts are classic `<script src>` files, see [ADR 0001](../decisions/0001-classic-scripts-not-modules.md).

The field the user is typing in is never rewritten, so the caret keeps its position and a typed `-` is not replaced by `−`.[^plan]

No deploy workflow and no Actions secrets: the spec says deployment target none.[^plan]

[^plan]: Plan decisions note.
