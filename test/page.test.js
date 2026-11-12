const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { mkdtempSync, rmSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { tmpdir } = require("node:os");

const CHROME = process.env.CHROME || "/opt/hermes/tools/chromium-1208/chrome-linux64/chrome";
const PAGE = "file://" + resolve(__dirname, "..", "index.html");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MINUS = "\u2212";

let chrome, profile, ws, nextId = 0, spawnError;
const pending = new Map();
const events = [];

function send(method, params = {}, timeoutMs = 5000) {
  return new Promise((resolveCall, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => reject(new Error("CDP timeout: " + method + " | " + events.slice(-6).map((e) => e.method).join(","))), timeoutMs);
    pending.set(id, { resolveCall: (v) => { clearTimeout(timer); resolveCall(v); }, reject: (e) => { clearTimeout(timer); reject(e); } });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

before(async () => {
  profile = mkdtempSync(join(tmpdir(), "tc-page-"));
  const port = 9400 + Math.floor(Math.random() * 400);
  chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars",
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  chrome.on("error", (e) => { spawnError = e; });
  let target;
  for (let i = 0; i < 75 && !target && !spawnError; i++) {
    await sleep(200);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
  }
  assert.ok(target, `Chrome did not start (${CHROME}): ${spawnError || "no page target"}`);
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener("open", r, { once: true }); ws.addEventListener("error", j, { once: true }); });
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id);
      if (m.error) p.reject(new Error(m.error.message)); else p.resolveCall(m.result);
    } else if (m.method) events.push(m);
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
});

after(async () => {
  try { ws && ws.close(); } catch {}
  if (chrome) {
    const exited = new Promise((r) => chrome.once("exit", r));
    chrome.kill();
    await Promise.race([exited, sleep(3000)]);
  }
  if (profile) rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
});

async function open(width = 1440, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 500 });
  await send("Page.navigate", { url: "about:blank" });
  // Navigation is asynchronous: wait until the previous page is really gone, or we would type into it.
  for (let i = 0; i < 40; i++) {
    if (await evalJs("location.href === 'about:blank' && document.readyState === 'complete'", 500).catch(() => false)) break;
    await sleep(50);
  }
  events.length = 0;
  for (let attempt = 0; attempt < 5; attempt++) {
    // A navigation right after another one is occasionally dropped by headless Chrome: retry.
    await send("Page.navigate", { url: PAGE });
    for (let i = 0; i < 40; i++) {
      // An evaluate sent into a context that is being replaced may never be answered: short timeout, then retry.
      const ready = await evalJs("document.readyState === 'complete' && !!document.getElementById('c')", 500).catch(() => false);
      if (ready) return;
      await sleep(50);
    }
  }
  throw new Error("page did not load");
}
async function evalJs(expression, timeoutMs) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true }, timeoutMs);
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
async function type(id, text) {
  await evalJs(`document.getElementById(${JSON.stringify(id)}).focus()`);
  await send("Input.insertText", { text });
}
async function clear(id) {
  await evalJs(`document.getElementById(${JSON.stringify(id)}).focus()`);
  await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "a", code: "KeyA", modifiers: 2, commands: ["selectAll"] });
  await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
}
const values = () => evalJs(`({c: c.value, f: f.value, k: k.value})`);
const notice = () => evalJs(`document.getElementById("notice").textContent`);

test("page starts empty", async () => {
  await open();
  assert.deepEqual(await values(), { c: "", f: "", k: "" });
  assert.equal(await evalJs(`document.body.hasAttribute("data-band")`), false);
  assert.equal(await notice(), "");
  assert.equal(await evalJs(`document.getElementById("legend").hasAttribute("hidden-marker")`), true);
});

test("typing celsius fills the others", async () => {
  await open();
  await type("c", "100");
  const v = await values();
  assert.equal(v.f, "212");
  assert.equal(v.k, "373.15");
  assert.equal(await evalJs(`document.body.dataset.band`), "50");
  assert.equal(await evalJs(`document.getElementById("mlabel").textContent`), "100 °C, off the scale");
});

