---
id: hydra-worker-2026-09-01-snapshot-commit-license-and-manifest
title: An agent-authored "snapshot" commit captures the consolidation, adds the MIT LICENSE file and the manifest — and stays unpushed
kind: licence
scope: [project, LICENSE, .toledo.yaml, README.md, docs/SOURCE-OF-TRUTH.md]
paths: [LICENSE, .toledo.yaml, README.md, docs/SOURCE-OF-TRUTH.md]
significance: medium
summary: >-
  At 00:02 EDT on 2026-09-01 a commit by "AI Assistant" titled "chore: snapshot current progress" added the LICENSE file
  the README had promised since April, committed the .toledo.yaml manifest (now saying active, cloudflare-workers, live
  URL) and captured the July consolidation edits. It is the repository's first commit in five months and has not been
  pushed; GitHub still shows the 2026-04-03 tip.
occurred_at: 2026-09-01
decided_at: null
merged_at: 2026-09-01
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors:
  - 57154c55564897f96eebf558b14f51c24c0a80eb
  - 6808ec82597245fd620b15a45f15483b67699d78
rewrite_resistant_locators:
  - "git ls-remote origin (2026-09-04): refs/heads/master 6808ec82597245fd620b15a45f15483b67699d78"
claim_ids: [hw-c16, hw-c18, hw-c13, hw-c14]
source_ids: [src-git-hydra-worker, src-gh-metadata, src-worktree-2026-09-04, src-tc-root-reports-2026-07]
related_events: [hydra-worker-2026-07-25-source-of-truth-consolidation, hydra-worker-2026-08-06-audits-park-vs-kill, hydra-worker-2026-09-02-credential-purge-untouched]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: local master one commit ahead of origin; LICENSE and boundary exist locally only; the original macOS path is now in a committed file
secrets_reviewed: true
---

## Before-state and pressure

Three untracked or modified files had sat in the working tree since 2026-07-25 (the 2026-08-03 registry and
2026-08-06 dossier both list them); the value audit of 2026-07-20 had flagged "MIT claimed with no LICENSE file"
(hw-c13). The pressure was housekeeping, apparently by an owner-side agent sweeping dirty trees the night before the
credential purge began.

## Intended beneficiaries

Future readers of the repository, who get a licence file and a boundary document; the owner's tooling, which gets a
committed manifest.

## Goal, non-goal and definition of success

Goal `g-licence-file` (proposed 2026-07-20) is achieved in the tree. Goal `g-one-canonical-hydra` gains its commit.
Neither is visible on GitHub until a push, which nobody has decided to make.

## Principles affected

`p-licence-mit` v2 supersedes v1: MIT with a file instead of MIT by badge. `p-single-source-of-truth` v1 and
`p-explicit-deploy-decision` v1 enter Git.

## Alternatives and rejected paths

Also fixing the counts, the banner link or the template test in the same sweep — not done. Pushing — not done. Leaving
the manifest untracked (the registry's hygiene note) — not done: `.toledo.yaml`, with the original macOS path, was
committed (hw-c18).

## Decision and rationale

Recorded only as "chore: snapshot current progress". The author identity is a placeholder used by the owner's agent
tooling; the human instruction behind it is not on disk.

## Implementation and evidence

Commit `57154c55…` (LICENSE +21, `.toledo.yaml` +14, README +6, `docs/SOURCE-OF-TRUTH.md` +15). `git ls-remote` on
2026-09-04: origin/master `6808ec82…` (hw-c16).

## Expected versus observed outcome

Expected: a tidy tree. Observed: a tidy tree and a divergence from the remote that every later tool notices ("1
unpushed commit").

## Tradeoffs, debt and consequences

The public repository still lacks a licence file and the boundary note; the local one now carries a home-directory
path in a committed file. Pushing is a one-command owner decision; so is amending the manifest first.

## Related events

`hydra-worker-2026-07-25-source-of-truth-consolidation`; `hydra-worker-2026-08-06-audits-park-vs-kill`;
`hydra-worker-2026-09-02-credential-purge-untouched`.

## Unresolved questions

Who directed the snapshot; whether the owner wants the manifest's path field committed before pushing.
