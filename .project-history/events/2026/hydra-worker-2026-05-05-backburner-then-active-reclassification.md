---
id: hydra-worker-2026-05-05-backburner-then-active-reclassification
title: The workspace migration files the live Worker under backburner/ as "revenue, platform none, url null"; it is promoted to active/ within six weeks
kind: governance
scope: [project, .toledo.yaml]
paths: [.toledo.yaml]
significance: medium
summary: >-
  On 2026-05-05 tooling moved the checkout out of the macOS CascadeProjects directory into backburner/ and generated a
  manifest that called a live edge API "platform none, url null" and a revenue asset. The owner's May trackers repeated
  the mistake; by 2026-06-16 the registry listed active/hydra-worker. The manifest reached the tree, corrected, only in
  the 2026-09-01 snapshot.
occurred_at: 2026-05-05
decided_at: 2026-05-05
merged_at: null
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors: []
rewrite_resistant_locators:
  - "toledo-command/archive/_meta-inventory-2026-05/migration-log.txt lines 159-161, 177, 230"
  - "toledo-command/archive/_meta-inventory-2026-05/migration-plan.md lines 140-155"
claim_ids: [hw-c10, hw-c12, hw-c22]
source_ids: [src-tc-meta-inventory-2026-05, src-icloud-ttllc-status, src-tc-registry-hydra, src-business-ops]
related_events: [hydra-worker-2026-04-03-readme-openapi-playground-and-pages, hydra-worker-2026-05-28-hydra-site-static-mirror, hydra-worker-2026-06-17-price-gate-and-asset-kit]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: classified backburner then active; the "revenue" label persisted into the committed manifest; no code change
secrets_reviewed: true
---

## Before-state and pressure

Nothing had changed in the repository since 2026-04-03. The owner consolidated dozens of scattered checkouts into one
`Development/` layout with lifecycle folders, and every project received a generated manifest.

## Intended beneficiaries

The owner and the agents that operate the portfolio; the manifest exists so tooling can answer "what is this, is it
live, does it make money" without opening the code.

## Goal, non-goal and definition of success

Goal `g-revenue-classification` is introduced by the label `type: revenue`. Its definition of success — any paid usage
or a listed price — was never met. The migration's own record of the Worker (platform none, url null) was simply
wrong: the Worker was live.

## Principles affected

`p-keyless-free` v1 moves to *challenged*: the label asserts revenue while the code gives everything away.

## Alternatives and rejected paths

The manifest vocabulary offered other types; NoHustle got "personal", the two HYDRA repositories got "revenue". The
choice is recorded in the plan, not explained.

## Decision and rationale

A classification produced by tooling from an owner-approved plan. That the live engine landed in `backburner/` while
a one-file static copy landed in `active/` (see the next event) is the mis-filing that shaped every July document.

## Implementation and evidence

Migration log entries for `CascadeProjects/hydra-worker → backburner/hydra-worker`; the planned manifest; the
2026-05-27 tracker row (backburner, dirty); the registry of 2026-06-16 listing `active/hydra-worker` (hw-c10). The June
business reconciliation recorded the consequence: "ACTIVE-UNDOCUMENTED (.toledo.yaml says url=null while the worker is
live)" (hw-c22).

## Expected versus observed outcome

Expected: an orderly inventory. Observed: the inventory said the live product was not deployed; the correction
(status active, platform cloudflare-workers, the live URL) exists only in the 2026-09-01 snapshot commit, unpushed.

## Tradeoffs, debt and consequences

The `revenue` label is the seed of the price-gate argument of June (next event) and of every "aspirational" verdict in
August. The manifest also captured the original macOS path, later committed (hw-c18).

## Related events

`hydra-worker-2026-05-28-hydra-site-static-mirror`; `hydra-worker-2026-06-17-price-gate-and-asset-kit`.

## Unresolved questions

When exactly, and on whose decision, the Worker moved from `backburner/` to `active/`.
