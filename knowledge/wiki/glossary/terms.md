---
type: Glossary
title: Terms
description: Domain terms used in code and design.
tags: [glossary]
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
---

# Terms

* **Band:** one of ten 10 °C ranges of the legend (-40 to 50 °C), each with its own colour; plus the empty and below-absolute-zero states.[^dec]
* **Isotherm colour:** the forecast-map colour of a temperature band, used for the ground (very dark shade) and the figures.[^dec]
* **Deep shade:** the chosen design direction, see [ADR 0003](../decisions/0003-deep-shade-weather-map-direction.md).
* **Legend strip / marker:** the band scale and the pin showing the current value.[^des]
* **Notice slot:** the reserved line for messages such as below absolute zero.[^des]

[^dec]: Design decisions note.
[^des]: Design note note.
