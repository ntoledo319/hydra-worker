---
id: hydra-worker-2026-06-17-price-gate-and-asset-kit
title: June 2026 frames HYDRA three ways — template for sale, freemium candidate, gate-failed for "no price" — and changes nothing
kind: governance
scope: [project]
paths: []
significance: medium
summary: >-
  Within three weeks the asset-sale kit priced HYDRA "like a template, not a product", the business reconciliation called
  it "PILOT-READY" for a RapidAPI freemium tier, the marketing-machine gate failed it on G1 "no price set" and asked the
  owner to set a tier or designate it a backlink asset, and the master portfolio called it "a clean edge-deploy
  demonstration more than a business". The code, the price and the listing stayed exactly as they were.
occurred_at: 2026-06-17
decided_at: null
merged_at: null
released_at: null
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors:
  - 73e342abef33abc9161838c868d5f3939d92e721
rewrite_resistant_locators:
  - "marketing-arm/KILL-LIST.md line 12 (2026-06-17)"
  - "business-ops/assets-for-sale/LISTING-COPY/hydra.md (2026-06-22)"
  - "toledo-command/MASTER-PORTFOLIO.md section HYDRA (2026-06-23)"
claim_ids: [hw-c12, hw-c22, hw-c23, hw-c03]
source_ids: [src-business-ops, src-marketing-arm, src-tc-master-portfolio, src-launched-products-brief]
related_events: [hydra-worker-2026-05-05-backburner-then-active-reclassification, hydra-worker-2026-08-06-audits-park-vs-kill]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: framing recorded in four documents; no price, listing, metering or label change followed
secrets_reviewed: true
---

## Before-state and pressure

A live, free, keyless API carrying a `revenue` label. The owner's June strategy work asked every product the same
question — can the marketing machine drive money to it? — and HYDRA had no price to drive money to.

## Intended beneficiaries

The owner deciding where to spend attention; hypothetically, buyers of a Worker template or subscribers to a freemium
tier that does not exist.

## Goal, non-goal and definition of success

Goals `g-rapidapi-discovery` and `g-revenue-classification` both move to *blocked* here, on the same fact: no price.
The marketing documents supply the definition of success HYDRA never had — a decided price or a declared non-revenue
role — and the asset kit supplies a floor ("low hundreds", "template, not a product").

## Principles affected

`p-keyless-free` v1 is challenged by every document and defended by none; the June papers disagree only about how to
describe the gap between the label and the code (contradiction `hydra-worker-x4`).

## Alternatives and rejected paths

Named explicitly and chosen never: set a freemium tier (then HYDRA becomes an "A-candidate" for the machine);
designate it a lead/backlink asset for another product; sell it as a deployable template; wrap it on RapidAPI with
"proxy-secret enforcement for paid tier" (business-ops), which would require code that does not exist.

## Decision and rationale

No decision. The marketing red-team's note is the honest summary: "set a price is a business-model decision, not a
one-click fix."

## Implementation and evidence

`KILL-LIST.md` and `portfolio.yml` (`price: false`, `checkout_live: false`, `usable: true`); the asset kit's listing
copy, inventory, valuation rationale and sale queue (rank 11, "(unset)"); the reconciliation registries; the master
portfolio commit `73e342ab…`; the launched-products brief allocating HYDRA 10-15% and asking to "Confirm HYDRA endpoint
count and docs URL" (hw-c12, hw-c22).

## Expected versus observed outcome

Expected by each document: an owner action. Observed: none; the August audits found the same state.

## Tradeoffs, debt and consequences

The family's public story hardened into "free demonstration with an aspirational revenue tag", and the endpoint-count
problem (17+ in the asset kit, 20 in the registry, 22 in the README) spread into the business documents (hw-c09).

## Related events

`hydra-worker-2026-05-05-backburner-then-active-reclassification`; `hydra-worker-2026-08-06-audits-park-vs-kill`.

## Unresolved questions

Which of the named options the owner prefers; whether the RapidAPI listing the README claims ever existed to be priced.
