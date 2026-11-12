---
type: DeadEnd
title: Rejected approaches
description: Things tried or weighed and dropped, with reasons.
tags: [dead-ends]
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
  - id: dir
    resource: ../../raw/2026-11-12-ui-designer-direction-round-temperature-converter.md
    title: Direction round
    last_modified: 2026-11-12
---

# Rejected approaches

* **Absolute-zero check on converted Celsius:** float noise near the limit. See [ADR 0002](../decisions/0002-absolute-zero-on-typed-value.md).[^plan]
* **ES module scripts:** Chrome refuses them from `file://`. See [ADR 0001](../decisions/0001-classic-scripts-not-modules.md).[^plan]
* **Continuous `color-mix` colouring:** unreadable cold-band figures. See [ADR 0004](../decisions/0004-discrete-colour-bands.md).[^des]
* **A larger figure size than the chosen maximum:** clipped the Kelvin value in a third of a 1440px layout.[^des]
* **Baseline alignment of the unit row:** an empty input has no baseline and drops the unit; flex-end alignment is used.[^des]
* **Round 2 night map and dark frame:** see [ADR 0003](../decisions/0003-deep-shade-weather-map-direction.md).[^dir]

[^plan]: Plan decisions note.
[^des]: Design note note.
[^dir]: Direction round note.
