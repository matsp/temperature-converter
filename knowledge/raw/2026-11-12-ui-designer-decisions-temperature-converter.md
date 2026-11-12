# Design decisions: temperature converter (2026-11-12, ui-designer)

Spec: docs/specs/2026-11-12-temperature-converter-design.md. Gate 4 approved by Mats on 2026-11-12.

## Chosen direction and why
Weather map, "deep shade" take (round 2, option A). The page ground takes a very dark shade of the forecast-map isotherm colour of the current temperature, and the numerals show in the full isotherm colour, with a legend strip and marker. Mats picked the weather map (round 1, B) and asked for it darker. Of the three darker takes he chose the one closest to the original: the colour still says how warm the value is, while the page stays dark.

## Rejected options
- Round 1 A, reference table: bottle-green cloth band and serif tabular rows among fixed points; not picked.
- Round 1 C, departure board: split-flap digit cells and amber lamps; not picked.
- Round 1 D, plain standard look: not picked.
- Round 2 B, night map: fixed near-black ground and only the current legend band glowing; lost most of the colour signal.
- Round 2 C, dark frame: near-black page with one isotherm-coloured band behind the fields; not picked.
- Round 2 D, plain standard look: not picked.

## Mats's changes
- Round 1: "Option B, but darker"
- Round 2: "A"
- Gate 4: "Approved by Mats 2026-11-12" (no changes)

## Key values
Ten isotherm bands from -40 to 50 °C (deep violet to dark red); the ground is the band colour mixed at about 22% into near-black. Ink is warm off-white #f4ecd2. Figures use Barlow Condensed 700 at 120px with tabular numerals; labels and body text use Barlow. Square corners everywhere, 4px spacing scale. The empty state and the below-absolute-zero state have their own neutral grounds. Fonts are self-hosted so the page works offline.

Source of truth: DESIGN.md
