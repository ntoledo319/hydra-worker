---
id: hydra-worker-2026-09-02-credential-purge-untouched
title: The September 2026 credential purge classifies the history as clean and leaves it unrewritten and unpushed
kind: security
scope: [project]
paths: []
significance: medium
summary: >-
  The workspace-wide purge scanned this history, matched only two public-configuration patterns, and neither rewrote nor
  pushed it; GitHub secret scanning and push protection are on. Recorded because it fixes the reliability of every
  anchor cited here and confirms that the one divergence from the remote is the owner's own unpushed snapshot.
occurred_at: 2026-09-02
decided_at: 2026-09-02
merged_at: null
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors:
  - 57154c55564897f96eebf558b14f51c24c0a80eb
  - 6808ec82597245fd620b15a45f15483b67699d78
rewrite_resistant_locators:
  - "/home/nick/Development/SECURITY_CLEANUP_REPORT.md (2026-09-02)"
  - "/home/nick/Development/.unlazy/credential-cleanup/verification/history-pattern-final-classification.json"
claim_ids: [hw-c17, hw-c16, hw-c24]
source_ids: [src-purge-2026-09, src-gh-metadata, src-worktree-2026-09-04, src-leaf-brief-2026-09-04]
related_events: [hydra-worker-2026-09-01-snapshot-commit-license-and-manifest, hydra-worker-2026-09-04-history-system-bootstrap]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: history unchanged; anchors remain valid; remote untouched
secrets_reviewed: true
---

## Before-state and pressure

A workspace-wide credential exposure review rewrote eighteen owned remotes and pushed security commits to twenty-two
others. Any history that was rewritten loses its commit anchors; this one had to be checked either way.

## Intended beneficiaries

Future readers of this history, whose citations depend on the anchors; the owner, whose exposure the purge reduced.

## Goal, non-goal and definition of success

Goal: know whether the reachable graph is the original one. Success: the classification records and the remote ref
agree that nothing changed.

## Principles affected

None of the project's own. The history system's rule — cite full SHAs while reachable and record rewrites as events
rather than silently rebinding — is exercised here for the first time.

## Alternatives and rejected paths

Not applicable; the purge's routing decisions were made outside this project. The clean working tree meant no security
commit was needed here, unlike the NoHustle sibling.

## Decision and rationale

The purge classified both pattern matches in this history as RETAINED_PUBLIC_CLASS ("public configuration, identifier,
endpoint, environment reference, or placeholder with no embedded credential"), so no rewrite was warranted (hw-c17).

## Implementation and evidence

No commit here. Evidence is external: the classification JSON (values omitted), the cleanup report, GitHub's
security settings, and `git ls-remote` on 2026-09-04 showing origin/master at the April tip. The lead's first dispatch
brief for this reconstruction had cross-wired dirty baselines between the two HYDRA repositories; the measured state
(clean) was used (hw-c24).

## Expected versus observed outcome

Expected: no change. Observed: no change.

## Tradeoffs, debt and consequences

None for the code. For the record: every SHA in this history resolves, and the only local/remote divergence is the
snapshot commit the owner has not pushed.

## Related events

`hydra-worker-2026-09-01-snapshot-commit-license-and-manifest`; `hydra-worker-2026-09-04-history-system-bootstrap`.

## Unresolved questions

None.
