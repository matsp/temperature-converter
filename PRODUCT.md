# Product

<!-- impeccable:product-schema 1 -->

All facts below come from the spec `docs/specs/2026-11-12-temperature-converter-design.md` (branch spec/temperature-converter). Lines marked *(inferred)* are not confirmed by Mats.

## Platform

web

## Stack

Static HTML/CSS/JS: one `index.html` at the repo root plus `converter.js` (pure conversion logic, unit tested with plain Node). No framework, no build step, no runtime dependencies; the page opens straight from the file system. No hosting or deployment.

## Users

Anyone who needs a quick temperature conversion: types one number and reads the other two. *(inferred: a person at a desk or on a phone, mid-task — a recipe, a lab or weather reading, a spec sheet — who wants the answer in seconds and then leaves.)*

## Product Purpose

A single page where typing a temperature in Celsius, Fahrenheit or Kelvin instantly shows it in the other two units. Success: the answer is readable the moment the last digit is typed, with no button, no popup and no ambiguity about which number belongs to which unit.

## Positioning

Three equal fields, any one of which is the input: there is no "from" and "to", no unit dropdown. *(inferred)*

## Operating Context

Opened as a local file (`file://`) in a desktop or phone browser. Used briefly and repeatedly; nothing is stored between visits.

## Capabilities and Constraints

- Three labelled number inputs: Celsius, Fahrenheit, Kelvin. Typing in one updates the other two live.
- Results rounded to 2 decimals, trailing zeros dropped (100 °C → 212 °F, 373.15 K).
- Empty or non-numeric input clears the other two fields; no error popups.
- Below absolute zero (−273.15 °C, −459.67 °F, 0 K) values still display, with a short inline notice "Below absolute zero".
- Negative and decimal numbers work.
- Out of scope: other units (Rankine etc.), history, unit dropdown, saved settings, localisation, deployment.
- No network fetches: fonts and assets must be local or system (the page must work offline from file://). *(inferred from "no runtime dependencies")*

## Evidence on Hand

None beyond the spec. No logo, name treatment, or brand assets exist; the product name is "Temperature converter".

## Product Principles

- The answer is the interface: converted values are the largest, clearest thing on the page.
- Every field is both input and output; none is privileged.
- Quiet failure: invalid or empty input clears, never scolds.
- Works anywhere a browser opens a file: phone, desktop, offline.

## Accessibility & Inclusion

Fields are labelled and fully keyboard usable (spec acceptance). Layout must work at phone and desktop widths. *(inferred: WCAG 2.2 AA contrast; the below-absolute-zero notice announced to screen readers.)*
