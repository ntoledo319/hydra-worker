---
id: hydra-worker-2026-04-03-readme-openapi-playground-and-pages
title: The live URL is published with a hand-written README, OpenAPI document and playground — and GitHub Pages quietly serves it
kind: release
scope: [project, README.md, openapi.json, docs/index.html]
paths: [README.md, openapi.json, docs/index.html]
significance: high
summary: >-
  Eight days after the port, two commits gave the API its public face: a README with the live URL, "Free. No API key
  required.", an MIT badge with no licence file, an "All 22 Endpoints" table of 24 rows, and an "Also Available"
  section naming the Python version and a RapidAPI listing; then a hand-written openapi.json and an HTML playground.
  GitHub Pages built docs/ the same minute and has served it ever since, mentioned nowhere.
occurred_at: 2026-04-03
decided_at: 2026-04-03
merged_at: 2026-04-03
released_at: 2026-04-03
recorded_at: 2026-09-04
last_verified_at: 2026-09-04
backfilled: true
anchors:
  - 465f28476f262c580f8e9a10638851209cafe88c
  - 6808ec82597245fd620b15a45f15483b67699d78
rewrite_resistant_locators:
  - "GitHub Actions run 'pages build and deployment' 2026-04-03T08:01:27Z (the repository's only run)"
  - "https://ntoledo319.github.io/hydra-worker/ (HTTP 200 on 2026-09-04)"
claim_ids: [hw-c05, hw-c06, hw-c07, hw-c09, hw-c21, hw-c23]
source_ids: [src-git-hydra-worker, src-gh-metadata, src-live-probe]
related_events: [hydra-worker-2026-03-26-worker-port-and-first-deploy, hydra-worker-2026-05-28-hydra-site-static-mirror]
amends: []
supersedes: []
reverses: []
amendments: []
status: closed
confidence: confirmed
observed_outcome: README, spec and playground published; Pages live; counts and links drifted from the code and were never reconciled; the last push to GitHub
secrets_reviewed: true
---

## Before-state and pressure

A live Worker with no README, no spec and no way for a stranger to discover what it did. The Python sibling had had
generated Swagger and ReDoc for free; the port lost them.

## Intended beneficiaries

Developers arriving from GitHub or a marketplace: the README opens with curl examples, the playground lets them try
endpoints in the browser, the OpenAPI document lets tools import the surface.

## Goal, non-goal and definition of success

Goal `g-document-the-surface`: every endpoint findable and tryable without reading the source. Goal
`g-rapidapi-discovery` is stated here for the first time — "RapidAPI: Listed for marketplace discovery" — as a fact
that no later document confirms (hw-c23). Success was defined as the artifacts existing; no one counted the endpoints
in them.

## Principles affected

Introduced: `p-curated-documentation` v1 (hand-written spec and playground instead of generated docs) and
`p-licence-mit` v1 (claimed in a badge and a footer, no file). The first was weakened immediately by drift; the second
was flagged in July and replaced by a file in September.

## Alternatives and rejected paths

Generating the spec from the code (as FastAPI had) was not attempted; serving the playground from the Worker itself
(the `assets` binding is a commented-out line away) was not attempted; GitHub Pages happened instead — enabled from
`master:/docs`, built in the same minute as the commit, never mentioned in any commit, README line, wrangler setting
or later document until the 2026-08-03 registry called it "effectively-accidental" (hw-c07).

## Decision and rationale

Publish. The rationale is the README's marketing section; the counts (22 in the title, 24 in the table, "20+" in the
spec, 20 in the banner) show that the number was a slogan, not a measurement (hw-c09).

## Implementation and evidence

`465f2847…` (README, 106 lines); `6808ec82…` (`openapi.json` 257 lines with 26 paths, `docs/index.html` 176 lines
wiring 17 endpoints into its dropdown). GitHub `pushed_at` 2026-04-03T08:01:18Z — the last push the repository has
had (hw-c26).

## Expected versus observed outcome

Expected: a discoverable, documented free API. Observed: the documentation exists and is live in two places (Pages and
the repository); its numbers disagree with each other and with the code; the live banner still directs callers to the
Python repository (hw-c21); the RapidAPI claim is unverified.

## Tradeoffs, debt and consequences

Hand-written documentation drifts, and this one did on the day it was written. The Pages delivery path created a
"site" that later trackers treated as a separate product (see the hydra-site event). The "Also Available" line fixed
the family's framing — Worker as product, Python as variant — for every document that followed.

## Related events

`hydra-worker-2026-03-26-worker-port-and-first-deploy`; `hydra-worker-2026-05-28-hydra-site-static-mirror`.

## Unresolved questions

Was Pages enabled on purpose? Was a RapidAPI listing ever submitted? Why 22?
