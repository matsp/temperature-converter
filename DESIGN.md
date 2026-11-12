---
name: Temperature converter
description: One page, three equal fields; the page takes a deep shade of the temperature's isotherm colour.
colors:
  band-m40: "#3b2a7a"
  band-m30: "#4a3f9e"
  band-m20: "#3f62c4"
  band-m10: "#4a8fd6"
  band-0: "#7cc3e0"
  band-10: "#a8d98a"
  band-20: "#f2d34f"
  band-30: "#f29a3a"
  band-40: "#e0542e"
  band-50: "#a8232a"
  ink: "#f4ecd2"
  ground-empty: "#12110e"
  label-empty: "#a39a85"
  rule-empty: "#7a725f"
  ground-abs: "#0b0a0d"
  rule-abs: "#6e6878"
typography:
  figure:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "120px"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  unit:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.34em of the figure"
    fontWeight: 700
  title:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
  notice:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "28px"
  tick:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "14": "56px"
components:
  field-input:
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    rounded: "{rounded.none}"
    padding: "0"
  legend-band:
    height: "24px"
    rounded: "{rounded.none}"
---

# Design System: Temperature converter

## Overview

**Creative North Star: "The Deep Shade"**

The page is a weather map at night. The temperature you type picks an isotherm band, from deep violet at −40 °C to dark red at 50 °C and above, and the whole page takes a very dark shade of that band. The three numbers glow in the band's own colour. A legend strip along the foot shows the full ramp with a marker at your value, so the colour always has a key.

This is a tool you use for ten seconds. Nothing on the page competes with the three figures: one title, one line of help, three labelled fields, one legend. No cards, no buttons, no shadows, no rounded corners. The colour change is the only motion and the only decoration, and it carries meaning (how hot or cold the value is).

Every colour role (ground, figure, label, rule) changes together with the band, so contrast is fixed per band rather than computed on the fly. Below absolute zero the page leaves the map: near-black, figures in plain ink, and an inline notice.

**Key Characteristics:**
- Ground and figures follow the current value's 10 °C band; ten bands plus "empty" and "below absolute zero".
- Huge condensed tabular figures; the input is the output.
- Three fields of equal weight side by side on desktop, stacked on phone.
- Legend strip with a value marker anchors the colour to a scale.
- Flat, square, hairline-ruled; no elevation.

## Colors

A ten-step isotherm ramp, used two ways: full strength in the legend, and as a family of four derived roles per band for the page itself.

### Primary
- **Isotherm ramp** (`band-m40` … `band-50`): the legend strip only, at full strength, one cell per 10 °C from −40 to 60 °C. Values below −40 use `band-m40`; values of 50 and above use `band-50`.

### Band roles (one set per band, set by `data-band` on `<body>`)
Derived from each band colour in OKLCH and checked for contrast on its own ground. Exact values live in `design/mockups/tokens.css`; the implementation copies that block verbatim.

| Band | Ground | Figure | Label | Rule |
|---|---|---|---|---|
| m40 (< −30 °C) | #121023 | #bab3fe | #a8a6c9 | #7d77b4 |
| m30 | #151429 | #b5b5ff | #a6a7ca | #7877bc |
| m20 | #121b30 | #a0bcff | #9cabcb | #617ec3 |
| m10 | #142333 | #8bc3ff | #94aeca | #5684b4 |
| 0 (0 to < 10) | #1b2c33 | #7cc3e0 | #96b0bb | #5a889b |
| 10 | #25301e | #a8d98a | #9fb294 | #6c8b58 |
| 20 | #342e14 | #f2d34f | #b4ab87 | #937f2a |
| 30 | #362311 | #f29a3a | #c2a58b | #ab7237 |
| 40 | #351810 | #ffa289 | #c8a095 | #c06148 |
| 50 (≥ 50 °C) | #2b100f | #ffa09a | #c99f9c | #bc615d |
| empty | #12110e | #f4ecd2 | #a39a85 | #7a725f |
| abs (below absolute zero) | #0b0a0d | #f4ecd2 | #a39a85 | #6e6878 |

