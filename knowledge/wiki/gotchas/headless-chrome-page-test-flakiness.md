---
type: Gotcha
title: Headless Chrome page tests crash or race
description: Renderer crashes from small /dev/shm and navigation races in test/page.test.js, with the fixes.
tags: [gotchas,testing,tooling]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T22:00:00+00:00 }
sources:
  - id: eng
    resource: ../../raw/2026-11-12-engineer-headless-chrome-flakiness.md
    title: Headless Chrome flakiness
    last_modified: 2026-11-12
---

# Headless Chrome page tests crash or race

Found while writing `test/page.test.js`.[^eng]

* **Random renderer crash (about 1 run in 3):** `Inspector.targetCrashed`, then every CDP call hangs. Cause: the container's 64 MB `/dev/shm`. Launch Chrome with `--disable-dev-shm-usage`. Afterwards 20 page-test runs and 5 full-suite runs were clean.[^eng]
* **Typing into the previous page:** `Page.navigate` returns before the document is replaced, so after `about:blank` then the page, `readyState === "complete"` can still describe the old document and `insertText` lands in a dying page (symptom: own field set, others empty). Wait until `location.href === "about:blank"` before navigating to the page.[^eng]
* **Unanswered `Runtime.evaluate`:** a context being replaced may never answer. Every CDP call has a timeout (5 s; 500 ms while polling for the page), so a hang fails one test, not the run.[^eng]
* **`rmSync` of the Chrome profile fails with ENOTEMPTY** while Chrome still exits: wait for the `exit` event, then `rmSync` with `maxRetries`.[^eng]

See also [window width gotcha](headless-chrome-minimum-width.md), [test strategy](../testing/strategy.md) and [rejected approaches](../dead-ends/rejected-approaches.md).

[^eng]: Engineer note on headless Chrome flakiness.
