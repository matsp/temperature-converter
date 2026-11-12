---
type: Design
title: Components
description: UI components of the converter; values are in DESIGN.md.
tags: [design,components]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: des
    resource: ../../raw/2026-11-12-ui-designer-design-temperature-converter.md
    title: Design note
    last_modified: 2026-11-12
  - id: dec
    resource: ../../raw/2026-11-12-ui-designer-decisions-temperature-converter.md
    title: Design decisions
    last_modified: 2026-11-12
---

# Components

* **Field row:** a `<label>` wrapping an input and its unit; input uses `field-sizing: content`; row aligned to flex-end.[^des]
* **Figure:** large tabular numerals, one shared size across the three fields.[^dec]
* **Notice slot:** reserved single line under the fields.[^des]
* **Legend strip:** ten isotherm bands with a marker for the current value.[^des]

Tokens: [DESIGN.md](../../../DESIGN.md). Mockup: `design/mockups/converter.html`.

[^des]: Design note note.
[^dec]: Design decisions note.
