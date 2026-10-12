import { clean, expandHex } from "./format";
import type { FlowDraft, Issue, NodeStyle, ResolvedFlow } from "./types";

const EPS = 1e-6;

export type ParseResult = {
  flows: FlowDraft[];
  styles: Map<string, NodeStyle>;
  errors: Issue[];
};

function splitColor(rest: string): { name: string; color: string | null; opacity: number | null } {
  const hash = rest.lastIndexOf("#");
  if (hash < 0) return { name: rest.trim(), color: null, opacity: null };
  if (hash > 0 && !/\s/.test(rest[hash - 1]!)) return { name: rest.trim(), color: null, opacity: null };
  const maybe = rest.slice(hash).trim();
  const match = maybe.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?:\s*\.\s*(\d*\.?\d+))?$/);
  if (!match) return { name: rest.trim(), color: null, opacity: null };
  let opacity: number | null = null;
  if (match[2]) {
    const n = Number(match[2]);
    if (Number.isFinite(n)) opacity = Math.min(1, Math.max(0, n));
  }
  return { name: rest.slice(0, hash).trim(), color: expandHex(match[1]!), opacity };
}

function parseAmount(raw: string): { kind: FlowDraft["kind"]; amount: number | null } | null {
  const t = raw.trim();
  if (t === "*") return { kind: "rest", amount: null };
  if (t === "?") return { kind: "need", amount: null };
  const n = Number(t.replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return { kind: "value", amount: n };
}

function parseFlow(line: string, lineNo: number): { flow?: FlowDraft; error?: string } {
  const lb = line.indexOf("[");
  const rb = line.indexOf("]", lb + 1);
  if (lb <= 0 || rb < 0) return { error: "Expected Source [amount] Target" };
  const source = line.slice(0, lb).trim();
  if (!source) return { error: "That flow needs a source." };
  const amount = parseAmount(line.slice(lb + 1, rb));
  if (!amount) return { error: "Amount should be a positive number, [*], or [?]." };
  const { name: target, color, opacity } = splitColor(line.slice(rb + 1));
  if (!target) return { error: "That flow needs a target." };
  if (source === target) return { error: "A flow can't start and end in the same place." };
  return { flow: { line: lineNo, source, target, color, opacity, ...amount } };
}

function parseNode(line: string): { style?: { name: string; style: NodeStyle }; error?: string } {
  let body = line.slice(1).trim();
  let paintIn = false;
  let paintOut = false;
  const arrows = body.match(/^(.*?)(?:\s+((?:<<|>>)(?:\s*(?:<<|>>))*))\s*$/);
  if (arrows?.[2]) {
    body = arrows[1]!.trim();
    paintIn = arrows[2].includes("<<");
    paintOut = arrows[2].includes(">>");
  }
  const { name, color } = splitColor(body);
  if (!name) return { error: "A node line needs a name, like :Rent #c4622d" };
  return { style: { name, style: { color, paintIn, paintOut } } };
}

export function parseSource(source: string): ParseResult {
  const flows: FlowDraft[] = [];
  const styles = new Map<string, NodeStyle>();
  const errors: Issue[] = [];
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const line = raw.trim();
    const lineNo = i + 1;
    if (!line || line.startsWith("//")) continue;
    if (line.startsWith(":")) {
      const parsed = parseNode(line);
      if (parsed.error) errors.push({ line: lineNo, message: parsed.error });
      else if (parsed.style) styles.set(parsed.style.name, parsed.style.style);
      continue;
    }
    const parsed = parseFlow(line, lineNo);
    if (parsed.error || !parsed.flow) errors.push({ line: lineNo, message: parsed.error ?? "Could not read that line." });
    else flows.push(parsed.flow);
  }
  return { flows, styles, errors };
}

type Mutable = Omit<ResolvedFlow, "value"> & { value: number | null };

function sum(rows: Mutable[]): number {
  let total = 0;
  for (const row of rows) total += row.value ?? 0;
  return total;
}

/** [*] takes what a node received but did not pass on. [?] fills what a node must pass on but has not received. */
export function resolveFlows(drafts: FlowDraft[]): {
  flows: ResolvedFlow[];
  warnings: string[];
  errors: Issue[];
} {
  const rows: Mutable[] = drafts.map((flow) => ({
    line: flow.line,
    source: flow.source,
    target: flow.target,
    kind: flow.kind,
    color: flow.color,
    opacity: flow.opacity,
    value: flow.kind === "value" ? flow.amount : null,
  }));
  const warnings: string[] = [];
  const errors: Issue[] = [];
  const names = new Set<string>();
  for (const row of rows) {
    names.add(row.source);
    names.add(row.target);
  }

  const warned = new Set<string>();
  let guard = rows.length + 3;
  while (guard-- > 0) {
    let progress = false;
    for (const name of names) {
      if (fillRest(name, rows, warnings, warned)) progress = true;
      if (fillNeed(name, rows, warnings, warned)) progress = true;
    }
    if (!progress) break;
  }

  const flows: ResolvedFlow[] = [];
  for (const row of rows) {
    if (row.value == null) {
      errors.push({
        line: row.line,
        message:
          row.kind === "rest"
            ? `Couldn't compute the remainder leaving ${row.source}. Give that step a numeric inflow first.`
            : `Couldn't compute the shortfall into ${row.target}. That step needs a known outflow.`,
      });
      continue;
    }
    const value = clean(row.value);
    if (value <= EPS) {
      warnings.push(`${row.source} → ${row.target} is zero, so it isn't drawn.`);
      continue;
    }
    flows.push({ ...row, value });
  }
  return { flows, warnings, errors };
}

