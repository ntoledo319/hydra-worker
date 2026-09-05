---
id: hydra-worker-2026-09-04-history-system-bootstrap
title: Bootstrap of the project-history system (reconstruction and maintenance mechanism)
kind: bootstrap
scope: [project, docs/history, .project-history, scripts/project_history.mjs]
paths: [docs/history/**, .project-history/**, scripts/project_history.mjs, test/project_history_tests.mjs, AGENTS.md, .github/**, package.json]
significance: medium
summary: >-
  On 2026-09-04 the complete history of this repository was reconstructed from Git, the four related repositories,
  GitHub metadata, live probes and the owner's dated records, and a deterministic, dependency-free Node maintenance tool
  (assess/context/validate/render/audit/declaration) with node --test tests, an agent continuity contract, a PR template,
  a CI workflow and npm history:* scripts was installed. Everything before this capsule is backfilled: recorded_at is the
  reconstruction date.
occurred_at: 2026-09-04
decided_at: 2026-09-04
merged_at: null
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: false
anchors:
  - 57154c55564897f96eebf558b14f51c24c0a80eb
rewrite_resistant_locators:
  - ".project-history/state.yml (full_audit_anchor)"
claim_ids: [hw-c24, hw-c17, hw-c26]
source_ids: [src-git-hydra-worker, src-worktree-2026-09-04, src-leaf-brief-2026-09-04]
related_events: [hydra-worker-2026-09-02-credential-purge-untouched]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: validate, render (byte-stable), audit, assess, context and the node --test suite pass on the audit date
secrets_reviewed: true
---

## Before-state and pressure

A 112-line README, a boundary note, no changelog, no tests of the product, and no record of why the Worker exists,
why it won over its Python twin, why a static copy of it confused the owner's trackers for two months, or what the
August audits asked for. The pressure was an explicit owner request to reconstruct and permanently maintain the
history of four project families, of which this is one of three "API projects".

## Intended beneficiaries

Future humans and coding agents working here, who need orientation, goals, principles and prior decisions before
touching the code — and, given the explicit-deploy rule, before deploying — plus a low-friction way to leave a trace
afterwards.

## Goal, non-goal and definition of success

Goal: a complete, evidence-linked, unabridged history plus a living mechanism. Non-goals: changing runtime code,
adding dependencies, running the product's vitest suite, deploying, committing, pushing, contacting anyone, or
reproducing any secret. Success: the independent verifier passes; render is byte-stable; every cited SHA resolves;
claims carry status and confidence; the agent contract and PR template carry the three declarations.

## Principles affected

Introduces the history system's own rules (recorded in `policy.yml`): materiality tests, no naked skips, deferrals
that expire, backfilled records that never masquerade as contemporaneous, and no auto-authored ideological prose.

## Alternatives and rejected paths

A commit-by-commit changelog (rejected by the assignment); a shared cross-repository history (rejected — each
repository gets its own complete record, cross-citing the others by absolute path); a vitest-based test file (rejected
— `node --test` needs no install, and a `.test.mjs` name would have been swept into the product's failing vitest run);
a YAML dependency (rejected — a strict-subset parser is embedded, the same subset the Python siblings use).

## Decision and rationale

Install the record in the project's native language (Node ESM, no dependencies) with the layout fixed by the shared
contract, as a line-for-line port of the Python tool used by the two sibling histories so the three ledgers stay
interoperable.

## Implementation and evidence

`PROJECT_HISTORY.md`, `docs/history/*`, `.project-history/*`, `scripts/project_history.mjs`,
`test/project_history_tests.mjs`, `AGENTS.md`, `.github/PULL_REQUEST_TEMPLATE.md`,
`.github/workflows/project-history.yml`, `history:*` scripts in `package.json`. Anchored to HEAD `57154c55…`.

## Expected versus observed outcome

Expected: all commands exit 0 and the verifier passes. Observed: recorded in the reconstruction report delivered with
this work; re-verify with `node scripts/project_history.mjs validate`.

## Tradeoffs, debt and consequences

The CI workflow runs only once these files are pushed; until then it documents an intended mechanism. The history adds
files to a public repository; they contain no secrets and no personal data beyond the owner's already-public business
identity.

## Related events

`hydra-worker-2026-09-02-credential-purge-untouched`.

## Unresolved questions

Whether the owner will adopt the declaration discipline; if not, the gardener audit will still report drift monthly
once CI is active.
