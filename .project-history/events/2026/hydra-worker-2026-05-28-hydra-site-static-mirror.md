---
id: hydra-worker-2026-05-28-hydra-site-static-mirror
title: A byte-identical copy of the playground becomes a separate "hydra-site" repository that the owner's trackers mistake for the product
kind: experiment
scope: [project, docs/index.html]
paths: [docs/index.html]
significance: medium
summary: >-
  On 2026-05-28 a private repository received one commit — "safe backup to remote" — containing a copy of docs/index.html
  identical to the byte. For two months the owner's trackers listed it under active/ as "Web presence for the Hydra
  ecosystem" (purpose unclear), planned a Cloudflare Pages deploy for it, and one research note concluded from it that
  HYDRA was not live. It was never deployed; it was archived as a mirror on 2026-07-25.
occurred_at: 2026-05-28
decided_at: 2026-05-28
merged_at: null
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors:
  - e961c9d60348d3f767ea782ee595b781977458ab
rewrite_resistant_locators:
  - "sha256 dfbcface41ac83c2ecb6643df1874c46550e87153cf3459df46cc3f19ed26678 (public/index.html == docs/index.html)"
  - "GitHub repository ntoledo319/hydra-site created 2026-05-28T05:01:28Z (private)"
claim_ids: [hw-c11, hw-c13, hw-c07]
source_ids: [src-git-hydra-site, src-gh-metadata, src-icloud-ttllc-status, src-tc-root-reports-2026-07]
related_events: [hydra-worker-2026-04-03-readme-openapi-playground-and-pages, hydra-worker-2026-07-25-source-of-truth-consolidation]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: never deployed; archived byte-identical under archive/duplicates on 2026-07-25
secrets_reviewed: true
---

## Before-state and pressure

The playground already lived in this repository's `docs/` and was already served by GitHub Pages (hw-c07). The
pressure for a separate copy is unrecorded; the commit message says "safe backup", and the 2026-05-27 decision log
folds "hydra-site" into the studio's asset portfolio the day before the repository exists.

## Intended beneficiaries

Unclear by the owner's own account: the assets tracker says "purpose unclear — needs definition".

## Goal, non-goal and definition of success

A goal was proposed for it by the July ship queue — "hydra-site — free docs — CF Pages — 20m — `wrangler pages deploy
public`" — and never executed. No goal of this repository was advanced.

## Principles affected

None at the time. In retrospect the event is the case that produced `p-single-source-of-truth`.

## Alternatives and rejected paths

Pointing the trackers at this repository's `docs/` (already live) instead of creating a copy — not taken until
2026-07-25.

## Decision and rationale

A backup, made and then misread. The 2026-07-22 research note's "hydra is NOT actually live (static backup repo, no
deploy pipeline)" is the clearest consequence: the analyst opened the copy and the May manifest rather than the Worker
(hw-c13; contradiction `hydra-worker-x2`).

## Implementation and evidence

`hydra-site` commit `e961c9d6…` (`.gitignore`, `public/index.html`); sha256 equality re-verified on 2026-09-04; the
2026-05-27 tracker and product catalogue; the ship queue of 2026-07-20.

## Expected versus observed outcome

Expected (by the trackers): a web presence to be deployed. Observed: no deployment; on 2026-07-25 it was declared a
retired mirror and moved to `archive/duplicates` (next event).

## Tradeoffs, debt and consequences

Two months of documents that described the wrong repository as the HYDRA site, one of which concluded the product was
dead. The mirror still exists, private, one commit, correctly filed.

## Related events

`hydra-worker-2026-04-03-readme-openapi-playground-and-pages`; `hydra-worker-2026-07-25-source-of-truth-consolidation`.

## Unresolved questions

Why a copy rather than a link; whether a Pages deploy was ever attempted from it.
