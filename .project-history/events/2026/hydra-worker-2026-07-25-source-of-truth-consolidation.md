---
id: hydra-worker-2026-07-25-source-of-truth-consolidation
title: The Worker is declared the single source of truth; the static mirror is archived byte-identically; deployment becomes an explicit decision
kind: consolidation
scope: [project, docs/index.html, docs/SOURCE-OF-TRUTH.md, README.md]
paths: [docs/SOURCE-OF-TRUTH.md, docs/index.html, README.md]
significance: high
summary: >-
  After a week in which one owner report listed HYDRA as live, another said it was not, and a synergy report called the
  Worker/site pair the "easiest duplicate", a written boundary made this repository the owner of the code, the OpenAPI
  description and the editable playground, archived hydra-site as a historical baseline, and ruled that local changes
  never authorise a deployment. It was enacted in the working tree and the registries on 2026-07-25 and committed only
  on 2026-09-01.
occurred_at: 2026-07-25
decided_at: 2026-07-25
merged_at: 2026-09-01
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors:
  - 57154c55564897f96eebf558b14f51c24c0a80eb
  - e961c9d60348d3f767ea782ee595b781977458ab
rewrite_resistant_locators:
  - "docs/SOURCE-OF-TRUTH.md ('Effective 2026-07-25')"
  - "toledo-command/workspace/project-overrides.json (active/hydra-worker canonical; archive/duplicates/hydra-site retired-mirror)"
  - "toledo-command/registry/REPOS.md ('archived 2026-07-25')"
claim_ids: [hw-c14, hw-c13, hw-c11, hw-c15, hw-c04]
source_ids: [src-git-hydra-worker, src-tc-workspace-registry, src-tc-synergy-report-2026-07-24, src-tc-root-reports-2026-07, src-tc-registry-hydra]
related_events: [hydra-worker-2026-05-28-hydra-site-static-mirror, hydra-worker-2026-09-01-snapshot-commit-license-and-manifest]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: boundary enacted locally and in registries; committed 2026-09-01; not pushed; the "normal Worker tests" it requires do not exist
secrets_reviewed: true
---

## Before-state and pressure

Two repositories carried the same HTML; the owner's trackers called the copy the site and the engine backburner; the
2026-07-20 ship queue scheduled a Pages deploy of the copy and a LICENSE for the engine; the 2026-07-22 research note
concluded HYDRA was not live (hw-c13). On 2026-07-24 a generated synergy report named the pair the "easiest duplicate"
and recommended "HYDRA Site → Worker docs or generated mirror … consolidate" (hw-c14).

## Intended beneficiaries

Agents and the owner operating the portfolio, who need one answer to "where is HYDRA edited and deployed from"; and,
indirectly, users, who would otherwise see two drifting copies of the playground.

## Goal, non-goal and definition of success

Goal `g-one-canonical-hydra`: one owner of the surface, the duplicate archived byte-identically, registries updated.
Achieved on 2026-07-25 in every place but Git. Non-goal, stated: splicing histories or deleting the archived remote.

## Principles affected

Introduced: `p-single-source-of-truth` v1 and `p-explicit-deploy-decision` v1 ("new HYDRA surface work belongs here
and requires the normal Worker tests and an explicit deployment decision"). The second is challenged by the fact the
boundary document does not mention: the only Worker test is the starter template and cannot pass (hw-c04).

## Alternatives and rejected paths

The synergy report's other option — make hydra-site "a generated deployment mirror after tracing hosting" — was
rejected in favour of retiring it. Deploying the copy to Cloudflare Pages (the ship queue's plan) was dropped. The
Pages delivery of `docs/` from this repository was left as it was, still undocumented.

## Decision and rationale

Stated in `docs/SOURCE-OF-TRUTH.md`: the Worker "owns the Worker code, OpenAPI description, operator documentation,
and editable docs/index.html surface"; the archived file "is a historical baseline, not a mirror that must follow
future edits". The registry adds the operational rule: "Local source changes do not authorize a Cloudflare deployment."

## Implementation and evidence

The README note and `docs/SOURCE-OF-TRUTH.md` (uncommitted from 2026-07-25 to 2026-09-01; the 2026-08-03 registry and
2026-08-06 dossier both list them as untracked, hw-c15); `hydra-site` moved to `archive/duplicates/`; overrides and
`ROOT-LAYOUT.md` updated; sha256 recorded in the boundary document and re-verified on 2026-09-04 (hw-c11). Committed in
`57154c55…` on 2026-09-01; not pushed.

## Expected versus observed outcome

Expected: no more ambiguity about which repository is HYDRA. Observed: none since — the August audits, the workspace
registry and this history all treat the Worker as canonical. The boundary is still invisible on GitHub.

## Tradeoffs, debt and consequences

The rule that deployment needs "the normal Worker tests" points at a test that does not exist; the `.toledo.yaml` that
was written alongside carried the original macOS path into the tree (hw-c18); the family's counts and links were not
touched by the consolidation and remain wrong.

## Related events

`hydra-worker-2026-05-28-hydra-site-static-mirror`; `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest`.

## Unresolved questions

Who wrote the boundary (owner or agent); why it waited five weeks for a commit and is still waiting for a push.
