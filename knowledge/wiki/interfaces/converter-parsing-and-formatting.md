---
type: Interface
title: Converter parsing and formatting rules
description: Input and output rules of converter.js and display.js.
tags: [interfaces,conversion]
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

# Converter parsing and formatting rules

**Parsing (`parseInput`)**

* Accepts `,` as decimal separator (phone keypads).[^plan]
* Rejects `1e3`, `0x10` and `Infinity`, which `Number()` would accept.[^plan]

**Formatting**

* Rounds half away from zero to 2 decimals; `-0` prints as `0`; the minus sign is U+2212.[^plan]

**Bands and legend**

* Band and legend use Celsius rounded to 2 decimals, so float noise never crosses a band edge.[^plan]
* The legend marker pins to the end with "…, off the scale" outside the legend range; exactly absolute zero shows no notice.[^des]

**Figure size**

* All three figures share one size chosen from the longest formatted value (steps at 6, 7 and 8+ characters). Kelvin is usually 6 characters, so the largest size is the normal one.[^des] Sizes are in DESIGN.md.

[^plan]: Plan decisions note.
[^des]: Design note note.
