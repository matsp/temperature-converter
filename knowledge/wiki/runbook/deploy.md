---
type: Runbook
title: Deploy to GitHub Pages
description: How the site is published, checked and recovered.
tags: [runbook,deployment]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T23:10:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-github-pages-deploy.md
    title: Pages deploy plan decisions
    last_modified: 2026-11-12
  - id: eng
    resource: ../../raw/2026-11-12-engineer-deploy-guard-tests.md
    title: Deploy guard tests
    last_modified: 2026-11-12
---

# Deploy to GitHub Pages

Live URL: `https://matsp.github.io/temperature-converter/` (also in the README).[^eng]

* Publishing is automatic: a green `CI` run on `main` triggers the `Deploy` workflow. Rationale in [ADR 0005](../decisions/0005-deploy-workflow-after-green-ci.md).[^plan]
* Published files: `index.html`, `converter.js`, `display.js`, `app.js`, `styles.css`, `fonts/`. Asset references in `index.html` stay relative (`styles.css`, not `/styles.css`), because the site lives under a sub-path.[^plan][^eng]
* Smoke check after deploy: the page, three scripts, the stylesheet and three fonts must answer; a 404 fails the run.[^plan]
* Prerequisite: Settings → Pages → Source must be "GitHub Actions". If it is not, `configure-pages` fails. Mats enables it; recovery after enabling is a manual `workflow_dispatch` run of `Deploy`.[^plan]
* No Actions secrets are needed.[^plan]
* Not yet verified live: QA could not check the deploy before merge (needs the Pages setting and a merge to `main`).

See also [Commands](commands.md).

[^plan]: Pages deploy plan decisions.
[^eng]: Deploy guard tests note.
