# Temperature converter — design

Request (Mats): "Build a one-page temperature converter, plain HTML/JS, no deploy."

Frontend: yes
Look: new
Deployment target after merge to main: GitHub Pages (changed 2026-11-12 at Mats's request; was none)

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
Other units (Rankine etc.), history, unit dropdown, saved settings, localisation, any hosting other than GitHub Pages, custom domain.

## Acceptance
- 0 °C = 32 °F = 273.15 K; 100 °C = 212 °F = 373.15 K; -40 °C = -40 °F.
- Clearing a field clears the others.
- Layout works on phone and desktop widths; fields are labelled and keyboard usable.
- Unit tests for conversion logic run in CI (plain Node, no dependencies).

## Deployment: GitHub Pages (added 2026-11-12)
Mats: "ja ich möchte auf github pages deployen".
- Every merge to `main` publishes the page automatically to GitHub Pages via a GitHub Actions workflow (official Pages actions; Pages source set to "GitHub Actions"). No build step: the published site is only the static files the page needs (`index.html`, `converter.js`, `display.js`, `app.js`, `styles.css`, `fonts/`); tests, docs and knowledge/ are not published.
- Live URL: `https://matsp.github.io/temperature-converter/` (project site, served from a sub-path). All asset references must be relative so the page works both from `file://` and under that sub-path.
- Deploy runs only after CI is green on `main`; a failed deploy shows as a failed workflow run.
- One-time setup by Mats (needs repo admin; agents cannot do it): enable Pages with source "GitHub Actions" in the repo settings. No secrets required.
- AGENTS.md line "Deployment target: none" is updated to GitHub Pages.

### Acceptance (deployment)
- After a merge to `main`, the live URL serves the converter and the 0 °C / 100 °C / -40 °C examples work there.
- Fonts and styles load on the live URL (no 404s).
- Opening `index.html` from `file://` still works.
