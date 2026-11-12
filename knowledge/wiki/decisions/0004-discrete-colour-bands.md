---
type: Decision
title: ADR 0004: discrete colour per 10 °C band
description: Why colour is stepped, not continuously mixed.
tags: [adr,design,accessibility]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: des
    resource: ../../raw/2026-11-12-ui-designer-design-temperature-converter.md
    title: Design note
    last_modified: 2026-11-12
---

# ADR 0004: discrete colour per 10 °C band

**Decision:** colour is discrete per 10 °C band (ten bands plus empty and below-absolute-zero states).[^des] Contrast can then be checked once per band.

**Rejected:** a continuous live `color-mix`, as in the round 2 sketch. It gave the cold bands unreadable violet figures.[^des]

The per-band derivation (OKLCH) and measured contrast are in DESIGN.md and [Accessibility](../design/accessibility.md).

[^des]: Design note note.
