import { sankey, sankeyCenter, sankeyJustify, sankeyLeft, sankeyRight } from "d3-sankey";
import { clean, formatNumber } from "./format";
import { findCycle, parseSource, resolveFlows } from "./parse";
import type {
  Issue,
  NodeBalance,
  Project,
  ResolvedFlow,
  Scene,
  SceneLabel,
  SceneLink,
  SceneNode,
} from "./types";
import { PALETTE, PAPERS } from "./types";

const EPS = 1e-4;

export type ComputedFlow = {
  source: string;
  target: string;
  value: number;
  kind: "rest" | "need";
};

export type DiagramMeta = {
  errors: Issue[];
  warnings: string[];
  balances: NodeBalance[];
  computed: ComputedFlow[];
  totalIn: number;
  totalOut: number;
};

export type Diagram = {
  scene: Scene | null;
  meta: DiagramMeta;
};

const ALIGNS = {
  justify: sankeyJustify,
  left: sankeyLeft,
  right: sankeyRight,
  center: sankeyCenter,
};

function balancesOf(flows: ResolvedFlow[]): NodeBalance[] {
  const order: string[] = [];
  const inn = new Map<string, number>();
  const out = new Map<string, number>();
  const touch = (name: string) => {
    if (inn.has(name)) return;
    inn.set(name, 0);
    out.set(name, 0);
    order.push(name);
  };
  for (const flow of flows) {
    touch(flow.source);
    touch(flow.target);
    out.set(flow.source, (out.get(flow.source) ?? 0) + flow.value);
    inn.set(flow.target, (inn.get(flow.target) ?? 0) + flow.value);
  }
  return order.map((name) => {
    const i = clean(inn.get(name) ?? 0);
    const o = clean(out.get(name) ?? 0);
    return { name, inn: i, out: o, gap: clean(i - o) };
  });
}

function estimate(text: string, size: number): number {
  return text.length * size * 0.56;
}

function ribbon(x0: number, x1: number, y0: number, y1: number, width: number): string {
  const half = Math.max(width, 0) / 2;
  const c = (x0 + x1) / 2;
  const n = (v: number) => Math.round(v * 100) / 100;
  return [
    `M${n(x0)},${n(y0 - half)}`,
    `C${n(c)},${n(y0 - half)} ${n(c)},${n(y1 - half)} ${n(x1)},${n(y1 - half)}`,
    `L${n(x1)},${n(y1 + half)}`,
    `C${n(c)},${n(y1 + half)} ${n(c)},${n(y0 + half)} ${n(x0)},${n(y0 + half)}`,
    "Z",
  ].join("");
}

