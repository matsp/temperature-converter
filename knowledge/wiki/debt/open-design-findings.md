---
type: Debt
title: Open design findings
description: P2/P3 findings left open after design approval, for Mats to decide.
tags: [debt,design,accessibility]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T22:00:00+00:00 }
sources:
  - id: rev
    resource: ../../raw/2026-11-12-ui-designer-review-temperature-converter.md
    title: Design review
    last_modified: 2026-11-12
  - id: rec
    resource: ../../raw/2026-11-12-ui-designer-recheck-temperature-converter.md
    title: Design re-check
    last_modified: 2026-11-12
---

# Open design findings

Not regressions; no fix card exists.[^rec]

* **P2-1 Values not announced:** converted values are not read by screen readers. Option: a visually hidden `aria-live="polite"` summary, debounced about 500 ms.[^rev]
* **P2-2 Empty first view gives no cue:** no placeholder, no autofocus. Option: `placeholder="0"`; autofocus would raise the phone keyboard.[^rev]
* **P3-1** Band 20 label contrast is 5.89:1 against a stated 5.9 floor (wording only, far above AA).[^rev]
* **P3-2** `html` keeps the empty-state ground because `data-band` sits on `body`; visible only on overflow.[^rev]
* **P3-3** Figure tier changes shift the vertical centring by about 10px.[^rev]
* **P3-4** Typed hyphen stays "-" while other fields show "−". Option: swap a leading "-" for "−".[^rev][^rec]
* **P3-5** Values longer than 12 characters can still clip at the smallest tier.[^rev]
* **Not tested:** a real iOS device; screenshots at 820 and 1024px after the fix.[^rec]
* **Detector false positives:** 2 `design-system-font-size` findings (`.name` 14px, `.notice` 17px); `.marker i` 14px is undocumented in DESIGN.md.[^rev]

[^rev]: Design review.
[^rec]: Design re-check.
