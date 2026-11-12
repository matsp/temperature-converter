# Design re-check: temperature converter (feat/temperature-converter @ a94d0cd)

Reviewer: ui-designer. Plan: `docs/plans/2026-11-12-temperature-converter.md`. Fix card: t_6b610356. Earlier review: `knowledge/raw/2026-11-12-ui-designer-review-temperature-converter.md`.

**Verdict: approved. No open P0 or P1.**

## What was checked

- **P0-1 (figures clipped at 761–1280px): fixed.** `styles.css` now matches `design/mockups/tokens.css` plus the `<style>` in `design/mockups/converter.html` line for line, except for the font URLs (`../fonts/` → `fonts/`), which is intended. That covers the container-query `--fig-fit-*` caps, the `min()` tiers, `@media (max-width: 1023px)` and `grid-template-columns: minmax(0, 1fr)` with the phone `--fig-fit-*` values. The earlier review verified this exact CSS at 13 widths (320–1920) against the worst-case value in each tier.
- **P1-1 (no minus key on iOS): fixed.** `input#c`, `#f` and `#k` have `inputmode="text" enterkeyhint="done"`, as the mockup does. `test/page.test.js:188` expects `"text"`.
- Tests: `node --test "test/**/*.test.js"`: 40 pass, 0 fail.
- At 390px (CDP device emulation), `scrollWidth` equals `innerWidth` (390) for 38.5 °C and −459.67 °F: the page doesn't overflow sideways.
- `impeccable detect --json index.html styles.css`: the same 2 advisory `design-system-font-size` findings as in the review (`.name` 14px, `.notice` 17px). Both sizes appear in DESIGN.md's prose but not in its frontmatter, so these are false positives.

## Screenshots (`design/screenshots/recheck-2026-11-12/`)
- `fixed-warm-1440.png` (24 °C), `fixed-hot-1440.png` (38.5 °C), `fixed-long-1440.png` (−459.67 °F): all figures are whole. The large tier renders at about 115px, as noted in the review.
- `fixed-hot-390.png`, `fixed-long-390.png`: figures and the legend are whole, and the legend shows the full −40…60 °C scale.
- Method note: plain `chrome --headless --window-size=390,844` lays out wider than 390 and crops the image, and screenshots taken right after load catch the colour and font-size transitions halfway. Those first captures were thrown away. The 390 shots and `fixed-hot-1440.png` were retaken over CDP (`Emulation.setDeviceMetricsOverride`, `Input.insertText`, then a 1.5s wait).

## Still open (P2/P3 from the review; not regressions, for Mats to decide)
- P2-1: converted values are not announced to screen readers. P2-2: the empty first view gives no cue.
- P3-4 is still visible: a typed hyphen stays "-" while the other fields show "−" (`fixed-long-390.png`). P3-1, P3-2, P3-3 and P3-5 are unchanged.

## Not checked
- I took no new screenshots at 820 and 1024px, because re-checks are limited to 1440 and 390. The fix for those widths is the CSS the review verified there, now confirmed identical in `styles.css`.
- I did not re-run `critique` or `audit`: the CSS and markup are now identical to the approved mockup, and the review's scores still apply, with Responsive moving from 1 to 4 now that P0-1 is fixed.
- I didn't test on a real iOS device.
