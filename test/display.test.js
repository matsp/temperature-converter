const { test } = require("node:test");
const assert = require("node:assert/strict");
const D = require("../display.js");

test("bandFor", () => {
  const cases = [[-273.15, "m40"], [-41, "m40"], [-40, "m40"], [-30.01, "m40"], [-30, "m30"],
    [-0.01, "m10"], [0, "0"], [9.99, "0"], [10, "10"], [24, "20"], [49.99, "40"], [50, "50"], [1000, "50"]];
  for (const [c, b] of cases) assert.equal(D.bandFor(c), b, String(c));
});

test("figureSize", () => {
  assert.equal(D.figureSize(["24", "75.2", "297.15"]), "l");
  assert.equal(D.figureSize(["\u2212459.67", "\u2212273.15", "0"]), "m");
  assert.equal(D.figureSize(["1000000", "1800032", "1000273.15"]), "s");
  assert.equal(D.figureSize(["", "", ""]), "l");
});

test("legendMarker", () => {
  const m = (pos, shift, label, off) => ({ pos, shift, label, off });
  assert.deepEqual(D.legendMarker(24), m(64, "-50%", "24 °C", false));
  assert.deepEqual(D.legendMarker(-40), m(0, "0%", "\u221240 °C", false));
  assert.deepEqual(D.legendMarker(60), m(100, "-100%", "60 °C", false));
  assert.deepEqual(D.legendMarker(-35), m(5, "0%", "\u221235 °C", false));
  assert.deepEqual(D.legendMarker(-300), m(0, "0%", "\u2212300 °C, off the scale", true));
  assert.deepEqual(D.legendMarker(61), m(100, "-100%", "61 °C, off the scale", true));
});

const M = "\u2212";
const rows = [
  ["c", "100", { c: "100", f: "212", k: "373.15" }, "50", false, "100 °C, off the scale", "l"],
  ["c", "24", { c: "24", f: "75.2", k: "297.15" }, "20", false, "24 °C", "l"],
  ["f", "-40", { c: M + "40", f: "-40", k: "233.15" }, "m40", false, M + "40 °C", "l"],
  ["f", "50", { c: "10", f: "50" }, "10", false, "10 °C", "l"],
  ["k", "0", { c: M + "273.15", f: M + "459.67", k: "0" }, "m40", false, M + "273.15 °C, off the scale", "m"],
  ["f", "-459.67", { c: M + "273.15", k: "0", f: "-459.67" }, "m40", false, undefined, "m"],
  ["c", "-300", { f: M + "508", k: M + "26.85", c: "-300" }, "abs", true, M + "300 °C, off the scale", "l"],
  ["c", "36,6", { f: "97.88", k: "309.75", c: "36,6" }, "30", false, "36.6 °C", "l"],
];
for (const [unit, text, values, band, notice, label, size] of rows) {
  test(`viewState(${unit}, ${JSON.stringify(text)})`, () => {
    const s = D.viewState(unit, text);
    for (const [u, v] of Object.entries(values)) assert.equal(s.values[u], v, u);
    assert.equal(s.band, band);
    assert.equal(s.notice, notice);
    if (label !== undefined) assert.equal(s.marker.label, label);
    assert.equal(s.size, size);
  });
}
for (const [unit, text] of [["c", ""], ["c", "abc"], ["k", "-"]]) {
  test(`viewState(${unit}, ${JSON.stringify(text)}) is empty`, () => {
    const s = D.viewState(unit, text);
    for (const u of ["c", "f", "k"]) assert.equal(s.values[u], u === unit ? text : "");
    assert.equal(s.band, null);
    assert.equal(s.notice, false);
    assert.equal(s.marker, null);
    assert.equal(s.size, "l");
  });
}
