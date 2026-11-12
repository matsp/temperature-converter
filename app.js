// DOM wiring only: all decisions come from Display.viewState.
(function () {
  const $ = (id) => document.getElementById(id);
  const units = ["c", "f", "k"];
  const NOTICE_HTML = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 4.8v5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="12.9" r="1.1" fill="currentColor"/></svg>Below absolute zero';

  function apply(unit) {
    const s = Display.viewState(unit, $(unit).value);
    // Never rewrite the field being typed in: it would move the caret and swap "-" for "−".
    for (const u of units) if (u !== unit) $(u).value = s.values[u];

    if (s.band === null) delete document.body.dataset.band;
    else document.body.dataset.band = s.band;
    $("fields").dataset.size = s.size;
    $("notice").innerHTML = s.notice ? NOTICE_HTML : "";

    const legend = $("legend");
    if (s.marker === null) {
      legend.setAttribute("hidden-marker", "");
    } else {
      legend.removeAttribute("hidden-marker");
      legend.dataset.off = String(s.marker.off);
      legend.style.setProperty("--pos", s.marker.pos + "%");
      legend.style.setProperty("--shift", s.marker.shift);
      $("mlabel").textContent = s.marker.label;
    }
  }

  for (const u of units) $(u).addEventListener("input", () => apply(u));
})();
