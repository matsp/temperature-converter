# CI: 13 page tests "timed out after 10000ms" (PR #9)

- Whole CI step took 17 s for 13 failing tests, so the tests did not each hang 10 s: the `before` hook (Chrome startup) hit `--test-timeout=10000` and node reported that timeout on every test. Not reproducible locally (no `google-chrome` here; local chromium passes 52/52).
- The old hook polled 15 s for a page target, longer than the 10 s test timeout, and sent Chrome's stderr to /dev/null, so the cause was invisible. The CI log was not readable without gh auth; the check-run annotations API is public.
- Change (test/page.test.js only, assertions untouched): hook timeout 40 s; stderr captured; fail fast if Chrome exits; request a page via `/json/new` when none exists; extra quiet flags (`--no-first-run`, `--disable-extensions`, `--disable-background-networking`); on failure print `::error title=Chrome startup::...` so Chrome's stderr appears as a CI annotation (readable via the public annotations API).
- Root cause on the runner is still unconfirmed: if CI stays red, read the annotation first.