function fillRest(source: string, rows: Mutable[], warnings: string[], warned: Set<string>): boolean {
  const outgoing = rows.filter((row) => row.source === source);
  const incoming = rows.filter((row) => row.target === source);
  const pending = outgoing.filter((row) => row.value == null);
  const rests = pending.filter((row) => row.kind === "rest");
  if (rests.length === 0 || pending.length !== rests.length) return false;
  if (incoming.some((row) => row.value == null)) return false;
  if (incoming.length === 0 && outgoing.every((row) => row.value == null)) return false;

  const inn = sum(incoming);
  const knownOut = sum(outgoing.filter((row) => row.value != null));
  let remainder = clean(inn - knownOut);
  if (remainder < 0) {
    const key = `over:${source}`;
    if (!warned.has(key)) {
      warned.add(key);
      warnings.push(`${source} already sends more than it receives. The remainder is zero.`);
    }
    remainder = 0;
  }
  if (rests.length > 1 && !warned.has(`split:${source}`)) {
    warned.add(`split:${source}`);
    warnings.push(`${source} has ${rests.length} remainder flows. The leftover is split evenly.`);
  }
  const share = remainder / rests.length;
  for (const row of rests) row.value = share;
  return true;
}

function fillNeed(target: string, rows: Mutable[], warnings: string[], warned: Set<string>): boolean {
  const outgoing = rows.filter((row) => row.source === target);
  const incoming = rows.filter((row) => row.target === target);
  const pending = incoming.filter((row) => row.value == null);
  const needs = pending.filter((row) => row.kind === "need");
  if (needs.length === 0 || pending.length !== needs.length) return false;
  if (outgoing.length === 0 || outgoing.some((row) => row.value == null)) return false;

  const out = sum(outgoing);
  const knownIn = sum(incoming.filter((row) => row.value != null));
  let deficit = clean(out - knownIn);
  if (deficit < 0) {
    const key = `under:${target}`;
    if (!warned.has(key)) {
      warned.add(key);
      warnings.push(`${target} already receives more than it sends. The shortfall is zero.`);
    }
    deficit = 0;
  }
  if (needs.length > 1 && !warned.has(`needs:${target}`)) {
    warned.add(`needs:${target}`);
    warnings.push(`${target} has ${needs.length} shortfall flows. The gap is split evenly.`);
  }
  const share = deficit / needs.length;
  for (const row of needs) row.value = share;
  return true;
}

export function findCycle(flows: { source: string; target: string }[]): string | null {
  const next = new Map<string, string[]>();
  for (const flow of flows) {
    const list = next.get(flow.source);
    if (list) list.push(flow.target);
    else next.set(flow.source, [flow.target]);
  }
  const state = new Map<string, 0 | 1 | 2>();
  const stack: string[] = [];

  function walk(name: string): string[] | null {
    state.set(name, 1);
    stack.push(name);
    for (const target of next.get(name) ?? []) {
      const seen = state.get(target) ?? 0;
      if (seen === 1) {
        const at = stack.indexOf(target);
        return [...stack.slice(at), target];
      }
      if (seen === 0) {
        const found = walk(target);
        if (found) return found;
      }
    }
    stack.pop();
    state.set(name, 2);
    return null;
  }

  for (const name of next.keys()) {
    if ((state.get(name) ?? 0) !== 0) continue;
    const found = walk(name);
    if (found) return `These flows loop (${found.join(" → ")}). A diagram needs a direction.`;
  }
  return null;
}

export function tryConvertTable(text: string): string | null {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0 || lines.some((line) => line.includes("["))) return null;
  const rows = lines.map((line) => (line.includes("\t") ? line.split("\t") : splitCsv(line)).map((cell) => cell.trim()));
  if (rows.some((row) => row.length < 3)) return null;
  const header = rows[0]!.map((cell) => cell.toLowerCase());
  const body =
    header.some((cell) => ["source", "from", "target", "to", "amount", "value"].includes(cell)) && rows.length > 1
      ? rows.slice(1)
      : rows;
  if (body.length === 0) return null;
  const numeric = [0, 1, 2].find(
    (index) => body.filter((row) => isAmount(row[index] ?? "")).length >= Math.ceil(body.length * 0.8),
  );
  if (numeric == null) return null;
  const nameCols = [0, 1, 2].filter((index) => index !== numeric);
  let sourceCol = nameCols[0]!;
  let targetCol = nameCols[1]!;
  if (header[sourceCol]?.match(/target|to/) && header[targetCol]?.match(/source|from/)) {
    [sourceCol, targetCol] = [targetCol, sourceCol];
  }
  return body
    .map((row) => {
      const amount = (row[numeric] ?? "").replace(/[$,\s]/g, "");
      return `${row[sourceCol]} [${amount}] ${row[targetCol]}`;
    })
    .join("\n");
}

function splitCsv(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

function isAmount(value: string): boolean {
  const n = Number(value.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n > 0;
}
