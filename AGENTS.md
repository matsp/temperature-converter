# AGENTS.md

Rules for every agent working in this repository.

## Project

Temperature converter: one static page (`index.html` at the repo root) where typing a temperature in Celsius, Fahrenheit or Kelvin updates the other two fields live. For anyone who needs a quick conversion, on phone or desktop, opened straight from `file://`.

Components: `converter.js` (pure conversion, parsing, formatting), `display.js` (pure view state: band, figure size, notice, legend), `app.js` (DOM wiring), `styles.css` + `fonts/` (Deep Shade design, see `DESIGN.md` and `design/mockups/`). No framework, no build step, no runtime dependencies. Deployment target: none.

## Commands

- Test (also what CI job `ci` runs): `node --test "test/**/*.test.js"` (Node ≥ 24; page tests need headless Chrome, path in `CHROME`, default `/opt/hermes/tools/chromium-1208/chrome-linux64/chrome`).
- Build: none. Run: open `index.html` in a browser.

Full build, test, lint and run commands live in [knowledge/wiki/runbook/](knowledge/wiki/runbook/index.md). Keep them current there, not here.

## Team flow

- Roles: product-owner (spec), architect (plan, CI/CD, repo setup), engineer (code), code-reviewer, qa-engineer, release-manager (PRs, merges), tech-writer (wiki).
- Gates: Mats approves the spec, the plan and every code PR. Nothing reaches `main` without a PR and green CI. Nobody pushes to `main`.
- Test-driven development always: no production code without a failing test first.
- Branches: `spec/<topic>`, `plan/<topic>`, `feat/<topic>`, `wiki/<YYYY-MM-DD>-<card id>`.
- Specs in `docs/specs/`, plans in `docs/plans/`.
- Secrets never go into this repo. Deployment secrets live in GitHub Actions secrets, set by Mats.

## Project wiki

The wiki follows two specs, saved in `knowledge/specs/` and not repeated here:

- `knowledge/specs/karpathy-llm-wiki.md`: the pattern (raw sources, wiki, schema; ingest, query, lint).
- `knowledge/specs/okf-spec-v0.2.md`: the format of `knowledge/wiki/` (OKF v0.2 bundle, markdown with YAML frontmatter).

### Layers

- `knowledge/raw/`: notes written by every role. Immutable: never edit or delete a file there; a correction is a new file. Name files `YYYY-MM-DD-<role>-<slug>.md`.
- `knowledge/wiki/`: the OKF bundle. Written only by the tech-writer. English.
- `knowledge/specs/`: saved specs. Never edit.

### Wiki format (OKF v0.2)

- Bundle root is `knowledge/wiki/`. Every `.md` except `index.md` and `log.md` is a concept; its ID is its path without `.md`. File names use `[a-z0-9-]`.
- Required frontmatter: non-empty `type`. Recommended: `title`, `description`, `tags`, `generated: {by, at}`.
- `generated.by` is `hermes-tech-writer/claude-haiku-5-5`. Timestamps are ISO 8601 with offset.
- `sources`: list of entries with `id`, `resource`, optional `title`, `last_modified`. A `resource` pointing into `knowledge/raw/` is a path relative to the page file. Cite single claims with footnotes `[^id]` that match a source `id`.
- `status`: `draft`, `stable` or `deprecated`. Deprecate a page instead of deleting it.
- `verified` is set only by Mats (`human:` actor). Never set or change it.
- Links are relative Markdown links without a leading `/`.
- Every directory under `knowledge/wiki/` has an `index.md` without frontmatter: one line per entry, `* [Title](path) - description`. Only `knowledge/wiki/index.md` has frontmatter, with `okf_version: "0.2"`.
- `log.md` exists at `knowledge/wiki/` and at each domain root. Newest day on top. Heading `## YYYY-MM-DD`, then bullets `* **Ingest**: ...`, `* **Update**: ...`, `* **Creation**: ...`, `* **Query**: ...`, `* **Lint**: ...`, `* **Skip**: ...`, `* **Deprecation**: ...`.

### Domains

`architecture`, `decisions` (ADRs with rejected alternatives), `gotchas`, `runbook`, `conventions` (`type: Convention`), `interfaces`, `testing`, `dead-ends` (tried and failed, with the reason), `glossary`, `debt`, and `design` only for projects with a frontend (`tokens`, `components`, `patterns`, `accessibility`, `ux-decisions`).

### Ingest

1. Find unprocessed files in `knowledge/raw/`: a file is processed when a page cites it in `sources[].resource` or an `Ingest` or `Skip` log line names it (`PYTHONPATH=/opt/data/workspace/coding-tools python3 -m codingtool raw-unprocessed <repo>` lists them). Process them oldest first.
2. Read one source. Pick the domain, or create a new domain with `index.md` and `log.md`.
3. Write or update the pages the source affects. Prefer updating a page over creating a near-duplicate. Add the source to `sources`.
4. When sources contradict each other or an existing page, record both and flag the conflict. Do not silently pick a winner.
5. Update the `index.md` files and write one log line per raw file: `Ingest`, or `Skip` with the reason.

### Query

Read `knowledge/wiki/index.md`, then the domain index, then the relevant pages. If the wiki does not cover the question, say so.

### Lint

Report: a page without `type`; a directory without `index.md`; `okf_version` anywhere but `knowledge/wiki/index.md`; broken relative links; orphan pages; `sources[].resource` paths into `knowledge/raw/` that do not exist; raw files neither cited nor logged; log headings not `## YYYY-MM-DD`; contradictions, open questions, stale pages. Fix only mechanical problems (links, indexes, log format).

### Conventions

A domain may have conventions in `knowledge/wiki/<domain>/conventions/` or the `conventions/` domain (`type: Convention`). Read them before you work in that area. The repo's own existing conventions win over team defaults.

### Git

The tech-writer works on branch `wiki/<YYYY-MM-DD>-<card id>`, changes only `knowledge/wiki/`, and hands the branch to the release-manager for the PR. Never push to `main`.
