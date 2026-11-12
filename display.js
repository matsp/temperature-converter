// Pure view state for one field's text. Global `Display` in the browser, module.exports in Node.
(function (root, api) {
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Display = api;
})(typeof globalThis !== "undefined" ? globalThis : this, (function () {
  const Converter = typeof require === "function" ? require("./converter.js") : globalThis.Converter;
  const BANDS = ["m40", "m30", "m20", "m10", "0", "10", "20", "30", "40", "50"];
  const UNITS = ["c", "f", "k"];

  function bandFor(celsius) {
    return BANDS[Math.max(0, Math.min(9, Math.floor((celsius + 40) / 10)))];
  }

  function figureSize(texts) {
    const n = Math.max(0, ...texts.map((t) => t.length));
    return n <= 6 ? "l" : n === 7 ? "m" : "s";
  }

  function legendMarker(celsius) {
    const raw = celsius + 40;
    const pos = Math.max(0, Math.min(100, raw));
    const off = celsius < -40 || celsius > 60;
    return {
      pos,
      shift: pos < 6 ? "0%" : pos > 94 ? "-100%" : "-50%",
      label: Converter.formatValue(celsius) + " °C" + (off ? ", off the scale" : ""),
      off,
    };
  }

  function viewState(unit, text) {
    const v = Converter.parseInput(text);
    const values = { c: "", f: "", k: "" };
    values[unit] = text;
    if (v === null) {
      return { values, band: null, size: figureSize(Object.values(values)), notice: false, marker: null };
    }
    const c = Converter.toCelsius(unit, v);
    for (const u of UNITS) if (u !== unit) values[u] = Converter.formatValue(Converter.fromCelsius(u, c));
    const rounded = Number(Converter.formatValue(c).replace("\u2212", "-"));
    const notice = Converter.isBelowAbsoluteZero(unit, v);
    return {
      values,
      band: notice ? "abs" : bandFor(rounded),
      size: figureSize(Object.values(values)),
      notice,
      marker: legendMarker(rounded),
    };
  }

  return { bandFor, figureSize, legendMarker, viewState };
})());
