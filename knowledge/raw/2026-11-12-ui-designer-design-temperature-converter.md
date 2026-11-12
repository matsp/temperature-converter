# Design: temperature converter, "Deep shade" (2026-11-12, ui-designer)

Mats picked round 2 option A ("deep shade", a darker take on the weather-map direction B).
System: DESIGN.md (+ .impeccable/design.json). Mockup: design/mockups/converter.html with design/mockups/tokens.css.
Screenshots: design/screenshots/converter-<state>-<1440|390>.png, states warm, cold, hot, long, below-zero, empty, focus.

## Decisions
- Colour is discrete per 10 °C band (ten bands + empty + below absolute zero), not a continuous colour-mix. Reason: contrast can be checked once per band; the r2 sketch's live color-mix gave the cold bands unreadable violet figures (raw #3b2a7a on its own dark ground fails badly).
- Per band: ground = 22% band into #0b0905 (OKLCH); figure = band, or lifted to OKLCH L 0.80 when darker than 0.76; label = OKLCH L 0.74, chroma ≤ 0.05; rule = L 0.60, 0.7 × chroma. Measured: figure 6.7–9.8:1, label 5.9–8.0:1, rule 3.4–4.6:1.
- All three figures share one size chosen from the longest value (≤6 chars 120px, 7 → 100px, 8+ → 80px desktop; 76/64/52 phone). Kelvin is usually 6 characters, so 120px is the normal size; 128px clipped "297.15 K" in a third of 1440.
- Whole field is a `<label>`; input uses `field-sizing: content` so the unit sits right after the number. Row uses flex-end alignment (an empty input has no baseline and drops the unit under baseline alignment).
- Notice slot is reserved (fixed 28px) so the page never jumps.
- Legend marker pins to the end with "…, off the scale" outside −40…60 °C; exactly absolute zero shows no notice.

## Learned (tooling)
- The bundled headless Chrome has a 500px minimum window width: `--window-size=390,844` lays out at 500px and crops. Phone screenshots need CDP device-metrics emulation: `node design/shoot.mjs` (Node ≥ 22, no deps) does this and prints innerWidth per shot as proof.
- execute_code and heredoc scripts are blocked in unattended runs; write a script file and run `python3 -I file.py`.
