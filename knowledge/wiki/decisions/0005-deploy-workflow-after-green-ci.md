---
type: Decision
title: "ADR 0005: separate Deploy workflow after green CI"
description: Why Pages deploys from a workflow_run of CI, with inline staging.
tags: [adr,ci,deployment]
status: draft
generated: { by: hermes-tech-writer/claude-haiku-5-5, at: 2026-11-12T23:10:00+00:00 }
sources:
  - id: plan
    resource: ../../raw/2026-11-12-architect-plan-github-pages-deploy.md
    title: Pages deploy plan decisions
    last_modified: 2026-11-12
---

# ADR 0005: separate Deploy workflow after green CI

**Status:** accepted (plan, 2026-11-12).

**Context:** the site is published to GitHub Pages and must only ever show a commit that passed CI.[^plan]

**Decision:** workflow `Deploy` runs on `workflow_run` of `CI` on `main`, guarded by `conclusion == 'success'` and `event == 'push'`. Checkout uses `workflow_run.head_sha`, so the deployed commit is the one CI tested. Staging is an inline `cp -r index.html converter.js display.js app.js styles.css fonts _site/` with no script, so the workflow depends on nothing that is not already on `main`. After `deploy-pages` a smoke check curls the page, three scripts, the stylesheet and three fonts with retries; a 404 fails the run. No secrets are needed.[^plan]

**Rejected:**

* A deploy job inside `ci.yml` with `needs: ci`: works, but mixes PR CI with the `pages: write` / `id-token: write` permissions in one file.[^plan]
* Deploy on plain `push`: would deploy before or without green CI.[^plan]

**Consequence:** see the [deploy runbook](../runbook/deploy.md) and the [test strategy](../testing/strategy.md) for the guard tests.

[^plan]: Pages deploy plan decisions.
