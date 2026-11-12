---
type: Decision
title: ADR 0003: Deep shade weather-map direction
description: The chosen visual direction and the options that were rejected.
tags: [adr,design]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: dec
    resource: ../../raw/2026-11-12-ui-designer-decisions-temperature-converter.md
    title: Design decisions
    last_modified: 2026-11-12
  - id: dir
    resource: ../../raw/2026-11-12-ui-designer-direction-round-temperature-converter.md
    title: Direction round
    last_modified: 2026-11-12
---

# ADR 0003: Deep shade weather-map direction

**Status:** accepted; gate 4 approved by Mats 2026-11-12, no changes.[^dec]

**Decision:** weather map, "deep shade" take. The page ground is a very dark shade of the isotherm colour of the current temperature; the numerals use the full isotherm colour; a legend strip with a marker shows where the value sits. Mats chose the weather map in round 1 ("Option B, but darker") and, of three darker takes, the one closest to the original in round 2 ("A"): colour still says how warm the value is while the page stays dark.[^dec]

**Rejected alternatives**

* Round 1 A, reference table: bottle-green cloth band, serif tabular rows among fixed points.[^dec]
* Round 1 C, departure board: split-flap digit cells, amber lamps for below absolute zero.[^dec]
* Round 1 D, plain standard look.[^dec]
* Round 2 B, night map: fixed near-black ground, only the current legend band glows; lost most of the colour signal.[^dec]
* Round 2 C, dark frame: near-black page, one isotherm-coloured band behind the fields.[^dec]
* Round 2 D, plain standard look.[^dec]

Round 1 also weighed other grounded candidates (cookbook oven chart, thermal-camera palette, almanac tables, wall thermometer) and declined challengers (centre-rail reference setting, warm consumer app, star atlas, cassette j-card, transit diagram).[^dir]

Values live in [DESIGN.md](../../../DESIGN.md).

[^dec]: Design decisions note.
[^dir]: Direction round note.