test("typing fahrenheit fills the others", async () => {
  await open();
  await type("f", "-40");
  const v = await values();
  assert.equal(v.c, MINUS + "40");
  assert.equal(v.k, "233.15");
  assert.equal(v.f, "-40");
});

test("zero kelvin shows no notice", async () => {
  await open();
  await type("k", "0");
  const v = await values();
  assert.equal(v.c, MINUS + "273.15");
  assert.equal(v.f, MINUS + "459.67");
  assert.equal(await notice(), "");
});

test("below absolute zero shows the notice", async () => {
  await open();
  await type("c", "-300");
  const v = await values();
  assert.equal(v.f, MINUS + "508");
  assert.equal(v.k, MINUS + "26.85");
  assert.equal(await evalJs(`document.body.dataset.band`), "abs");
  assert.equal(await notice(), "Below absolute zero");
  assert.equal(await evalJs(`document.getElementById("notice").getAttribute("role")`), "status");
  assert.equal(await evalJs(`document.getElementById("notice").getAttribute("aria-live")`), "polite");
  assert.equal(await evalJs(`!!document.querySelector("#notice svg")`), true);
});

test("clearing a field clears the others", async () => {
  await open();
  await type("c", "100");
  await clear("c");
  assert.deepEqual(await values(), { c: "", f: "", k: "" });
  assert.equal(await evalJs(`document.body.hasAttribute("data-band")`), false);
  assert.equal(await evalJs(`document.getElementById("legend").hasAttribute("hidden-marker")`), true);
  assert.equal(await notice(), "");
});

test("non-numeric input clears the others", async () => {
  await open();
  await type("c", "100");
  await clear("c");
  await type("c", "abc");
  const v = await values();
  assert.equal(v.f, "");
  assert.equal(v.k, "");
  assert.equal(await notice(), "");
  assert.equal(events.some((e) => e.method === "Page.javascriptDialogOpening"), false);
});

test("partial minus clears quietly", async () => {
  await open();
  await type("c", "-");
  let v = await values();
  assert.equal(v.f, "");
  assert.equal(v.k, "");
  await type("c", "5");
  v = await values();
  assert.equal(v.f, "23");
});

test("fields are labelled", async () => {
  await open();
  for (const [id, name] of [["c", "celsius"], ["f", "fahrenheit"], ["k", "kelvin"]]) {
    const label = await evalJs(`document.getElementById("${id}").labels[0].textContent.toLowerCase()`);
    assert.ok(label.includes(name), `${id}: ${label}`);
    assert.equal(await evalJs(`document.getElementById("${id}").getAttribute("inputmode")`), "text");
  }
});

test("tab moves through the fields in order", async () => {
  await open();
  await evalJs(`document.getElementById("c").focus()`);
  const tab = async () => {
    await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  };
  await tab();
  assert.equal(await evalJs(`document.activeElement.id`), "f");
  await tab();
  assert.equal(await evalJs(`document.activeElement.id`), "k");
});

test("figure size follows the longest value", async () => {
  await open();
  await type("f", "-459.67");
  assert.equal(await evalJs(`document.getElementById("fields").dataset.size`), "m");
});

test("no network requests", async () => {
  await open();
  const urls = events.filter((e) => e.method === "Network.requestWillBeSent").map((e) => e.params.request.url);
  assert.ok(urls.length > 0);
  for (const u of urls) assert.ok(u.startsWith("file://"), u);
});

test("phone layout stacks the fields", async () => {
  await open(390, 844);
  const boxes = await evalJs(`[...document.querySelectorAll(".field")].map(e => { const r = e.getBoundingClientRect(); return [r.left, r.top]; })`);
  assert.equal(boxes.length, 3);
  assert.equal(boxes[0][0], boxes[1][0]);
  assert.equal(boxes[1][0], boxes[2][0]);
  assert.ok(boxes[0][1] < boxes[1][1] && boxes[1][1] < boxes[2][1]);
  assert.ok(await evalJs(`document.documentElement.scrollWidth`) <= 390);
});
