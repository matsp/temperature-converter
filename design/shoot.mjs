// Mockup screenshots at exact viewport sizes (headless Chrome's window has a 500px
// minimum width, so phone sizes need device-metrics emulation over CDP).
// Usage, from the repo root: node design/shoot.mjs   (Node ≥ 22, no dependencies)
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";

const CHROME = process.env.CHROME || "/opt/hermes/tools/chromium-1208/chrome-linux64/chrome";
const dir = resolve("design");
const out = join(dir, "screenshots");
mkdirSync(out, { recursive: true });
const states = [["warm", "c=24"], ["cold", "c=-18"], ["hot", "c=38.5"], ["long", "f=-459.67"],
  ["below-zero", "c=-300"], ["empty", "empty"], ["focus", "focus=f"]];
const sizes = [[1440, 900, 1], [390, 844, 2]];

const port = 9333;
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "shoot-"))}`, "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === "page"); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

await send("Page.enable");
for (const [w, h, dpr] of sizes) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: dpr, mobile: w < 500 });
  for (const [name, hash] of states) {
    await send("Page.navigate", { url: "about:blank" });
    await send("Page.navigate", { url: `file://${dir}/mockups/converter.html#${hash}` });
    await sleep(900); // fonts + the 280ms shade transition
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(out, `converter-${name}-${w}.png`), Buffer.from(data, "base64"));
    const vw = await send("Runtime.evaluate", { expression: "innerWidth" });
    console.log(name, w, "innerWidth", vw.result.value);
  }
}
ws.close(); chrome.kill();
