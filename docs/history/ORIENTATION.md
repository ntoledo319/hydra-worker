# Orientation — HYDRA Developer Toolkit (`active/hydra-worker`)

_Present-tense briefing as of the audit date 2026-09-04. Everything here is what is true **now**; the history that produced it lives in the chapters that follow. Read this file first; then read `NARRATIVE.md`._

## What this repository is

The canonical, deployed HYDRA: a 414-line Cloudflare Worker on Hono (`src/index.js`) exposing 24 stateless developer-utility routes plus `/` and `/health` — text analysis, hashing, Base64, UUIDs, JSON validate/diff, regex testing, password scoring, URL/e-mail/JWT parsing, colour conversion, Markdown-to-HTML, time helpers, fake data. No authentication, no rate limit, no storage, no bindings, one runtime dependency. It is the port of the Python/FastAPI file in `backburner/hydra-api` committed 75 minutes earlier on the same night (claim `hw-c02`), and the thematic successor of the August-2025 NoHustle API, with which it shares no code (`hw-c19`).

## What is true today (verified 2026-09-04)

- **Live.** `https://hydra-worker.toledonick98.workers.dev/` answers `200` in ~0.1 s with Cloudflare headers, as it has on every probe on record since 2026-06-23 (`hw-c08`). Its banner still says `endpoints: 20` and points `docs` at the shelved Python repository (`hw-c21`).
- **Playground live on GitHub Pages** at `https://ntoledo319.github.io/hydra-worker/` from `master:/docs`, enabled since 2026-04-03 and documented nowhere but here (`hw-c07`).
- **Deployment is manual** (`npx wrangler deploy`), there is no CI/CD, no custom domain, and `docs/SOURCE-OF-TRUTH.md` rules that local changes never authorise a deployment (`hw-c08`, `hw-c14`).
- **Local `master` is one unpushed commit ahead of `origin/master`.** The 2026-09-01 snapshot (`57154c55564897f96eebf558b14f51c24c0a80eb`, author "AI Assistant") added `LICENSE` (MIT), `.toledo.yaml`, the source-of-truth note and `docs/SOURCE-OF-TRUTH.md`; GitHub still shows the 2026-04-03 tip and no licence file (`hw-c16`).
- **The endpoint count is wrong everywhere.** README/badge/playground 22; README table 24; `openapi.json` "20+" with 26 paths; live banner 20; code 24 utilities + 2 meta (`hw-c09`, contradiction `hydra-worker-x1`).
- **The only test cannot pass.** `test/index.spec.js` is the untouched starter template asserting `GET /` returns "Hello World!" (`hw-c04`, `hydra-worker-x8`).
- **Labelled `revenue`, earns nothing.** Free, keyless, no billing; the June-2026 marketing gate failed it for "no price set"; whether a RapidAPI listing exists is unknown (`hw-c12`, `hw-c23`).
- **Public, secret-scanned, unrewritten.** The September-2026 credential purge classified its two pattern matches as public configuration and touched nothing (`hw-c17`).
- **Working tree (present tense):** clean.

## Who should care, and what for

- **Anyone about to edit `src/index.js`, `openapi.json` or `docs/index.html`.** Three artifacts describe one surface and already disagree; the playground wires only 17 of 24 endpoints; the banner's link is wrong. Goal `g-reconcile-counts-and-links` is waiting for you.
- **Anyone about to deploy.** Deployment is an explicit decision, and "the normal Worker tests" the boundary document requires do not yet exist (`g-real-test`).
- **Anyone deciding the price question.** Three June documents named the options — freemium tier, template sale, backlink asset — and no one chose (`hydra-worker-x4`, `hydra-worker-x7`).
- **Anyone reading the family's other histories.** The Python sibling's record is at `/home/nick/Development/backburner/hydra-api`; the NoHustle record at `/home/nick/Development/archive/NoHustle API`; the retired mirror at `/home/nick/Development/archive/duplicates/hydra-site`.

## How to read the history

- `NARRATIVE.md` — prehistory, the eras and the causal story; the lineage NoHustle → HYDRA API → this Worker, and the hydra-site consolidation, are argued with evidence, not assumed.
- `IDEOLOGY.md` — the worldview the code reveals, its non-goals and the tensions never resolved.
- `GOALS.md` — every goal, when it was proposed, and what became of it.
- `DECISION_MAP.md` — decision genealogies plus the generated index of events, principles and goals.
- `TIMELINE.md` — deterministic, evidence-linked index.
- `OPEN_QUESTIONS.md` — gaps, contradictions and low-confidence claims, ranked.

**Evidence conventions.** Every material statement cites a claim id (`hw-cNN`) from `.project-history/claims.yml`; each claim carries an evidence type (`direct`, `contemporaneous`, `retrospective`, `behavioral`, `inferred`), a status and a confidence. Four things are kept apart throughout: what participants said, what the system did, what outcome followed, and what the historian infers. Where the record says "inferred" or "plausible", treat it as an argument, not a fact. Several dated records here were written by AI agents on the owner's behalf — including the repository's latest commit — and are labelled as such; Git authorship is not intellectual authorship.

## Maintaining this history

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

## Related repositories (absolute paths; cited SHAs resolve against them)

- `/home/nick/Development/backburner/hydra-api` — the Python/FastAPI sibling and source of the port; never deployed.
- `/home/nick/Development/archive/duplicates/hydra-site` — the retired byte-identical mirror of `docs/index.html`.
- `/home/nick/Development/archive/NoHustle API` — the August-2025 paid utility API; thematic predecessor, no shared code.
- `/home/nick/Development/experiments/thing` — the NoHustle growth kit of August 2025.
