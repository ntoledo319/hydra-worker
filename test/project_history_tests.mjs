// Tests for scripts/project_history.mjs (no dependencies; run: node --test test/project_history_tests.mjs).
// Named without ".test"/".spec" on purpose so vitest's default include never picks it up.
//
// Live-repository checks are read-only. Acceptance cases that need a broken ledger run inside a
// throwaway `git clone --local --no-checkout` of this repository under the system temp directory,
// so the live tree and its history are never modified.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as ph from "../scripts/project_history.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = join(ROOT, "scripts", "project_history.mjs");

function run(args, cwd = ROOT) {
  // Always execute the script that belongs to `cwd`: the tool resolves its repository root from its own
  // location, so a fixture clone must be driven by its own copy of scripts/project_history.mjs.
  const script = cwd === ROOT ? SCRIPT : join(cwd, "scripts", "project_history.mjs");
  const r = spawnSync(process.execPath, [script, ...args], { cwd, encoding: "utf8" });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}

// ---------------------------------------------------------------- parser
test("yaml subset: mappings, sequences, scalars, flow lists, quotes", () => {
  const d = ph.parseYaml("a: 1\nb:\n  - x\n  - y: 2\n    z: [1, \"two\", 'three']\nc: \"q: r\"\nd: null\ne: true\n");
  assert.equal(d.a, 1);
  assert.equal(d.b[0], "x");
  assert.deepEqual(d.b[1].z, [1, "two", "three"]);
  assert.equal(d.c, "q: r");
  assert.equal(d.d, null);
  assert.equal(d.e, true);
});

test("yaml subset: literal and folded block scalars", () => {
  const d = ph.parseYaml("t: |\n  one\n  two\nf: >\n  a\n  b\n\n  c\n");
  assert.equal(d.t, "one\ntwo\n");
  assert.equal(d.f, "a b\nc\n");
});

test("yaml subset: tabs, duplicate keys and flow mappings are rejected", () => {
  for (const bad of ["a:\n\tb: 1\n", "a: 1\na: 2\n", "x: {a: 1}\n"]) assert.throws(() => ph.parseYaml(bad), ph.YamlError);
});

test("front matter splits", () => {
  const [meta, body] = ph.splitFrontMatter("---\nid: e\n---\n\n## Body\n");
  assert.equal(meta.id, "e");
  assert.match(body, /## Body/);
});

// ---------------------------------------------------------------- declarations
test("declarations: the three accepted forms", () => {
  assert.equal(ph.parseDeclaration("history:recorded proj-2026-01-01-thing").kind, "recorded");
  assert.equal(ph.parseDeclaration("history:none — README typo only").kind, "none");
  assert.equal(ph.parseDeclaration("history:defer — issue #12, owner nick, deadline 2099-01-01").kind, "defer");
});

test("declarations: naked skips, undated deferrals and double declarations are rejected", () => {
  for (const bad of ["history:none", "history:defer — later", "history:recorded x\nhistory:none — y", "no declaration"]) assert.throws(() => ph.parseDeclaration(bad));
});

test("declaration CLI helper", () => {
  assert.equal(run(["declaration", "--text", "history:none — comment-only change to README"]).code, 0);
  assert.equal(run(["declaration", "--text", "history:none"]).code, 1);
});

// ---------------------------------------------------------------- live repository (read-only)
test("live: validate passes", () => {
  const p = run(["validate"]);
  assert.equal(p.code, 0, p.out);
});

test("live: render --check is clean (committed output already rendered)", () => {
  const p = run(["render", "--check"]);
  assert.equal(p.code, 0, p.out);
});

test("live: assess, context and audit --full exit 0", () => {
  for (const args of [["assess"], ["context"], ["context", "README.md"], ["audit", "--full"]]) {
    const p = run(args);
    assert.equal(p.code, 0, args.join(" ") + "\n" + p.out);
  }
});

test("secret scanner: positive control triggers, ordinary text does not", () => {
  assert.ok(ph.scanSecrets(ph.SECRET_CONTROL).length > 0);
  assert.equal(ph.scanSecrets("nothing secret here; API_KEY=<set-at-deploy>").length, 0);
});

// ---------------------------------------------------------------- fixtures (throwaway clone)
const tmp = mkdtempSync(join(tmpdir(), "project-history-test-"));
const fix = join(tmp, "clone");
spawnSync("git", ["clone", "--quiet", "--local", "--no-checkout", ROOT, fix], { stdio: "ignore" });
// Mirror the source's remote-tracking refs too, so the fixture's reachable graph equals the live one.
spawnSync("git", ["-C", fix, "fetch", "--quiet", ROOT, "+refs/remotes/*:refs/remotes/*"], { stdio: "ignore" });
for (const rel of [".project-history", join("docs", "history"), ".github", "scripts"]) cpSync(join(ROOT, rel), join(fix, rel), { recursive: true });
for (const rel of ["PROJECT_HISTORY.md", "AGENTS.md"]) cpSync(join(ROOT, rel), join(fix, rel));
process.on("exit", () => rmSync(tmp, { recursive: true, force: true }));

function fresh(name) {
  const dst = join(tmp, name);
  cpSync(fix, dst, { recursive: true });
  return dst;
}
function firstEvent(root) {
  const base = join(root, ".project-history", "events");
  const stack = [base];
  while (stack.length) {
    const d = stack.shift();
    for (const f of readdirSync(d).sort()) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) stack.push(p); else if (f.endsWith(".md")) return p;
    }
  }
  throw new Error("no event capsule");
}
function validateIn(root, extra = []) { return run(["validate", ...extra], root); }

