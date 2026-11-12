# Plan decisions: temperature converter (2026-11-12, architect)

Plan: docs/plans/2026-11-12-temperature-converter.md. Spec: docs/specs/2026-11-12-temperature-converter-design.md.

- Classic `<script src>` files, not ES modules: Chrome refuses module scripts from `file://`. `converter.js` and `display.js` export via a small UMD wrapper (global `Converter`/`Display` in the browser, `module.exports` in Node), no package.json.
- All logic is pure and Node-tested; `app.js` only writes view state into the DOM. Page behaviour is tested in headless Chrome over the DevTools protocol with Node built-ins (WebSocket, fetch), same pattern as design/shoot.mjs. CI sets `CHROME=google-chrome` (preinstalled on ubuntu-latest).
- Test command: `node --test "test/**/*.test.js"`; it exits 0 with zero tests, so CI is green on the plan branch before any code exists.
- Absolute zero is checked on the typed value in its own unit (-273.15 C, -459.67 F, 0 K). Rejected: checking the converted Celsius, because float noise can land a hair off the limit.
- Rounding: half away from zero to 2 decimals, `-0` printed as `0`, output minus U+2212.
- `parseInput` accepts `,` as decimal (phone keypads) and rejects `1e3`, `0x10`, `Infinity` that `Number()` would accept.
- Band and legend use Celsius rounded to 2 decimals, so float noise never crosses a band edge.
- The field being typed in is never rewritten (caret position, and `-` would turn into `−`).
- No deploy workflow and no Actions secrets: spec says deployment target none.
