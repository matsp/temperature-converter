---
type: Architecture
title: Architecture overview
description: Components of the static converter page and how they fit.
tags: [architecture]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T23:10:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-temperature-converter.md
    title: Plan decisions
    last_modified: 2026-11-12
  - id: pd
    resource: ../../raw/2026-11-12-architect-plan-github-pages-deploy.md
    title: Pages deploy plan decisions
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

Deployment (added later): a separate `Deploy` workflow publishes the static files to GitHub Pages after green CI on `main`, with no Actions secrets; see [ADR 0005](../decisions/0005-deploy-workflow-after-green-ci.md) and the [deploy runbook](../runbook/deploy.md).[^pd] The original plan had no deploy workflow (deployment target none).[^plan]

[^plan]: Plan decisions note.
[^pd]: Pages deploy plan decisions.