test("fixture: clean clone validates and renders byte-stably", () => {
  const root = fresh("clean");
  const p = validateIn(root);
  assert.equal(p.code, 0, p.out);
  const r1 = run(["render"], root); const r2 = run(["render"], root);
  assert.match(r1.out, /no changes/);
  assert.match(r2.out, /no changes/);
});

test("fixture: duplicate event id is rejected", () => {
  const root = fresh("dup");
  const ev = firstEvent(root);
  cpSync(ev, join(dirname(ev), "zz-copy.md"));
  const p = validateIn(root);
  assert.equal(p.code, 1);
  assert.match(p.out, /duplicate event id/);
});

test("fixture: broken supersedes link is rejected", () => {
  const root = fresh("sup");
  const path = join(root, ".project-history", "doctrine", "goals.yml");
  const text = readFileSync(path, "utf8").replace("goals:\n", "goals:\n  - id: goal-ghost\n    version: 2\n    status: active\n    introduced_at: 2026-01-01\n    statement: ghost\n    supersedes: no-such-goal\n");
  writeFileSync(path, text);
  const p = validateIn(root);
  assert.equal(p.code, 1);
  assert.match(p.out, /supersedes unknown/);
});

test("fixture: expired deferral fails validation", () => {
  const root = fresh("defer");
  const path = join(root, ".project-history", "policy.yml");
  const block = "deferrals:\n  - id: d-old\n    owner: someone\n    deadline: 2000-01-01\n    tracking: issue-1\n    status: open\n";
  let text = readFileSync(path, "utf8");
  text = text.includes("deferrals: []") ? text.replace("deferrals: []\n", block) : text + "\n" + block;
  writeFileSync(path, text);
  const p = validateIn(root);
  assert.equal(p.code, 1);
  assert.match(p.out, /expired/);
});

test("fixture: unreachable anchor fails validate and audit", () => {
  const root = fresh("anchor");
  const ev = firstEvent(root);
  writeFileSync(ev, readFileSync(ev, "utf8").replace("anchors:", "anchors:\n  - deadbeefdeadbeefdeadbeefdeadbeefdeadbeef"));
  const p = validateIn(root, ["--no-render-check"]);
  assert.equal(p.code, 1);
  assert.match(p.out, /unreachable/);
  const a = run(["audit", "--full"], root);
  assert.equal(a.code, 1);
  assert.match(a.out, /unreachable/);
});

test("fixture: a secret-looking token in an artifact fails validation", () => {
  const root = fresh("secret");
  const ev = firstEvent(root);
  writeFileSync(ev, readFileSync(ev, "utf8") + "\n" + ph.SECRET_CONTROL.split(" ")[0] + "\n");
  const p = validateIn(root, ["--no-render-check"]);
  assert.equal(p.code, 1);
  assert.match(p.out, /possible secret/);
});

test("fixture: recorded_at before occurred_at is rejected", () => {
  const root = fresh("dates");
  const ev = firstEvent(root);
  writeFileSync(ev, readFileSync(ev, "utf8").replace(/recorded_at: \S+/, "recorded_at: 1999-01-01"));
  const p = validateIn(root, ["--no-render-check"]);
  assert.equal(p.code, 1);
  assert.match(p.out, /recorded_at earlier than occurred_at/);
});

test("fixture: reachable_commit_count mismatch is rejected", () => {
  const root = fresh("count");
  const path = join(root, ".project-history", "state.yml");
  writeFileSync(path, readFileSync(path, "utf8").replace(/reachable_commit_count: \d+/, "reachable_commit_count: 999999"));
  const p = validateIn(root, ["--no-render-check"]);
  assert.equal(p.code, 1);
  assert.match(p.out, /reachable_commit_count/);
});

test("fixture: render seeds and regenerates the deterministic blocks", () => {
  const root = fresh("render");
  const tl = join(root, "docs", "history", "TIMELINE.md");
  const before = readFileSync(tl, "utf8");
  writeFileSync(tl, before.replace(/<!-- BEGIN GENERATED: timeline -->[\s\S]*<!-- END GENERATED: timeline -->/, "<!-- BEGIN GENERATED: timeline -->\nstale\n<!-- END GENERATED: timeline -->"));
  assert.equal(run(["render", "--check"], root).code, 1);
  assert.equal(run(["render"], root).code, 0);
  assert.equal(readFileSync(tl, "utf8"), before);
  assert.ok(existsSync(join(root, "PROJECT_HISTORY.md")));
});
