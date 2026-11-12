# Design review: temperature converter (feat/temperature-converter @ 162abf2)

Reviewer: ui-designer. Plan: `docs/plans/2026-11-12-temperature-converter.md`. Binding design: `DESIGN.md`, `design/mockups/converter.html`, `design/mockups/tokens.css`.

**Verdict: changes required. 1 P0, 1 P1** (both are gaps in the approved design that the build copied faithfully, not build errors). Fix target already applied to DESIGN.md and the mockup in this commit; the engineer copies it.

## Method

- Page opened from `file://…/index.html` in headless Chromium (chromium-1208) over CDP, typed with `Input.insertText`. States: 24 °C, −18 °C, 38.5 °C, −459.67 °F, −300 °C, empty, focus on °F, 0 K, −5 K, 123456789 °C. Widths: 320, 390, 760, 761, 768, 800, 820, 900, 1024, 1100, 1280, 1440, 1920.
- `styles.css` compared with tokens.css + the mockup `<style>`: identical. Markup identical apart from the mockup's seeded values. At 1440 and 390 the implementation matches `design/screenshots/` pixel for pixel, except where a typed hyphen stays a hyphen (P3-4).
- Impeccable `critique`: dual-agent (A: design review, B: detector + browser measurements), synthesized here. Impeccable `audit`: scores below. CLI `impeccable detect`: see Detector.

## Findings

### P0-1 Figures are cut off at 761–1280px, so the page shows wrong numbers
- **Where:** `styles.css` `.fields` / `.fields[data-size=…]` (`--fig` = fixed 120/100/80px) with `input { max-width: 100% }`; stacking breakpoint `@media (max-width: 760px)`.
- **Evidence:** at 820px (iPad portrait), 38.5 °C reads "38.!", "10'" and "311 K" (`design/screenshots/review-2026-11-12/impl-hot-820-clipped.png`). At 1024px, 24 °C reads "297.1 K" (the input is 311px wide inside a 243px box) (`impl-warm-1024-clipped.png`). At 1280px, −459.67 °F is clipped (301/290px). At 1440px, values of 10+ characters are clipped. On phones, 13+ character values widen the page (`.fields { grid-template-columns: 1fr }`): 429px at 320 and 390.
- **Why P0:** the user reads a valid-looking but wrong number. That defeats the product's one task.
- **Target (verified, now in DESIGN.md and `design/mockups/converter.html`):**
  - `.fields { container-type: inline-size; --fig-fit-l: calc(10.5cqi - 24px); --fig-fit-m: calc(9.3cqi - 24px); --fig-fit-s: calc(5.8cqi - 14px); --fig: min(var(--figure-l), var(--fig-fit-l)); }`
  - `.fields[data-size="m"] { --fig: min(var(--figure-m), var(--fig-fit-m)); }` and `.fields[data-size="s"] { --fig: min(var(--figure-s), var(--fig-fit-s)); }`
  - `@media (max-width: 760px)` → `@media (max-width: 1023px)`
  - In that media block, `.fields { grid-template-columns: 1fr; … }` → `minmax(0, 1fr)`, and add `--fig-fit-l: calc(29cqi - 12px); --fig-fit-m: calc(25cqi - 12px); --fig-fit-s: calc(16cqi - 6px);`
- **Verification:** with the target CSS, the worst case per tier ("888888", "−888.8", "−88.88"; "8888888", "−888888", "−459.67"; "−88888888.88", "888888888.88", "88888888") fits every field, with no page overflow, at all 13 widths. Screenshots: `target-hot-820.png`, `target-long-1024.png`, `target-big-320.png`. Side effect: at 1440 the large figure renders at 115px instead of 120px (`design/screenshots/converter-*-1440.png` regenerated).
- **Tests to update:** none assert the breakpoint; `test/page.test.js` runs at 1440.

