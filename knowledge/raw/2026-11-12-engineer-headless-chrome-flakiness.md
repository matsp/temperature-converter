# Headless Chrome page tests: renderer crash and navigation races

Found while implementing `test/page.test.js` (card t_dffab42c).

- **Renderer crashed at random** (`Inspector.targetCrashed`, then every CDP call hung) with 1 run in ~3. Cause: the container's 64 MB `/dev/shm`. Fix: launch Chrome with `--disable-dev-shm-usage`. After that, 20 page-test runs and 5 full-suite runs were clean.
- **Typing into the previous page.** `Page.navigate` returns before the document is replaced. After `about:blank` then the page, `readyState === "complete"` could still be true for the old page, so `insertText` went to a dying document (symptom: own field set, others empty). Fix: wait until `location.href === "about:blank"` before navigating to the page.
- `Runtime.evaluate` sent into a context that is being replaced may never be answered: every CDP call has a timeout (5 s; 500 ms while polling for the page) so a hang fails the test instead of the whole run.
- `rmSync` of the Chrome profile failed with ENOTEMPTY while Chrome was still exiting: wait for the `exit` event, then `rmSync` with `maxRetries`.
- Rejected: `pkill -f remote-debugging-port` from the shell kills the shell running it too; use `pgrep -f "[c]hrome..."` to avoid self-match.
- Visual check: screenshots of `index.html` (c=24, -18, f=-459.67, c=-300, empty; 1440 and 390) match `design/screenshots/`. Only difference: the typed field keeps the user's `-` (by design: the own field is never rewritten), the mockup replaced it with `−`.
