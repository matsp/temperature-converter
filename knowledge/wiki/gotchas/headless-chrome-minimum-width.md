---
type: Gotcha
title: Headless Chrome has a 500px minimum window width
description: Phone-width screenshots need device-metrics emulation.
tags: [gotchas,tooling]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: des
    resource: ../../raw/2026-11-12-ui-designer-design-temperature-converter.md
    title: Design note
    last_modified: 2026-11-12
---

# Headless Chrome has a 500px minimum window width

The bundled headless Chrome enforces a 500px minimum window width: `--window-size=390,844` lays out at 500px and crops.[^des]

Use CDP device-metrics emulation instead. `node design/shoot.mjs` does this and prints `innerWidth` per shot as proof.[^des]

Unattended runs block `execute_code` and heredoc scripts; write a script file and run it with `python3 -I file.py`.[^des]

[^des]: Design note note.
