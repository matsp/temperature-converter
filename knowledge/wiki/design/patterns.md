---
type: Design
title: Patterns
description: Layout and state patterns; values are in DESIGN.md.
tags: [design,patterns]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: des
    resource: ../../raw/2026-11-12-ui-designer-design-temperature-converter.md
    title: Design note
    last_modified: 2026-11-12
---

# Patterns

* **States:** ten band states, empty, below absolute zero. Screenshots exist for warm, cold, hot, long, below-zero, empty and focus at 1440 and 390 widths (`design/screenshots/`).[^des]
* **Live update:** typing in one field updates the other two; the typed field is not rewritten (see [architecture](../architecture/overview.md)).
* **Responsive:** one layout; figure sizes step down at phone width.[^des]
* **No layout shift:** reserved notice slot.[^des]

[^des]: Design note note.
