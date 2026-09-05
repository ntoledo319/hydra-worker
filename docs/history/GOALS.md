# Goals — every goal, its lifecycle and what "success" meant

_Versioned lifecycle records live in `.project-history/doctrine/goals.yml`. Status vocabulary: proposed → active → narrowed / expanded / blocked → achieved / abandoned / superseded. Dates are decision or observation dates, not commit dates, unless stated._

## `g-port-and-deploy-edge` — re-express the 24 routes as a Cloudflare Worker and put them live on the free tier

- **Proposed / activated:** 2026-03-26 02:28 EDT, revealed by the root commit (`hw-c01`, `hw-c02`).
- **Definition of success:** a `workers.dev` URL answering every route.
- **Status: achieved** by 2026-04-03 at the latest — the README publishes the live URL — and still met on 2026-09-04 (`hw-c05`, `hw-c08`). The actual first deploy date is unrecorded (the Cloudflare dashboard was not consulted).
- **Consequence:** the Python twin's own deployment goal was abandoned by outcome the same night; the Worker became HYDRA by being the one that ran.

## `g-document-the-surface` — a README with every endpoint, an OpenAPI document and an interactive playground

- **Proposed / achieved:** 2026-04-03 (`hw-c05`, `hw-c06`).
- **Definition of success:** a reader can find and try every endpoint without reading the source.
- **Met as artifacts, undermined by drift:** the README says 22 and lists 24; the spec says "20+" and lists 26; the playground wires 17; the live banner says 20 and links the wrong repository (`hw-c09`, `hw-c21`). GitHub Pages serves the playground by a path no one documented (`hw-c07`).
- **Successor goal:** `g-reconcile-counts-and-links`, below.

## `g-rapidapi-discovery` — be discoverable on RapidAPI, possibly as a freemium tier

- **Proposed:** 2026-04-03 ("RapidAPI: Listed for marketplace discovery", README) and 2026-06-23 ("a freemium RapidAPI candidate", master portfolio) (`hw-c05`, `hw-c12`).
- **Definition of success (supplied by the marketing documents):** a published listing with at least a free tier and a decided price.
- **Status: blocked** since 2026-06-17 on gate G1, "no price set"; business-ops still lists "list hydra-worker on RapidAPI" as a next action on 2026-06-22 (`hw-c22`). Whether a listing ever existed is unknown (`hw-c23`, `hydra-worker-x6`).

## `g-revenue-classification` — be a revenue asset, by a freemium tier or as a sellable Worker template

- **Proposed:** 2026-05-05 by the migration tooling's manifest; committed as `type: revenue` on 2026-09-01 (`hw-c10`, `hw-c16`).
- **Definition of success:** any paid usage, a listed price, or a template sale.
- **Status: blocked.** No auth, metering or billing exists; the asset kit prices it "like a template, not a product" with "no canonical price"; the dossier calls the label "aspirational, not real revenue" (`hw-c12`, `hw-c15`; `hydra-worker-x4`).
- **Alternative named by the documents:** drop the label and designate HYDRA a lead/backlink asset for another product. Not chosen either.

## `g-one-canonical-hydra` — one owner of the surface; the duplicate archived byte-identically

- **Proposed:** 2026-07-24 by the synergy report ("consolidate"); **achieved:** 2026-07-25 by the boundary document, the archive move and the registry updates (`hw-c14`, `hw-c11`).
- **Definition of success:** a written boundary, the mirror archived, registries updated.
- **Caveat:** enacted in the working tree and the owner's registries; committed only on 2026-09-01; not pushed, so the public repository does not yet carry the boundary (`hw-c16`).

## `g-licence-file` — add the LICENSE file the README's MIT badge implies

- **Proposed:** 2026-07-20 by the value audit ("MIT claimed with no LICENSE file") and the ship queue's day-five plan (`hw-c13`).
- **Achieved:** 2026-09-01, in the local snapshot commit (`hw-c16`). Not on GitHub until that commit is pushed.

## `g-reconcile-counts-and-links` — one endpoint number everywhere; a banner that points at HYDRA's own documentation

- **Proposed:** 2026-06-26 by the launched-products brief ("Confirm HYDRA endpoint count and docs URL"), restated 2026-08-03 by the registry and 2026-08-06 by the dossier (`hw-c09`, `hw-c15`).
- **Status: proposed** (review by 2026-12-31). A fifteen-minute change to `src/index.js`, `README.md`, `openapi.json` and `docs/index.html` that no one has made.

## `g-real-test` — replace or delete the starter-template test

- **Proposed:** 2026-08-03 by the registry ("delete or update the broken template test") (`hw-c04`).
- **Status: proposed** (review by 2026-12-31). Its importance rose on 2026-07-25 when deployment was made conditional on "the normal Worker tests".

## Goals that were never proposed

Worth recording because their absence is a choice: a custom domain (every audit lists its absence as a caveat; no document plans one); rate limiting or abuse protection for a public no-key API (the dossier judges the risk acceptable); a release or version scheme (`0.0.0` / `1.0.0`, no tags); serving the playground from the Worker itself; archiving or linking back from the Python twin; revisiting the template compatibility date (`hw-c25`).

## How the definition of success moved

| When | Success meant | Who said so |
|---|---|---|
| 2026-03-26 | the Worker answers | the code (`hw-c01`, `hw-c03`) |
| 2026-04-03 | a live URL, a README, a spec, a playground, "listed" | the README (`hw-c05`) |
| 2026-05-05 | a revenue asset | the manifest (`hw-c10`) |
| 2026-06-17 | a decided price, or a declared non-revenue role | the marketing gate (`hw-c12`) |
| 2026-06-22 | a RapidAPI freemium listing; the dead twin archived | business-ops (`hw-c22`) |
| 2026-07-25 | one canonical repository; deployment as an explicit, tested decision | the boundary document (`hw-c14`) |
| 2026-08-03 | reconciled counts, a correct banner link, a real test, "otherwise leave as-is" | the registry (`hw-c15`) |
| 2026-08-06 | metering or no label (PARK); or delete (KILL) | the two audits (`hw-c15`) |

The Worker met the first two by its own account, the seventh on paper, and none of the rest.
