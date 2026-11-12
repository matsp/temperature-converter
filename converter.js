// Pure conversion, parsing and formatting. Global `Converter` in the browser, module.exports in Node.
(function (root, api) {
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Converter = api;
})(typeof globalThis !== "undefined" ? globalThis : this, {
  ABSOLUTE_ZERO: { c: -273.15, f: -459.67, k: 0 },

  toCelsius(unit, value) {
    if (unit === "f") return ((value - 32) * 5) / 9;
    if (unit === "k") return value - 273.15;
    return value;
  },

  fromCelsius(unit, celsius) {
    if (unit === "f") return (celsius * 9) / 5 + 32;
    if (unit === "k") return celsius + 273.15;
    return celsius;
  },

  // Returns a number, or null when the text is not a (partial) temperature.
  parseInput(text) {
    const t = String(text).trim().replace(/\u2212/g, "-").replace(/,/g, ".");
    return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : null;
  },

  // Two decimals, half away from zero, trailing zeros dropped, U+2212 minus, never "−0".
  formatValue(v) {
    const r = (Math.sign(v) * Math.round(Math.abs(v) * 100)) / 100;
    return (r === 0 ? "0" : String(r)).replace("-", "\u2212");
  },

  // Decided in the typed unit, never via converted Celsius (float noise at the boundary).
  isBelowAbsoluteZero(unit, value) {
    return value < this.ABSOLUTE_ZERO[unit];
  },
});
