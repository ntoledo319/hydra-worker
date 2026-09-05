---
id: hydra-worker-2026-08-06-audits-park-vs-kill
title: Three August reviews measure the Worker — PARK by judgement, KILL by rule, "fix the counts" by the registry — and none is acted on
kind: governance
scope: [project]
paths: [README.md, openapi.json, src/index.js, test/index.spec.js]
significance: medium
summary: >-
  The 2026-08-03 registry note is the most precise measurement the repository has ever had (26 routes, 17-of-24
  playground, template test "would FAIL", Pages "effectively-accidental", banner docs link wrong) and names three cheap
  fixes. The 2026-08-06 dossier says PARK; the rule-based estate audit says KILL by a rule that also condemns the live
  product. The repository did not change.
occurred_at: 2026-08-06
decided_at: null
merged_at: null
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors: []
rewrite_resistant_locators:
  - "toledo-command/registry/assets/hydra.md (verified 2026-08-03)"
  - "toledo-command/audit-2026-08/assets/active-hydra-worker.md (2026-08-06)"
  - "toledo-command/estate-audit-2026-08/assets/active-hydra-worker.md (2026-08-06)"
claim_ids: [hw-c15, hw-c09, hw-c04, hw-c21, hw-c08]
source_ids: [src-tc-registry-hydra, src-tc-audit-2026-08, src-tc-estate-audit-2026-08, src-live-probe]
related_events: [hydra-worker-2026-06-17-price-gate-and-asset-kit, hydra-worker-2026-09-01-snapshot-commit-license-and-manifest]
amends: []
supersedes: []
reverses: []
amendments: []
status: open
confidence: confirmed
observed_outcome: verdicts recorded; counts, banner link and template test unchanged; no owner decision
secrets_reviewed: true
---

## Before-state and pressure

The consolidation was a week old and uncommitted. The owner ran a portfolio-wide audit in two forms — agent-written
dossiers per asset and a rule-generated estate audit — plus a registry refresh.

## Intended beneficiaries

The owner deciding where attention and money go; the audits exist to separate real from claimed.

## Goal, non-goal and definition of success

Two goals are proposed by the reviews and adopted by this history as `proposed`: `g-reconcile-counts-and-links` (one
number everywhere; a banner that points at HYDRA's own documentation) and `g-real-test` (a test of this product). The
dossier's single next action restates the June choice: wire metering or drop the revenue label.

## Principles affected

None revised. The registry names the live consequence of `p-curated-documentation`'s drift: "a caller following the
API's own metadata lands on the wrong repo" (hw-c21).

## Alternatives and rejected paths

PARK ("cheap to keep running, $0"), KILL ("trivial: under 500 logical lines and under 10 commits" — a rule under which
the live product and its shelved sibling are indistinguishable), "leave as-is" after cheap fixes (registry). All three
remain open (contradiction `hydra-worker-x7`). The registry's own measurement contains an error — it says
`openapi.json` has 25 paths and omits `/time/convert`; the committed file has 26 and includes it (hw-c09) — preserved
here because retrospective sources can be wrong in detail while right in substance.

## Decision and rationale

No decision was taken. That is the finding.

## Implementation and evidence

The three documents; probes on 2026-08-03, 2026-08-06 and 2026-09-04 confirming the Worker live throughout (hw-c08).

## Expected versus observed outcome

Expected by the reviewers: three fifteen-minute fixes. Observed: none; the 2026-09-01 snapshot committed the
consolidation files and a licence, and touched neither the counts, the banner nor the test.

## Tradeoffs, debt and consequences

The inheritance list is unchanged from June, now with a documented measurement behind each item.

## Related events

`hydra-worker-2026-06-17-price-gate-and-asset-kit`; `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest`.

## Unresolved questions

Which verdict the owner accepts; whether the cheap fixes will be made before or after the next deployment decision.
This capsule stays open until one is recorded.
