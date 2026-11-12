# Temperature converter Implementation Plan

> **For agentic workers:** Executed by the Hermes coding team via Kanban: engineer per card, code-reviewer per card, qa-engineer per plan.

**Goal:** One page, `index.html` at the repo root, where typing a temperature in Celsius, Fahrenheit or Kelvin updates the other two fields live, styled as the "Deep Shade" design.

**Architecture:** Three classic scripts, loaded with plain `<script src>` tags at the end of `<body>` (no ES modules: Chrome blocks module scripts from `file://`). `converter.js` holds the pure conversion, parsing and formatting; `display.js` turns one field's text into a view state (other fields' values, band, figure size, notice, legend marker), also pure; `app.js` only applies that state to the DOM. The two pure files work in the browser (globals `Converter` and `Display`) and in Node (`module.exports`), so all logic is unit tested with `node:test`; a headless-Chrome test drives the real page.

**Tech Stack:** HTML, CSS, JavaScript (ES2022, CommonJS-compatible), Node ≥ 24 built-in test runner (`node:test`, `node:assert/strict`), headless Chrome over the DevTools protocol (Node's built-in `WebSocket` and `fetch`). No packages, no `package.json`, no build step.

**Spec:** `docs/specs/2026-11-12-temperature-converter-design.md`. **Design (binding):** `DESIGN.md`, `design/mockups/converter.html`, `design/mockups/tokens.css`, screenshots in `design/screenshots/`.

## Global Constraints

- One page `index.html` at the repo root; plain HTML, CSS and JavaScript; no framework, no build step, no runtime dependencies; opens straight from the file system.
- Conversion logic lives in `converter.js`, loaded by the page with a script tag; unit tests run in CI with plain Node, no dependencies.
- Results rounded to 2 decimals, trailing zeros dropped (100 °C → 212 °F, 373.15 K).
- Empty or non-numeric input clears the other two fields; no error popups, no red error styling.
- Below absolute zero (below −273.15 °C, −459.67 °F, 0 K) values still display, with the inline notice text exactly `Below absolute zero`. At exactly absolute zero: no notice.
- Output minus sign is U+2212 `−`; input accepts `-` and `−`.
- No network requests: fonts self-hosted next to `index.html`, never a hosted font stylesheet.
- Copy, exact: title `Temperature converter`; help line `Type in any field; the other two follow.`; field names `Celsius`, `Fahrenheit`, `Kelvin` (shown uppercase via CSS); unit symbols `°C`, `°F`, `K`; legend last tick `60 °C`; marker label `<value> °C`, off-scale suffix `, off the scale`.
- Out of scope: other units, history, unit dropdown, saved settings, localisation, light theme, deployment.

## Review Focus

1. **Comma as decimal separator.** Phone keypads opened by `inputmode="decimal"` show only `,` in many locales; `36,6` must convert like `36.6` (Task 1, `parseInput` cases).
2. **Things `Number()` accepts that are not temperatures.** `1e3`, `0x10`, `Infinity`, ` ` would otherwise convert silently; they must clear the other fields (Task 1).
3. **Partial input while typing.** `-`, `−`, `.`, `12.` are mid-typing states: `-`/`.` clear the others quietly, `12.` already converts as 12 (Task 1, Task 3 e2e).
4. **Float noise at the boundaries.** −459.67 °F and 0 K are exactly absolute zero and must not show the notice; the notice is decided on the typed value in its own unit, not on the converted Celsius (Task 1 `isBelowAbsoluteZero`, Task 3 e2e).
5. **The field being typed in is never rewritten.** Rewriting it would move the caret and turn `-` into `−` under the user's fingers; only the other two fields are written (Task 2 `viewState`, Task 3 e2e).

---

## File Structure

| File | Responsibility |
|---|---|
| `converter.js` | Pure: unit conversion, input parsing, output formatting, absolute-zero check. Global `Converter` / `module.exports`. |
| `display.js` | Pure: view state for one field's text: other fields' strings, band, figure size, notice flag, legend marker. Global `Display` / `module.exports`. |
| `app.js` | DOM wiring only: listens to the three inputs, writes `Display.viewState(...)` into the page. |
| `index.html` | Markup of `design/mockups/converter.html` minus its mockup script; loads `styles.css`, then `converter.js`, `display.js`, `app.js`. |
| `styles.css` | `design/mockups/tokens.css` verbatim (font URLs changed to `fonts/…`) followed by the mockup's `<style>` block verbatim. |
| `fonts/` | `Barlow-Medium.ttf`, `Barlow-SemiBold.ttf`, `BarlowCondensed-Bold.ttf` copied from `design/fonts/`. |
| `test/converter.test.js` | Unit tests, Task 1. |
| `test/display.test.js` | Unit tests, Task 2. |
| `test/page.test.js` | Headless-Chrome tests of `index.html`, Task 3. |

Run all tests: `node --test "test/**/*.test.js"` (CI runs exactly this; it is also the whole "build").

Dual-environment export pattern for `converter.js` and `display.js` (the one non-obvious piece):

```js
(function (root, api) {
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Converter = api;            // root.Display in display.js
})(typeof globalThis !== "undefined" ? globalThis : this, { /* functions */ });
```

`display.js` gets its converter with `typeof require === "function" ? require("./converter.js") : globalThis.Converter`.

Units are always the strings `"c"`, `"f"`, `"k"` (also the input ids).

---

### Task 1: Conversion, parsing and formatting (`converter.js`)

**Files:**
- Create: `converter.js`
- Test: `test/converter.test.js`

**Interfaces:**
- Produces (`Converter.*` in the browser, `require("./converter.js")` in Node):
  - `toCelsius(unit: "c"|"f"|"k", value: number) -> number` — f: `(v − 32) × 5/9`; k: `v − 273.15`.
  - `fromCelsius(unit: "c"|"f"|"k", celsius: number) -> number` — f: `c × 9/5 + 32`; k: `c + 273.15`.
  - `parseInput(text: string) -> number | null`
  - `formatValue(value: number) -> string`
  - `isBelowAbsoluteZero(unit: "c"|"f"|"k", value: number) -> boolean`
  - `ABSOLUTE_ZERO = { c: -273.15, f: -459.67, k: 0 }`

- [ ] **Step 1: Write the failing tests in `test/converter.test.js`**

`formatValue(fromCelsius(...))` / `formatValue(toCelsius(...))` cases (spec acceptance first):

| Test | Input | Expected string |
|---|---|---|
| `0 °C is 32 °F and 273.15 K` | c 0 → f, k | `"32"`, `"273.15"` |
| `100 °C is 212 °F and 373.15 K` | c 100 → f, k | `"212"`, `"373.15"` |
| `-40 °C is -40 °F` | c −40 → f; f −40 → c | `"−40"`, `"−40"` |
| `-40 °F is 233.15 K` | f −40 → c → k | `"233.15"` |
| `98.6 °F is 37 °C` | f 98.6 → c | `"37"` |
| `0 °F rounds to -17.78 °C` | f 0 → c | `"−17.78"` |
| `300 K is 80.33 °F` | k 300 → c → f | `"80.33"` |
| `0 K is -273.15 °C and -459.67 °F` | k 0 → c, → f | `"−273.15"`, `"−459.67"` |
| `-300 °C is -508 °F and -26.85 K` | c −300 → f, k | `"−508"`, `"−26.85"` |

`formatValue` cases:

| Input | Expected |
|---|---|
| `212` | `"212"` |
| `24.5` | `"24.5"` (trailing zero dropped) |
| `233.14999999999998` | `"233.15"` |
| `0.125` | `"0.13"` (half away from zero) |
| `-0.125` | `"−0.13"` |
| `-0.004` | `"0"` (never `"−0"`) |
| `-17.7777` | `"−17.78"` (U+2212, not `-`) |

`parseInput` cases:

| Input | Expected |
|---|---|
| `"24"` | `24` |
| `"  24 "` | `24` |
| `"-40"` / `"−40"` (U+2212) / `"+5"` | `-40` / `-40` / `5` |
| `"36.6"` / `"36,6"` | `36.6` / `36.6` |
| `".5"` / `"12."` | `0.5` / `12` |
| `""`, `"   "`, `"-"`, `"−"`, `"."`, `","` | `null` |
| `"abc"`, `"12a"`, `"1e3"`, `"0x10"`, `"Infinity"`, `"NaN"`, `"1.2.3"`, `"1,2,3"`, `"--5"` | `null` |

`isBelowAbsoluteZero` cases:

| Input | Expected |
|---|---|
| `("c", -273.15)`, `("f", -459.67)`, `("k", 0)` | `false` |
| `("c", -273.16)`, `("f", -459.68)`, `("k", -0.01)` | `true` |
| `("c", 24)` | `false` |

- [ ] **Step 2: Run to verify they fail**

Run: `node --test "test/**/*.test.js"`. Expected: FAIL, `Cannot find module '../converter.js'`.

- [ ] **Step 3: Implement `converter.js`** with the export pattern from File Structure.

`parseInput`: trim, replace U+2212 with `-` and `,` with `.`, then accept only `^[+-]?(\d+\.?\d*|\.\d+)$`, else `null`; return `Number(...)`.

`formatValue` (rounding is decided here, not by the tests alone):

```js
const r = Math.sign(v) * Math.round(Math.abs(v) * 100) / 100;
return (r === 0 ? "0" : String(r)).replace("-", "\u2212");
```

`isBelowAbsoluteZero` compares the value with `ABSOLUTE_ZERO[unit]` in its own unit (strict `<`), never via converted Celsius.

- [ ] **Step 4: Run to verify they pass.** `node --test "test/**/*.test.js"` → all pass, `fail 0`.

- [ ] **Step 5: Commit** `git add converter.js test/converter.test.js && git commit -m "feat: conversion, parsing and formatting in converter.js"`

---

### Task 2: View state (`display.js`)

**Files:**
- Create: `display.js`
- Test: `test/display.test.js`

**Interfaces:**
- Consumes: Task 1 `toCelsius`, `fromCelsius`, `parseInput`, `formatValue`, `isBelowAbsoluteZero`.
- Produces (`Display.*` / `require("./display.js")`):
  - `bandFor(celsius: number) -> "m40"|"m30"|"m20"|"m10"|"0"|"10"|"20"|"30"|"40"|"50"` — `Math.floor((c + 40) / 10)` clamped to 0…9, indexing that list.
  - `figureSize(texts: string[]) -> "l"|"m"|"s"` — longest `.length`: ≤ 6 `"l"`, 7 `"m"`, ≥ 8 `"s"`.
  - `legendMarker(celsius: number) -> { pos: number, shift: "0%"|"-50%"|"-100%", label: string, off: boolean }` — `pos` = `celsius + 40` clamped to 0…100 (a percentage of the scale); `shift` `"0%"` when `pos < 6`, `"-100%"` when `pos > 94`, else `"-50%"`; `off` when `celsius < -40` or `> 60`; `label` = `formatValue(celsius) + " °C"` plus `", off the scale"` when `off`.
  - `viewState(unit: "c"|"f"|"k", text: string) -> { values: {c: string, f: string, k: string}, band: string|null, size: "l"|"m"|"s", notice: boolean, marker: object|null }`
    - `values[unit]` is `text` unchanged; the other two are `formatValue(fromCelsius(u, toCelsius(unit, v)))`, or `""` when `parseInput(text)` is `null`.
    - Band and marker use Celsius rounded to 2 decimals (`Number(formatValue(c).replace("\u2212", "-"))`) so float noise never crosses a band edge.
    - `band`: `null` when empty/invalid; `"abs"` when `isBelowAbsoluteZero(unit, v)`; else `bandFor(rounded c)`.
    - `notice`: `isBelowAbsoluteZero(unit, v)` (false when invalid). `marker`: `null` when invalid, else `legendMarker(rounded c)`.
    - `size`: `figureSize` of the three `values`.

- [ ] **Step 1: Write the failing tests in `test/display.test.js`**

`bandFor`:

| Celsius | Band |
|---|---|
| −273.15, −41, −40, −30.01 | `"m40"` |
| −30 | `"m30"` |
| −0.01 | `"m10"` |
| 0, 9.99 | `"0"` |
| 10 | `"10"` |
| 24 | `"20"` |
| 49.99 | `"40"` |
| 50, 1000 | `"50"` |

`figureSize`: `["24","75.2","297.15"]` → `"l"`; `["−459.67","−273.15","0"]` → `"m"`; `["1000000","1800032","1000273.15"]` → `"s"`; `["","",""]` → `"l"`.

`legendMarker`:

| Celsius | Expected |
|---|---|
| 24 | `{ pos: 64, shift: "-50%", label: "24 °C", off: false }` |
| −40 | `{ pos: 0, shift: "0%", label: "−40 °C", off: false }` |
| 60 | `{ pos: 100, shift: "-100%", label: "60 °C", off: false }` |
| −35 | `{ pos: 5, shift: "0%", label: "−35 °C", off: false }` |
| −300 | `{ pos: 0, shift: "0%", label: "−300 °C, off the scale", off: true }` |
| 61 | `{ pos: 100, shift: "-100%", label: "61 °C, off the scale", off: true }` |

`viewState` (deep-equal on the listed fields):

| Call | values | band | notice | marker.label | size |
|---|---|---|---|---|---|
| `("c", "100")` | c `"100"`, f `"212"`, k `"373.15"` | `"50"` | false | `"100 °C, off the scale"` | `"l"` |
| `("c", "24")` | f `"75.2"`, k `"297.15"` | `"20"` | false | `"24 °C"` | `"l"` |
| `("f", "-40")` | f `"-40"` (unchanged), c `"−40"`, k `"233.15"` | `"m40"` | false | `"−40 °C"` | `"l"` |
| `("f", "50")` | c `"10"` | `"10"` | false | `"10 °C"` | `"l"` |
| `("k", "0")` | c `"−273.15"`, f `"−459.67"` | `"m40"` | false | `"−273.15 °C, off the scale"` | `"m"` |
| `("f", "-459.67")` | c `"−273.15"`, k `"0"` | `"m40"` | false | — | `"m"` |
| `("c", "-300")` | f `"−508"`, k `"−26.85"` | `"abs"` | true | `"−300 °C, off the scale"` | `"l"` |
| `("c", "36,6")` | f `"97.88"`, k `"309.75"` | `"30"` | false | `"36.6 °C"` | `"l"` |
| `("c", "")`, `("c", "abc")`, `("k", "-")` | other two `""`, own text unchanged | `null` | false | marker `null` | `"l"` |

- [ ] **Step 2: Run to verify they fail.** `node --test "test/**/*.test.js"` → FAIL, `Cannot find module '../display.js'`; Task 1 tests still pass.

- [ ] **Step 3: Implement `display.js`** with the export pattern and the signatures above.

- [ ] **Step 4: Run to verify they pass.** `node --test "test/**/*.test.js"` → `fail 0`.

- [ ] **Step 5: Commit** `git add display.js test/display.test.js && git commit -m "feat: view state for bands, figure size, notice and legend"`

---

### Task 3: The page (`index.html`, `styles.css`, `fonts/`, `app.js`)

Implements mockup **`design/mockups/converter.html`** with **`design/mockups/tokens.css`**; compare against `design/screenshots/converter-*-1440.png` and `-390.png`.

**Files:**
- Create: `index.html`, `styles.css`, `app.js`, `fonts/Barlow-Medium.ttf`, `fonts/Barlow-SemiBold.ttf`, `fonts/BarlowCondensed-Bold.ttf` (copies from `design/fonts/`)
- Test: `test/page.test.js`

**Interfaces:**
- Consumes: Task 2 `Display.viewState(unit, text)`; DOM ids from the mockup: inputs `c`, `f`, `k`; `fields`, `notice`, `legend`, `marker`, `mlabel`.
- Produces: the page. DOM contract the tests and the ui-designer rely on: `<body data-band="…">` (attribute absent when empty), `#fields[data-size]`, `#notice` (empty when no notice), `#legend[data-off]`, `#legend[hidden-marker]` when no value, `--pos` (e.g. `64%`) and `--shift` custom properties on `#legend`, text of `#mlabel`.

- [ ] **Step 1: Write the failing tests in `test/page.test.js`**

Harness: launch headless Chrome from `process.env.CHROME`, default `/opt/hermes/tools/chromium-1208/chrome-linux64/chrome` (CI sets `CHROME=google-chrome`); drive it over the DevTools protocol exactly like `design/shoot.mjs` (`--headless=new --no-sandbox --remote-debugging-port`, `fetch` `/json`, `WebSocket`). Fail (not skip) when Chrome cannot start. Open `file://<repo>/index.html` fresh for each test at 1440×900. Type with `Input.insertText` after focusing the input; clear by `Input.dispatchKeyEvent` select-all (Ctrl+A) then Backspace; read state with `Runtime.evaluate`. Kill Chrome in an `after` hook.

| Test | Action | Expected |
|---|---|---|
| `page starts empty` | load | all three inputs `""`; `body` has no `data-band`; `#notice` text `""`; `#legend` has `hidden-marker` |
| `typing celsius fills the others` | type `100` in `c` | `f` `"212"`, `k` `"373.15"`; `data-band` `"50"`; `#mlabel` `"100 °C, off the scale"` |
| `typing fahrenheit fills the others` | type `-40` in `f` | `c` `"−40"`, `k` `"233.15"`; `f` still `"-40"` (own field not rewritten) |
| `zero kelvin shows no notice` | type `0` in `k` | `c` `"−273.15"`, `f` `"−459.67"`; `#notice` text `""` |
| `below absolute zero shows the notice` | type `-300` in `c` | `f` `"−508"`, `k` `"−26.85"`; `data-band` `"abs"`; `#notice` text `"Below absolute zero"`, `role="status"`, `aria-live="polite"`, contains an `svg` |
| `clearing a field clears the others` | type `100` in `c`, then clear `c` | `f` `""`, `k` `""`; no `data-band`; `#legend` has `hidden-marker`; `#notice` `""` |
| `non-numeric input clears the others` | type `100` in `c`, clear, type `abc` | `f` `""`, `k` `""`; `#notice` `""`; no `alert`/dialog opened (`Page.javascriptDialogOpening` never fired) |
| `partial minus clears quietly` | type `-` in `c` | `f` `""`, `k` `""`; then type `5` → `f` `"23"` |
| `fields are labelled` | load | each input's accessible name (`input.labels[0]` text, case-insensitive) contains `Celsius`, `Fahrenheit`, `Kelvin` respectively; each has `inputmode="decimal"` |
| `tab moves through the fields in order` | focus `c`, `Input.dispatchKeyEvent` Tab twice | `document.activeElement.id` is `f`, then `k` |
| `figure size follows the longest value` | type `-459.67` in `f` | `#fields` `data-size` `"m"` |
| `no network requests` | load with `Network.enable` | every `Network.requestWillBeSent` URL starts with `file://` |
| `phone layout stacks the fields` | `Emulation.setDeviceMetricsOverride` 390×844, load | the three `.field` boxes have equal `left` and increasing `top`; `document.documentElement.scrollWidth` ≤ 390 |

- [ ] **Step 2: Run to verify they fail.** `node --test "test/**/*.test.js"` → page tests FAIL (no `index.html`); Tasks 1–2 pass.

- [ ] **Step 3: Create `styles.css` and `fonts/`.** `styles.css` = `design/mockups/tokens.css` verbatim with the three `url("../fonts/…")` changed to `url("fonts/…")`, then the `<style>` block of the mockup verbatim. Copy the three font files used by tokens.css into `fonts/` (not Archivo, PublicSans, SourceSerif4).

- [ ] **Step 4: Create `index.html`** = the mockup's `<head>` (link `styles.css` instead of `tokens.css`, no inline `<style>`) and `<body>` markup verbatim, with these changes only: the three inputs have no `value` attribute; `#mlabel` is empty; `#legend` starts with `hidden-marker`. Replace the mockup `<script>` with `<script src="converter.js"></script><script src="display.js"></script><script src="app.js"></script>`.

- [ ] **Step 5: Create `app.js`.** For each input, on `input`: `s = Display.viewState(unit, input.value)`; write `s.values` into the other two inputs only; set or delete `document.body.dataset.band`; set `#fields` `data-size`; `#notice`: the mockup's SVG plus `Below absolute zero` when `s.notice`, else empty; legend: `hidden-marker` when `s.marker` is `null`, else `data-off`, `--pos` (`s.marker.pos + "%"`), `--shift`, `#mlabel` text. Copy the notice SVG markup from the mockup's script.

- [ ] **Step 6: Run to verify all pass.** `node --test "test/**/*.test.js"` → `fail 0`.

- [ ] **Step 7: Visual check.** Run `node design/shoot.mjs`-style screenshots of `index.html` (typed states `c=24`, `c=-18`, `c=-300`, empty, at 1440 and 390) into the scratch dir, not into the repo; compare with `design/screenshots/`. Differences other than the absent mockup default value are bugs.

- [ ] **Step 8: Commit** `git add index.html styles.css app.js fonts test/page.test.js && git commit -m "feat: converter page per Deep Shade mockup"`

---

## CI

`.github/workflows/ci.yml` (on this plan branch): job `ci` on `pull_request` and `push` to `main`; `ubuntu-latest`, `actions/setup-node` Node 24, env `CHROME: google-chrome`, runs `node --test "test/**/*.test.js"`. No deploy workflow (spec: deployment target none). GitHub Actions secrets: none.
