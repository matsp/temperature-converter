---
type: Gotcha
title: Test timeout hides a Chrome startup failure
description: 13 page tests reported timed out when only the before hook was slow.
tags: [gotchas,testing,ci]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T23:10:00+00:00 }
sources:
  - id: eng
    resource: ../../raw/2026-11-12-engineer-ci-chrome-startup.md
    title: CI Chrome startup
    last_modified: 2026-11-12
---

# Test timeout hides a Chrome startup failure

Seen on PR #9 CI.[^eng]

* **Symptom:** 13 page tests "timed out after 10000ms", yet the whole step took 17 s. The tests did not each hang: the `before` hook (Chrome startup) hit `--test-timeout=10000` and node reported that timeout on every test.[^eng]
* **Why it was invisible:** the hook polled 15 s for a page target (longer than the 10 s test timeout) and sent Chrome's stderr to `/dev/null`. Not reproducible locally (local chromium passed 52/52; no `google-chrome` there).[^eng]
* **Fix (`test/page.test.js` only, assertions untouched):** hook timeout 40 s; stderr captured; fail fast if Chrome exits; request a page via `/json/new` when none exists; extra quiet flags (`--no-first-run`, `--disable-extensions`, `--disable-background-networking`). On failure the hook prints `::error title=Chrome startup::...` so Chrome's stderr shows as a CI annotation.[^eng]
* **Reading CI logs:** the job log needs gh auth, but the check-run annotations API is public.[^eng]
* **Open:** the root cause on the runner is unconfirmed. If CI goes red again, read the annotation first.[^eng]

See also [page-test flakiness](headless-chrome-page-test-flakiness.md) and [test strategy](../testing/strategy.md).

[^eng]: Engineer note on CI Chrome startup.
