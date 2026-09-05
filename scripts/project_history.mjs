#!/usr/bin/env node
// project_history.mjs -- deterministic, dependency-free history tooling (Node >= 18, ESM).
//
// Commands (run from the project root):
//   assess [range] [paths...]      flag potentially material surfaces in new work (advisory)
//   context [paths|component]      smallest relevant history for an area of the tree
//   validate [--no-render-check] [--today YYYY-MM-DD]
//                                  schemas, ids, dates, links, anchors, secrets, render drift
//   render [--check]               rebuild TIMELINE, decision index, PROJECT_HISTORY.md
//   audit --full | --since <sha> [--report <path>] [--date YYYY-MM-DD]
//                                  compare git evidence with recorded history
//   declaration --text T | --file F   check a history-impact declaration (CI helper)
//
// The ledgers under .project-history/ use a strict YAML subset parsed here (block mappings,
// block sequences, flow lists of scalars, quoted strings, literal/folded block scalars).
// Nothing here injects timestamps into rendered output; the only dated artifact is an audit
// report written on explicit request. This is a line-for-line port of the Python tool used by
// the sibling HYDRA API and NoHustle histories, so the three ledgers stay interoperable.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const HEX40 = /\b[0-9a-f]{40}\b/g;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const GEN_BEGIN = (name) => `<!-- BEGIN GENERATED: ${name} -->`;
const GEN_END = (name) => `<!-- END GENERATED: ${name} -->`;
const UNIT_SEP = "\u001f";

const CLAIM_EVIDENCE = new Set(["direct", "contemporaneous", "retrospective", "behavioral", "inferred"]);
const CLAIM_STATUS = new Set(["verified", "reported", "inferred", "disputed", "unknown"]);
const CONFIDENCE = new Set(["confirmed", "strongly_supported", "plausible", "speculative", "unknown"]);
const EVENT_REQUIRED = [
  "id", "title", "kind", "scope", "significance", "occurred_at", "decided_at", "merged_at",
  "released_at", "recorded_at", "last_verified_at", "claim_ids", "source_ids", "status",
  "confidence", "secrets_reviewed",
];
const EVENT_SECTIONS = [
  "Before-state and pressure", "Intended beneficiaries", "Goal, non-goal and definition of success",
  "Principles affected", "Alternatives and rejected paths", "Decision and rationale",
  "Implementation and evidence", "Expected versus observed outcome",
  "Tradeoffs, debt and consequences", "Related events", "Unresolved questions",
];
const GOAL_STATUS = new Set(["proposed", "active", "narrowed", "expanded", "blocked", "achieved", "abandoned", "superseded"]);
const PRINCIPLE_STATUS = new Set(["active", "weakened", "challenged", "superseded", "retired"]);
const DECLARATION_RE = /history:(recorded|none|defer)\s*(?:[-—:]\s*)?(.*)/gi;

export const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/, /ASIA[0-9A-Z]{16}/,
  /\b(?:sk|rk|pk)_(?:live|test)_[0-9A-Za-z]{16,}/, /\bwhsec_[0-9A-Za-z]{16,}/,
  /\bghp_[0-9A-Za-z]{30,}/, /\bgithub_pat_[0-9A-Za-z_]{20,}/, /\bgho_[0-9A-Za-z]{30,}/,
  /\bxox[abprs]-[0-9A-Za-z-]{10,}/, /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY/,
  /\bAIza[0-9A-Za-z_-]{35}\b/, /\bsk-[A-Za-z0-9]{20,}\b/, /\bsk-ant-[A-Za-z0-9_-]{20,}/,
  /\bre_[A-Za-z0-9]{8}_[A-Za-z0-9]{20,}/,
  /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/,
  /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^:\s/]+:[^@\s/]{4,}@/i,
  /\b[A-Za-z_]*(?:SECRET|TOKEN|PASSWORD|API_KEY)[A-Za-z_]*\s*[=:]\s*["']?(?!\$\{|\$[A-Z]|<|\[|\(|\{|null|none|redacted|changeme|xxx|your[-_])[A-Za-z0-9+/=_\-]{24,}["']?/,
];
// Positive control for the scanner, assembled at runtime so this source file never contains a matching literal.
export const SECRET_CONTROL = ["AKIA" + "IOSFODNN7EXAMPLE", "sk_live_" + "4eC39HqLyjWDarjtT1zdp7dc", "-----BEGIN " + "PRIVATE KEY-----"].join(" ");

// --------------------------------------------------------------------------- YAML subset
export class YamlError extends Error {}

