# Ideology — the worldview this code reveals

_"Ideology" here means the project's governing assumptions, priorities, non-negotiables, theory of the problem, intended beneficiaries, definition of success, acceptable trade-offs and revealed non-goals. Nothing below is manufactured from motive; where the code or a dated document is the only witness, that is said._

## Theory of the problem

Developers spend small, repeated units of attention on utilities that are individually trivial and collectively tedious — hash this, slugify that, decode this JWT, give me five UUIDs. The remedy is not a library but a **public HTTP surface**: one URL, JSON in, JSON out, no account. The README states the promise in one line — "developer utility endpoints on the global edge. Free. No API key required." — and the code keeps it (`hw-c03`, `hw-c05`).

## Theory of change

Publish everything, charge nothing, require nothing, and let discovery do the rest: GitHub topics ("free", "developer-tools"), a marketplace listing, a playground. The only later elaboration — "intended top-of-funnel dev surface + a freemium RapidAPI candidate" (master portfolio, 2026-06-23) — was written by an agent about the Worker, not by the Worker's author, and the freemium half was never built (`hw-c12`).

## Intended beneficiaries over time

1. **2026-03-26:** anonymous developers (`cors()` on every route, no key) and the studio, as a demonstrably live artifact.
2. **2026-04-03:** GitHub and marketplace readers — curl examples, a playground, an OpenAPI document (`hw-c05`, `hw-c06`).
3. **2026-05 to 2026-08:** the owner and the agents operating the portfolio; the Worker exists in their records as a row to classify, price, verify and consolidate (`hw-c10`, `hw-c12`, `hw-c15`).

No external user is evidenced at any stage; the Cloudflare analytics that would show one were not in scope.

## Principles (versioned in `.project-history/doctrine/principles.yml`)

| Principle | Status | Revealed by |
|---|---|---|
| `p-edge-first` v1 — the global edge at zero cost; no origin server, no cold starts | active | `wrangler.jsonc`; README tech stack; the Render blueprint abandoned in the Python sibling |
| `p-keyless-free` v1 — no key, no billing, no rate limit, open CORS | **challenged** since 2026-05-05 by the `revenue` label and the June "set a price" gate; the code never changed | `app.use('*', cors())`; absence of auth or metering |
| `p-stateless-pure` v1 — every handler a pure function; no bindings, no storage, no outbound calls | active | `src/index.js`; every binding in `wrangler.jsonc` commented out (`hw-c25`) |
| `p-zero-deps-beyond-hono` v1 — one runtime dependency; Web Crypto and hand-rolled helpers (including MD5) for the rest | active | `package.json`; README "Zero dependencies beyond Hono" |
| `p-curated-documentation` v1 — a hand-written README table, `openapi.json` and playground rather than generated docs | **weakened** — drifted from the code on the day it was written and never reconciled | no generator in the tree; counts 22/20+/20 against 24 (`hw-c09`) |
| `p-licence-mit` v1 — MIT by badge and footer, no file | superseded 2026-09-01 | README at `465f2847…` |
| `p-licence-mit` v2 — MIT with a committed LICENSE file (local, unpushed) | active | `LICENSE` at `57154c55…` (`hw-c16`) |
| `p-single-source-of-truth` v1 — this repository owns code, spec and playground; mirrors are archived, never synced | active | `docs/SOURCE-OF-TRUTH.md`; workspace overrides (`hw-c14`) |
| `p-explicit-deploy-decision` v1 — local changes never authorise a deployment; surface work needs the Worker tests and an explicit decision | active, **challenged** by the absence of any real test (`hw-c04`) | `docs/SOURCE-OF-TRUTH.md`; overrides' known risk |

Only one principle has a second version, and the change was a file, not a belief. The doctrine froze at 02:28 EDT on 2026-03-26; everything added later is governance about the repository, not about the API.

## Non-goals and negative space

Revealed by absence — none is written anywhere:

- **No authentication, metering or rate limiting.** Not stubbed, not commented. Every reviewer since June has noted it; no one has added it or dropped the label that implies it.
- **No persistence.** No KV, D1, R2 or Durable Object; the `wrangler.jsonc` examples for each remain commented out.
- **No custom domain.** The personal `workers.dev` subdomain ties the API to the owner's handle; noted by the dossier as "self-chosen and already public".
- **No real test.** The template test was never replaced; `npm test` would fail.
- **No versioning or releases.** `0.0.0` in `package.json`, `1.0.0` in the banner, no tags (`hw-c26`).
- **No pruning of the family.** The Python twin was neither archived nor linked back to; the Worker still calls it "docs".

## Recurring tensions

1. **Free versus revenue.** The code gives everything away; the manifest, the asset kit and the reconciliation call it a revenue asset or a freemium candidate; the marketing gate fails it for having no price (`hydra-worker-x4`). Four documents, no decision.
2. **Slogan versus count.** "22" was never a measurement. The README table under the heading "All 22 Endpoints" has 24 rows; the spec says "20+"; the banner says 20; a later audit said 25. The number was a marketing figure that every artifact repeated in its own way (`hydra-worker-x1`).
3. **Curated versus generated.** The port traded generated Swagger/ReDoc for hand-written artifacts and got drift on day one; the playground wires 17 of 24 endpoints (`hw-c06`).
4. **Explicit deployment versus no tests.** The consolidation made deployment a decision gated on "the normal Worker tests"; the only test is the template (`hydra-worker-x8`).
5. **Engine versus site.** For two months the owner's records treated a one-file copy as the active product and the live engine as backburner, and one analysis concluded the product was dead (`hydra-worker-x2`, `hydra-worker-x5`). The boundary of 2026-07-25 resolved it on paper; the commit came five weeks later; the push has not.
6. **Rule versus judgement.** The estate audit's KILL rule condemns the live Worker and its dead twin identically; the dossier's PARK and the registry's "leave as-is" disagree with it (`hydra-worker-x7`).

## Stated ideals versus revealed behaviour

- *Stated:* "22 developer utility endpoints." *Revealed:* 24 utilities, 26 routes, and four different published numbers (`hw-c09`).
- *Stated:* "RapidAPI: Listed for marketplace discovery." *Revealed:* unverified by every later reviewer; "list hydra-worker on RapidAPI" still a June to-do (`hw-c23`).
- *Stated:* MIT ("use it however you want"). *Revealed:* no licence file for five months; one added locally, unpushed (`hw-c13`, `hw-c16`).
- *Stated (boundary):* deployment requires the normal Worker tests. *Revealed:* the test asserts "Hello World!" (`hw-c04`).
- *Stated (banner):* `docs: hydra-toolkit-api`. *Revealed:* the documentation is this repository's README, spec and playground (`hw-c21`).
- *Stated (manifest, committed 2026-09-01):* `type: revenue`. *Revealed:* free (`hw-c16`, `hydra-worker-x4`).

## What the project refused to become

A second NoHustle, and — by leaving the Python twin undeployed — a Render service. Every axis on which NoHustle was heavy is light here; the refusal is visible in the code with **confirmed** confidence, and its deliberateness is **plausible** only (`hw-c19`, `hw-c20`).

## Evolution

Inside the code: none since 2026-03-26. Around it: from "free edge utility" (April) to "revenue, platform none" (May, by tooling) to "freemium candidate / template / no price" (June) to "not live" and then "canonical" (July) to "park / kill / fix the counts" (August) to "snapshot with a licence" (September). The API's own ideology has not moved; the ideology *about* it has moved six times, and this record keeps each position labelled as a view.
