---
id: hydra-worker-2026-10-24-pages-browser-policy
title: Add minimal browser policy to the Pages playground
kind: security
scope: [playground]
paths: [docs/index.html]
significance: medium
summary: Add object and base restrictions plus a referrer policy in HTML metadata while preserving the playground scripts, inline styles and API requests.
occurred_at: 2026-10-24
decided_at: 2026-10-24
merged_at: null
released_at: null
recorded_at: 2026-10-24
last_verified_at: 2026-10-24
backfilled: false
anchors: []
rewrite_resistant_locators: [docs/index.html]
claim_ids: [hw-c28]
source_ids: [src-pages-policy-2026-10-24]
related_events: [hydra-worker-2026-04-03-readme-openapi-playground-and-pages]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: Two metadata elements are the only playground changes; source validation passes. Publication and response-header findings remain separate checks.
secrets_reviewed: true
---

## Before-state and pressure

The owner requested the remaining website security fixes. GitHub Pages does not expose arbitrary response-header settings; the existing playground had no document CSP or referrer metadata.

## Intended beneficiaries

People using the public API playground and maintainers preserving its free hosting.

## Goal, non-goal and definition of success

Prevent plugin/object execution and document base-URL replacement without changing the working playground. Metadata cannot enforce frame-ancestors, HSTS or nosniff; this source improvement does not claim those response-header gaps are closed.

## Principles affected

The single canonical source and free keyless API contract are preserved. Principle p-pages-minimal-browser-policy records the narrow browser policy and its hosting limits.

## Alternatives and rejected paths

Do not use a blanket default-src policy that would block existing inline scripts/styles or API calls. Do not add ineffective frame-ancestors metadata or migrate hosting to claim full header coverage.

## Decision and rationale

Place object-src none and base-uri none CSP immediately after the character encoding, followed by strict-origin-when-cross-origin referrer metadata. No script, style, connect, image or frame restriction is introduced.

## Implementation and evidence

The exact prior docs/index.html is preserved after removing the two added metadata lines. HTML parsing verifies one early CSP and referrer declaration, no base/object/embed elements, and unchanged script contents. History render and validation are required before committing.

## Expected versus observed outcome

Source checks verify only those two policy declarations changed. The separate website hardening evidence owns live publication status; a push or successful local validation alone is not proof of Pages activation.

## Tradeoffs, debt and consequences

This is intentionally a minimal document policy. GitHub Pages response-header constraints remain; HTML metadata cannot replace server-level frame protection.

## Related events

The April 2026 playground remains the same hand-written document and delivery path.

## Unresolved questions

A provider build failure can prevent a pushed Pages update from becoming live. Keep that limitation explicit until a public fetch contains these exact metadata declarations.
