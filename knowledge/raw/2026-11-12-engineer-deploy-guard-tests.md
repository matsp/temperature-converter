# Deploy guard tests (card t_9e69be28)

Added test/deploy.test.js (12 tests) and README live URL. Full suite: 52 pass.

Mutation checks (each reverted afterwards):
- `href="/styles.css"` in index.html -> `absolute asset reference: /styles.css` (also `not published: /styles.css`).
- `fonts` dropped from the cp line -> `not published: fonts/Barlow-Medium.ttf` (and the exact-set test fails).
- `fonts/Barlow-Medium.ttf` dropped from the smoke list -> `not smoke-checked: fonts/Barlow-Medium.ttf`.

Note: the smoke list uses `""` for the page root instead of `index.html`, so the smoke test requires `""` plus the five other root files/fonts.
