---
type: Design
title: Accessibility
description: Contrast approach and rules the reviewer checks.
tags: [design,accessibility]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: des
    resource: ../../raw/2026-11-12-ui-designer-design-temperature-converter.md
    title: Design note
    last_modified: 2026-11-12
  - id: dir
    resource: ../../raw/2026-11-12-ui-designer-direction-round-temperature-converter.md
    title: Direction round
    last_modified: 2026-11-12
---

# Accessibility

* Contrast is checked once per band because colour is discrete ([ADR 0004](../decisions/0004-discrete-colour-bands.md)).[^des]
* Measured in the current design: figures 6.7-9.8:1, labels 5.9-8.0:1, rules 3.4-4.6:1.[^des] Derivation rules are in [DESIGN.md](../../../DESIGN.md).
* Dark figures are lifted so cold bands stay readable.[^des]
* The whole field is a `<label>`, so the click target is the full field.[^des]
* Contrast hooks may flag unresolved `var()` / `color-mix()`; judge the rendered pairs.[^dir]

[^des]: Design note note.
[^dir]: Direction round note.
