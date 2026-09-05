# Open questions, gaps and low-confidence claims

_Ranked by how much an answer would change the record. "No evidence found" is never treated as "did not happen"; each entry names what was searched and what would settle it._

## Ranked questions

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

## Contradictions carried in the register (`.project-history/contradictions.yml`)

- `hydra-worker-x1` — endpoint count (fact; confirmed: 24 utilities + 2 meta; every published number wrong; one audit added an error).
- `hydra-worker-x2` — live in July 2026 (fact; confirmed: yes; the "not live" note examined the wrong repository).
- `hydra-worker-x3` — predecessor or parallel variant (chronology; strongly supported: both, of different things).
- `hydra-worker-x4` — revenue asset (interpretation; confirmed: a label without a price or mechanism).
- `hydra-worker-x5` — which repository was the site (fact; confirmed: this one's `docs/`).
- `hydra-worker-x6` — RapidAPI listing (outcome; unknown).
- `hydra-worker-x7` — what should become of it (interpretation; plausible: keep, fix counts/link/test, decide the price).
- `hydra-worker-x8` — has tests (fact; confirmed: a file, not a test).

## Low-confidence claims to keep visible

- `hw-c20` (plausible, inferred) — HYDRA as a deliberate inversion of NoHustle.
- `hw-c23` (unknown) — existence of a RapidAPI listing.
- `hw-c08`'s first-deploy date (bounded, not known).
- `hw-c14`'s and `hw-c16`'s authorship (agent tooling, human intent unrecorded).

## Evidence gaps and lost or inaccessible sources

- The 2026-03-26 authoring session (former macOS `CascadeProjects` path, unlinked 2026-05-05).
- Cloudflare Workers dashboard (deployments, analytics, errors).
- RapidAPI provider account state.
- The agent sessions behind the 2026-07-25 edits and the 2026-09-01 commit.
- Any pre-repository design note; none exists in the owner's synced documents (searched only for the project's names).
- `package-lock.json` (2,788 lines) was treated as generated and not read; the product's vitest suite was deliberately not executed.

## Biases audited

- **Main-branch bias:** one branch; the remote-tracking ref was compared (one unpushed local commit); no never-merged work exists.
- **Survivor bias:** the Worker is the survivor of the family, and its README's framing ("Also Available", "Listed") was not allowed to stand as fact; each claim was tested against measurement and later reviewers.
- **Recency and hindsight bias:** the August verdicts and the June framings are labelled as agent-written opinions dated months after the event; they are not used to infer March intent.
- **Most-articulate-source bias:** the 2026-08-03 registry note is the longest and most precise source about this repository, and it contains a demonstrable error (the openapi path count); it is cited for its measurements and corrected where the committed file disagrees.
- **Authorship bias:** the latest commit is authored by a placeholder agent identity; Git authorship is not treated as intellectual authorship anywhere in this record.

## Coverage statement

All four reachable commits were deep-read (the lockfile excepted); both refs examined; the remote compared; the four related repositories read in full; GitHub metadata, Pages, Actions and security settings read; the live Worker and Pages probed; every dated owner document naming HYDRA read for the relevant lines. That is complete coverage of the available record and is not the same as knowing the project's full history: the design was made inside a session whose transcript is unavailable, the deployment platform and marketplace were not consulted, and the two most recent changes to the repository were enacted by agents whose instructions are not on disk. See Appendix D of `PROJECT_HISTORY.md` and `state.yml` for counts, exclusions and the coverage matrix.