- **Ground:** the band taken very dark (22% band into near-black #0b0905).
- **Figure:** the band itself when it is light enough, otherwise lifted to OKLCH lightness 0.80 at the same hue. Contrast on ground 6.7:1 to 9.8:1.
- **Label:** a muted tint of the band for field names, unit symbols, help line and legend ticks. 5.9:1 to 8.0:1.
- **Rule:** field underlines and column dividers. 3.4:1 to 4.6:1 (WCAG 1.4.11 boundary).

### Neutral
- **Ink** (#f4ecd2): page title, focused field name, legend marker and its label, the below-absolute-zero notice, figures in the empty and below-zero states. ≥ 11:1 on every ground.

### Named Rules
**The Whole Page Moves Rule.** Ground, figure, label and rule switch together, always from the same band. Never mix a role from one band with another band's ground.

**The Key Rule.** The colour always has a key: the legend strip is on every state that has a value.

**The Raw Band Rule.** Raw band colours appear only in the legend. Never set text in a raw cold band colour (`band-m40` to `band-m10` fail contrast on dark grounds).

## Typography

**Figure Font:** Barlow Condensed Bold (fallback Arial Narrow)
**UI Font:** Barlow Medium / SemiBold (fallback system-ui)

**Character:** Road-sign and weather-chart lettering: condensed figures fit three six-character values across a laptop screen at 120px; the regular-width Barlow keeps labels calm.

Fonts are self-hosted from `design/fonts/` (SIL OFL). The page must work offline from `file://`, so never load a hosted font stylesheet.

### Hierarchy
- **Figure** (700, 120 / 100 / 80px desktop, 76 / 64 / 52px phone, line-height 0.95, tracking −0.02em, tabular numerals): the three values. One size for all three fields, picked from the longest value: ≤ 6 characters large, 7 medium, 8+ small.
- **Unit** (700, 0.34 × figure): °C, °F, K after each figure, in the label colour.
- **Title** (600, 20px; 18px phone): "Temperature converter".
- **Body** (500, 16px; 15px phone): the help line.
- **Label** (600, 15px; 14px phone, uppercase, tracking 0.08em): CELSIUS, FAHRENHEIT, KELVIN.
- **Notice** (600, 18px / 28px; 17px phone): "Below absolute zero".
- **Tick** (600, 13px, tabular): legend numbers.

Minus signs in output are the true minus (U+2212 "−"), not a hyphen; inputs accept both.

## Layout

- **Desktop (> 760px):** three rows of the page grid: header (title left, help right, 32px top / 56px sides), main (vertically centred), legend (56px sides, 40px bottom). Fields are three equal columns separated by 1px rules; the first field has no left padding, the last no right padding; 32px inner padding otherwise.
- **Phone (≤ 760px):** header stacks title over help (24px padding). Fields stack, 16px vertical padding each, no column rules. Legend shows every other tick (−40, −20, 0, 20, 40, 60 °C).
- **Notice slot:** a fixed 28px row under the fields, always reserved, so the page never jumps when the notice appears.
- **Spacing:** 4px base scale (4, 8, 12, 16, 24, 32, 40, 56).

## Elevation & Depth

Flat. No shadows anywhere. Depth comes only from the band colour: the ground is the dark shade, the figures are the light glow.

## Shapes

Square everything (0px radius). Lines are the only shapes: the 3px field underline (4px in the figure colour on focus), 1px column rules, the 24px-tall legend strip and the 4px-wide ink marker.

## Components

### Field (input)
- **Structure:** the whole field is a `<label>`: name (CELSIUS), then a row holding the input and the unit symbol, underlined. Clicking anywhere in the field focuses its input.
- **Input:** no box, no background, no radius; figure type in the figure colour; caret in ink; `inputmode="decimal"`; width follows its content (`field-sizing: content`), so the unit sits right after the number. Where `field-sizing` is unsupported, the input fills the row and the unit sits at the right edge.
- **Row alignment:** `align-items: flex-end` with the unit lifted by 0.12 × figure, so an empty input does not drop the unit.
- **Focus:** underline becomes 4px in the figure colour; the field name turns ink. No outline ring (the underline is the focus indicator, ≥ 6.7:1).
- **Empty:** all three inputs empty, unit symbols stay, ground goes to `ground-empty`, legend marker hidden.
- **Selection:** figure colour background, ground colour text.

### Below-absolute-zero notice
- Ink text "Below absolute zero" with an 18px drawn circle-exclamation icon (1.5px stroke), in the fixed slot under the fields. `role="status"`, `aria-live="polite"`.
- Shown when the value is below −273.15 °C; at exactly absolute zero no notice.

### Legend (signature component)
- Ten 24px cells in the raw ramp, ticks every 10 °C under them (first left-aligned, last right-aligned, "60 °C" at the end).
- Marker: 4px × 46px ink bar at the current Celsius value, with "24 °C" above it. Near the ends its label aligns inward. Outside −40…60 °C the marker pins to the end and the label reads "−300 °C, off the scale".
- `aria-hidden="true"`: it repeats what the fields say.

### Motion
- One moment: when the band changes, ground, figure, label and rule colours cross-fade over 280ms (`cubic-bezier(0.22, 1, 0.36, 1)`), and the legend marker slides the same way. Figure size changes ease over 160ms. No entrance animation. `prefers-reduced-motion: reduce` removes all transitions.

## Do's and Don'ts

### Do:
- **Do** copy the band-role block from `design/mockups/tokens.css` as is and switch bands with one `data-band` attribute on `<body>`.
- **Do** keep all three figures the same size, chosen from the longest value.
- **Do** keep the notice slot reserved even when empty.
- **Do** self-host Barlow and Barlow Condensed next to `index.html`.

### Don't:
- **Don't** add boxes, cards, shadows, rounded corners or buttons; the fields are bare figures on a rule.
- **Don't** set text in the raw cold band colours.
- **Don't** show an error popup or red error styling for non-numeric input; the other fields just clear.
- **Don't** add a light theme or a theme toggle; the dark shade is the design.
