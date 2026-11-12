# Direction round: temperature converter (2026-11-12, ui-designer)

Spec: docs/specs/2026-11-12-temperature-converter-design.md (branch spec/temperature-converter). Look: new.
Mode: Operate (a one-screen tool). Code-led; no image generation. Seed reference: seed:a453348d23a3e918.

## Grounded candidates (temperature's cultural world, ranked by resonance)
1. Forecast weather map: isotherm colour bands, legend strip. -> direction B
2. Cookbook oven-temperature conversion chart (gas marks, ruled table)
3. Laboratory reference handbook tables: fixed points (absolute zero, freezing, boiling), tabular figures, cloth binding -> direction A (assigned by the roll)
4. Enamel wall thermometer with dual scales (the literal reading; spent one slot)
5. Thermal-camera "ironbow" palette
6. Alpine weather-station / snow-report board
7. Farmer's almanac weather tables

## Challengers dealt and verdicts
- Split-flap concourse board: competitive (strong product clarity, big fixed-cell numerals; weaker audience identification) -> direction C, fused: rows = units, flap cells = digits, amber lamp = below-absolute-zero state.
- Centre-rail reference setting: declined. Raise kept on A: one-pixel hairline ruling, no radius anywhere, three values only.
- Warm consumer app surface: declined (this is close to the "plain standard look", offered as D).
- Star atlas, cassette j-card, transit diagram: declined (no product clarity for a 3-field converter).

## Options sent to Mats
- A Reference table: bottle-green cloth band, cool paper, serif tabular numerals; signature = your value slotted as a highlighted row among fixed points.
- B Weather map: page ground takes the isotherm colour of the current value; huge condensed numerals; legend strip with a marker.
- C Departure board: dark board, digits in split-flap cells that flip on change; amber lamps for below absolute zero.
- D the plain standard look.

Sketches: design/directions/*.html, screenshots design/screenshots/directions/*.png.
Fonts (OFL, self-hosted under design/fonts/ because the page must work offline from file://): Source Serif 4 + Public Sans (A), Barlow + Barlow Condensed (B), Archivo (C).

## Round 2 (Mats: "Option B, but darker")
Three darker takes on the weather-map direction, same layout, type and legend (shared CSS design/directions/r2-shared.css):
- A Deep shade: ground = the isotherm colour taken very dark (color-mix 22% hue into near-black); numerals in the full isotherm colour. Closest to B.
- B Night map: fixed near-black ground (#101215); numerals in the isotherm colour; legend dimmed except the current band, which glows.
- C Dark frame: near-black page; the three fields sit on one full-width band in the isotherm colour with dark numerals.
Learned: with a dark ground the Kelvin field at 136px clips inside a padded band; C uses 116px. Opacity on legend cells also dims their labels; use an inset shadow overlay instead.
Contrast hook flags on r2 sketches are unresolved var()/color-mix() values; rendered pairs pass AA (e.g. #8d939c on #101215 ~6:1).
Screenshots: design/screenshots/directions/r2-*.png
