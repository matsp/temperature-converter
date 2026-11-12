---
type: Gotcha
title: Opacity on legend cells also dims their labels
description: Use an inset shadow overlay to dim a legend cell.
tags: [gotchas,design]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: dir
    resource: ../../raw/2026-11-12-ui-designer-direction-round-temperature-converter.md
    title: Direction round
    last_modified: 2026-11-12
---

# Opacity on legend cells also dims their labels

Dimming legend cells with `opacity` also dims their labels. Use an inset shadow overlay instead.[^dir]

With a dark ground the Kelvin field at the largest figure size clips inside a padded band; the band sketch had to use a smaller size.[^dir]

Contrast-hook flags on the round 2 sketches were unresolved `var()` / `color-mix()` values; the rendered pairs pass AA.[^dir]

[^dir]: Direction round note.
