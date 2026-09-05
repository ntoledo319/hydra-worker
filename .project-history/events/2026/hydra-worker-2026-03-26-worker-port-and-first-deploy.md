---
id: hydra-worker-2026-03-26-worker-port-and-first-deploy
title: The FastAPI toolkit is re-expressed as a Cloudflare Worker seventeen minutes after its Render blueprint
kind: origin
scope: [project, src/index.js, wrangler.jsonc, package.json]
paths: [src/index.js, wrangler.jsonc, package.json, test/index.spec.js, vitest.config.js]
significance: high
summary: >-
  Born at 02:28 EDT as a route-for-route Hono port of the Python file committed 75 minutes earlier, on wrangler's
  untouched template, with one dependency and no auth, storage or bindings; its banner still points its docs at the
  Python repository. Which implementation was meant to be the product was decided by deploying this one, and nobody
  wrote that decision down.
occurred_at: 2026-03-26
decided_at: 2026-03-26
merged_at: 2026-03-26
released_at: 2026-04-03
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors:
  - 2a804e67b5eb84bb52ddd4950fa41b0aa533959b
  - ff404c6030c6529b28dbc50ff7b80f1031eb7916
  - 0106964e92fa29d6a9cde46fa652839cb282b302
rewrite_resistant_locators:
  - "GitHub repository ntoledo319/hydra-worker created 2026-03-26T06:28:30Z"
  - "https://hydra-worker.toledonick98.workers.dev (live; HTTP 200 on 2026-09-04)"
claim_ids: [hw-c01, hw-c02, hw-c03, hw-c04, hw-c19, hw-c20, hw-c25, hw-c26]
source_ids: [src-git-hydra-worker, src-git-hydra-api, src-gh-metadata, src-live-probe, src-git-nohustle]
related_events: [hydra-worker-2026-04-03-readme-openapi-playground-and-pages]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: the Worker became the deployed HYDRA; first deploy date unrecorded (between 2026-03-26 and 2026-04-03); released_at is the first evidence of the live URL
secrets_reviewed: true
---

## Before-state and pressure

Seventy-five minutes earlier the same 24 utility routes had been committed as a single FastAPI file in
`hydra-toolkit-api`, and seventeen minutes earlier that repository had received a Render blueprint with auto-deploy
(hw-c02). The code was finished and unhosted. The pressure that produced a second implementation is unrecorded: the
Worker's later README gives the only rationale — "~50ms worldwide", "$0 on Workers free tier", "no cold starts" — and
it is marketing copy written eight days after the fact.

Further back, the thesis has a documented ancestor: NoHustle API (August 2025), a paid, keyed, ML-heavy Flask utility
pack that fought Render and a marketplace health checker for four days and went quiet (hw-c19). HYDRA shares no code
with it and inverts every choice it made (hw-c20, **inferred** as a lesson, plausible only).

## Intended beneficiaries

Any developer, anonymously: `cors()` on every route, no key, no sign-up (hw-c03). Secondarily the studio — the later
README signs the work "Built by Toledo Technologies LLC" — as a cheap, public, demonstrably live artifact.

## Goal, non-goal and definition of success

Goal `g-port-and-deploy-edge`: the 24 routes live on the free tier at a `workers.dev` URL. Non-goals, revealed by
absence: authentication, metering, rate limiting, storage, a custom domain, a real test. The starter test asserting
"Hello World!" was left in place and cannot pass (hw-c04); success evidently meant "the Worker answers", not "the
suite is green".

## Principles affected

Introduced: `p-edge-first` v1, `p-keyless-free` v1, `p-stateless-pure` v1, `p-zero-deps-beyond-hono` v1. All four are
visible in the root commit and none has been revised since.

## Alternatives and rejected paths

The alternative was the one just built: Python on Render. It was not deleted, archived or linked back to — it was
left as "the Python/FastAPI version" (see the next event) with its auto-deploy blueprint pointing at a host that never
served it. Also rejected, by contrast with NoHustle: keys, tiers, a database, heavy libraries, a source-available
licence.

## Decision and rationale

Unrecorded. The sequence of commits is the decision. The one contemporaneous acknowledgement of parentage is the
banner's `docs` field, which still sends callers to the Python repository (hw-c21).

## Implementation and evidence

Root commit `2a804e67…`: `src/index.js` (414 lines, 26 routes), `wrangler.jsonc` (the generated template with
compatibility date 2025-09-27 and every binding commented out, hw-c25), `package.json` 0.0.0 with `hono` as the only
runtime dependency, the template test, prettier/editorconfig, a 2,788-line lockfile. Identifier overlap with
`main.py` 0.82; the same stop-word list and "Acme Corp" literal (hw-c02).

## Expected versus observed outcome

Expected: a live edge API. Observed: live by 2026-04-03 at the latest and still answering 200 on 2026-09-04 (hw-c08).
The exact first-deploy date is unknown; the Cloudflare dashboard was not consulted.

## Tradeoffs, debt and consequences

The port was trivial because the source was one pure file — and the same fact made the Python copy expendable. The
banner's hard-coded `endpoints: 20` and `docs` link, the template test, the template compatibility date and the
absent licence file are debts created here and still present on 2026-09-04.

## Related events

`hydra-worker-2026-04-03-readme-openapi-playground-and-pages`; in the Python sibling's history,
`hydra-api-2026-03-26-render-blueprint-and-worker-port`.

## Unresolved questions

Why two implementations in one night; whether Python was the draft language with the edge always the target; when
`wrangler deploy` first ran.
