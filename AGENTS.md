# AGENTS.md — HYDRA Developer Toolkit (`active/hydra-worker`)

This repository is the canonical, deployed HYDRA: a free, keyless, stateless Cloudflare Worker (Hono) live at `https://hydra-worker.toledonick98.workers.dev`, with its playground served by GitHub Pages from `docs/`. Deployment is a manual `wrangler deploy` from a developer machine and is an explicit decision (`docs/SOURCE-OF-TRUTH.md`): **local source changes never authorise a deployment.** Do not change runtime behaviour, add dependencies, commit, push or deploy unless the task explicitly authorises it.

## Project-history continuity contract

At task start, read `docs/history/ORIENTATION.md`, the relevant current goals and principles (`.project-history/doctrine/goals.yml`, `.project-history/doctrine/principles.yml`), and the history surfaced for the paths or component you will touch:

```
node scripts/project_history.mjs context [paths...]      # or: npm run history:context -- [paths...]
```

At task completion, run the history-impact assessment (`node scripts/project_history.mjs assess`) and declare **exactly one** of:

- `history:recorded <event-id>` — you added or amended an event capsule under `.project-history/events/YYYY/`, updated affected goal/principle lifecycle records, patched the relevant curated chapter(s) in `docs/history/`, ran `node scripts/project_history.mjs render`, and `node scripts/project_history.mjs validate` passes.
- `history:none — <specific reason>` — the work is immaterial (typos, formatting, generated refreshes, lockfile churn, fixups, mechanical renames, behaviour-preserving refactors, tests that only confirm existing behaviour). Say why; a bare `history:none` is not accepted.
- `history:defer — <tracking item, owner, deadline>` — emergency rollback, incident containment or a security hotfix may defer the prose, but the deferral must be attributable and must expire: add it to `deferrals:` in `.project-history/policy.yml` with an `id`, `owner`, `deadline` (YYYY-MM-DD) and `tracking` reference. `validate` fails on expired open deferrals.

Materiality (see `.project-history/policy.yml`): record an event when purpose, audience, value, principle, success metric, goal or non-goal changed; when a durable API, data-model, architecture, security, privacy, reliability, governance or deployment choice constrains future work; on a meaningful release, migration, deprecation, incident, rollback or reversal; when an experiment or discovery changed what the project believes; when a feature or removal changed the user promise or identity. Do not create history noise for anything else.

Rules: closed events are append-mostly — correct them with an `amendments:` entry (date, reason, evidence, confidence_moved), never by silent rewrite; backfilled capsules carry `recorded_at` later than `occurred_at`; cite full 40-hex commit SHAs while they are reachable plus a rewrite-resistant locator where one exists; never reproduce secrets, tokens, env values or personal data in any history artifact (validate secret-scans them); automation may index and assemble curated prose but must never author or wholesale rewrite ideological or causal narrative.

Commands: `assess`, `context`, `validate`, `render`, `audit --full`, `audit --since <anchor>`, `declaration --text` in `scripts/project_history.mjs` (also exposed as `npm run history:*`); tests in `test/project_history_tests.mjs` (`node --test test/project_history_tests.mjs` — deliberately outside vitest's glob; `npm test` remains the product's vitest run).

## Repository facts agents keep getting wrong

- The code has 24 utility routes plus `/` and `/health`. "22" (README, badge, playground), "20+" (openapi.json) and "20" (live banner) are all approximations; do not propagate any of them without counting.
- The live `/` banner links `docs` to the shelved Python repository (`hydra-toolkit-api`), not to this repository's playground.
- `test/index.spec.js` is the untouched Cloudflare starter test and cannot pass against this app; do not cite it as evidence of coverage.
- Local `master` is one unpushed commit (the 2026-09-01 snapshot: LICENSE, `.toledo.yaml`, source-of-truth note) ahead of `origin/master`. Pushing is an owner decision.
- `.toledo.yaml` is committed and records the original macOS path; treat it as portfolio metadata, not configuration.