class Parser {
  constructor(text) { this.lines = text.split("\n"); this.i = 0; }
  static KEY_RE = /^([A-Za-z_][A-Za-z0-9_.\-/ ]*?):(?:\s+(.*))?$/;
  skippable(line) { const s = line.trim(); return s === "" || s.startsWith("#"); }
  peek() {
    while (this.i < this.lines.length && this.skippable(this.lines[this.i])) this.i++;
    if (this.i >= this.lines.length) return null;
    const line = this.lines[this.i];
    const indent = line.length - line.replace(/^ */, "").length;
    if (line.slice(0, indent + 1).includes("\t")) throw new YamlError(`line ${this.i + 1}: tabs are not allowed for indentation`);
    return [indent, line.slice(indent).replace(/\s+$/, ""), this.i];
  }
  parse() {
    const tok = this.peek();
    if (tok === null) return {};
    const value = this.block(tok[0]);
    const rest = this.peek();
    if (rest !== null) throw new YamlError(`line ${rest[2] + 1}: unexpected content after document`);
    return value;
  }
  isItem(t) { return t === "-" || t.startsWith("- "); }
  block(indent) {
    const tok = this.peek();
    if (tok === null) return null;
    if (tok[0] !== indent) throw new YamlError(`line ${tok[2] + 1}: expected indent ${indent}, found ${tok[0]}`);
    return this.isItem(tok[1]) ? this.sequence(indent) : this.mapping(indent);
  }
  mapping(indent) {
    const out = {};
    for (;;) {
      const tok = this.peek();
      if (tok === null || tok[0] < indent) return out;
      if (tok[0] > indent) throw new YamlError(`line ${tok[2] + 1}: unexpected deeper indent`);
      if (this.isItem(tok[1])) return out;
      const [key, rest] = this.splitKey(tok[1], tok[2]);
      if (Object.prototype.hasOwnProperty.call(out, key)) throw new YamlError(`line ${tok[2] + 1}: duplicate key '${key}'`);
      this.i++;
      out[key] = this.valueAfterKey(indent, rest, tok[2]);
    }
  }
  sequence(indent) {
    const out = [];
    for (;;) {
      const tok = this.peek();
      if (tok === null || tok[0] < indent) return out;
      if (tok[0] > indent) throw new YamlError(`line ${tok[2] + 1}: unexpected deeper indent in sequence`);
      if (!this.isItem(tok[1])) return out;
      const item = tok[1] === "-" ? "" : tok[1].slice(1).replace(/^\s+/, "");
      if (item === "") {
        this.i++;
        const nxt = this.peek();
        if (nxt === null || nxt[0] <= indent) out.push(null); else out.push(this.block(nxt[0]));
      } else if (this.looksLikeKey(item)) {
        const virtual = indent + 2;
        this.lines[tok[2]] = " ".repeat(virtual) + item;
        out.push(this.mapping(virtual));
      } else {
        this.i++;
        out.push(this.scalar(item, tok[2]));
      }
    }
  }
  looksLikeKey(s) { if (s.startsWith('"') || s.startsWith("'") || s.startsWith("[")) return false; return Parser.KEY_RE.test(s); }
  splitKey(content, lineno) {
    const m = Parser.KEY_RE.exec(content);
    if (!m) throw new YamlError(`line ${lineno + 1}: expected 'key: value', got '${content}'`);
    return [m[1].trim(), (m[2] || "").trim()];
  }
  valueAfterKey(indent, rest, lineno) {
    if (rest === "") {
      const nxt = this.peek();
      if (nxt === null || nxt[0] <= indent) return null;
      return this.block(nxt[0]);
    }
    if (["|", "|-", ">", ">-"].includes(rest)) return this.blockScalar(indent, rest);
    return this.scalar(rest, lineno);
  }
  blockScalar(indent, style) {
    const collected = [];
    let blockIndent = null;
    while (this.i < this.lines.length) {
      const line = this.lines[this.i];
      if (line.trim() === "") { collected.push(""); this.i++; continue; }
      const cur = line.length - line.replace(/^ */, "").length;
      if (cur <= indent) break;
      if (blockIndent === null) blockIndent = cur;
      collected.push(cur >= blockIndent ? line.slice(blockIndent) : line.trim());
      this.i++;
    }
    while (collected.length && collected[collected.length - 1] === "") collected.pop();
    let text;
    if (style.startsWith("|")) text = collected.join("\n");
    else {
      const paras = []; let buf = [];
      for (const ln of collected) { if (ln === "") { paras.push(buf.join(" ")); buf = []; } else buf.push(ln.trim()); }
      paras.push(buf.join(" "));
      text = paras.join("\n");
    }
    return style.endsWith("-") ? text : text + "\n";
  }
  scalar(s, lineno) {
    s = s.trim();
    if (s.startsWith('"')) {
      try { return JSON.parse(s); } catch (e) { throw new YamlError(`line ${lineno + 1}: bad double-quoted string: ${e.message}`); }
    }
    if (s.startsWith("'")) {
      if (!s.endsWith("'") || s.length < 2) throw new YamlError(`line ${lineno + 1}: bad single-quoted string`);
      return s.slice(1, -1).replace(/''/g, "'");
    }
    if (s.startsWith("[")) {
      if (!s.endsWith("]")) throw new YamlError(`line ${lineno + 1}: unterminated flow list`);
      return Parser.splitFlow(s.slice(1, -1)).map((p) => this.scalar(p, lineno));
    }
    if (s.startsWith("{")) throw new YamlError(`line ${lineno + 1}: flow mappings are not supported`);
    if (s === "null" || s === "~") return null;
    if (s === "true") return true;
    if (s === "false") return false;
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
    return s;
  }
  static splitFlow(body) {
    const parts = []; let buf = []; let quote = null;
    for (const ch of body) {
      if (quote) { buf.push(ch); if (ch === quote) quote = null; }
      else if (ch === '"' || ch === "'") { quote = ch; buf.push(ch); }
      else if (ch === ",") { parts.push(buf.join("").trim()); buf = []; }
      else buf.push(ch);
    }
    const tail = buf.join("").trim();
    if (tail) parts.push(tail);
    return parts.filter((p) => p !== "");
  }
}

export function parseYaml(text) { return new Parser(text).parse(); }

export function splitFrontMatter(text) {
  if (!text.startsWith("---\n")) throw new YamlError("event capsule must start with '---' front matter");
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) throw new YamlError("front matter is not terminated by '---'");
  return [parseYaml(text.slice(4, end + 1)), text.slice(end + 5)];
}

// --------------------------------------------------------------------------- repository access
function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const ent of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc); else if (ent.isFile()) acc.push(p);
  }
  return acc;
}

