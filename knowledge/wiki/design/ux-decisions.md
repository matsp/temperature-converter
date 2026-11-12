---
type: Design
title: UX decisions
description: Why the screen works the way it does; values are in DESIGN.md.
tags: [design,ux]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: dec
    resource: ../../raw/2026-11-12-ui-designer-decisions-temperature-converter.md
    title: Design decisions
    last_modified: 2026-11-12
  - id: des
    resource: ../../raw/2026-11-12-ui-designer-design-temperature-converter.md
    title: Design note
    last_modified: 2026-11-12
  - id: dir
    resource: ../../raw/2026-11-12-ui-designer-direction-round-temperature-converter.md
    title: Direction round
    last_modified: 2026-11-12
---

# UX decisions

Design system: [DESIGN.md](../../../DESIGN.md). Mode: Operate (a one-screen tool).[^dir]

* **Direction:** weather map, deep shade; see [ADR 0003](../decisions/0003-deep-shade-weather-map-direction.md).
* **Colour per band:** discrete, see [ADR 0004](../decisions/0004-discrete-colour-bands.md).
* **Shared figure size:** all three figures use one size from the longest value.[^des]
* **Whole field is a label:** clicking anywhere focuses the input; `field-sizing: content` keeps the unit right after the number.[^des]
* **Reserved notice slot:** fixed height so the page never jumps.[^des]
* **Legend marker:** pins to the end with "…, off the scale" outside the legend range; exactly absolute zero shows no notice.[^des]
* **Neutral states:** empty and below-absolute-zero have their own neutral grounds.[^dec]
* **Offline:** fonts are self-hosted so the page works from `file://`.[^dec]
* **Shape:** square corners everywhere, 4px-based spacing scale.[^dec]
* **Mats's decisions:** round 1 "Option B, but darker"; round 2 "A"; gate 4 approved 2026-11-12, no changes.[^dec]

[^dec]: Design decisions note.
[^des]: Design note note.
[^dir]: Direction round note.
