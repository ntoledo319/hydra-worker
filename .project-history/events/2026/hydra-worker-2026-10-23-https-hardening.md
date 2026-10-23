---
id: hydra-worker-2026-10-23-https-hardening
title: Require HTTPS and establish real Worker regression coverage
kind: security
scope: [worker]
paths: [src/index.js, test/index.spec.js]
significance: medium
summary: Redirect plaintext requests before utility processing and set API security headers. Replace the starter test with actual Worker route and transport checks.
occurred_at: 2026-10-23
decided_at: 2026-10-23
merged_at: null
released_at: 2026-10-23
recorded_at: 2026-10-23
last_verified_at: 2026-10-23
backfilled: false
anchors: []
rewrite_resistant_locators: [test/index.spec.js]
claim_ids: [hw-c27]
source_ids: [src-security-verification-2026-10-23]
related_events: [hydra-worker-2026-08-06-audits-park-vs-kill]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: Nine local Worker tests and four live checks passed; Worker version 8e7b8ebe-f182-4066-8170-7599e677d13b active.
secrets_reviewed: true
---

## Before-state and pressure

The website security audit observed plaintext HTTP returning the API directly. The owner requested hardening of all audited sites except AVENTZ.

## Intended beneficiaries

API callers sending utility inputs and developers maintaining transport behavior.

## Goal, non-goal and definition of success

HTTP requests receive a method-preserving HTTPS redirect before processing; HTTPS receives HSTS and safe JSON API headers. Preserve keyless access and cross-origin clients. Billing, route count cleanup, and GitHub Pages redesign are outside this security change.

## Principles affected

The existing stateless and keyless contract is preserved. Goal g-real-test is achieved by actual banner and utility route assertions.

## Alternatives and rejected paths

Do not disable CORS: the public playground and external callers rely on it. Do not deploy the unrelated historical Git changes just to release the Worker.

## Decision and rationale

Use an early Hono middleware for HTTP 308 redirects, six-month HSTS on HTTPS, nosniff, no-referrer, frame denial, and a restrictive JSON API CSP. Path and query are preserved.

## Implementation and evidence

src/index.js and test/index.spec.js. npm test -- --run passes nine tests in the Cloudflare Worker runtime. Wrangler dry-run validates bundling before release.

## Expected versus observed outcome

The tested artifact redirects HTTP including malformed POST bodies without parsing them. HTTPS banner, health, validation, preflight, cross-origin utility response, and not-found headers pass.

## Tradeoffs, debt and consequences

Local development should use wrangler dev --local-protocol https. Initial plaintext requests cannot be made confidential retroactively; clients should use HTTPS directly.

## Related events

The August audit identified the starter test as unusable. This change closes that specific coverage gap, not all utility coverage.

## Unresolved questions

Production activated with wrangler deploy; HTTP308, HTTPS banner200, health200 and cross-origin utility200 verified. Prior rollback version is 38399e0f-4bf7-4646-9862-ee605c199c29. History metadata was reconciled to the registry-confirmed moved mirror path and current reachable commit count; original dated audit facts remain unchanged. Other utility routes retain existing test coverage limits.
