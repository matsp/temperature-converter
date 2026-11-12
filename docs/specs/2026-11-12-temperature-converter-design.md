# Temperature converter — design

Request (Mats): "Build a one-page temperature converter, plain HTML/JS, no deploy."

Frontend: yes
Look: new
Deployment target after merge to main: none

## Goal
A single web page where a user types a temperature and instantly sees it in Celsius, Fahrenheit and Kelvin.

## Behaviour
- One page, `index.html` at the repo root, with plain HTML, CSS and JavaScript. No framework, no build step, no runtime dependencies; opens straight from the file system.
- Three number inputs: Celsius, Fahrenheit, Kelvin. Typing in any one updates the other two live.
- Results are rounded to 2 decimals, trailing zeros dropped (e.g. 100 °C -> 212 °F, 373.15 K).
- Empty or non-numeric input clears the other two fields; no error popups.
- Values below absolute zero (below -273.15 °C, -459.67 °F, 0 K) are accepted for display but show a short inline notice "Below absolute zero".
- Negative and decimal numbers work.
- Conversion logic lives in a separate pure-JS file (`converter.js`) so it can be unit tested; the page loads it with a script tag.

## Out of scope
Other units (Rankine etc.), history, unit dropdown, saved settings, localisation, deployment/hosting.

## Acceptance
- 0 °C = 32 °F = 273.15 K; 100 °C = 212 °F = 373.15 K; -40 °C = -40 °F.
- Clearing a field clears the others.
- Layout works on phone and desktop widths; fields are labelled and keyboard usable.
- Unit tests for conversion logic run in CI (plain Node, no dependencies).
