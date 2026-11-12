---
type: Decision
title: ADR 0002: absolute-zero check on the typed value
description: Where the below-absolute-zero check happens, and the rejected alternative.
tags: [adr,conversion]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-temperature-converter.md
    title: Plan decisions
    last_modified: 2026-11-12
---

# ADR 0002: absolute-zero check on the typed value

**Decision:** check absolute zero on the typed value in its own unit (-273.15 C, -459.67 F, 0 K).[^plan]

**Rejected:** checking the converted Celsius value. Float noise can land a hair off the limit.[^plan]

Exactly absolute zero is valid and shows no notice (see [UX decisions](../design/ux-decisions.md)).

[^plan]: Plan decisions note.