export class Repo {
  constructor(root) {
    this.root = resolve(root);
    this.policy = this.loadYaml(join(this.root, ".project-history", "policy.yml"));
    this.docsDir = join(this.root, this.policy.docs_dir || "docs/history");
    this.phDir = join(this.root, this.policy.history_dir || ".project-history");
  }
  loadYaml(path) { return parseYaml(readFileSync(path, "utf8")); }
  read(rel) { return readFileSync(join(this.root, rel), "utf8"); }
  exists(rel) { return existsSync(join(this.root, rel)); }
  ledger(name) { return this.loadYaml(join(this.phDir, name)); }
  events() {
    const out = [];
    for (const path of walkFiles(join(this.phDir, "events"))) {
      if (!path.endsWith(".md")) continue;
      const [meta, body] = splitFrontMatter(readFileSync(path, "utf8"));
      out.push({ path: relative(this.root, path), meta, body });
    }
    out.sort((a, b) => {
      const ka = `${a.meta.occurred_at || ""} ${a.meta.id}`; const kb = `${b.meta.occurred_at || ""} ${b.meta.id}`;
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
    return out;
  }
  git(args, { check = true } = {}) {
    const r = spawnSync("git", ["-C", this.root, ...args], { encoding: "utf8" });
    if (check && r.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${(r.stderr || "").trim()}`);
    return r.stdout || "";
  }
  commitExists(sha, extraRepos = []) {
    for (const repo of [this.root, ...extraRepos]) {
      const r = spawnSync("git", ["-C", repo, "cat-file", "-e", `${sha}^{commit}`], { stdio: "ignore" });
      if (r.status === 0) return true;
    }
    return false;
  }
  relatedRepoPaths() {
    const paths = new Set();
    let sources;
    try { sources = this.ledger("sources.yml"); } catch { return []; }
    for (const src of sources.sources || []) {
      if (!src || typeof src !== "object") continue;
      for (const key of ["local_path", "path"]) {
        const p = src[key];
        if (typeof p === "string" && existsSync(join(p, ".git")) && resolve(p) !== this.root) paths.add(resolve(p));
      }
    }
    return [...paths].sort();
  }
}

// --------------------------------------------------------------------------- helpers
export function asList(v) { if (v === null || v === undefined) return []; return Array.isArray(v) ? v : [v]; }

function fnmatch(name, pat) {
  let re = "^";
  for (const ch of pat) {
    if (ch === "*") re += ".*"; else if (ch === "?") re += "."; else re += ch.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(re + "$").test(name);
}

export function globsMatch(path, patterns) {
  for (let pat of patterns || []) {
    pat = String(pat);
    if (fnmatch(path, pat) || fnmatch(basename(path), pat)) return true;
    if (pat.endsWith("/**") && (path === pat.slice(0, -3) || path.startsWith(pat.slice(0, -3) + "/"))) return true;
    if (pat.endsWith("/*") && dirname(path) === pat.slice(0, -2)) return true;
  }
  return false;
}

function dateOk(v) { return v === null || v === undefined || (typeof v === "string" && DATE_RE.test(v)); }

export function scanSecrets(text) {
  const hits = [];
  text.split("\n").forEach((line, idx) => {
    for (const pat of SECRET_PATTERNS) { if (pat.test(line)) { hits.push([idx + 1, pat.source.slice(0, 28)]); break; } }
  });
  return hits;
}

export function parseDeclaration(text) {
  const found = [...(text || "").matchAll(DECLARATION_RE)];
  if (!found.length) throw new Error("no history declaration found (expected history:recorded|none|defer)");
  if (found.length > 1) throw new Error("more than one history declaration found; declare exactly one");
  const kind = found[0][1].toLowerCase();
  const detail = found[0][2].trim().replace(/^[`*_ ]+|[`*_ ]+$/g, "").trim();
  if (kind === "recorded") { if (!/^[A-Za-z0-9][A-Za-z0-9._-]{3,}/.test(detail)) throw new Error("history:recorded must name an event id"); }
  else if (kind === "none") { if (detail.length < 8) throw new Error("history:none must give a specific reason"); }
  else if (detail.length < 12 || !/\d{4}-\d{2}-\d{2}/.test(detail)) throw new Error("history:defer must name a tracking item, an owner and a YYYY-MM-DD deadline");
  return { kind, detail };
}

function todayISO() { return new Date().toISOString().slice(0, 10); }

// --------------------------------------------------------------------------- validate
export class Validator {
  constructor(repo, today = null) { this.repo = repo; this.errors = []; this.warnings = []; this.today = today || todayISO(); this.citedShas = new Set(); }
  err(m) { this.errors.push(m); }
  warn(m) { this.warnings.push(m); }
  run(checkRender = true) {
    const r = this.repo; const pol = r.policy;
    for (const key of ["docs_dir", "commands", "repository", "materiality"]) if (!(key in pol)) this.err(`policy.yml missing top-level '${key}'`);
    for (const cmd of ["assess", "context", "validate", "render", "audit_full", "audit_incremental", "test"]) if (!(pol.commands || {})[cmd]) this.err(`policy.yml commands.${cmd} missing`);
    const docs = pol.docs_dir || "docs/history";
    const required = [
      "PROJECT_HISTORY.md", "AGENTS.md",
      ...["ORIENTATION.md", "NARRATIVE.md", "IDEOLOGY.md", "GOALS.md", "DECISION_MAP.md", "TIMELINE.md", "OPEN_QUESTIONS.md"].map((f) => `${docs}/${f}`),
      ...["policy.yml", "sources.yml", "claims.yml", "contradictions.yml", "state.yml", "doctrine/principles.yml", "doctrine/goals.yml", "schemas/event.schema.json", "templates/event.md"].map((f) => `.project-history/${f}`),
    ];
    for (const rel of required) if (!r.exists(rel)) this.err(`required file missing: ${rel}`);
    if (this.errors.length) return this;
    const sources = r.ledger("sources.yml"); const claims = r.ledger("claims.yml"); const contradictions = r.ledger("contradictions.yml");
    const state = r.ledger("state.yml"); const principles = r.ledger("doctrine/principles.yml"); const goals = r.ledger("doctrine/goals.yml");
    let schema = {};
    try { schema = JSON.parse(r.read(".project-history/schemas/event.schema.json")); } catch (e) { this.err(`event.schema.json is not valid JSON: ${e.message}`); }
    const events = r.events(); const related = r.relatedRepoPaths();
    const sourceIds = this.checkSources(sources);
    const claimIds = this.checkClaims(claims, sourceIds);
    this.checkContradictions(contradictions, claimIds, sourceIds);
    const eventIds = this.checkEvents(events, schema, claimIds, sourceIds, related);
    this.checkDoctrine(principles, "principle", PRINCIPLE_STATUS, claimIds, eventIds);
    this.checkDoctrine(goals, "goal", GOAL_STATUS, claimIds, eventIds);
    this.checkState(state);
    this.checkDeferrals(pol);
    this.checkAgentContract();
    this.checkLinks();
    this.checkSecrets();
    this.checkCitedShas(related);
    if (checkRender) for (const rel of new Renderer(r).render(false)) this.err(`rendered output drifted: ${relative(r.root, rel)} (run render)`);
    return this;
  }
  checkSources(sources) {
    const ids = new Set();
    for (const s of sources.sources || []) {
      const sid = s && s.id;
      if (!sid) { this.err("source without id"); continue; }
      if (ids.has(sid)) this.err(`duplicate source id ${sid}`);
      ids.add(sid);
      for (const key of ["kind", "class", "access"]) if (!(key in s)) this.err(`source ${sid} missing '${key}'`);
      if (!["direct", "contemporaneous", "retrospective", "behavioral", "inferred", "external"].includes(s.class)) this.err(`source ${sid} has unknown class '${s.class}'`);
      if (!["accessible", "inaccessible", "partial"].includes(s.access)) this.err(`source ${sid} has unknown access '${s.access}'`);
      if (s.retrieved_at !== null && s.retrieved_at !== undefined && !dateOk(s.retrieved_at)) this.err(`source ${sid} retrieved_at is not YYYY-MM-DD`);
    }
    if (!ids.size) this.err("sources.yml lists no sources");
    return ids;
  }
  checkClaims(claims, sourceIds) {
    const ids = new Set();
    for (const c of claims.claims || []) {
      const cid = c && c.claim_id;
      if (!cid) { this.err("claim without claim_id"); continue; }
      if (ids.has(cid)) this.err(`duplicate claim_id ${cid}`);
      ids.add(cid);
      for (const key of ["claim", "source_ids", "locator", "evidence_type", "status", "confidence", "rationale", "caveats"]) if (!(key in c)) this.err(`claim ${cid} missing '${key}'`);
      if (!("date" in c) && !("date_range" in c)) this.err(`claim ${cid} needs date or date_range`);
      if (!CLAIM_EVIDENCE.has(c.evidence_type)) this.err(`claim ${cid} evidence_type '${c.evidence_type}' invalid`);
      if (!CLAIM_STATUS.has(c.status)) this.err(`claim ${cid} status '${c.status}' invalid`);
      if (!CONFIDENCE.has(c.confidence)) this.err(`claim ${cid} confidence '${c.confidence}' invalid`);
      if (c.status === "verified" && c.evidence_type === "inferred") this.err(`claim ${cid} cannot be both 'verified' and 'inferred'`);
      for (const sid of asList(c.source_ids)) if (!sourceIds.has(sid)) this.err(`claim ${cid} cites unknown source ${sid}`);
      if (!asList(c.source_ids).length) this.err(`claim ${cid} cites no sources`);
      if (c.date !== null && c.date !== undefined && !dateOk(c.date)) this.err(`claim ${cid} date must be YYYY-MM-DD`);
    }
    return ids;
  }
  checkContradictions(contradictions, claimIds, sourceIds) {
    const seen = new Set();
    for (const x of contradictions.contradictions || []) {
      const xid = x && x.id;
      if (!xid) { this.err("contradiction without id"); continue; }
      if (seen.has(xid)) this.err(`duplicate contradiction id ${xid}`);
      seen.add(xid);
      for (const key of ["disputed_claim", "accounts", "disagreement_kind", "best_supported_reading", "confidence", "resolving_evidence"]) if (!(key in x)) this.err(`contradiction ${xid} missing '${key}'`);
      if (!CONFIDENCE.has(x.confidence)) this.err(`contradiction ${xid} confidence invalid`);
      if (asList(x.accounts).length < 2) this.err(`contradiction ${xid} needs at least two accounts`);
      for (const acc of asList(x.accounts)) for (const sid of asList(acc && typeof acc === "object" ? acc.source_ids : null)) if (!sourceIds.has(sid)) this.err(`contradiction ${xid} account cites unknown source ${sid}`);
      for (const cid of asList(x.claim_ids)) if (!claimIds.has(cid)) this.err(`contradiction ${xid} cites unknown claim ${cid}`);
    }
  }
  checkEvents(events, schema, claimIds, sourceIds, related) {
    const ids = new Map();
    const req = Array.isArray(schema.required) ? schema.required : EVENT_REQUIRED;
    const kinds = new Set(((((schema.properties || {}).kind || {}).enum) || []));
    for (const ev of events) {
      const m = ev.meta; const body = ev.body; const eid = m.id;
      if (!eid) { this.err(`${ev.path}: event without id`); continue; }
      if (ids.has(eid)) this.err(`duplicate event id ${eid} (${ev.path} and ${ids.get(eid)})`);
      ids.set(eid, ev.path);
      if (basename(ev.path, ".md") !== eid) this.err(`${ev.path}: file name must equal event id ${eid}`);
      for (const key of req) if (!(key in m)) this.err(`event ${eid} missing front-matter key '${key}'`);
      for (const key of ["occurred_at", "decided_at", "merged_at", "released_at", "recorded_at", "last_verified_at"]) if (!dateOk(m[key])) this.err(`event ${eid} ${key} must be YYYY-MM-DD or null`);
      if (m.occurred_at && m.recorded_at && m.recorded_at < m.occurred_at) this.err(`event ${eid} recorded_at earlier than occurred_at`);
      if (m.backfilled === true && m.occurred_at && m.recorded_at && m.recorded_at <= m.occurred_at) this.err(`event ${eid} is backfilled but recorded_at is not later than occurred_at`);
      if (kinds.size && !kinds.has(m.kind)) this.err(`event ${eid} kind '${m.kind}' not in schema enum`);
      if (!["high", "medium", "low"].includes(m.significance)) this.err(`event ${eid} significance invalid`);
      if (!["open", "closed", "amended", "superseded"].includes(m.status)) this.err(`event ${eid} status invalid`);
      if (!CONFIDENCE.has(m.confidence)) this.err(`event ${eid} confidence invalid`);
      if (m.secrets_reviewed !== true) this.err(`event ${eid} secrets_reviewed must be true`);
      if (!asList(m.claim_ids).length) this.err(`event ${eid} cites no claims`);
      for (const cid of asList(m.claim_ids)) if (!claimIds.has(cid)) this.err(`event ${eid} cites unknown claim ${cid}`);
      for (const sid of asList(m.source_ids)) if (!sourceIds.has(sid)) this.err(`event ${eid} cites unknown source ${sid}`);
      for (const sha of asList(m.anchors)) {
        if (!/^[0-9a-f]{40}$/.test(String(sha))) this.err(`event ${eid} anchor '${sha}' is not a 40-hex sha`);
        else if (!this.repo.commitExists(String(sha), related)) this.err(`event ${eid} anchor ${sha} is unreachable (rewritten or foreign history?)`);
      }
      for (const section of EVENT_SECTIONS) if (!body.includes(`## ${section}`)) this.err(`event ${eid} lacks section '## ${section}'`);
      for (const am of asList(m.amendments)) if (!am || typeof am !== "object" || !am.date || !am.reason || !am.confidence_moved) this.err(`event ${eid} amendment must carry date, reason and confidence_moved`);
    }
    for (const ev of events) for (const key of ["related_events", "amends", "supersedes", "reverses"]) for (const other of asList(ev.meta[key])) if (!ids.has(other)) this.err(`event ${ev.meta.id} ${key} -> unknown event ${other}`);
    if (!events.some((e) => e.meta.kind === "bootstrap")) this.err("no bootstrap event for the history system itself");
    return new Set(ids.keys());
  }
  checkDoctrine(doc, label, statuses, claimIds, eventIds) {
    const items = doc[label + "s"] || []; const ids = new Map();
    for (const it of items) {
      const iid = it && it.id;
      if (!iid) { this.err(`${label} without id`); continue; }
      const key = `${iid} ${it.version}`;
      if (ids.has(key)) this.err(`duplicate ${label} ${iid} v${it.version}`);
      ids.set(key, it);
      if (!statuses.has(it.status)) this.err(`${label} ${iid} status '${it.status}' invalid`);
      if (!Number.isInteger(it.version)) this.err(`${label} ${iid} version must be an integer`);
      if (!dateOk(it.introduced_at)) this.err(`${label} ${iid} introduced_at must be YYYY-MM-DD`);
      for (const cid of asList(it.claim_ids)) if (!claimIds.has(cid)) this.err(`${label} ${iid} cites unknown claim ${cid}`);
      for (const eid of asList(it.event_ids)) if (!eventIds.has(eid)) this.err(`${label} ${iid} cites unknown event ${eid}`);
      if (label === "goal" && it.status === "active" && it.review_by && String(it.review_by) < this.today) this.warn(`goal ${iid} is active but review_by ${it.review_by} has passed (stale goal)`);
    }
    for (const [key, it] of ids) {
      const [iid, ver] = key.split(" "); const sup = it.supersedes;
      if (!sup) continue;
      const target = (sup && typeof sup === "object") ? [sup.id, sup.version] : [String(sup), null];
      if (target[1] === null || target[1] === undefined) {
        if (![...ids.keys()].some((k) => k.split(" ")[0] === target[0])) this.err(`${label} ${iid} v${ver} supersedes unknown ${target[0]}`);
      } else {
        const tkey = `${target[0]} ${target[1]}`;
        if (!ids.has(tkey)) this.err(`${label} ${iid} v${ver} supersedes unknown ${target[0]} v${target[1]}`);
        else if (!["superseded", "retired", "abandoned", "achieved", "narrowed", "expanded", "weakened"].includes(ids.get(tkey).status)) this.err(`${label} ${target[0]} v${target[1]} is superseded by ${iid} v${ver} but not marked superseded`);
      }
    }
  }
  checkState(state) {
    for (const key of ["repository", "audit_date", "full_audit_anchor", "incremental_anchor", "reachable_commit_count", "refs_examined", "exclusion_counts", "source_classes", "inaccessible_sources", "evidence_gaps", "rewritten_history"]) if (!(key in state)) this.err(`state.yml missing '${key}'`);
    for (const key of ["full_audit_anchor", "incremental_anchor"]) {
      const v = String(state[key] || "");
      if (!/^[0-9a-f]{40}$/.test(v)) this.err(`state.yml ${key} is not a 40-hex sha`);
      else if (!this.repo.commitExists(v)) this.err(`state.yml ${key} ${v} is unreachable in this repository`);
    }
    let actual;
    try { actual = parseInt(this.repo.git(["rev-list", "--all", "--count"]).trim(), 10); } catch (e) { this.err(e.message); return; }
    if (state.reachable_commit_count !== actual) this.err(`state.yml reachable_commit_count=${state.reachable_commit_count} but git reports ${actual}`);
  }
  checkDeferrals(pol) {
    for (const d of pol.deferrals || []) {
      for (const key of ["id", "owner", "deadline", "tracking"]) if (!d[key]) this.err(`deferral ${d.id || "?"} missing '${key}' (naked deferrals are not allowed)`);
      if (d.deadline && String(d.deadline) < this.today && (d.status || "open") === "open") this.err(`deferral ${d.id} expired on ${d.deadline} (owner ${d.owner})`);
    }
  }
  checkAgentContract() {
    let text = "";
    for (const fn of ["AGENTS.md", "CLAUDE.md"]) if (this.repo.exists(fn)) text += this.repo.read(fn);
    for (const tok of ["history:recorded", "history:none", "history:defer"]) if (!text.includes(tok)) this.err(`AGENTS.md lacks the declaration token ${tok}`);
    if (!text.includes("ORIENTATION.md")) this.err("AGENTS.md does not direct agents to docs/history/ORIENTATION.md");
    let pr = "";
    for (const fn of [".github/PULL_REQUEST_TEMPLATE.md", ".github/pull_request_template.md", "docs/PULL_REQUEST_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"]) if (this.repo.exists(fn)) pr += this.repo.read(fn);
    if (!pr) this.err("no pull-request template found");
    for (const tok of ["history:recorded", "history:none", "history:defer"]) if (!pr.includes(tok)) this.err(`PR template lacks ${tok}`);
  }
  checkLinks() {
    const files = [join(this.repo.root, "PROJECT_HISTORY.md"), ...walkFiles(this.repo.docsDir).filter((f) => f.endsWith(".md"))];
    for (const f of files) {
      if (!existsSync(f)) continue;
      const text = readFileSync(f, "utf8");
      for (const m of text.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
        const target = m[1];
        if (/^[a-z]+:/i.test(target)) continue;
        if (!existsSync(resolve(dirname(f), target))) this.err(`broken link in ${relative(this.repo.root, f)} -> ${target}`);
      }
    }
  }
  artifactFiles() {
    const files = [join(this.repo.root, "PROJECT_HISTORY.md"), ...walkFiles(this.repo.docsDir), ...walkFiles(this.repo.phDir)];
    return files.filter((f) => existsSync(f));
  }
  checkSecrets() {
    if (!SECRET_PATTERNS.some((p) => p.test(SECRET_CONTROL))) this.err("secret-scan positive control failed; scanner is broken");
    for (const f of this.artifactFiles()) for (const [n, pat] of scanSecrets(readFileSync(f, "utf8"))) this.err(`possible secret in ${relative(this.repo.root, f)}:${n} (${pat}...)`);
  }
  checkCitedShas(related) {
    const shas = new Set();
    for (const f of this.artifactFiles()) {
      if (!/\.(md|ya?ml|json)$/.test(f)) continue;
      for (const m of readFileSync(f, "utf8").matchAll(HEX40)) shas.add(m[0]);
    }
    for (const s of [...shas].sort()) if (!this.repo.commitExists(s, related)) this.err(`cited sha ${s} does not resolve in this repository or any related repository listed in sources.yml`);
    this.citedShas = shas;
  }
}

// --------------------------------------------------------------------------- render
export class Renderer {
  constructor(repo) { this.repo = repo; }
  replaceGenerated(text, name, generated) {
    const b = GEN_BEGIN(name); const e = GEN_END(name);
    if (!text.includes(b) || !text.includes(e)) throw new Error(`markers for generated block '${name}' not found`);
    const pre = text.slice(0, text.indexOf(b) + b.length); const post = text.slice(text.indexOf(e));
    return pre + "\n" + generated.replace(/\n+$/, "") + "\n" + post;
  }
  static clean(s) { return String(s ?? "").replace(/\|/g, "/").trim(); }
  timeline(events, claims) {
    const rows = [];
    for (const ev of events) {
      const m = ev.meta;
      for (const key of ["occurred_at", "decided_at", "merged_at", "released_at"]) if (m[key]) rows.push([m[key], key.replace("_at", ""), m.id, m.title || "", ev.path]);
    }
    for (const c of claims.claims || []) {
      let d = c.date;
      if (!d && typeof c.date_range === "string") d = c.date_range.split("..")[0].trim();
      if (!d && c.date_range && typeof c.date_range === "object") d = c.date_range.start;
      if (d) rows.push([String(d), "claim", c.claim_id, String(c.claim || "").slice(0, 110), ".project-history/claims.yml"]);
    }
    rows.sort((a, b) => { const ka = a.slice(0, 3).join(" "); const kb = b.slice(0, 3).join(" "); return ka < kb ? -1 : ka > kb ? 1 : 0; });
    const out = ["| Date | Kind | Id | Summary | Record |", "|---|---|---|---|---|"];
    for (const [d, kind, ident, title, path] of rows) out.push(`| ${d} | ${kind} | \`${ident}\` | ${Renderer.clean(title)} | \`${path}\` |`);
    const anchors = [...new Set(events.flatMap((ev) => asList(ev.meta.anchors).map(String)))].sort();
    out.push("", "### Git anchors cited by events", "");
    if (anchors.length) for (const s of anchors) out.push(`- \`${s}\``); else out.push("- (none)");
    return out.join("\n");
  }
  static sup(sup) { if (sup && typeof sup === "object") return `\`${sup.id}\` v${sup.version}`; return sup ? `\`${sup}\`` : "—"; }
  decisionIndex(events, principles, goals) {
    const out = ["| Event | Kind | Significance | Occurred | Status | Related | Amends / supersedes |", "|---|---|---|---|---|---|---|"];
    for (const ev of events) {
      const m = ev.meta;
      const rel = asList(m.related_events).map((x) => `\`${x}\``).join(", ") || "—";
      const am = [...asList(m.amends), ...asList(m.supersedes), ...asList(m.reverses)].map((x) => `\`${x}\``).join(", ") || "—";
      out.push(`| \`${m.id}\` | ${m.kind} | ${m.significance} | ${m.occurred_at} | ${m.status} | ${rel} | ${am} |`);
    }
    out.push("", "#### Principles (versioned)", "", "| Id | v | Status | Introduced | Supersedes | Statement |", "|---|---|---|---|---|---|");
    for (const p of principles.principles || []) out.push(`| \`${p.id}\` | ${p.version} | ${p.status} | ${p.introduced_at} | ${Renderer.sup(p.supersedes)} | ${Renderer.clean(p.statement)} |`);
    out.push("", "#### Goals (lifecycle)", "", "| Id | v | Status | Introduced | Review by | Supersedes | Statement |", "|---|---|---|---|---|---|---|");
    for (const g of goals.goals || []) out.push(`| \`${g.id}\` | ${g.version} | ${g.status} | ${g.introduced_at} | ${g.review_by || "—"} | ${Renderer.sup(g.supersedes)} | ${Renderer.clean(g.statement)} |`);
    return out.join("\n");
  }
  static anchor(text) { return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"); }
  static shiftHeadings(body) {
    let inCode = false;
    return body.split("\n").map((line) => {
      if (line.startsWith("```")) inCode = !inCode;
      if (!inCode && /^#{1,5} /.test(line)) return "#" + line;
      return line;
    }).join("\n");
  }
  bullets(val, depth) {
    const out = []; const pad = " ".repeat(depth);
    if (val && typeof val === "object" && !Array.isArray(val)) {
      for (const [k, v] of Object.entries(val)) {
        if (v && typeof v === "object") { out.push(`${pad}- ${k}:`); out.push(...this.bullets(v, depth + 2)); }
        else out.push(`${pad}- ${k}: ${String(v ?? "").trim()}`);
      }
    } else if (Array.isArray(val)) {
      for (const v of val) { if (v && typeof v === "object") out.push(...this.bullets(v, depth)); else out.push(`${pad}- ${String(v ?? "").trim()}`); }
    }
    return out;
  }
  projectHistory(events, claims, contradictions, sources, state, overrides = new Map()) {
    const pol = this.repo.policy;
    const order = pol.render_order || ["ORIENTATION.md", "NARRATIVE.md", "IDEOLOGY.md", "GOALS.md", "DECISION_MAP.md", "TIMELINE.md", "OPEN_QUESTIONS.md"];
    const title = pol.project || pol.repository;
    const parts = [`# ${title} — Project History`, "",
      "_Canonical, unabridged reading path. Assembled deterministically by `scripts/project_history` `render` from the curated chapters in `docs/history/` and the evidence ledgers in `.project-history/`. Edit the chapters, not this file._", "", "## Contents", ""];
    const chapters = [];
    for (const name of order) {
      if (name.endsWith("/*")) {
        const d = join(this.repo.docsDir, name.slice(0, -2));
        if (existsSync(d)) for (const f of readdirSync(d).sort()) if (f.endsWith(".md")) chapters.push(join(name.slice(0, -2), f));
      } else chapters.push(name);
    }
    for (const ch of chapters) parts.push(`- [${ch}](#${Renderer.anchor("Chapter: " + ch)})`);
    for (const extra of ["Appendix A — Claims ledger", "Appendix B — Contradiction register", "Appendix C — Source inventory", "Appendix D — Coverage and reproducibility"]) parts.push(`- [${extra}](#${Renderer.anchor(extra)})`);
    parts.push("");
    for (const ch of chapters) {
      const path = join(this.repo.docsDir, ch);
      let body;
      if (overrides.has(path)) body = overrides.get(path);
      else { if (!existsSync(path)) throw new Error(`render_order names missing chapter ${ch}`); body = readFileSync(path, "utf8"); }
      parts.push(`## Chapter: ${ch}`, "", Renderer.shiftHeadings(body.replace(/\n+$/, "")), "");
    }
    parts.push("## Appendix A — Claims ledger", "", "| Claim | Date | Type | Status | Confidence | Statement |", "|---|---|---|---|---|---|");
    for (const c of claims.claims || []) {
      let d = c.date ?? c.date_range;
      if (d && typeof d === "object") d = `${d.start}..${d.end}`;
      parts.push(`| \`${c.claim_id}\` | ${d} | ${c.evidence_type} | ${c.status} | ${c.confidence} | ${Renderer.clean(c.claim)} |`);
    }
    parts.push("", "## Appendix B — Contradiction register", "");
    for (const x of contradictions.contradictions || []) {
      parts.push(`### \`${x.id}\` — ${String(x.disputed_claim || "").trim()}`, "", `- Disagreement kind: ${x.disagreement_kind}`);
      for (const acc of asList(x.accounts)) if (acc && typeof acc === "object") parts.push(`- Account (${asList(acc.source_ids).join(", ") || "unsourced"}; ${acc.date ?? "undated"}; ${acc.proximity ?? "proximity unknown"}): ${String(acc.says || "").trim()}`);
      parts.push(`- Best-supported reading (${x.confidence}): ${String(x.best_supported_reading || "").trim()}`, `- Resolving evidence: ${String(x.resolving_evidence || "").trim()}`, "");
    }
    parts.push("## Appendix C — Source inventory", "", "| Source | Kind | Class | Access | Retrieved | Locator |", "|---|---|---|---|---|---|");
    for (const s of sources.sources || []) {
      const loc = s.locator || s.local_path || s.url || "";
      parts.push(`| \`${s.id}\` | ${s.kind} | ${s.class} | ${s.access} | ${s.retrieved_at || "—"} | ${String(loc).replace(/\|/g, "/")} |`);
    }
    parts.push("", "## Appendix D — Coverage and reproducibility", "");
    for (const key of ["repository", "audit_date", "full_audit_anchor", "incremental_anchor", "reachable_commit_count", "refs_examined", "exclusion_counts", "source_classes", "inaccessible_sources", "evidence_gaps", "rewritten_history", "coverage_matrix", "completeness_statement"]) {
      const val = state[key];
      if (val === null || val === undefined) continue;
      if (val && typeof val === "object") { parts.push(`- **${key}:**`); parts.push(...this.bullets(val, 2)); }
      else parts.push(`- **${key}:** ${String(val).trim()}`);
    }
    parts.push("");
    return parts.join("\n");
  }
  static readOrSeed(path, name) {
    if (existsSync(path)) return readFileSync(path, "utf8");
    return `# ${basename(path)}\n\n${GEN_BEGIN(name)}\n${GEN_END(name)}\n`;
  }
  static write(path, content, write) {
    if (!content.endsWith("\n")) content += "\n";
    const old = existsSync(path) ? readFileSync(path, "utf8") : null;
    if (old === content) return [];
    if (write) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); }
    return [path];
  }
  render(write = true) {
    const r = this.repo;
    const events = r.events(); const claims = r.ledger("claims.yml"); const contradictions = r.ledger("contradictions.yml");
    const sources = r.ledger("sources.yml"); const state = r.ledger("state.yml"); const principles = r.ledger("doctrine/principles.yml"); const goals = r.ledger("doctrine/goals.yml");
    const changed = [];
    const tlPath = join(r.docsDir, "TIMELINE.md");
    const tl = this.replaceGenerated(Renderer.readOrSeed(tlPath, "timeline"), "timeline", this.timeline(events, claims));
    changed.push(...Renderer.write(tlPath, tl, write));
    const dmPath = join(r.docsDir, "DECISION_MAP.md");
    const dm = this.replaceGenerated(Renderer.readOrSeed(dmPath, "decision-index"), "decision-index", this.decisionIndex(events, principles, goals));
    changed.push(...Renderer.write(dmPath, dm, write));
    const overrides = write ? new Map() : new Map([[tlPath, tl], [dmPath, dm]]);
    const ph = this.projectHistory(events, claims, contradictions, sources, state, overrides);
    changed.push(...Renderer.write(join(r.root, "PROJECT_HISTORY.md"), ph, write));
    return changed;
  }
}

// --------------------------------------------------------------------------- assess / context / audit
function materialClassification(repo, path) {
  const mat = repo.policy.materiality || {};
  if (globsMatch(path, mat.noise_paths)) return ["noise", "history/tooling/generated path (policy.materiality.noise_paths)"];
  for (const rule of mat.material_paths || []) {
    if (rule && typeof rule === "object") { if (globsMatch(path, [rule.glob])) return ["material", rule.why || "material surface"]; }
    else if (globsMatch(path, [rule])) return ["material", "material surface (policy.materiality.material_paths)"];
  }
  return ["review", "not classified by policy; judge by the materiality tests in policy.yml"];
}

function looksLikeRange(s) { return Boolean(s) && (s.includes("..") || /^[0-9a-f]{7,40}$/.test(s) || s.startsWith("HEAD")); }

function cmdAssess(repo, args) {
  const state = repo.ledger("state.yml");
  let rng = args.range;
  if (!rng) {
    const anchor = String(state.incremental_anchor || "");
    if (anchor && repo.commitExists(anchor)) rng = `${anchor}..HEAD`;
    else rng = repo.git(["rev-list", "--count", "HEAD"]).trim() !== "1" ? "HEAD~1..HEAD" : "HEAD";
  }
  console.log(`history assess — range: ${rng}`);
  let subjects = rng !== "HEAD" ? repo.git(["log", "--format=%H %s", rng], { check: false }).trim().split("\n") : [repo.git(["log", "-1", "--format=%H %s"]).trim()];
  subjects = subjects.filter(Boolean);
  const pats = ((repo.policy.materiality || {}).history_only_commit_patterns || []).map((p) => new RegExp(p));
  const files = new Set();
  if (rng === "HEAD") repo.git(["show", "--name-only", "--format=", "HEAD"]).split(/\s+/).filter(Boolean).forEach((f) => files.add(f));
  else if (subjects.length) repo.git(["diff", "--name-only", rng], { check: false }).split(/\s+/).filter(Boolean).forEach((f) => files.add(f));
  const status = repo.git(["status", "--porcelain", "-uall"], { check: false });
  const uncommitted = status.split("\n").filter((l) => l.trim()).map((l) => l.slice(3).replace(/^"|"$/g, ""));
  let list = [...files];
  if (args.paths && args.paths.length) list = args.paths;
  console.log(`commits in range: ${subjects.length}`);
  for (const s of subjects) { const [sha, ...rest] = s.split(" "); const subj = rest.join(" "); const tag = pats.some((p) => p.test(subj)) ? "history-only" : "review"; console.log(`  ${sha.slice(0, 12)} [${tag}] ${subj}`); }
  const material = [];
  for (const f of list.sort()) { const [cls, why] = materialClassification(repo, f); console.log(`  ${cls.padEnd(8)} ${f} — ${why}`); if (cls === "material") material.push(f); }
  if (uncommitted.length) { console.log("uncommitted work (present-tense, not history):"); for (const f of uncommitted) { const [cls] = materialClassification(repo, f); console.log(`  ${cls.padEnd(8)} ${f}`); } }
  console.log("");
  if (material.length) {
    console.log("assessment: candidate material surfaces touched — check the materiality tests in .project-history/policy.yml.");
    console.log("  if a purpose, promise, interface, architecture, deployment, licence or governance choice changed,");
    console.log("  add or amend an event capsule and declare `history:recorded <event-id>`;");
    console.log("  otherwise declare `history:none — <specific reason>`; emergencies may `history:defer — <item, owner, YYYY-MM-DD>`.");
  } else console.log("assessment: no policy-material surface touched; `history:none — <reason>` is probably right (heuristic only).");
  return 0;
}

function cmdContext(repo, args) {
  const paths = args.paths || [];
  console.log("# History context\n");
  const text = readFileSync(join(repo.docsDir, "ORIENTATION.md"), "utf8");
  const max = args.maxChars || 6000;
  console.log(text.trim().slice(0, max) + (text.length > max ? "\n…(truncated; read docs/history/ORIENTATION.md)" : ""));
  const goals = repo.ledger("doctrine/goals.yml").goals || []; const principles = repo.ledger("doctrine/principles.yml").principles || [];
  console.log("\n## Active goals");
  for (const g of goals) if (["active", "proposed", "blocked", "narrowed", "expanded"].includes(g.status)) console.log(`- \`${g.id}\` v${g.version} [${g.status}]: ${String(g.statement || "").trim()}`);
  console.log("\n## Active principles");
  for (const p of principles) if (["active", "weakened", "challenged"].includes(p.status)) console.log(`- \`${p.id}\` v${p.version} [${p.status}]: ${String(p.statement || "").trim()}`);
  console.log("\n## Relevant events");
  let shown = 0;
  for (const ev of repo.events()) {
    const m = ev.meta; const scope = [...asList(m.scope), ...asList(m.paths)].map(String);
    if (paths.length && !paths.some((p) => scope.some((s) => globsMatch(p, [s]) || p.startsWith(s.replace(/[*/]+$/, "")) || s === "project" || s === "*"))) continue;
    shown++;
    console.log(`- \`${m.id}\` (${m.kind}, ${m.significance}, ${m.occurred_at}): ${m.title}`);
    if (m.summary) console.log(`  ${String(m.summary).trim()}`);
  }
  if (!shown) console.log("- (no event matches these paths; read NARRATIVE.md)");
  const contr = repo.ledger("contradictions.yml").contradictions || [];
  const open = contr.filter((x) => ["plausible", "speculative", "unknown"].includes(x.confidence));
  if (open.length) { console.log("\n## Open disputes to keep in mind"); for (const x of open) console.log(`- \`${x.id}\`: ${String(x.disputed_claim || "").trim()}`); }
  console.log("\nDeclare exactly one of `history:recorded <event-id>`, `history:none — <reason>`, `history:defer — <item, owner, deadline>` when done.");
  return 0;
}

function cmdAudit(repo, args) {
  const state = repo.ledger("state.yml"); const related = repo.relatedRepoPaths(); const events = repo.events();
  const claims = repo.ledger("claims.yml").claims || []; const goals = repo.ledger("doctrine/goals.yml").goals || [];
  const today = args.date || todayISO();
  const hard = []; const advisories = []; const lines = [];
  lines.push(`# History audit report — ${repo.policy.repository}`, "", `- Mode: ${args.full ? "full" : "incremental since " + args.since}`, `- Audit date: ${today}`);
  const head = repo.git(["rev-parse", "HEAD"]).trim();
  lines.push(`- HEAD: \`${head}\``);
  for (const key of ["full_audit_anchor", "incremental_anchor"]) { const v = String(state[key] || ""); if (!repo.commitExists(v)) hard.push(`state.yml ${key} ${v} is unreachable — ancestry rewritten or object missing; re-audit the affected range`); }
  const cited = new Set();
  for (const ev of events) for (const s of asList(ev.meta.anchors)) { cited.add(String(s)); if (!repo.commitExists(String(s), related)) hard.push(`event ${ev.meta.id} anchor ${s} unreachable`); }
  for (const c of claims) for (const m of String(c.locator || "").matchAll(HEX40)) { cited.add(m[0]); if (!repo.commitExists(m[0], related)) hard.push(`claim ${c.claim_id} locator sha ${m[0]} unreachable`); }
  const refsNow = repo.git(["for-each-ref", "--format=%(refname)"]).split("\n").map((l) => l.trim()).filter(Boolean).sort();
  const refsThen = asList(state.refs_examined).map(String).sort();
  const newRefs = refsNow.filter((x) => !refsThen.includes(x)); const goneRefs = refsThen.filter((x) => !refsNow.includes(x));
  if (newRefs.length) advisories.push("refs not present at last full audit: " + newRefs.join(", "));
  if (goneRefs.length) advisories.push("refs examined at last full audit that no longer exist: " + goneRefs.join(", "));
  for (const rf of refsNow) {
    if (!rf.startsWith("refs/remotes/") || rf.endsWith("/HEAD")) continue;
    const a = spawnSync("git", ["-C", repo.root, "merge-base", "--is-ancestor", rf, "HEAD"]).status;
    const b = spawnSync("git", ["-C", repo.root, "merge-base", "--is-ancestor", "HEAD", rf]).status;
    if (a !== 0 && b !== 0) advisories.push(`${rf} and HEAD have diverged (possible rewritten remote history)`);
    else if (a === 0 && repo.git(["rev-parse", rf]).trim() !== head) advisories.push(`${rf} is behind HEAD (local commits not on the remote-tracking ref)`);
  }
  let rngCommits;
  const fmt = `--format=%H%x1f%s`;
  if (args.full) rngCommits = repo.git(["rev-list", "--all", fmt, "--no-commit-header"]).split("\n").filter((l) => l.trim());
  else if (!repo.commitExists(args.since)) { hard.push(`--since anchor ${args.since} is unreachable; cannot compute an incremental range (rewritten history?)`); rngCommits = []; }
  else rngCommits = repo.git(["rev-list", `${args.since}..HEAD`, fmt, "--no-commit-header"]).split("\n").filter((l) => l.trim());
  const pats = ((repo.policy.materiality || {}).history_only_commit_patterns || []).map((p) => new RegExp(p));
  const uncovered = []; let covered = 0; let noise = 0;
  lines.push("", "## Commit coverage", "", "| Commit | Subject | Touches material surface | Cited by history | Classification |", "|---|---|---|---|---|");
  for (const entry of rngCommits) {
    const [sha, subj = ""] = entry.split(UNIT_SEP);
    const files = repo.git(["show", "--name-only", "--format=", sha]).split(/\s+/).filter(Boolean);
    const mat = files.filter((f) => materialClassification(repo, f)[0] === "material");
    const isHist = pats.some((p) => p.test(subj)); const isCited = cited.has(sha);
    let cls;
    if (isHist) { cls = "history-only (ignored)"; noise++; }
    else if (isCited) { cls = "covered"; covered++; }
    else if (mat.length) { cls = "UNCOVERED material — likely unrecorded change"; uncovered.push([sha, subj]); }
    else cls = "uncited, no material surface";
    lines.push(`| \`${sha.slice(0, 12)}\` | ${subj.replace(/\|/g, "/")} | ${mat.slice(0, 4).join(", ") || "—"} | ${isCited ? "yes" : "no"} | ${cls} |`);
  }
  if (uncovered.length) advisories.push(`${uncovered.length} commit(s) touch material surfaces but are cited by no event or claim`);
  for (const g of goals) if (["active", "proposed"].includes(g.status) && g.review_by && String(g.review_by) < today) advisories.push(`goal ${g.id} v${g.version} is ${g.status} but its review_by ${g.review_by} has passed`);
  for (const ev of events) {
    if (ev.meta.status === "open") advisories.push(`event ${ev.meta.id} is still open — outcome not yet recorded`);
    if (String(ev.meta.observed_outcome || "").toLowerCase().includes("unknown")) advisories.push(`event ${ev.meta.id} records an unknown observed outcome`);
  }
  for (const d of repo.policy.deferrals || []) if ((d.status || "open") === "open" && d.deadline && String(d.deadline) < today) hard.push(`deferral ${d.id} expired ${d.deadline} (owner ${d.owner})`);
  lines.push("", `- Commits in range: ${rngCommits.length} · covered by history: ${covered} · history-only: ${noise} · uncovered material: ${uncovered.length}`, "", "## Hard failures", "");
  lines.push(...(hard.length ? hard.map((h) => `- ${h}`) : ["- none"]), "", "## Advisories", "");
  lines.push(...(advisories.length ? advisories.map((a) => `- ${a}`) : ["- none"]), "");
  const report = lines.join("\n");
  console.log(report);
  if (args.report) { const p = join(repo.root, args.report); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, report); console.log(`(report written to ${args.report})`); }
  return hard.length ? 1 : 0;
}

// --------------------------------------------------------------------------- main
function usage() {
  console.log("usage: project_history.mjs <assess [range] [paths...] | context [paths...] [--max-chars N] | validate [--no-render-check] [--today D] | render [--check] | audit (--full | --since SHA) [--report P] [--date D] | declaration (--text T | --file F)> [--root DIR]");
}

export function main(argv) {
  const opts = { flags: new Set(), values: {}, positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (["--root", "--since", "--report", "--date", "--today", "--text", "--file", "--max-chars"].includes(a)) { opts.values[a] = argv[++i]; }
    else if (a.startsWith("--")) opts.flags.add(a);
    else opts.positional.push(a);
  }
  const cmd = opts.positional.shift();
  if (!cmd || !["assess", "context", "validate", "render", "audit", "declaration"].includes(cmd)) { usage(); return 2; }
  if (cmd === "declaration") {
    const text = opts.values["--text"] !== undefined ? opts.values["--text"] : (opts.values["--file"] ? readFileSync(opts.values["--file"], "utf8") : "");
    try { const res = parseDeclaration(text); console.log(`declaration OK: history:${res.kind} — ${res.detail}`); return 0; }
    catch (e) { console.log(`declaration INVALID: ${e.message}`); return 1; }
  }
  const root = opts.values["--root"] || resolve(dirname(fileURLToPath(import.meta.url)), "..");
  let repo;
  try { repo = new Repo(root); } catch (e) { console.log(`error: policy.yml is not valid: ${e.message}`); return 1; }
  if (cmd === "validate") {
    let val;
    try { val = new Validator(repo, opts.values["--today"] || null).run(!opts.flags.has("--no-render-check")); }
    catch (e) { if (e instanceof YamlError) { console.log(`error: ledger is not valid YAML subset: ${e.message}`); console.log("validate: 1 error(s), 0 warning(s)"); return 1; } throw e; }
    for (const w of val.warnings) console.log(`warning: ${w}`);
    for (const e of val.errors) console.log(`error: ${e}`);
    console.log(`validate: ${val.errors.length} error(s), ${val.warnings.length} warning(s)`);
    return val.errors.length ? 1 : 0;
  }
  if (cmd === "render") {
    const check = opts.flags.has("--check");
    const changed = new Renderer(repo).render(!check).map((p) => relative(repo.root, p));
    if (check) { console.log("render --check: " + (changed.length ? "DRIFT in " + changed.join(", ") : "clean")); return changed.length ? 1 : 0; }
    console.log("render: " + (changed.length ? "updated " + changed.join(", ") : "no changes"));
    return 0;
  }
  if (cmd === "assess") {
    const [first, ...rest] = opts.positional;
    if (looksLikeRange(first)) return cmdAssess(repo, { range: first, paths: rest });
    return cmdAssess(repo, { range: undefined, paths: first ? [first, ...rest] : [] });
  }
  if (cmd === "context") return cmdContext(repo, { paths: opts.positional, maxChars: opts.values["--max-chars"] ? parseInt(opts.values["--max-chars"], 10) : 6000 });
  if (cmd === "audit") {
    const full = opts.flags.has("--full"); const since = opts.values["--since"];
    if (full === Boolean(since)) { console.log("audit needs exactly one of --full or --since <anchor>"); return 2; }
    return cmdAudit(repo, { full, since, report: opts.values["--report"], date: opts.values["--date"] });
  }
  return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
