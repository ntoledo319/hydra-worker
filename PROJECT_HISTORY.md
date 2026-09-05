# HYDRA Developer Toolkit (hydra-worker) — Project History

_Canonical, unabridged reading path. Assembled deterministically by `scripts/project_history` `render` from the curated chapters in `docs/history/` and the evidence ledgers in `.project-history/`. Edit the chapters, not this file._

## Contents

- [ORIENTATION.md](#chapter-orientationmd)
- [NARRATIVE.md](#chapter-narrativemd)
- [IDEOLOGY.md](#chapter-ideologymd)
- [GOALS.md](#chapter-goalsmd)
- [DECISION_MAP.md](#chapter-decision_mapmd)
- [TIMELINE.md](#chapter-timelinemd)
- [OPEN_QUESTIONS.md](#chapter-open_questionsmd)
- [Appendix A — Claims ledger](#appendix-a-claims-ledger)
- [Appendix B — Contradiction register](#appendix-b-contradiction-register)
- [Appendix C — Source inventory](#appendix-c-source-inventory)
- [Appendix D — Coverage and reproducibility](#appendix-d-coverage-and-reproducibility)

## Chapter: ORIENTATION.md

## Orientation — HYDRA Developer Toolkit (`active/hydra-worker`)

_Present-tense briefing as of the audit date 2026-09-04. Everything here is what is true **now**; the history that produced it lives in the chapters that follow. Read this file first; then read `NARRATIVE.md`._

### What this repository is

The canonical, deployed HYDRA: a 414-line Cloudflare Worker on Hono (`src/index.js`) exposing 24 stateless developer-utility routes plus `/` and `/health` — text analysis, hashing, Base64, UUIDs, JSON validate/diff, regex testing, password scoring, URL/e-mail/JWT parsing, colour conversion, Markdown-to-HTML, time helpers, fake data. No authentication, no rate limit, no storage, no bindings, one runtime dependency. It is the port of the Python/FastAPI file in `backburner/hydra-api` committed 75 minutes earlier on the same night (claim `hw-c02`), and the thematic successor of the August-2025 NoHustle API, with which it shares no code (`hw-c19`).

### What is true today (verified 2026-09-04)

- **Live.** `https://hydra-worker.toledonick98.workers.dev/` answers `200` in ~0.1 s with Cloudflare headers, as it has on every probe on record since 2026-06-23 (`hw-c08`). Its banner still says `endpoints: 20` and points `docs` at the shelved Python repository (`hw-c21`).
- **Playground live on GitHub Pages** at `https://ntoledo319.github.io/hydra-worker/` from `master:/docs`, enabled since 2026-04-03 and documented nowhere but here (`hw-c07`).
- **Deployment is manual** (`npx wrangler deploy`), there is no CI/CD, no custom domain, and `docs/SOURCE-OF-TRUTH.md` rules that local changes never authorise a deployment (`hw-c08`, `hw-c14`).
- **Local `master` is one unpushed commit ahead of `origin/master`.** The 2026-09-01 snapshot (`57154c55564897f96eebf558b14f51c24c0a80eb`, author "AI Assistant") added `LICENSE` (MIT), `.toledo.yaml`, the source-of-truth note and `docs/SOURCE-OF-TRUTH.md`; GitHub still shows the 2026-04-03 tip and no licence file (`hw-c16`).
- **The endpoint count is wrong everywhere.** README/badge/playground 22; README table 24; `openapi.json` "20+" with 26 paths; live banner 20; code 24 utilities + 2 meta (`hw-c09`, contradiction `hydra-worker-x1`).
- **The only test cannot pass.** `test/index.spec.js` is the untouched starter template asserting `GET /` returns "Hello World!" (`hw-c04`, `hydra-worker-x8`).
- **Labelled `revenue`, earns nothing.** Free, keyless, no billing; the June-2026 marketing gate failed it for "no price set"; whether a RapidAPI listing exists is unknown (`hw-c12`, `hw-c23`).
- **Public, secret-scanned, unrewritten.** The September-2026 credential purge classified its two pattern matches as public configuration and touched nothing (`hw-c17`).
- **Working tree (present tense):** clean.

### Who should care, and what for

- **Anyone about to edit `src/index.js`, `openapi.json` or `docs/index.html`.** Three artifacts describe one surface and already disagree; the playground wires only 17 of 24 endpoints; the banner's link is wrong. Goal `g-reconcile-counts-and-links` is waiting for you.
- **Anyone about to deploy.** Deployment is an explicit decision, and "the normal Worker tests" the boundary document requires do not yet exist (`g-real-test`).
- **Anyone deciding the price question.** Three June documents named the options — freemium tier, template sale, backlink asset — and no one chose (`hydra-worker-x4`, `hydra-worker-x7`).
- **Anyone reading the family's other histories.** The Python sibling's record is at `/home/nick/Development/backburner/hydra-api`; the NoHustle record at `/home/nick/Development/archive/NoHustle API`; the retired mirror at `/home/nick/Development/archive/duplicates/hydra-site`.

### How to read the history

- `NARRATIVE.md` — prehistory, the eras and the causal story; the lineage NoHustle → HYDRA API → this Worker, and the hydra-site consolidation, are argued with evidence, not assumed.
- `IDEOLOGY.md` — the worldview the code reveals, its non-goals and the tensions never resolved.
- `GOALS.md` — every goal, when it was proposed, and what became of it.
- `DECISION_MAP.md` — decision genealogies plus the generated index of events, principles and goals.
- `TIMELINE.md` — deterministic, evidence-linked index.
- `OPEN_QUESTIONS.md` — gaps, contradictions and low-confidence claims, ranked.

**Evidence conventions.** Every material statement cites a claim id (`hw-cNN`) from `.project-history/claims.yml`; each claim carries an evidence type (`direct`, `contemporaneous`, `retrospective`, `behavioral`, `inferred`), a status and a confidence. Four things are kept apart throughout: what participants said, what the system did, what outcome followed, and what the historian infers. Where the record says "inferred" or "plausible", treat it as an argument, not a fact. Several dated records here were written by AI agents on the owner's behalf — including the repository's latest commit — and are labelled as such; Git authorship is not intellectual authorship.

### Maintaining this history

Commands (run from the repository root; all exit 0 when healthy; also available as `npm run history:*`):

```
node scripts/project_history.mjs context [paths...]     # smallest relevant history for an area
node scripts/project_history.mjs assess [range]         # advisory materiality check on new work
node scripts/project_history.mjs validate               # schemas, ids, dates, anchors, secrets, render drift
node scripts/project_history.mjs render                 # rebuild TIMELINE, DECISION_MAP index, PROJECT_HISTORY.md
node scripts/project_history.mjs audit --full           # compare git evidence with recorded history
node scripts/project_history.mjs audit --since HEAD~1   # incremental audit
node scripts/project_history.mjs declaration --text "…" # check a history declaration (CI helper)
node --test test/project_history_tests.mjs              # the history tool's tests (outside vitest's glob on purpose)
```

At task end every agent declares exactly one of `history:recorded <event-id>`, `history:none — <specific reason>` or `history:defer — <tracking item, owner, deadline>` (see `AGENTS.md` and `.github/PULL_REQUEST_TEMPLATE.md`).

**CI status.** `.github/workflows/project-history.yml` runs validate, render-drift, tests, an incremental audit, a secret scan and the declaration check on pull requests, and a monthly "history gardener" audit that publishes one drift report. The repository has never had a workflow of its own (its single Actions run was the automatic Pages build), and this file exists only in the uncommitted working tree: **it activates only once these files are committed and pushed.** Nothing here claims it is running today.

### Related repositories (absolute paths; cited SHAs resolve against them)

- `/home/nick/Development/backburner/hydra-api` — the Python/FastAPI sibling and source of the port; never deployed.
- `/home/nick/Development/archive/duplicates/hydra-site` — the retired byte-identical mirror of `docs/index.html`.
- `/home/nick/Development/archive/NoHustle API` — the August-2025 paid utility API; thematic predecessor, no shared code.
- `/home/nick/Development/experiments/thing` — the NoHustle growth kit of August 2025.

## Chapter: NARRATIVE.md

## Narrative — a one-night port that became the product, and the paperwork that kept mistaking it

_Curated era-and-causal synthesis. Claim ids (`hw-cNN`) point into `.project-history/claims.yml`; event ids point into `.project-history/events/`. Statements marked **inferred** are the historian's reading, not the record's._

### How to read this

Four commits: a port, a README, a spec-and-playground, and — five months later — a housekeeping snapshot by an agent. The code has not changed since the night it was written. A commit diary would be four lines and would miss the actual history, which happened *around* the repository: the decision to deploy this implementation rather than its Python twin, never written down; a documentation set that disagreed with the code on the day it was published; a static copy that the owner's own trackers mistook for the product for two months; a consolidation that fixed that and then waited five weeks for a commit; three audits that measured everything and decided nothing. The eras below follow what people believed about the Worker, because that is what changed.

### Prehistory — the thesis before the Worker (2025-08 to 2026-03-26 02:28 EDT)

The idea — small developer utilities behind one HTTP surface, discovered through a marketplace — has a documented ancestor in the same portfolio. **NoHustle API** (August 2025) was a Flask "Utility Pack" of seven heavy file-processing endpoints, keyed, metered into SQLite, licensed under the Business Source License, deployed to Render and prepared for a RapidAPI listing with four price tiers; it spent four days fighting Render's Python version and a marketplace health checker, spawned an automated "growth kit" the next week, and went silent (`hw-c19`; its full history lives in `/home/nick/Development/archive/NoHustle API`). A mechanical comparison finds no shared route beyond `/` and `/health`, no shared literal, identifier overlap 0.28, and no reference in either direction (`hw-c19`, confirmed). HYDRA inverts every choice NoHustle made — twenty heavy dependencies to one, metering to statelessness, keys and tiers to keyless and free, BSL to MIT, a Render monolith to the edge. That reads as a lesson learned; no source says so; the claim is marked **plausible** (`hw-c20`).

The Worker's immediate ancestor is closer: at 01:13 EDT on 2026-03-26 a 437-line FastAPI file with the same 24 routes was committed to `hydra-toolkit-api`; at 02:11 that repository received a Render blueprint with auto-deploy; at 02:28 this repository was born with a Hono port of the same file — identifier overlap 0.82, the same stop-word list, the same "Acme Corp" in the fake-data generator (`hw-c02`, confirmed). The Worker's banner pointed its `docs` field at the Python repository, and still does. The idea's birth is earlier than either commit and unrecorded; the original checkout lived in a macOS `CascadeProjects` directory, which suggests an AI-assisted editor session whose transcript is not on disk.

### Era 1 — The port, and the decision made by deploying (2026-03-26 to 2026-04-03)

**Situation.** Finished code in two languages, one Render blueprint pointing at a host that would never serve it, and a Cloudflare account. The pressure — read only from later marketing copy — was the edge's promise: "~50ms worldwide", "no cold starts", "$0 on Workers free tier (100K req/day)" (`hw-c05`). No decision record exists (event `hydra-worker-2026-03-26-worker-port-and-first-deploy`).

**What it believed the problem was.** Developers reach for the same helpers over and over; one keyless HTTP surface answers all of them, fast, everywhere, for nothing. The root commit is the whole belief: `app.use('*', cors())`, no auth, no storage, no bindings, every handler a pure function, `hono` the only dependency (`hw-c03`). The runtime configuration is wrangler's generated template with only the name filled in — compatibility date 2025-09-27, six months before the project existed, observability on, every binding commented out (`hw-c25`).

**Whom it was for.** Anonymous developers; secondarily the studio, as a demonstrably live, zero-cost artifact.

**Principles introduced** (all in the root commit, none revised since): edge-first (`p-edge-first`), keyless and free (`p-keyless-free`), stateless and pure (`p-stateless-pure`), zero dependencies beyond Hono (`p-zero-deps-beyond-hono`).

**What was left behind.** The starter test — "Hello World worker", asserting `GET /` returns "Hello World!" — was never adapted and cannot pass against an app whose root returns JSON (`hw-c04`). `package.json` says version 0.0.0; the banner says 1.0.0; the banner also hard-codes `endpoints: 20` (`hw-c03`, `hw-c09`). These are the repository's oldest debts, and they are all still present.

**The public face, eight days later.** On 2026-04-03 a README published the live URL — the first evidence the Worker was deployed; the actual first `wrangler deploy` is undated — with "22 developer utility endpoints on the global edge. Free. No API key required.", an MIT badge (no licence file), a tech-stack section, an "All 22 Endpoints" table containing 24 rows, and an "Also Available" section that fixed the family's framing for good: the Python repository as "the Python/FastAPI version", "RapidAPI: Listed for marketplace discovery", an OpenAPI spec (`hw-c05`). Two minutes later a hand-written `openapi.json` (26 paths, described as "20+") and a 176-line HTML playground wiring 17 of the 24 endpoints were committed (`hw-c06`). In the same minute GitHub Pages built `docs/` and began serving the playground at `ntoledo319.github.io/hydra-worker/` — a delivery path no commit, README line, wrangler setting or later owner document mentions; the 2026-08-03 registry would call it "effectively-accidental" (`hw-c07`). That push, at 08:01Z on 2026-04-03, is the last the repository has had (`hw-c26`; event `hydra-worker-2026-04-03-readme-openapi-playground-and-pages`).

**Alternatives.** Generated documentation, as the Python sibling had for free — not attempted; serving the playground from the Worker (the `assets` binding is one uncommented line away) — not attempted; deleting or archiving the Python twin — not done, then or since.

**Synthesis.** By 2026-04-03 the project believed it was a free, live, edge-hosted utility API with a marketplace presence and MIT terms. Two of those were true. It could ship and document a surface in a morning; it could not count it. It refused to be keyed, metered, stateful or heavy — which is to say it refused to be NoHustle.

### Era 2 — Reclassified and misread from outside (2026-05-05 to 2026-07-24)

The repository did not change; the documents around it did, and they got it wrong in an instructive way.

On 2026-05-05 the workspace migration moved the checkout out of `CascadeProjects` into `backburner/` and generated a manifest reading `status: backburner`, `type: revenue`, `platform: none`, `url: null` — for a live API (`hw-c10`; event `hydra-worker-2026-05-05-backburner-then-active-reclassification`). Three weeks later a private repository, `hydra-site`, received a single "safe backup" commit containing a byte-identical copy of `docs/index.html`, and the owner's trackers filed *it* under `active/` as "Web presence for the Hydra ecosystem" with "purpose unclear — needs definition", while the engine sat in `backburner/` (`hw-c11`; event `hydra-worker-2026-05-28-hydra-site-static-mirror`). By 2026-06-16 the Worker had been promoted to `active/`; nobody recorded when or why.

June then framed HYDRA from three directions at once. The asset-sale kit valued it as "a template, not a product" with "17+ endpoints" and "no canonical price"; the business reconciliation called it "PILOT-READY — RapidAPI freemium/metered" and listed "list hydra-worker on RapidAPI; archive dead hydra-api" as a next action; the marketing-machine gate failed "hydra" on G1 — "no price set" — and told the owner to set a freemium tier or designate it a backlink asset, adding that "set a price is a business-model decision, not a one-click fix"; the master portfolio called it "LIVE … a clean edge-deploy demonstration more than a business"; the launched-products brief allocated it 10–15% and asked for the endpoint count and docs URL to be confirmed (`hw-c12`, `hw-c22`; event `hydra-worker-2026-06-17-price-gate-and-asset-kit`). Goals `g-rapidapi-discovery` and `g-revenue-classification` are recorded as *blocked* on that single fact — no price — and remain so.

July produced the week the mis-filing mattered. The 2026-07-20 ship queue listed `hydra-worker` as LIVE ("verify only — all confirmed 200") and, on day five, planned to deploy `hydra-site` to Cloudflare Pages and to add "LICENSE on hydra-worker"; the value audit of the same day flagged "MIT claimed with no LICENSE file". Two days later a research note concluded "hydra is NOT actually live (static backup repo, no deploy pipeline, its own registry says 'not deployed?')" — while the Worker was answering 200 (`hw-c13`; contradiction `hydra-worker-x2`). The analyst had opened the copy and the May manifest, not the Worker. On 2026-07-24 a generated synergy report named the Worker/site pair the "easiest duplicate" and recommended "HYDRA Site → Worker docs or generated mirror … consolidate" (`hw-c14`).

**What the project believed by now** is best described as what others believed about it, which was inconsistent: live and not live, active and backburner, a product and a template, PILOT-READY and gate-failed. The tension that propels the next era is simply that two repositories carried one HTML file and nobody had said which one was HYDRA.

### Era 3 — Consolidation, audits and the late snapshot (2026-07-25 to 2026-09-01)

On 2026-07-25 a boundary was written: this repository "owns the Worker code, OpenAPI description, operator documentation, and editable `docs/index.html` surface"; `hydra-site` was moved to `archive/duplicates` as "a historical baseline, not a mirror that must follow future edits", byte-identical (sha256 recorded and re-verified on 2026-09-04); Git histories were not spliced; and "new HYDRA surface work belongs here and requires the normal Worker tests and an explicit deployment decision" (`hw-c14`; event `hydra-worker-2026-07-25-source-of-truth-consolidation`). The workspace registry recorded `canonical_status: canonical`, the known risk "Local source changes do not authorize a Cloudflare deployment", and a note to keep `docs/index.html` synchronised by hash check. Two principles date from here — `p-single-source-of-truth` and `p-explicit-deploy-decision` — and the second is undermined by a fact the boundary does not mention: the "normal Worker tests" are the starter template (`hydra-worker-x8`). The README note and `docs/SOURCE-OF-TRUTH.md` were written into the working tree and left uncommitted.

Three reviews then measured the repository within four days. The 2026-08-03 registry note is the most precise measurement it has ever had: 26 routes, all real; the playground live on Pages but wiring 17 of 24 endpoints; the test "would FAIL"; CI none; the banner "stale" with the wrong count and the wrong docs link; three uncommitted paths; next action "reconcile the endpoint count … fix the live banner docs link … delete or update the broken template test. Otherwise leave as-is (live, low-maintenance, $0)". It also contained an error of its own — that `openapi.json` has 25 paths and omits `/time/convert`; the committed file has 26 and includes it (`hw-c09`) — preserved here because retrospective sources can be wrong in detail while right in substance. The 2026-08-06 dossier said **PARK** ("wire a real monetization/metering path … or drop the `type: revenue` label"); the rule-based estate audit said **KILL** ("trivial: under 500 logical lines and under 10 commits"), a rule under which the live product and its shelved twin are indistinguishable (`hw-c15`; contradiction `hydra-worker-x7`; event `hydra-worker-2026-08-06-audits-park-vs-kill`, left **open** because no decision followed).

On 2026-09-01 at 00:02 EDT a commit authored "AI Assistant" and titled "chore: snapshot current progress" finally captured the consolidation files and added two more: `LICENSE` (MIT, copyright 2026 Toledo Technologies LLC — the file the README had promised since April and the value audit had asked for in July) and `.toledo.yaml` (now `status: active`, `platform: cloudflare-workers`, the live URL, notes "Canonical HYDRA implementation … since 2026-07-25", and the original macOS path that the registry had warned would leak "only if someone runs a blanket `git add -A`") (`hw-c16`, `hw-c18`; event `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest`). It touched neither the counts, the banner nor the test. It has not been pushed: on 2026-09-04 GitHub still shows the 2026-04-03 tip and no licence file.

### Era 4 — Purge and record (2026-09-02 to 2026-09-04)

The workspace-wide credential purge of early September rewrote eighteen owned remotes and pushed security commits to twenty-two others. This history was scanned, matched only two public-configuration patterns, and was neither rewritten nor pushed; GitHub secret scanning and push protection are enabled on it (`hw-c17`; event `hydra-worker-2026-09-02-credential-purge-untouched`). Every anchor cited here resolves; the only local/remote divergence is the owner's own unpushed snapshot. On 2026-09-04 this history system was installed (event `hydra-worker-2026-09-04-history-system-bootstrap`) as a dependency-free Node port of the tool used by the two sibling histories, with tests outside vitest's glob so the product's own failing suite is left exactly as found.

### The lineage question, answered with evidence

**NoHustle (Aug 2025) → HYDRA API (Mar 2026) → HYDRA Worker (Mar 2026).** A sequence of the same author's attempts at one thesis; a code lineage only at the last link.

- *NoHustle → the family:* thesis, marketplace ambition and (in the Python sibling) the Render habit carried forward; keys, metering, a database, heavy libraries, source-available licensing, paid tiers, Render and file-processing as the product category were all dropped (`hw-c19`, confirmed). Whether deliberately is **inferred** (`hw-c20`, plausible); the March-2026 session that would settle it is inaccessible.
- *HYDRA API → this Worker:* a route-for-route port seventeen minutes after the Python blueprint; the Worker still cites the Python repository as its documentation; the Python repository never links back (`hw-c02`, `hw-c21`). Rejected in the port: Render and a Python runtime. Lost in the port: generated Swagger/ReDoc, replaced eight days later by hand-written artifacts that immediately drifted (`hw-c06`, `hw-c09`). The three framings — predecessor by 75 minutes, "parallel variant" (April/June), "superseded/shelved" (August) — are all true of different things and are preserved as contradiction `hydra-worker-x3`.
- *This Worker → hydra-site:* not lineage but duplication — a backup copy that documents mistook for the product until the 2026-07-25 boundary (`hydra-worker-x5`).

### Inheritance — what the present carries

- A live, free, $0 API with no rate limit and no custom domain, deployed by hand from a developer machine, answering every probe since June 2026 and with no record of when it first went up (`hw-c08`).
- An endpoint count that is wrong in every artifact including the live banner, and a banner `docs` link that sends callers to a shelved repository (`hw-c09`, `hw-c21`; goal `g-reconcile-counts-and-links`).
- A playground served by a delivery path nobody chose, wiring 17 of 24 endpoints (`hw-c07`).
- A test that cannot pass, standing in for "the normal Worker tests" a deployment now formally requires (`hw-c04`; goal `g-real-test`).
- A licence file and a source-of-truth boundary that exist locally and not on GitHub, in an agent-authored commit that also committed a home-directory path (`hw-c16`, `hw-c18`).
- A `revenue` label with no price and no mechanism, and a marketplace listing that may never have existed (`hw-c12`, `hw-c23`).
- Two unadopted verdicts and one open event awaiting an owner decision (`hw-c15`).
- A runtime pinned to a compatibility date six months older than the project (`hw-c25`).
- Four repositories' worth of family cross-references that run one way (`hw-c21`).

## Chapter: IDEOLOGY.md

## Ideology — the worldview this code reveals

_"Ideology" here means the project's governing assumptions, priorities, non-negotiables, theory of the problem, intended beneficiaries, definition of success, acceptable trade-offs and revealed non-goals. Nothing below is manufactured from motive; where the code or a dated document is the only witness, that is said._

### Theory of the problem

Developers spend small, repeated units of attention on utilities that are individually trivial and collectively tedious — hash this, slugify that, decode this JWT, give me five UUIDs. The remedy is not a library but a **public HTTP surface**: one URL, JSON in, JSON out, no account. The README states the promise in one line — "developer utility endpoints on the global edge. Free. No API key required." — and the code keeps it (`hw-c03`, `hw-c05`).

### Theory of change

Publish everything, charge nothing, require nothing, and let discovery do the rest: GitHub topics ("free", "developer-tools"), a marketplace listing, a playground. The only later elaboration — "intended top-of-funnel dev surface + a freemium RapidAPI candidate" (master portfolio, 2026-06-23) — was written by an agent about the Worker, not by the Worker's author, and the freemium half was never built (`hw-c12`).

### Intended beneficiaries over time

1. **2026-03-26:** anonymous developers (`cors()` on every route, no key) and the studio, as a demonstrably live artifact.
2. **2026-04-03:** GitHub and marketplace readers — curl examples, a playground, an OpenAPI document (`hw-c05`, `hw-c06`).
3. **2026-05 to 2026-08:** the owner and the agents operating the portfolio; the Worker exists in their records as a row to classify, price, verify and consolidate (`hw-c10`, `hw-c12`, `hw-c15`).

No external user is evidenced at any stage; the Cloudflare analytics that would show one were not in scope.

### Principles (versioned in `.project-history/doctrine/principles.yml`)

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

### Non-goals and negative space

Revealed by absence — none is written anywhere:

- **No authentication, metering or rate limiting.** Not stubbed, not commented. Every reviewer since June has noted it; no one has added it or dropped the label that implies it.
- **No persistence.** No KV, D1, R2 or Durable Object; the `wrangler.jsonc` examples for each remain commented out.
- **No custom domain.** The personal `workers.dev` subdomain ties the API to the owner's handle; noted by the dossier as "self-chosen and already public".
- **No real test.** The template test was never replaced; `npm test` would fail.
- **No versioning or releases.** `0.0.0` in `package.json`, `1.0.0` in the banner, no tags (`hw-c26`).
- **No pruning of the family.** The Python twin was neither archived nor linked back to; the Worker still calls it "docs".

### Recurring tensions

1. **Free versus revenue.** The code gives everything away; the manifest, the asset kit and the reconciliation call it a revenue asset or a freemium candidate; the marketing gate fails it for having no price (`hydra-worker-x4`). Four documents, no decision.
2. **Slogan versus count.** "22" was never a measurement. The README table under the heading "All 22 Endpoints" has 24 rows; the spec says "20+"; the banner says 20; a later audit said 25. The number was a marketing figure that every artifact repeated in its own way (`hydra-worker-x1`).
3. **Curated versus generated.** The port traded generated Swagger/ReDoc for hand-written artifacts and got drift on day one; the playground wires 17 of 24 endpoints (`hw-c06`).
4. **Explicit deployment versus no tests.** The consolidation made deployment a decision gated on "the normal Worker tests"; the only test is the template (`hydra-worker-x8`).
5. **Engine versus site.** For two months the owner's records treated a one-file copy as the active product and the live engine as backburner, and one analysis concluded the product was dead (`hydra-worker-x2`, `hydra-worker-x5`). The boundary of 2026-07-25 resolved it on paper; the commit came five weeks later; the push has not.
6. **Rule versus judgement.** The estate audit's KILL rule condemns the live Worker and its dead twin identically; the dossier's PARK and the registry's "leave as-is" disagree with it (`hydra-worker-x7`).

### Stated ideals versus revealed behaviour

- *Stated:* "22 developer utility endpoints." *Revealed:* 24 utilities, 26 routes, and four different published numbers (`hw-c09`).
- *Stated:* "RapidAPI: Listed for marketplace discovery." *Revealed:* unverified by every later reviewer; "list hydra-worker on RapidAPI" still a June to-do (`hw-c23`).
- *Stated:* MIT ("use it however you want"). *Revealed:* no licence file for five months; one added locally, unpushed (`hw-c13`, `hw-c16`).
- *Stated (boundary):* deployment requires the normal Worker tests. *Revealed:* the test asserts "Hello World!" (`hw-c04`).
- *Stated (banner):* `docs: hydra-toolkit-api`. *Revealed:* the documentation is this repository's README, spec and playground (`hw-c21`).
- *Stated (manifest, committed 2026-09-01):* `type: revenue`. *Revealed:* free (`hw-c16`, `hydra-worker-x4`).

### What the project refused to become

A second NoHustle, and — by leaving the Python twin undeployed — a Render service. Every axis on which NoHustle was heavy is light here; the refusal is visible in the code with **confirmed** confidence, and its deliberateness is **plausible** only (`hw-c19`, `hw-c20`).

### Evolution

Inside the code: none since 2026-03-26. Around it: from "free edge utility" (April) to "revenue, platform none" (May, by tooling) to "freemium candidate / template / no price" (June) to "not live" and then "canonical" (July) to "park / kill / fix the counts" (August) to "snapshot with a licence" (September). The API's own ideology has not moved; the ideology *about* it has moved six times, and this record keeps each position labelled as a view.

## Chapter: GOALS.md

## Goals — every goal, its lifecycle and what "success" meant

_Versioned lifecycle records live in `.project-history/doctrine/goals.yml`. Status vocabulary: proposed → active → narrowed / expanded / blocked → achieved / abandoned / superseded. Dates are decision or observation dates, not commit dates, unless stated._

### `g-port-and-deploy-edge` — re-express the 24 routes as a Cloudflare Worker and put them live on the free tier

- **Proposed / activated:** 2026-03-26 02:28 EDT, revealed by the root commit (`hw-c01`, `hw-c02`).
- **Definition of success:** a `workers.dev` URL answering every route.
- **Status: achieved** by 2026-04-03 at the latest — the README publishes the live URL — and still met on 2026-09-04 (`hw-c05`, `hw-c08`). The actual first deploy date is unrecorded (the Cloudflare dashboard was not consulted).
- **Consequence:** the Python twin's own deployment goal was abandoned by outcome the same night; the Worker became HYDRA by being the one that ran.

### `g-document-the-surface` — a README with every endpoint, an OpenAPI document and an interactive playground

- **Proposed / achieved:** 2026-04-03 (`hw-c05`, `hw-c06`).
- **Definition of success:** a reader can find and try every endpoint without reading the source.
- **Met as artifacts, undermined by drift:** the README says 22 and lists 24; the spec says "20+" and lists 26; the playground wires 17; the live banner says 20 and links the wrong repository (`hw-c09`, `hw-c21`). GitHub Pages serves the playground by a path no one documented (`hw-c07`).
- **Successor goal:** `g-reconcile-counts-and-links`, below.

### `g-rapidapi-discovery` — be discoverable on RapidAPI, possibly as a freemium tier

- **Proposed:** 2026-04-03 ("RapidAPI: Listed for marketplace discovery", README) and 2026-06-23 ("a freemium RapidAPI candidate", master portfolio) (`hw-c05`, `hw-c12`).
- **Definition of success (supplied by the marketing documents):** a published listing with at least a free tier and a decided price.
- **Status: blocked** since 2026-06-17 on gate G1, "no price set"; business-ops still lists "list hydra-worker on RapidAPI" as a next action on 2026-06-22 (`hw-c22`). Whether a listing ever existed is unknown (`hw-c23`, `hydra-worker-x6`).

### `g-revenue-classification` — be a revenue asset, by a freemium tier or as a sellable Worker template

- **Proposed:** 2026-05-05 by the migration tooling's manifest; committed as `type: revenue` on 2026-09-01 (`hw-c10`, `hw-c16`).
- **Definition of success:** any paid usage, a listed price, or a template sale.
- **Status: blocked.** No auth, metering or billing exists; the asset kit prices it "like a template, not a product" with "no canonical price"; the dossier calls the label "aspirational, not real revenue" (`hw-c12`, `hw-c15`; `hydra-worker-x4`).
- **Alternative named by the documents:** drop the label and designate HYDRA a lead/backlink asset for another product. Not chosen either.

### `g-one-canonical-hydra` — one owner of the surface; the duplicate archived byte-identically

- **Proposed:** 2026-07-24 by the synergy report ("consolidate"); **achieved:** 2026-07-25 by the boundary document, the archive move and the registry updates (`hw-c14`, `hw-c11`).
- **Definition of success:** a written boundary, the mirror archived, registries updated.
- **Caveat:** enacted in the working tree and the owner's registries; committed only on 2026-09-01; not pushed, so the public repository does not yet carry the boundary (`hw-c16`).

### `g-licence-file` — add the LICENSE file the README's MIT badge implies

- **Proposed:** 2026-07-20 by the value audit ("MIT claimed with no LICENSE file") and the ship queue's day-five plan (`hw-c13`).
- **Achieved:** 2026-09-01, in the local snapshot commit (`hw-c16`). Not on GitHub until that commit is pushed.

### `g-reconcile-counts-and-links` — one endpoint number everywhere; a banner that points at HYDRA's own documentation

- **Proposed:** 2026-06-26 by the launched-products brief ("Confirm HYDRA endpoint count and docs URL"), restated 2026-08-03 by the registry and 2026-08-06 by the dossier (`hw-c09`, `hw-c15`).
- **Status: proposed** (review by 2026-12-31). A fifteen-minute change to `src/index.js`, `README.md`, `openapi.json` and `docs/index.html` that no one has made.

### `g-real-test` — replace or delete the starter-template test

- **Proposed:** 2026-08-03 by the registry ("delete or update the broken template test") (`hw-c04`).
- **Status: proposed** (review by 2026-12-31). Its importance rose on 2026-07-25 when deployment was made conditional on "the normal Worker tests".

### Goals that were never proposed

Worth recording because their absence is a choice: a custom domain (every audit lists its absence as a caveat; no document plans one); rate limiting or abuse protection for a public no-key API (the dossier judges the risk acceptable); a release or version scheme (`0.0.0` / `1.0.0`, no tags); serving the playground from the Worker itself; archiving or linking back from the Python twin; revisiting the template compatibility date (`hw-c25`).

### How the definition of success moved

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

## Chapter: DECISION_MAP.md

## Decision map — genealogies and cross-links

_Each genealogy follows `pressure → belief → alternatives → decision → implementation → result → consequence → later revision`. The index at the end is generated by `scripts/project_history.mjs render` from the event capsules and doctrine files; edit those, not the table._

### D1 — Port the FastAPI toolkit to a Cloudflare Worker (2026-03-26 02:28 EDT)

- **Pressure:** finished code, unhosted; a Render blueprint seventeen minutes old (**inferred** from commit order).
- **Belief:** the edge is faster and free; one pure file is the right unit (`p-edge-first`, `p-stateless-pure`).
- **Alternatives:** run the Python file on Render (the blueprint) — never executed; keep only one implementation — not done.
- **Implementation:** root `2a804e67b5eb84bb52ddd4950fa41b0aa533959b`, a route-for-route port of `ff404c6030c6529b28dbc50ff7b80f1031eb7916` (`hw-c02`).
- **Result:** live by 2026-04-03; the Python twin never served.
- **Consequence:** a banner that still cites the twin as `docs`; a template test and a template compatibility date never revisited (`hw-c04`, `hw-c25`).
- **Later revision:** none. Event `hydra-worker-2026-03-26-worker-port-and-first-deploy`; sibling capsule `hydra-api-2026-03-26-render-blueprint-and-worker-port`.

### D2 — Publish hand-written documentation and let GitHub Pages serve it (2026-04-03)

- **Belief:** a README table, a spec and a playground are enough (`p-curated-documentation`).
- **Alternatives:** generate the spec from the code; serve the playground from the Worker's `assets` binding — neither attempted.
- **Implementation:** `465f28476f262c580f8e9a10638851209cafe88c` (README), `6808ec82597245fd620b15a45f15483b67699d78` (spec, playground); Pages built from `master:/docs` the same minute (`hw-c05`, `hw-c06`, `hw-c07`).
- **Result:** documented and discoverable; counts 22/24/20+/20 against 24; the "Also Available" line fixed the family's framing; last push to GitHub.
- **Consequence:** `hydra-worker-x1`; goal `g-reconcile-counts-and-links`; the hydra-site confusion of May–July. Event `hydra-worker-2026-04-03-readme-openapi-playground-and-pages`.

### D3 — File it as backburner / revenue / platform none (2026-05-05, tooling on an owner-approved plan)

- **Implementation:** migration log and planned manifest (`hw-c10`).
- **Result:** a live API recorded as not deployed; promoted to `active/` by 2026-06-16 without a record.
- **Consequence:** `p-keyless-free` challenged; goal `g-revenue-classification` blocked; the July "not live" misreading. Event `hydra-worker-2026-05-05-backburner-then-active-reclassification`.

### D4 — Back the playground up into a separate repository (2026-05-28)

- **Implementation:** `hydra-site` `e961c9d60348d3f767ea782ee595b781977458ab`, byte-identical to `docs/index.html` (`hw-c11`).
- **Result:** trackers called it the active HYDRA site; a Pages deploy was planned for it; nothing happened.
- **Consequence:** `hydra-worker-x5`; the 2026-07-22 "not live" conclusion (`hw-c13`); retired 2026-07-25. Event `hydra-worker-2026-05-28-hydra-site-static-mirror`.

### D5 — Price it, sell it as a template, or gate it (June 2026 — advice, not decision)

- **Accounts:** asset kit "template, not a product"; business-ops "PILOT-READY … list on RapidAPI"; marketing gate "no price set … set a tier or designate a backlink asset"; portfolio "a demonstration more than a business" (`hw-c12`, `hw-c22`).
- **Decision:** none. **Consequence:** goals `g-rapidapi-discovery` and `g-revenue-classification` blocked; `hydra-worker-x4`, `hydra-worker-x6`. Event `hydra-worker-2026-06-17-price-gate-and-asset-kit`.

### D6 — Declare the Worker the single source of truth and deployment an explicit decision (2026-07-25)

- **Pressure:** the July week of contradictory owner reports; the 2026-07-24 "easiest duplicate" recommendation (`hw-c13`, `hw-c14`).
- **Alternatives:** make hydra-site a generated mirror; deploy it to Pages — rejected.
- **Implementation:** `docs/SOURCE-OF-TRUTH.md`, the README note, the archive move, registry overrides; committed 2026-09-01 in `57154c55564897f96eebf558b14f51c24c0a80eb`.
- **Consequence:** `p-single-source-of-truth`, `p-explicit-deploy-decision`; goal `g-one-canonical-hydra` achieved; the deploy rule points at tests that do not exist (`hydra-worker-x8`). Event `hydra-worker-2026-07-25-source-of-truth-consolidation`.

### D7 — Three verdicts, no decision (2026-08-03 to 2026-08-06)

- **Accounts:** registry "fix counts, banner, test; otherwise leave as-is"; dossier PARK; estate audit KILL by rule (`hw-c15`).
- **Consequence:** goals `g-reconcile-counts-and-links` and `g-real-test` proposed; `hydra-worker-x7`; event `hydra-worker-2026-08-06-audits-park-vs-kill` left **open**.

### D8 — Snapshot the working tree, add LICENSE and the manifest; do not push (2026-09-01, agent-authored)

- **Implementation:** `57154c55564897f96eebf558b14f51c24c0a80eb` (`hw-c16`).
- **Consequence:** `p-licence-mit` v2 supersedes v1; goals `g-licence-file` and `g-one-canonical-hydra` gain a commit; the manifest's home-directory path enters Git (`hw-c18`); origin/master stays at the April tip. Event `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest`.

### D9 — Do not rewrite (2026-09-02, decided by the credential purge's classification)

- **Implementation:** two pattern matches classified public configuration; no rewrite; secret scanning and push protection on (`hw-c17`). Event `hydra-worker-2026-09-02-credential-purge-untouched`.

### D10 — Install the history system (2026-09-04)

- Event `hydra-worker-2026-09-04-history-system-bootstrap`; anchored to `57154c55564897f96eebf558b14f51c24c0a80eb`; Node port of the sibling tool; tests outside vitest's glob.

### Generated index

<!-- BEGIN GENERATED: decision-index -->
| Event | Kind | Significance | Occurred | Status | Related | Amends / supersedes |
|---|---|---|---|---|---|---|
| `hydra-worker-2026-03-26-worker-port-and-first-deploy` | origin | high | 2026-03-26 | closed | `hydra-worker-2026-04-03-readme-openapi-playground-and-pages` | — |
| `hydra-worker-2026-04-03-readme-openapi-playground-and-pages` | release | high | 2026-04-03 | closed | `hydra-worker-2026-03-26-worker-port-and-first-deploy`, `hydra-worker-2026-05-28-hydra-site-static-mirror` | — |
| `hydra-worker-2026-05-05-backburner-then-active-reclassification` | governance | medium | 2026-05-05 | closed | `hydra-worker-2026-04-03-readme-openapi-playground-and-pages`, `hydra-worker-2026-05-28-hydra-site-static-mirror`, `hydra-worker-2026-06-17-price-gate-and-asset-kit` | — |
| `hydra-worker-2026-05-28-hydra-site-static-mirror` | experiment | medium | 2026-05-28 | closed | `hydra-worker-2026-04-03-readme-openapi-playground-and-pages`, `hydra-worker-2026-07-25-source-of-truth-consolidation` | — |
| `hydra-worker-2026-06-17-price-gate-and-asset-kit` | governance | medium | 2026-06-17 | closed | `hydra-worker-2026-05-05-backburner-then-active-reclassification`, `hydra-worker-2026-08-06-audits-park-vs-kill` | — |
| `hydra-worker-2026-07-25-source-of-truth-consolidation` | consolidation | high | 2026-07-25 | closed | `hydra-worker-2026-05-28-hydra-site-static-mirror`, `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest` | — |
| `hydra-worker-2026-08-06-audits-park-vs-kill` | governance | medium | 2026-08-06 | open | `hydra-worker-2026-06-17-price-gate-and-asset-kit`, `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest` | — |
| `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest` | licence | medium | 2026-09-01 | closed | `hydra-worker-2026-07-25-source-of-truth-consolidation`, `hydra-worker-2026-08-06-audits-park-vs-kill`, `hydra-worker-2026-09-02-credential-purge-untouched` | — |
| `hydra-worker-2026-09-02-credential-purge-untouched` | security | medium | 2026-09-02 | closed | `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest`, `hydra-worker-2026-09-04-history-system-bootstrap` | — |
| `hydra-worker-2026-09-04-history-system-bootstrap` | bootstrap | medium | 2026-09-04 | closed | `hydra-worker-2026-09-02-credential-purge-untouched` | — |

##### Principles (versioned)

| Id | v | Status | Introduced | Supersedes | Statement |
|---|---|---|---|---|---|
| `p-edge-first` | 1 | active | 2026-03-26 | — | Run on the global edge at zero cost: a Cloudflare Worker on Hono, no origin server, no cold starts, "~50ms worldwide", "$0 on Workers free tier". |
| `p-keyless-free` | 1 | challenged | 2026-03-26 | — | No API key, no billing, no rate limit, open CORS; anyone may call any endpoint. |
| `p-stateless-pure` | 1 | active | 2026-03-26 | — | Every handler is a pure function of its request — no bindings, no storage, no outbound calls; the Worker can be redeployed anywhere from one file. |
| `p-zero-deps-beyond-hono` | 1 | active | 2026-03-26 | — | One runtime dependency (Hono); Web Crypto and hand-rolled helpers for everything else, including MD5. |
| `p-curated-documentation` | 1 | weakened | 2026-04-03 | — | Documentation is a hand-written artifact — a README table, an openapi.json and an HTML playground — rather than something generated from types, as the Python sibling had it. |
| `p-licence-mit` | 1 | superseded | 2026-04-03 | — | MIT — claimed in the README badge and footer ("use it however you want") without a LICENSE file. |
| `p-licence-mit` | 2 | active | 2026-09-01 | `p-licence-mit` v1 | MIT, with a LICENSE file (copyright 2026 Toledo Technologies LLC) committed — locally, not yet pushed. |
| `p-single-source-of-truth` | 1 | active | 2026-07-25 | — | This repository owns the Worker code, the OpenAPI description, operator documentation and the editable docs/index.html; mirrors are archived as historical baselines, never spliced or synced. |
| `p-explicit-deploy-decision` | 1 | active | 2026-07-25 | — | Local source changes never authorise a Cloudflare deployment; new surface work requires the normal Worker tests and an explicit deployment decision. |

##### Goals (lifecycle)

| Id | v | Status | Introduced | Review by | Supersedes | Statement |
|---|---|---|---|---|---|---|
| `g-port-and-deploy-edge` | 1 | achieved | 2026-03-26 | — | — | Re-express the 24 utility routes as a Cloudflare Worker and put them live on the free tier. |
| `g-document-the-surface` | 1 | achieved | 2026-04-03 | — | — | Give the live API a README with every endpoint, an OpenAPI document and an interactive playground. |
| `g-rapidapi-discovery` | 1 | blocked | 2026-04-03 | 2026-12-31 | — | Be discoverable on RapidAPI ("Listed for marketplace discovery"), possibly as a freemium tier. |
| `g-revenue-classification` | 1 | blocked | 2026-05-05 | 2026-12-31 | — | Be a revenue asset (the manifest's type), by a freemium tier or as a sellable Worker template. |
| `g-one-canonical-hydra` | 1 | achieved | 2026-07-24 | — | — | End the duplication between the Worker's docs/ and the standalone hydra-site by declaring one owner of the surface. |
| `g-licence-file` | 1 | achieved | 2026-07-20 | — | — | Add the LICENSE file the README's MIT badge implies. |
| `g-reconcile-counts-and-links` | 1 | proposed | 2026-06-26 | 2026-12-31 | — | Make the endpoint count consistent (README, badge, openapi.json, playground, live banner) and point the live banner's docs field at the real playground. |
| `g-real-test` | 1 | proposed | 2026-08-03 | 2026-12-31 | — | Replace or delete the starter-template test so that "the normal Worker tests" in the source-of-truth note exist. |
<!-- END GENERATED: decision-index -->

## Chapter: TIMELINE.md

## Timeline — deterministic, evidence-linked index

_Generated by `scripts/project_history.mjs render` from event front matter and claim dates. Rows are sorted by date, then kind, then id; identical inputs produce identical output. Times inside claim locators are UTC unless marked EDT. This index is a lookup aid, not the story — read `NARRATIVE.md` for causality._

Reading the rows: `occurred` / `decided` / `merged` / `released` are the distinct dates carried by each event capsule (null dates are omitted); `claim` rows carry the claim's own date or the start of its date range. The `released` row on 2026-04-03 is the first evidence of the live URL, not the (unrecorded) first `wrangler deploy`; the `merged` row on 2026-09-01 for the consolidation marks the commit that captured edits made on 2026-07-25.

<!-- BEGIN GENERATED: timeline -->
| Date | Kind | Id | Summary | Record |
|---|---|---|---|---|
| 2025-08-18 | claim | `hw-c19` | NoHustle API (2025-08-18..21) shares this project's author, its marketplace thesis and its Render-first habit | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c01` | The repository began on 2026-03-26 at 06:28:23Z (02:28 EDT) with a 414-line Hono Worker (src/index.js, 26 rout | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c02` | The root commit is a route-for-route port of the FastAPI file committed to hydra-toolkit-api 75 minutes earlie | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c03` | The Worker has no authentication, no rate limiting, no storage, no bindings and no outbound calls; cors() is a | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c04` | The only test file is wrangler's starter template ("Hello World worker", asserting GET / returns "Hello World! | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c09` | The endpoint count is stated inconsistently everywhere and never reconciled: README title, badge, GitHub descr | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c20` | HYDRA inverts every choice NoHustle stalled on — twenty heavy dependencies became one, SQLite metering became | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c21` | Cross-references inside the HYDRA family run one way: this Worker's banner and README point at the Python repo | `.project-history/claims.yml` |
| 2026-03-26 | claim | `hw-c25` | The runtime configuration is wrangler's generated template with only the name and entry point filled in: compa | `.project-history/claims.yml` |
| 2026-03-26 | decided | `hydra-worker-2026-03-26-worker-port-and-first-deploy` | The FastAPI toolkit is re-expressed as a Cloudflare Worker seventeen minutes after its Render blueprint | `.project-history/events/2026/hydra-worker-2026-03-26-worker-port-and-first-deploy.md` |
| 2026-03-26 | merged | `hydra-worker-2026-03-26-worker-port-and-first-deploy` | The FastAPI toolkit is re-expressed as a Cloudflare Worker seventeen minutes after its Render blueprint | `.project-history/events/2026/hydra-worker-2026-03-26-worker-port-and-first-deploy.md` |
| 2026-03-26 | occurred | `hydra-worker-2026-03-26-worker-port-and-first-deploy` | The FastAPI toolkit is re-expressed as a Cloudflare Worker seventeen minutes after its Render blueprint | `.project-history/events/2026/hydra-worker-2026-03-26-worker-port-and-first-deploy.md` |
| 2026-04-03 | claim | `hw-c05` | On 2026-04-03 at 07:59Z a 106-line README published the live URL hydra-worker.toledonick98.workers.dev, "22 de | `.project-history/claims.yml` |
| 2026-04-03 | claim | `hw-c06` | Two minutes later (08:01Z) openapi.json (257 lines; description "20+ developer utility endpoints"; 26 paths; s | `.project-history/claims.yml` |
| 2026-04-03 | claim | `hw-c07` | GitHub Pages serves docs/index.html at https://ntoledo319.github.io/hydra-worker/ from master:/docs; the Pages | `.project-history/claims.yml` |
| 2026-04-03 | claim | `hw-c08` | The Worker is deployed manually ("npx wrangler deploy"), has no CI/CD, no custom domain and no route configura | `.project-history/claims.yml` |
| 2026-04-03 | claim | `hw-c23` | Whether a RapidAPI listing for HYDRA was ever created is unknown: the README asserts "Listed for marketplace d | `.project-history/claims.yml` |
| 2026-04-03 | decided | `hydra-worker-2026-04-03-readme-openapi-playground-and-pages` | The live URL is published with a hand-written README, OpenAPI document and playground — and GitHub Pages quietly serves it | `.project-history/events/2026/hydra-worker-2026-04-03-readme-openapi-playground-and-pages.md` |
| 2026-04-03 | merged | `hydra-worker-2026-04-03-readme-openapi-playground-and-pages` | The live URL is published with a hand-written README, OpenAPI document and playground — and GitHub Pages quietly serves it | `.project-history/events/2026/hydra-worker-2026-04-03-readme-openapi-playground-and-pages.md` |
| 2026-04-03 | occurred | `hydra-worker-2026-04-03-readme-openapi-playground-and-pages` | The live URL is published with a hand-written README, OpenAPI document and playground — and GitHub Pages quietly serves it | `.project-history/events/2026/hydra-worker-2026-04-03-readme-openapi-playground-and-pages.md` |
| 2026-04-03 | released | `hydra-worker-2026-03-26-worker-port-and-first-deploy` | The FastAPI toolkit is re-expressed as a Cloudflare Worker seventeen minutes after its Render blueprint | `.project-history/events/2026/hydra-worker-2026-03-26-worker-port-and-first-deploy.md` |
| 2026-04-03 | released | `hydra-worker-2026-04-03-readme-openapi-playground-and-pages` | The live URL is published with a hand-written README, OpenAPI document and playground — and GitHub Pages quietly serves it | `.project-history/events/2026/hydra-worker-2026-04-03-readme-openapi-playground-and-pages.md` |
| 2026-05-05 | claim | `hw-c10` | On 2026-05-05 the workspace migration moved the checkout from the macOS CascadeProjects directory into backbur | `.project-history/claims.yml` |
| 2026-05-05 | decided | `hydra-worker-2026-05-05-backburner-then-active-reclassification` | The workspace migration files the live Worker under backburner/ as "revenue, platform none, url null"; it is promoted to active/ within six weeks | `.project-history/events/2026/hydra-worker-2026-05-05-backburner-then-active-reclassification.md` |
| 2026-05-05 | occurred | `hydra-worker-2026-05-05-backburner-then-active-reclassification` | The workspace migration files the live Worker under backburner/ as "revenue, platform none, url null"; it is promoted to active/ within six weeks | `.project-history/events/2026/hydra-worker-2026-05-05-backburner-then-active-reclassification.md` |
| 2026-05-28 | claim | `hw-c11` | On 2026-05-28 a private repository hydra-site was created with one commit ("Initial commit — safe backup to re | `.project-history/claims.yml` |
| 2026-05-28 | decided | `hydra-worker-2026-05-28-hydra-site-static-mirror` | A byte-identical copy of the playground becomes a separate "hydra-site" repository that the owner's trackers mistake for the product | `.project-history/events/2026/hydra-worker-2026-05-28-hydra-site-static-mirror.md` |
| 2026-05-28 | occurred | `hydra-worker-2026-05-28-hydra-site-static-mirror` | A byte-identical copy of the playground becomes a separate "hydra-site" repository that the owner's trackers mistake for the product | `.project-history/events/2026/hydra-worker-2026-05-28-hydra-site-static-mirror.md` |
| 2026-06-05 | claim | `hw-c12` | June 2026 framed HYDRA from three directions without changing it: the asset-sale kit valued it as "a template, | `.project-history/claims.yml` |
| 2026-06-17 | occurred | `hydra-worker-2026-06-17-price-gate-and-asset-kit` | June 2026 frames HYDRA three ways — template for sale, freemium candidate, gate-failed for "no price" — and changes nothing | `.project-history/events/2026/hydra-worker-2026-06-17-price-gate-and-asset-kit.md` |
| 2026-06-22 | claim | `hw-c22` | The June-2026 business reconciliation called hydra-worker "PILOT-READY — RapidAPI freemium/metered (OpenAPI sp | `.project-history/claims.yml` |
| 2026-07-20 | claim | `hw-c13` | The 2026-07-20 value audit flagged "MIT claimed with no LICENSE file" and the same day's ship queue scheduled | `.project-history/claims.yml` |
| 2026-07-25 | claim | `hw-c14` | On 2026-07-25 a source-of-truth boundary was enacted: this repository owns the Worker code, OpenAPI descriptio | `.project-history/claims.yml` |
| 2026-07-25 | decided | `hydra-worker-2026-07-25-source-of-truth-consolidation` | The Worker is declared the single source of truth; the static mirror is archived byte-identically; deployment becomes an explicit decision | `.project-history/events/2026/hydra-worker-2026-07-25-source-of-truth-consolidation.md` |
| 2026-07-25 | occurred | `hydra-worker-2026-07-25-source-of-truth-consolidation` | The Worker is declared the single source of truth; the static mirror is archived byte-identically; deployment becomes an explicit decision | `.project-history/events/2026/hydra-worker-2026-07-25-source-of-truth-consolidation.md` |
| 2026-08-03 | claim | `hw-c15` | Three August-2026 reviews measured the repository: the 2026-08-03 registry note (live-verified, 26 routes, "3 | `.project-history/claims.yml` |
| 2026-08-06 | occurred | `hydra-worker-2026-08-06-audits-park-vs-kill` | Three August reviews measure the Worker — PARK by judgement, KILL by rule, "fix the counts" by the registry — and none is acted on | `.project-history/events/2026/hydra-worker-2026-08-06-audits-park-vs-kill.md` |
| 2026-09-01 | claim | `hw-c16` | On 2026-09-01 at 00:02 EDT a commit authored "AI Assistant <ai@example.com>" and titled "chore: snapshot curre | `.project-history/claims.yml` |
| 2026-09-01 | claim | `hw-c18` | The committed .toledo.yaml records the original checkout path under the owner's macOS home directory; the 2026 | `.project-history/claims.yml` |
| 2026-09-01 | merged | `hydra-worker-2026-07-25-source-of-truth-consolidation` | The Worker is declared the single source of truth; the static mirror is archived byte-identically; deployment becomes an explicit decision | `.project-history/events/2026/hydra-worker-2026-07-25-source-of-truth-consolidation.md` |
| 2026-09-01 | merged | `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest` | An agent-authored "snapshot" commit captures the consolidation, adds the MIT LICENSE file and the manifest — and stays unpushed | `.project-history/events/2026/hydra-worker-2026-09-01-snapshot-commit-license-and-manifest.md` |
| 2026-09-01 | occurred | `hydra-worker-2026-09-01-snapshot-commit-license-and-manifest` | An agent-authored "snapshot" commit captures the consolidation, adds the MIT LICENSE file and the manifest — and stays unpushed | `.project-history/events/2026/hydra-worker-2026-09-01-snapshot-commit-license-and-manifest.md` |
| 2026-09-02 | claim | `hw-c17` | The September 2026 credential purge classified this history's two pattern matches as public configuration (RET | `.project-history/claims.yml` |
| 2026-09-02 | decided | `hydra-worker-2026-09-02-credential-purge-untouched` | The September 2026 credential purge classifies the history as clean and leaves it unrewritten and unpushed | `.project-history/events/2026/hydra-worker-2026-09-02-credential-purge-untouched.md` |
| 2026-09-02 | occurred | `hydra-worker-2026-09-02-credential-purge-untouched` | The September 2026 credential purge classifies the history as clean and leaves it unrewritten and unpushed | `.project-history/events/2026/hydra-worker-2026-09-02-credential-purge-untouched.md` |
| 2026-09-04 | claim | `hw-c24` | The working tree was clean at the start of the reconstruction (git status empty; reflog 4 entries; no stash); | `.project-history/claims.yml` |
| 2026-09-04 | claim | `hw-c26` | The repository has no tags, releases, issues or pull requests; the API reports version 1.0.0 and package.json | `.project-history/claims.yml` |
| 2026-09-04 | decided | `hydra-worker-2026-09-04-history-system-bootstrap` | Bootstrap of the project-history system (reconstruction and maintenance mechanism) | `.project-history/events/2026/hydra-worker-2026-09-04-history-system-bootstrap.md` |
| 2026-09-04 | occurred | `hydra-worker-2026-09-04-history-system-bootstrap` | Bootstrap of the project-history system (reconstruction and maintenance mechanism) | `.project-history/events/2026/hydra-worker-2026-09-04-history-system-bootstrap.md` |

#### Git anchors cited by events

- `0106964e92fa29d6a9cde46fa652839cb282b302`
- `2a804e67b5eb84bb52ddd4950fa41b0aa533959b`
- `465f28476f262c580f8e9a10638851209cafe88c`
- `57154c55564897f96eebf558b14f51c24c0a80eb`
- `6808ec82597245fd620b15a45f15483b67699d78`
- `73e342abef33abc9161838c868d5f3939d92e721`
- `e961c9d60348d3f767ea782ee595b781977458ab`
- `ff404c6030c6529b28dbc50ff7b80f1031eb7916`
<!-- END GENERATED: timeline -->

## Chapter: OPEN_QUESTIONS.md

## Open questions, gaps and low-confidence claims

_Ranked by how much an answer would change the record. "No evidence found" is never treated as "did not happen"; each entry names what was searched and what would settle it._

### Ranked questions

1. **Why were two implementations made the same night, and why did the edge win?** Commit order and the README's marketing copy are the only witnesses. Searched: both repositories' full histories, every owner document naming HYDRA, the migration logs. Would settle it: the AI-assisted authoring session of 2026-03-26 (former `CascadeProjects` directory; inaccessible) or one sentence from the owner. Affects `hw-c20` (plausible), contradiction `hydra-worker-x3`.
2. **When was the Worker first deployed, and has anyone but the owner's monitors ever called it?** Bounded by the root commit and the README; no analytics in scope. Would settle it: the Cloudflare dashboard's deployment history and request analytics. Affects `hw-c08`'s caveat, goal `g-port-and-deploy-edge`'s date, and the "no external user evidenced" statement in `IDEOLOGY.md`.
3. **Does a RapidAPI listing exist?** The README says "Listed"; every later reviewer says unverified or to-do. Would settle it: the RapidAPI provider dashboard. Affects `hw-c23` (unknown), `hydra-worker-x6`, goal `g-rapidapi-discovery`.
4. **What is the price decision — freemium tier, template sale, backlink asset, or drop the label?** Four June documents, no answer. Would settle it: an owner decision recorded as an event. Affects `hydra-worker-x4`, goals `g-rapidapi-discovery` and `g-revenue-classification`.
5. **Which August verdict stands — park, kill, or leave-as-is after fixes?** Would settle it: an event capsule. Affects the open event `hydra-worker-2026-08-06-audits-park-vs-kill`, `hydra-worker-x7`.
6. **Who wrote the 2026-07-25 boundary and who directed the 2026-09-01 snapshot commit?** The commit is authored by a placeholder agent identity; the boundary carries no author. Would settle it: the owner's agent-session records. Affects `hw-c14`'s and `hw-c16`'s caveats.
7. **Should the snapshot be pushed as-is?** It carries the licence file and the boundary the public repository lacks, and a manifest with the owner's home-directory path (`hw-c18`). An owner decision; recorded here as a question, not advice.
8. **Was GitHub Pages enabled deliberately?** No document mentions it before August. Would settle it: the repository's Pages settings history. Affects `hw-c07`'s caveat.
9. **Why "22"?** Twenty-four utility routes exist; the count 22 appears in the title, badge, description and playground. A grouping convention is defensible but unstated. Affects `hw-c09`'s caveat only.
10. **Why a backup repository (hydra-site) on 2026-05-28 rather than a link to this repository's docs/?** Would settle it: the owner. Affects the hydra-site event's "Unresolved questions".

### Contradictions carried in the register (`.project-history/contradictions.yml`)

- `hydra-worker-x1` — endpoint count (fact; confirmed: 24 utilities + 2 meta; every published number wrong; one audit added an error).
- `hydra-worker-x2` — live in July 2026 (fact; confirmed: yes; the "not live" note examined the wrong repository).
- `hydra-worker-x3` — predecessor or parallel variant (chronology; strongly supported: both, of different things).
- `hydra-worker-x4` — revenue asset (interpretation; confirmed: a label without a price or mechanism).
- `hydra-worker-x5` — which repository was the site (fact; confirmed: this one's `docs/`).
- `hydra-worker-x6` — RapidAPI listing (outcome; unknown).
- `hydra-worker-x7` — what should become of it (interpretation; plausible: keep, fix counts/link/test, decide the price).
- `hydra-worker-x8` — has tests (fact; confirmed: a file, not a test).

### Low-confidence claims to keep visible

- `hw-c20` (plausible, inferred) — HYDRA as a deliberate inversion of NoHustle.
- `hw-c23` (unknown) — existence of a RapidAPI listing.
- `hw-c08`'s first-deploy date (bounded, not known).
- `hw-c14`'s and `hw-c16`'s authorship (agent tooling, human intent unrecorded).

### Evidence gaps and lost or inaccessible sources

- The 2026-03-26 authoring session (former macOS `CascadeProjects` path, unlinked 2026-05-05).
- Cloudflare Workers dashboard (deployments, analytics, errors).
- RapidAPI provider account state.
- The agent sessions behind the 2026-07-25 edits and the 2026-09-01 commit.
- Any pre-repository design note; none exists in the owner's synced documents (searched only for the project's names).
- `package-lock.json` (2,788 lines) was treated as generated and not read; the product's vitest suite was deliberately not executed.

### Biases audited

- **Main-branch bias:** one branch; the remote-tracking ref was compared (one unpushed local commit); no never-merged work exists.
- **Survivor bias:** the Worker is the survivor of the family, and its README's framing ("Also Available", "Listed") was not allowed to stand as fact; each claim was tested against measurement and later reviewers.
- **Recency and hindsight bias:** the August verdicts and the June framings are labelled as agent-written opinions dated months after the event; they are not used to infer March intent.
- **Most-articulate-source bias:** the 2026-08-03 registry note is the longest and most precise source about this repository, and it contains a demonstrable error (the openapi path count); it is cited for its measurements and corrected where the committed file disagrees.
- **Authorship bias:** the latest commit is authored by a placeholder agent identity; Git authorship is not treated as intellectual authorship anywhere in this record.

### Coverage statement

All four reachable commits were deep-read (the lockfile excepted); both refs examined; the remote compared; the four related repositories read in full; GitHub metadata, Pages, Actions and security settings read; the live Worker and Pages probed; every dated owner document naming HYDRA read for the relevant lines. That is complete coverage of the available record and is not the same as knowing the project's full history: the design was made inside a session whose transcript is unavailable, the deployment platform and marketplace were not consulted, and the two most recent changes to the repository were enacted by agents whose instructions are not on disk. See Appendix D of `PROJECT_HISTORY.md` and `state.yml` for counts, exclusions and the coverage matrix.

## Appendix A — Claims ledger

| Claim | Date | Type | Status | Confidence | Statement |
|---|---|---|---|---|---|
| `hw-c01` | 2026-03-26 | direct | verified | confirmed | The repository began on 2026-03-26 at 06:28:23Z (02:28 EDT) with a 414-line Hono Worker (src/index.js, 26 routes), wrangler's starter scaffolding (wrangler.jsonc with compatibility_date 2025-09-27 and nodejs_compat, a template vitest test, editorconfig, prettier) and one runtime dependency (hono); the GitHub repository was created seven seconds later with the description "22 free developer utility endpoints…" and topics api, cloudflare-workers, developer-tools, free, serverless. |
| `hw-c02` | 2026-03-26 | behavioral | verified | confirmed | The root commit is a route-for-route port of the FastAPI file committed to hydra-toolkit-api 75 minutes earlier: all 26 routes match, identifier overlap is 0.82, the stop-word list, the fake-company literal "Acme Corp" and the password heuristics are the same, and the Worker's / banner links its docs field to github.com/ntoledo319/hydra-toolkit-api. |
| `hw-c03` | 2026-03-26 | direct | verified | confirmed | The Worker has no authentication, no rate limiting, no storage, no bindings and no outbound calls; cors() is applied to every route; every handler is a pure function of its request; the banner reports version 1.0.0 while package.json says 0.0.0. |
| `hw-c04` | 2026-03-26..2026-09-04 | direct | verified | confirmed | The only test file is wrangler's starter template ("Hello World worker", asserting GET / returns "Hello World!"), never adapted; against this app the assertion cannot pass, yet "npm test" (vitest) is the declared test command and later audits and the asset kit count "tests present". |
| `hw-c05` | 2026-04-03 | direct | verified | confirmed | On 2026-04-03 at 07:59Z a 106-line README published the live URL hydra-worker.toledonick98.workers.dev, "22 developer utility endpoints on the global edge. Free. No API key required.", badges for 22 endpoints and an MIT licence (with no LICENSE file), an "All 22 Endpoints" table containing 24 rows, a tech-stack section ("~50ms worldwide", "$0 on Workers free tier (100K req/day)", "Zero dependencies beyond Hono"), and an "Also Available" section naming the Python/FastAPI version, "RapidAPI: Listed for marketplace discovery" and an OpenAPI spec. |
| `hw-c06` | 2026-04-03 | direct | verified | confirmed | Two minutes later (08:01Z) openapi.json (257 lines; description "20+ developer utility endpoints"; 26 paths; server = the workers.dev URL) and docs/index.html (176 lines; "22 free developer utility endpoints"; a "22 Endpoints" badge; a playground whose dropdown wires 17 endpoints; "MIT License" in the footer) were committed by hand — there is no generator in the tree. |
| `hw-c07` | 2026-04-03..2026-09-04 | behavioral | verified | confirmed | GitHub Pages serves docs/index.html at https://ntoledo319.github.io/hydra-worker/ from master:/docs; the Pages build ("pages build and deployment", 2026-04-03T08:01:27Z) is the repository's only GitHub Actions run; the page answered 200 on 2026-08-03 and 2026-09-04; no commit, README line or wrangler setting mentions Pages, and the Worker itself serves no HTML (its assets binding is commented out). |
| `hw-c08` | 2026-04-03..2026-09-04 | behavioral | verified | confirmed | The Worker is deployed manually ("npx wrangler deploy"), has no CI/CD, no custom domain and no route configuration beyond the default workers.dev subdomain, and has answered HTTP 200 with Cloudflare headers on every probe on record — 2026-06-23, 2026-06-26, 2026-07-20, 2026-08-03, 2026-08-06 and 2026-09-04 (0.11 s; endpoints 20; docs pointing at hydra-toolkit-api). |
| `hw-c09` | 2026-03-26..2026-09-04 | direct | verified | confirmed | The endpoint count is stated inconsistently everywhere and never reconciled: README title, badge, GitHub description and playground say 22; the README table lists 24; openapi.json says "20+" and lists 26 paths; the live banner hard-codes 20; the code has 24 utility routes plus / and /health. The 2026-08-03 registry note added an error of its own, claiming openapi.json has 25 paths and omits /time/convert — it has 26 and includes it. |
| `hw-c10` | 2026-05-05..2026-06-16 | contemporaneous | verified | confirmed | On 2026-05-05 the workspace migration moved the checkout from the macOS CascadeProjects directory into backburner/hydra-worker and generated a manifest with status backburner, type revenue, platform none, url null; the owner's 2026-05-27 tracker still listed it under backburner (dirty) while listing the one-file hydra-site under active/; by 2026-06-16 the registry listed active/hydra-worker. |
| `hw-c11` | 2026-05-28..2026-07-25 | direct | verified | confirmed | On 2026-05-28 a private repository hydra-site was created with one commit ("Initial commit — safe backup to remote") whose public/index.html is byte-identical (sha256 dfbcface…) to this repository's docs/index.html; the owner's trackers called it "Web presence for the Hydra ecosystem" with "purpose unclear — needs definition", and the 2026-07-20 ship queue scheduled deploying it to Cloudflare Pages in 20 minutes; it was never deployed. |
| `hw-c12` | 2026-06-05..2026-06-26 | retrospective | reported | confirmed | June 2026 framed HYDRA from three directions without changing it: the asset-sale kit valued it as "a template, not a product" with "17+ endpoints" and "no canonical price"; the marketing-machine gate failed "hydra" on G1 "no price set" and told the owner to set a freemium tier or designate it a backlink asset; the master portfolio called it "LIVE … a clean edge-deploy demonstration more than a business" and "a freemium RapidAPI candidate"; the launched- products brief allocated it 10-15% and asked for the endpoint count and docs URL to be confirmed. |
| `hw-c13` | 2026-07-20..2026-07-22 | retrospective | reported | confirmed | The 2026-07-20 value audit flagged "MIT claimed with no LICENSE file" and the same day's ship queue scheduled "hydra-site + LICENSE on hydra-worker" for day five; the 2026-07-22 research note concluded "hydra is NOT actually live (static backup repo, no deploy pipeline)" while the Worker was answering 200 — it had examined hydra-site and the May manifest. |
| `hw-c14` | 2026-07-25 | contemporaneous | verified | confirmed | On 2026-07-25 a source-of-truth boundary was enacted: this repository owns the Worker code, OpenAPI description, operator documentation and editable docs/index.html; hydra-site was moved to archive/duplicates as a byte-identical historical baseline; a README note and docs/SOURCE-OF-TRUTH.md were written into the working tree (uncommitted until 2026-09-01) stating that new surface work "requires the normal Worker tests and an explicit deployment decision"; the workspace registry recorded canonical_status canonical, the known risk "Local source changes do not authorize a Cloudflare deployment", and a note to keep docs/index.html synchronised by hash check. The 2026-07-24 synergy report had recommended exactly this consolidation the day before. |
| `hw-c15` | 2026-08-03..2026-08-06 | retrospective | reported | confirmed | Three August-2026 reviews measured the repository: the 2026-08-03 registry note (live-verified, 26 routes, "3 uncommitted (M README.md, ?? .toledo.yaml, ?? docs/SOURCE-OF-TRUTH.md)", test "would FAIL", CI none, Pages accidental, next action "reconcile the endpoint count … fix the live banner docs link … delete or update the broken template test"); the 2026-08-06 dossier (PARK — "wire a real monetization/metering path … or drop the type: revenue label"); and the rule-based estate audit (KILL — "trivial: under 500 logical lines and under 10 commits"; License none). None was acted on. |
| `hw-c16` | 2026-09-01 | direct | verified | confirmed | On 2026-09-01 at 00:02 EDT a commit authored "AI Assistant <ai@example.com>" and titled "chore: snapshot current progress" captured the consolidation edits plus two new files: LICENSE (MIT, copyright 2026 Toledo Technologies LLC) and .toledo.yaml (status active, type revenue, platform cloudflare-workers, the live URL, last_touched 2026-04-03, the original macOS path, notes "Canonical HYDRA implementation and editable documentation surface since 2026-07-25"). It has not been pushed: origin/master is still the 2026-04-03 tip. |
| `hw-c17` | 2026-09-02 | contemporaneous | verified | confirmed | The September 2026 credential purge classified this history's two pattern matches as public configuration (RETAINED_PUBLIC_CLASS), performed no rewrite and no push; GitHub secret scanning and push protection are enabled on the public repository. |
| `hw-c18` | 2026-09-01 | behavioral | verified | confirmed | The committed .toledo.yaml records the original checkout path under the owner's macOS home directory; the 2026-08-03 registry had warned that the then-untracked manifest was "a latent leak only if someone runs a blanket git add -A" — the 2026-09-01 snapshot did exactly that, though nothing has been pushed. |
| `hw-c19` | 2025-08-18..2026-03-26 | behavioral | verified | confirmed | NoHustle API (2025-08-18..21) shares this project's author, its marketplace thesis and its Render-first habit (via the Python sibling), but shares no route beyond / and /health, no distinctive literal and no dependency beyond the language; neither repository, nor any portfolio document, references the other. |
| `hw-c20` | 2026-03-26 | inferred | inferred | plausible | HYDRA inverts every choice NoHustle stalled on — twenty heavy dependencies became one, SQLite metering became statelessness, API keys and four paid tiers became keyless and free, BSL 1.1 became MIT, a Render monolith on a disk became the edge — which reads as a lesson learned, but no source states that intent. |
| `hw-c21` | 2026-03-26..2026-09-04 | direct | verified | confirmed | Cross-references inside the HYDRA family run one way: this Worker's banner and README point at the Python repository ("docs", "Also Available"), while the Python repository never links back; a caller following the live API's own metadata lands on a shelved implementation, not on this playground. |
| `hw-c22` | 2026-06-22 | retrospective | reported | confirmed | The June-2026 business reconciliation called hydra-worker "PILOT-READY — RapidAPI freemium/metered (OpenAPI spec already present); add proxy-secret enforcement for paid tier", listed "list hydra-worker on RapidAPI; archive dead hydra-api" as a next action, recorded "20 endpoints … not yet monetized", and filed HYDRA as "ACTIVE-UNDOCUMENTED (.toledo.yaml says url=null while the worker is live)". |
| `hw-c23` | 2026-04-03..2026-09-04 | inferred | unknown | unknown | Whether a RapidAPI listing for HYDRA was ever created is unknown: the README asserts "Listed for marketplace discovery", every later reviewer marks it unverified or still-to-do, the marketing gate fails it for having no price, and the provider dashboard was not consulted. |
| `hw-c24` | 2026-09-04 | behavioral | verified | confirmed | The working tree was clean at the start of the reconstruction (git status empty; reflog 4 entries; no stash); the lead's first dispatch brief had assigned the Python sibling's dirty set to this repository, and the corrected brief and the measured state agree. Nothing here was modified, staged, committed or pushed by the reconstruction beyond the history artifacts. |
| `hw-c25` | 2026-03-26 | direct | verified | confirmed | The runtime configuration is wrangler's generated template with only the name and entry point filled in: compatibility_date 2025-09-27 (six months before the project existed), observability enabled, source maps uploaded, nodejs_compat, every binding, variable, asset and service example left commented out. |
| `hw-c26` | 2026-09-04 | behavioral | verified | confirmed | The repository has no tags, releases, issues or pull requests; the API reports version 1.0.0 and package.json 0.0.0; no version has ever changed; the only mechanism that has ever run on GitHub for it is the Pages build. |

## Appendix B — Contradiction register

### `hydra-worker-x1` — How many endpoints does HYDRA have?

- Disagreement kind: fact
- Account (src-git-hydra-worker; 2026-03-26; contemporaneous code): src/index.js registers 26 routes (24 utilities plus / and /health); the / banner hard-codes endpoints 20.
- Account (src-git-hydra-worker, src-gh-metadata; 2026-04-03; contemporaneous documentation): README title, badge and GitHub description say 22; the README's own 'All 22 Endpoints' table has 24 rows; openapi.json says '20+' and lists 26 paths; the playground says 22 and wires 17.
- Account (src-tc-registry-hydra; 2026-08-03; agent measurement, four months later): 'openapi.json paths = 25 entries (and it omits /time/convert/:ts)' — which is wrong against the committed file (26 paths, including /time/convert/{timestamp}).
- Best-supported reading (confirmed): 24 utility routes plus two meta routes; every published number is an unreconciled approximation, and one later audit added an error of its own.
- Resolving evidence: none needed; a README/banner/openapi reconciliation would close it.

### `hydra-worker-x2` — Was HYDRA live in July 2026?

- Disagreement kind: fact
- Account (src-tc-root-reports-2026-07; 2026-07-20; owner-side planning): 'hydra-worker — LIVE — verify only (all confirmed 200)'.
- Account (src-tc-root-reports-2026-07; 2026-07-22; owner-side research note, two days later): 'hydra is NOT actually live (static backup repo, no deploy pipeline, its own registry says not deployed?)'.
- Account (src-live-probe, src-tc-registry-hydra, src-tc-audit-2026-08; 2026-08-03; measurement): HTTP 200 with Cloudflare headers on 2026-07-20, 2026-08-03, 2026-08-06 and 2026-09-04.
- Best-supported reading (confirmed): Live throughout; the 2026-07-22 note examined hydra-site (a static file) and the May manifest (url null), not the Worker.
- Resolving evidence: none needed; the consolidation of 2026-07-25 removed the ambiguity that caused it.

### `hydra-worker-x3` — Is the Python/FastAPI repository this Worker's predecessor or a parallel variant?

- Disagreement kind: chronology
- Account (src-git-hydra-api, src-git-hydra-worker; 2026-03-26; contemporaneous machine record): The FastAPI root commit precedes this root by 75 minutes; this code is a route-for-route port; the banner links its docs back there.
- Account (src-git-hydra-worker, src-tc-master-portfolio; 2026-04-03; author, eight days after the event; owner portfolio in June): 'Also Available: Python/FastAPI version'; 'a parallel Python/FastAPI variant for a possible RapidAPI listing'.
- Account (src-tc-registry-hydra; 2026-08-03; agent-written, four months later): 'earlier Python/FastAPI predecessor … never deployed … Superseded/shelved'.
- Best-supported reading (strongly_supported): Chronologically the predecessor and functionally the source; strategically framed as a sibling; by outcome, shelved. All three are true of different things.
- Resolving evidence: The authoring session of 2026-03-26 or an owner statement about why two implementations were made the same night.

### `hydra-worker-x4` — Is this a revenue asset?

- Disagreement kind: interpretation
- Account (src-tc-meta-inventory-2026-05, src-git-hydra-worker; 2026-05-05; owner tooling; committed 2026-09-01): .toledo.yaml: type revenue.
- Account (src-business-ops, src-marketing-arm; 2026-06-17; owner strategy documents): 'PILOT-READY — RapidAPI freemium/metered' (business-ops) versus 'fails G1: no price set … a business-model decision, not a one-click fix' (marketing gate) versus 'price it like a template, not a product' (asset kit).
- Account (src-git-hydra-worker, src-tc-audit-2026-08; 2026-08-06; code and measurement): No auth, no rate limit, no billing anywhere in code; "aspirational, not real revenue".
- Best-supported reading (confirmed): A free reference implementation carrying a revenue label that no document has turned into a price; the strategy documents disagree only about how to describe the gap.
- Resolving evidence: A decided price or a recorded decision to designate HYDRA a lead/backlink asset.

### `hydra-worker-x5` — Which repository was "the HYDRA site"?

- Disagreement kind: fact
- Account (src-icloud-ttllc-status, src-tc-root-reports-2026-07; 2026-05-27; owner trackers and ship queue): hydra-site (active/) is 'Web presence for the Hydra ecosystem', to be deployed to Cloudflare Pages; hydra-worker sits in backburner/.
- Account (src-gh-metadata, src-live-probe; 2026-04-03; machine record): The Worker's docs/index.html has been served by GitHub Pages since 2026-04-03 and hydra-site's only file is a byte-identical copy of it.
- Account (src-git-hydra-worker, src-tc-workspace-registry; 2026-07-25; enacted boundary): This repository owns the editable docs/index.html; hydra-site is a retired mirror under archive/duplicates.
- Best-supported reading (confirmed): The site was always this repository's docs/ folder; hydra-site was a backup that the owner's trackers mistook for the product for two months.
- Resolving evidence: none needed.

### `hydra-worker-x6` — Is HYDRA listed on RapidAPI?

- Disagreement kind: outcome
- Account (src-git-hydra-worker; 2026-04-03; author's README): 'RapidAPI: Listed for marketplace discovery'.
- Account (src-tc-audit-2026-08, src-marketing-arm, src-business-ops; 2026-06-17; owner documents and audits): 'UNVERIFIED'; 'no price set'; 'not listed for sale; live as a free worker'; 'list hydra-worker on RapidAPI' still a next action in June.
- Best-supported reading (unknown): Unknown; the only affirmative statement is a README line, and every later reviewer treats a listing as still to do.
- Resolving evidence: The RapidAPI provider dashboard.

### `hydra-worker-x7` — What should become of the repository?

- Disagreement kind: interpretation
- Account (src-tc-audit-2026-08; 2026-08-06; agent judgement): PARK — 'a small, correct, genuinely-live utility API with no downside and no revenue mechanism'.
- Account (src-tc-estate-audit-2026-08; 2026-08-06; rule-generated verdict): KILL — 'trivial: under 500 logical lines and under 10 commits'.
- Account (src-business-ops, src-tc-registry-hydra; 2026-06-22; owner strategy and registry): 'PILOT-READY … list on RapidAPI'; 'leave as-is (live, low-maintenance, $0)' after cheap credibility fixes.
- Best-supported reading (plausible): Keep as a live, free, $0 demonstration; fix the counts, the banner link and the template test; decide the price question or drop the label. None of it has been done.
- Resolving evidence: An owner decision recorded as a history event.

### `hydra-worker-x8` — Does the repository have tests?

- Disagreement kind: fact
- Account (src-tc-audit-2026-08, src-tc-estate-audit-2026-08, src-business-ops; 2026-08-06; scanners and asset kit): 'Tests present: yes'; 'vitest config + tests present'; the asset listing sells 'vitest test setup'.
- Account (src-git-hydra-worker, src-tc-registry-hydra; 2026-08-03; code read): test/index.spec.js is the untouched Cloudflare starter test asserting GET / returns 'Hello World!'; it cannot pass against this app.
- Best-supported reading (confirmed): A test file exists; a test of this product does not.
- Resolving evidence: none needed (static analysis; the suite was deliberately not executed during this reconstruction).

## Appendix C — Source inventory

| Source | Kind | Class | Access | Retrieved | Locator |
|---|---|---|---|---|---|
| `src-git-hydra-worker` | git repository (this project) | direct | accessible | 2026-09-04 | https://github.com/ntoledo319/hydra-worker.git |
| `src-git-hydra-api` | git repository (related; the Python/FastAPI sibling committed 75 minutes before this repository's root) | direct | accessible | 2026-09-04 | https://github.com/ntoledo319/hydra-toolkit-api.git |
| `src-git-hydra-site` | git repository (related; retired static mirror of docs/index.html) | direct | accessible | 2026-09-04 | https://github.com/ntoledo319/hydra-site.git |
| `src-git-nohustle` | git repository (related; thematic predecessor, August 2025) | direct | accessible | 2026-09-04 | https://github.com/ntoledo319/NoHustle-API.git |
| `src-git-thing` | git repository (related; the NoHustle growth kit of August 2025) | direct | accessible | 2026-09-04 | https://github.com/ntoledo319/spidermind-omega.git |
| `src-gh-metadata` | GitHub REST metadata via authenticated gh (read-only) — repository, Pages, Actions runs, security settings | external | accessible | 2026-09-04 | gh api repos/ntoledo319/hydra-worker{,/pages,/actions/runs,/tags,/releases}; git ls-remote |
| `src-live-probe` | read-only HTTP GET probes of public URLs | behavioral | accessible | 2026-09-04 | https://hydra-worker.toledonick98.workers.dev/ and /health; https://ntoledo319.github.io/hydra-worker/; https://hydra-toolkit-api.onrender.com/health |
| `src-worktree-2026-09-04` | working-tree state at audit time | behavioral | accessible | 2026-09-04 | git status --porcelain -uall (clean); git for-each-ref (master 57154c55…, origin/master 6808ec82…) |
| `src-git-toledo-command` | git repository (owner's private control-plane / portfolio index; cited for dated portfolio commits) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command |
| `src-tc-master-portfolio` | owner portfolio documents (toledo-command/MASTER-PORTFOLIO.md section HYDRA; PORTFOLIO-DOSSIER.md; _VC-TARGET-LIST.md) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command/MASTER-PORTFOLIO.md |
| `src-tc-registry-hydra` | owner asset registry note (toledo-command/registry/assets/hydra.md; registry/REPOS.md; registry/SYSTEMS.md) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command/registry/assets/hydra.md |
| `src-tc-audit-2026-08` | owner asset audit dossiers (toledo-command/audit-2026-08/assets/active-hydra-worker.md, archive-duplicates-hydra-site.md, backburner-hydra-api.md; 03-TRUTH-VS-CLAIMS.md) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command/audit-2026-08/assets/active-hydra-worker.md |
| `src-tc-estate-audit-2026-08` | owner estate audit (toledo-command/estate-audit-2026-08/assets/active-hydra-worker.md; layers/01-surfaces-and-domains.md) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command/estate-audit-2026-08/assets/active-hydra-worker.md |
| `src-tc-root-reports-2026-07` | owner root reports (SHIP-QUEUE-2026-07-20, VALUE-AUDIT-GROUND-TRUTH-2026-07-20, GROUND-TRUTH-VALUE-AUDIT-2026-07-20, DEEP-RESEARCH-2026-07-22) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command/archive/root-reports-2026-07/ |
| `src-tc-synergy-report-2026-07-24` | owner generated report (toledo-command/archive/generated-reports/2026-07-24-active-project-synergy/01-portfolio-particle-collider.html) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command/archive/generated-reports/2026-07-24-active-project-synergy/01-portfolio-particle-collider.html |
| `src-tc-meta-inventory-2026-05` | workspace migration records (migration-plan.md, migration-log.txt) | contemporaneous | accessible | 2026-09-04 | /home/nick/Development/toledo-command/archive/_meta-inventory-2026-05/migration-log.txt |
| `src-tc-workspace-registry` | workspace registry and overrides (toledo-command/workspace/registry.json, project-overrides.json, ROOT-LAYOUT.md) | retrospective | accessible | 2026-09-04 | /home/nick/Development/toledo-command/workspace/project-overrides.json |
| `src-marketing-arm` | marketing-machine strategy docs (marketing-arm/portfolio.yml, KILL-LIST.md; toledo-command/strategy/marketing-machine/*) | retrospective | accessible | 2026-09-04 | /home/nick/Development/marketing-arm/portfolio.yml |
| `src-business-ops` | business-ops strategy hub (assets-for-sale/LISTING-COPY/hydra.md, MASTER-ASSET-INVENTORY.md, VALUATION-RATIONALE.md, PRIORITIZED-SALE-QUEUE.md; system-reconciliation/*) | retrospective | accessible | 2026-09-04 | /home/nick/Development/business-ops/assets-for-sale/LISTING-COPY/hydra.md |
| `src-launched-products-brief` | owner marketing resource-allocation brief (active/LAUNCHED_PRODUCTS_MARKETING_RESOURCE_ALLOCATION_BRIEF.md) | retrospective | accessible | 2026-09-04 | /home/nick/Development/active/LAUNCHED_PRODUCTS_MARKETING_RESOURCE_ALLOCATION_BRIEF.md |
| `src-icloud-ttllc-status` | owner status trackers synced from iCloud (TTLLC Status docs — MASTER_PORTFOLIO_TRACKER, ASSETS_TRACKER, DECISION_LOG, PRODUCT_CATALOG) | retrospective | accessible | 2026-09-04 | /home/nick/Development/active/Mind/60 Sources/iCloud/Documents — TTLLC Status docs — trackers — MASTER_PORTFOLIO_TRACKER.md |
| `src-purge-2026-09` | credential-purge records (SECURITY_CLEANUP_REPORT.md; .unlazy/credential-cleanup/verification/*.json; discovery/history.md) | contemporaneous | accessible | 2026-09-04 | /home/nick/Development/SECURITY_CLEANUP_REPORT.md |
| `src-leaf-brief-2026-09-04` | lead agent's dispatch brief for this reconstruction | contemporaneous | accessible | 2026-09-04 | /home/nick/Development/.unlazy/project-history/PLAN.md |
| `src-inaccessible-cloudflare-dashboard` | Cloudflare Workers dashboard — deployment history, request analytics, error rates | external | inaccessible | — | https://dash.cloudflare.com (owner account; not opened) |
| `src-inaccessible-rapidapi` | RapidAPI provider dashboard / listing state | external | inaccessible | — | https://rapidapi.com (owner account; not opened) |
| `src-inaccessible-authoring-sessions` | AI-assistant sessions of 2026-03-26 (CascadeProjects directory) and of 2026-07-25 / 2026-09-01 (the consolidation edits and the snapshot commit authored as "AI Assistant") | external | inaccessible | — | former /Users/…/CascadeProjects path (unlinked 2026-05-05); no transcripts on disk |

## Appendix D — Coverage and reproducibility

- **repository:** ntoledo319/hydra-worker
- **audit_date:** 2026-09-04
- **full_audit_anchor:** 57154c55564897f96eebf558b14f51c24c0a80eb
- **incremental_anchor:** 57154c55564897f96eebf558b14f51c24c0a80eb
- **reachable_commit_count:** 4
- **refs_examined:**
  - refs/heads/master
  - refs/remotes/origin/master
- **exclusion_counts:**
  - commits_total: 4
  - commits_deep_read: 4
  - generated_or_vendored_files_skipped: 1
  - binary_diffs_not_inspected: 0
  - history_only_commits: 0
  - uncommitted_paths_treated_as_present_tense: 0
- **source_classes:**
  - direct: 5
  - contemporaneous: 3
  - retrospective: 12
  - behavioral: 2
  - external: 4
  - inferred: 0
- **inaccessible_sources:**
  - Cloudflare Workers dashboard (first deploy date, deploy history, request analytics)
  - RapidAPI provider account (whether any HYDRA listing exists)
  - AI-assistant sessions of 2026-03-26, 2026-07-25 and 2026-09-01 (intent behind the port, the consolidation and the snapshot commit)
  - Any pre-repository design note; none was found in the owner's synced documents
- **evidence_gaps:**
  - When the Worker was first deployed is bounded only by the root commit (2026-03-26) and the README's live URL (2026-04-03).
  - Why the edge implementation won over the Python sibling is stated only as marketing copy (latency, cost), never as a decision.
  - Whether the GitHub Pages playground was enabled deliberately or by default is unknown; no commit or document mentions enabling it.
  - Who directed the 2026-07-25 consolidation edits and the 2026-09-01 snapshot commit (author "AI Assistant") is inferred from the owner's tooling, not recorded.
  - Whether a RapidAPI listing ever existed is unknown.
  - Whether anyone other than the owner's own monitors has ever called the API is unknown (no analytics in scope).
- **rewritten_history:** no — the September 2026 credential purge classified this history's two pattern matches as public configuration, performed no rewrite, and origin/master still equals the 2026-04-03 tip; nothing in the reachable graph shows force-push or rebase evidence; the only divergence is one unpushed local commit
- **coverage_matrix:**
  - eras:
    - era: prehistory (NoHustle 2025-08; the unrecorded idea before 2026-03-26)
    - git: related repositories fully read
    - docs: owner reports read
    - external: GitHub metadata read
    - gaps: origin of the idea and the authoring prompt unrecorded
    - era: the port and first deploy (2026-03-26..2026-04-03)
    - git: 3 of 3 commits deep-read (package-lock skipped)
    - docs: README, openapi.json, docs/index.html read
    - external: GitHub creation, push and Pages-build timestamps; live probes
    - gaps: first deploy date and intent behind the port inferred
    - era: reclassification and framing by others (2026-05-05..2026-07-24)
    - git: no commits
    - docs: migration log, trackers, portfolio, asset kit, marketing gate, ship queue, deep research, synergy report read
    - external: hydra-site repository and metadata
    - gaps: why hydra-site was created and whether a Pages deploy of it was ever attempted
    - era: consolidation, audits and the snapshot (2026-07-25..2026-09-01)
    - git: 1 of 1 commit deep-read
    - docs: SOURCE-OF-TRUTH.md, registry note, dossiers, overrides read
    - external: live probes
    - gaps: who directed the edits; the LICENSE file's creation date (between 2026-08-06 and 2026-09-01)
    - era: purge and reconstruction (2026-09-02..2026-09-04)
    - git: refs and remote compared
    - docs: purge records read (sanitised)
    - external: GitHub security settings
    - gaps: none material
- **completeness_statement:** All reachable Git objects, the four related repositories and every dated owner document naming HYDRA were reviewed. That is not the same as knowing the project's full history: the design was made inside an AI-assisted session whose transcript is unavailable, the Cloudflare and RapidAPI dashboards were not consulted, and the consolidation and snapshot were enacted by agents whose instructions are not on disk.
