---
type: Decision
title: ADR 0001: classic scripts, not ES modules
description: Why the page loads plain script files with a UMD wrapper.
tags: [adr,architecture]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T12:00:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-temperature-converter.md
    title: Plan decisions
    last_modified: 2026-11-12
---

# ADR 0001: classic scripts, not ES modules

**Status:** accepted (plan, 2026-11-12).

**Context:** the page must work opened from `file://`. Chrome refuses module scripts from `file://`.[^plan]

**Decision:** classic `<script src>` files; `converter.js` and `display.js` export through a small UMD wrapper so Node tests can `require` them.

**Consequence:** no `package.json`, no bundler.

[^plan]: Plan decisions note.
