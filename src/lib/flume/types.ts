export type Align = "left" | "justify" | "right" | "center";
export type SortMode = "entry" | "value";
export type PaperName = "cream" | "white" | "ink";

export type Settings = {
  prefix: string;
  suffix: string;
  decimals: number;
  width: number;
  height: number;
  nodeWidth: number;
  nodeGap: number;
  flowOpacity: number;
  align: Align;
  sort: SortMode;
  showLabels: boolean;
  showValues: boolean;
  paper: PaperName;
};

export type Project = {
  v: 1;
  title: string;
  subtitle: string;
  source: string;
  settings: Settings;
  offsets: Record<string, number>;
};

export type Issue = { line: number; message: string };

export type FlowKind = "value" | "rest" | "need";

export type FlowDraft = {
  line: number;
  source: string;
  target: string;
  kind: FlowKind;
  amount: number | null;
  color: string | null;
  opacity: number | null;
};

export type ResolvedFlow = {
  line: number;
  source: string;
  target: string;
  kind: FlowKind;
  value: number;
  color: string | null;
  opacity: number | null;
};

export type NodeStyle = {
  color: string | null;
  paintIn: boolean;
  paintOut: boolean;
};

export type NodeBalance = {
  name: string;
  inn: number;
  out: number;
  gap: number;
};

export type Paper = {
  bg: string;
  fg: string;
  muted: string;
  rule: string;
};

export type SceneLink = {
  id: string;
  d: string;
  fill: string;
  opacity: number;
  source: string;
  target: string;
  gradient: { id: string; x1: number; y1: number; x2: number; y2: number; from: string; to: string } | null;
};

export type SceneNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  value: number;
};

export type SceneLabel = {
  id: string;
  x: number;
  y: number;
  anchor: "start" | "end";
  name: string;
  value: string;
  showValue: boolean;
};

export type Scene = {
  width: number;
  height: number;
  paper: Paper;
  title: string;
  subtitle: string;
  links: SceneLink[];
  nodes: SceneNode[];
  labels: SceneLabel[];
};

export const PALETTE = [
  "#1f4b4a",
  "#c4622d",
  "#3d5a3d",
  "#8c3a3a",
  "#3a4a6b",
  "#8a6232",
  "#4a4458",
  "#2f6f6a",
  "#7a4e3a",
  "#3e5c48",
];

export const PAPERS: Record<PaperName, Paper> = {
  cream: { bg: "#f3eee6", fg: "#1c1915", muted: "#6f675e", rule: "#e39a62" },
  white: { bg: "#fbfbfa", fg: "#1a1a1a", muted: "#5e5a55", rule: "#e39a62" },
  ink: { bg: "#1c1915", fg: "#f4efe6", muted: "#b3a89c", rule: "#e39a62" },
};

export const DEFAULT_SETTINGS: Settings = {
  prefix: "",
  suffix: "",
  decimals: 0,
  width: 1120,
  height: 680,
  nodeWidth: 16,
  nodeGap: 20,
  flowOpacity: 0.5,
  align: "justify",
  sort: "entry",
  showLabels: true,
  showValues: true,
  paper: "cream",
};
