const { test } = require("node:test");
const assert = require("node:assert/strict");
const C = require("../converter.js");

const f = (v) => C.formatValue(v);

test("0 °C is 32 °F and 273.15 K", () => {
  assert.equal(f(C.fromCelsius("f", 0)), "32");
  assert.equal(f(C.fromCelsius("k", 0)), "273.15");
});
test("100 °C is 212 °F and 373.15 K", () => {
  assert.equal(f(C.fromCelsius("f", 100)), "212");
  assert.equal(f(C.fromCelsius("k", 100)), "373.15");
});
test("-40 °C is -40 °F", () => {
  assert.equal(f(C.fromCelsius("f", -40)), "\u221240");
  assert.equal(f(C.toCelsius("f", -40)), "\u221240");
});
test("-40 °F is 233.15 K", () => {
  assert.equal(f(C.fromCelsius("k", C.toCelsius("f", -40))), "233.15");
});
test("98.6 °F is 37 °C", () => {
  assert.equal(f(C.toCelsius("f", 98.6)), "37");
});
test("0 °F rounds to -17.78 °C", () => {
  assert.equal(f(C.toCelsius("f", 0)), "\u221217.78");
});
test("300 K is 80.33 °F", () => {
  assert.equal(f(C.fromCelsius("f", C.toCelsius("k", 300))), "80.33");
});
test("0 K is -273.15 °C and -459.67 °F", () => {
  const c = C.toCelsius("k", 0);
  assert.equal(f(c), "\u2212273.15");
  assert.equal(f(C.fromCelsius("f", c)), "\u2212459.67");
});
test("-300 °C is -508 °F and -26.85 K", () => {
  assert.equal(f(C.fromCelsius("f", -300)), "\u2212508");
  assert.equal(f(C.fromCelsius("k", -300)), "\u221226.85");
});

test("formatValue", () => {
  assert.equal(f(212), "212");
  assert.equal(f(24.5), "24.5");
  assert.equal(f(233.14999999999998), "233.15");
  assert.equal(f(0.125), "0.13");
  assert.equal(f(-0.125), "\u22120.13");
  assert.equal(f(-0.004), "0");
  assert.equal(f(-17.7777), "\u221217.78");
});

test("parseInput accepts numbers", () => {
  const cases = [["24", 24], ["  24 ", 24], ["-40", -40], ["\u221240", -40], ["+5", 5],
    ["36.6", 36.6], ["36,6", 36.6], [".5", 0.5], ["12.", 12]];
  for (const [i, e] of cases) assert.equal(C.parseInput(i), e, JSON.stringify(i));
});
test("parseInput rejects non-temperatures", () => {
  for (const i of ["", "   ", "-", "\u2212", ".", ",", "abc", "12a", "1e3", "0x10", "Infinity",
    "NaN", "1.2.3", "1,2,3", "--5"]) assert.equal(C.parseInput(i), null, JSON.stringify(i));
});

test("isBelowAbsoluteZero", () => {
  assert.equal(C.isBelowAbsoluteZero("c", -273.15), false);
  assert.equal(C.isBelowAbsoluteZero("f", -459.67), false);
  assert.equal(C.isBelowAbsoluteZero("k", 0), false);
  assert.equal(C.isBelowAbsoluteZero("c", -273.16), true);
  assert.equal(C.isBelowAbsoluteZero("f", -459.68), true);
  assert.equal(C.isBelowAbsoluteZero("k", -0.01), true);
  assert.equal(C.isBelowAbsoluteZero("c", 24), false);
});