export function buildDiagram(project: Project): Diagram {
  const parsed = parseSource(project.source);
  const resolved = resolveFlows(parsed.flows);
  const warnings = [...resolved.warnings];
  const errors = [...parsed.errors, ...resolved.errors];
  const empty: Diagram = {
    scene: null,
    meta: { errors, warnings, balances: [], computed: [], totalIn: 0, totalOut: 0 },
  };
  if (resolved.flows.length === 0) return empty;

  const cycle = findCycle(resolved.flows);
  if (cycle) {
    errors.push({ line: 0, message: cycle });
    return { scene: null, meta: { ...empty.meta, errors } };
  }

  const balances = balancesOf(resolved.flows);
  for (const [name] of parsed.styles) {
    if (!balances.some((row) => row.name === name)) warnings.push(`${name} is styled, but it isn't in a flow.`);
  }

  const colors = new Map<string, string>();
  let paletteAt = 0;
  for (const row of balances) {
    const chosen = parsed.styles.get(row.name)?.color;
    colors.set(row.name, chosen ?? PALETTE[paletteAt++ % PALETTE.length]!);
  }

  const settings = project.settings;
  const paper = PAPERS[settings.paper];
  const sources = balances.filter((row) => row.inn <= EPS && row.out > EPS);
  const sinks = balances.filter((row) => row.out <= EPS && row.inn > EPS);
  const totalIn = clean(sources.reduce((t, row) => t + row.out, 0));
  const totalOut = clean(sinks.reduce((t, row) => t + row.inn, 0));

  const labelWidth = (name: string) => {
    if (!settings.showLabels) return 0;
    const value = formatNumber(Math.max(balances.find((row) => row.name === name)?.inn ?? 0, balances.find((row) => row.name === name)?.out ?? 0), settings);
    return Math.max(estimate(name, 13), settings.showValues ? estimate(value, 11) : 0);
  };
  const left = 32 + (settings.showLabels ? Math.max(0, ...sources.map((row) => labelWidth(row.name))) : 0);
  const right = 32 + (settings.showLabels ? Math.max(0, ...sinks.map((row) => labelWidth(row.name)), ...balances.map((row) => labelWidth(row.name) * 0)) : 0);
  const top = project.title && project.subtitle ? 84 : project.title ? 68 : 28;
  const bottom = 32;
  const stack = Math.max(sources.length, sinks.length, 1);
  const width = Math.max(settings.width, left + right + settings.nodeWidth * 3 + 80);
  const height = Math.max(settings.height, top + bottom + stack * 26 + Math.max(0, stack - 1) * settings.nodeGap);

  const generator = sankey()
    .nodeId((node) => String(node.id))
    .nodeWidth(settings.nodeWidth)
    .nodePadding(settings.nodeGap)
    .nodeAlign(ALIGNS[settings.align])
    .iterations(32)
    .extent([
      [left, top],
      [width - right, height - bottom],
    ])
    .nodeSort(settings.sort === "value" ? (a, b) => (b.value ?? 0) - (a.value ?? 0) : null);

  let graph;
  try {
    graph = generator({
      nodes: balances.map((row) => ({ id: row.name })),
      links: resolved.flows.map((flow) => ({
        source: flow.source,
        target: flow.target,
        value: flow.value,
        color: flow.color,
        opacity: flow.opacity,
        kind: flow.kind,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not lay out these flows.";
    const friendly = message.toLowerCase().includes("circular")
      ? "These flows loop. A diagram needs a direction."
      : message;
    errors.push({ line: 0, message: friendly });
    return { scene: null, meta: { errors, warnings, balances, computed: computedOf(resolved.flows), totalIn, totalOut } };
  }

  for (const node of graph.nodes) {
    const dy = project.offsets[String(node.id)] ?? 0;
    if (!dy || node.y0 == null || node.y1 == null) continue;
    const h = node.y1 - node.y0;
    const y0 = Math.max(top, Math.min(height - bottom - h, node.y0 + dy));
    node.y0 = y0;
    node.y1 = y0 + h;
  }
  generator.update(graph);

  const nodes: SceneNode[] = graph.nodes.map((node) => ({
    id: String(node.id),
    x: node.x0 ?? 0,
    y: node.y0 ?? 0,
    w: (node.x1 ?? 0) - (node.x0 ?? 0),
    h: Math.max(0, (node.y1 ?? 0) - (node.y0 ?? 0)),
    color: colors.get(String(node.id)) ?? PALETTE[0]!,
    value: node.value ?? 0,
  }));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const lastLayer = graph.nodes.reduce((max, node) => Math.max(max, node.layer ?? 0), 0);

  const links: SceneLink[] = [];
  graph.links.forEach((link, index) => {
    const source = link.source;
    const target = link.target;
    if (typeof source === "string" || typeof target === "string") return;
    const sourceId = String(source.id);
    const targetId = String(target.id);
    const sourceNode = nodeById.get(sourceId);
    const targetNode = nodeById.get(targetId);
    if (!sourceNode || !targetNode || link.y0 == null || link.y1 == null || link.width == null) return;
    const sourceStyle = parsed.styles.get(sourceId);
    const targetStyle = parsed.styles.get(targetId);
    const explicit = typeof link.color === "string" ? link.color : null;
    const opacity = typeof link.opacity === "number" ? link.opacity : settings.flowOpacity;
    let gradient: SceneLink["gradient"] = null;
    let fill = explicit ?? sourceNode.color;
    if (!explicit && sourceStyle?.paintOut && sourceStyle.color) fill = sourceStyle.color;
    else if (!explicit && targetStyle?.paintIn && targetStyle.color) fill = targetStyle.color;
    else if (!explicit) {
      const id = `g${index}`;
      gradient = {
        id,
        x1: sourceNode.x + sourceNode.w,
        y1: link.y0,
        x2: targetNode.x,
        y2: link.y1,
        from: sourceNode.color,
        to: targetNode.color,
      };
      fill = `url(#${id})`;
    }
    links.push({
      id: `${sourceId}->${targetId}:${index}`,
      d: ribbon(sourceNode.x + sourceNode.w, targetNode.x, link.y0, link.y1, link.width),
      fill,
      opacity,
      source: sourceId,
      target: targetId,
      gradient,
    });
  });

  const labels: SceneLabel[] = settings.showLabels
    ? graph.nodes.flatMap((node) => {
        const id = String(node.id);
        const drawn = nodeById.get(id);
        if (!drawn || node.y0 == null || node.y1 == null || node.layer == null) return [];
        const onLeft = node.layer === 0 && lastLayer > 0;
        const label: SceneLabel = {
          id,
          x: onLeft ? drawn.x - 10 : drawn.x + drawn.w + 10,
          y: drawn.y + drawn.h / 2,
          anchor: onLeft ? "end" : "start",
          name: id,
          value: formatNumber(node.value ?? 0, settings),
          showValue: settings.showValues,
        };
        return [label];
      })
    : [];

  return {
    scene: {
      width,
      height,
      paper,
      title: project.title,
      subtitle: project.subtitle,
      links,
      nodes,
      labels,
    },
    meta: {
      errors,
      warnings,
      balances,
      computed: computedOf(resolved.flows),
      totalIn,
      totalOut,
    },
  };
}

function computedOf(flows: ResolvedFlow[]): ComputedFlow[] {
  const rows: ComputedFlow[] = [];
  for (const flow of flows) {
    if (flow.kind === "value") continue;
    rows.push({ source: flow.source, target: flow.target, value: flow.value, kind: flow.kind });
  }
  return rows;
}