### P1-1 iPhone users cannot type a negative number
- **Where:** `index.html` `input#c`, `#f`, `#k`: `inputmode="decimal"`. The test `test/page.test.js:188` asserts `"decimal"`.
- **Evidence:** the iOS decimal keypad has digits and a decimal separator only, with no minus key. This is known iOS behaviour; I didn't test it on a device. The spec requires negative numbers on phone and desktop. Cold weather and freezer values (−18 °C) can't be entered in the field the user naturally picks.
- **Target:** `inputmode="text" enterkeyhint="done"` on all three inputs (DESIGN.md › Field › Input and the mockup now say so). Update `test/page.test.js:188` to expect `"text"`. Trade-off accepted: Android's decimal pad (which has a minus key) gives way to the text keyboard's number row.

### P2 (for Mats to decide; no fix card)
- **P2-1 Converted values are not announced to screen readers.** Only `#notice` is a live region. A screen-reader user who types in Celsius hears nothing until they tab to Fahrenheit. Option: a visually hidden `aria-live="polite"` summary, debounced about 500ms ("24 °C is 75.2 °F and 297.15 K").
- **P2-2 Empty first view gives no cue.** No placeholder and no autofocus. The CSS already styles `::placeholder` in the label colour. Option: `placeholder="0"` on each field. Autofocus is a judgement call: it raises the keyboard on phones.

### P3
- **P3-1** Band 20 label contrast is 5.89:1 against DESIGN.md's stated 5.9 floor. That's still well above AA 4.5, so it's a wording mismatch only (the `styles.css` comment says ≥ 5.8).
- **P3-2** `html` keeps `--ground` from the empty state (`#12110e`) because `data-band` sits on `body`. That's only visible if the page ever overflows; the P0 fix prevents that.
- **P3-3** Figure-size tier changes (l→m) shift `main`'s vertical centring by about 10px.
- **P3-4** A typed hyphen stays "-" while the other fields show "−" (U+2212) (`impl-long-1440.png`: "−273.15" next to "-459.67"). Option: swap a leading "-" for "−" in the typed field. It's one character for one, so the caret stays put.
- **P3-5** Values longer than 12 characters (for example 222222219761.93) can still clip at the smallest tier. They're outside any real use.

## Detector (`impeccable detect --json`)
- `index.html`: 0 findings. The detector doesn't follow linked CSS, so it was also run on `styles.css`: 2 × `design-system-font-size` (`.name` 14px, `.notice` 17px, phone sizes). **False positives:** both sizes are in DESIGN.md's prose hierarchy but not in its frontmatter. The mockup has the same 2 findings.
- Missed by the detector: `.marker i` uses 14px through the `font:` shorthand. That size isn't in DESIGN.md (P3, documentation only).

## Audit scores
| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 3 | Contrast passes in all 12 states (figure 6.73–9.76, label 5.89–7.97, rule 3.43–4.60, ink 11.5–16.7). Tab order is c→f→k, the focus underline is 4.04:1 against the rule, reduced motion works. Gaps: P1-1 and P2-1 |
| Performance | 4 | Three tiny scripts and three local fonts; colour transitions only |
| Theming | 4 | One `data-band` switch; every colour comes from tokens |
| Responsive | 1 | P0-1 |
| Implementation integrity | 4 | Exact copy of the mockup; DOM contract as planned |
| **Total** | **16/20** | Good, once P0-1 is fixed |

## Critique (Nielsen, 28/40)
Visibility 3, match 3, control 3, consistency 3, error prevention 2 (P1-1, P0-1), recognition 3, efficiency 2, aesthetics 4, recovery 2 (inputs like "1e3" or "12°" blank the other fields with no hint, as the spec intends), help 3. Design specificity: authored. The band-shaded page and legend can't be swapped onto another product.

## Screenshots
- Implementation as built: `design/screenshots/review-2026-11-12/impl-warm-1440.png`, `impl-warm-390.png`, `impl-below-zero-390.png`, `impl-long-1440.png`, `impl-hot-820-clipped.png`, `impl-warm-1024-clipped.png`
- Target (fixed CSS): `target-hot-820.png`, `target-long-1024.png`, `target-big-320.png`
- Updated mockup reference: `design/screenshots/converter-*-1440.png` and `-390.png`
