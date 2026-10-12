import type { Project, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const KEY = "flume.project.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function pickSettings(value: unknown): Settings {
  const raw = isRecord(value) ? value : {};
  const align = raw.align;
  const sort = raw.sort;
  const paper = raw.paper;
  return {
    ...DEFAULT_SETTINGS,
    prefix: typeof raw.prefix === "string" ? raw.prefix : DEFAULT_SETTINGS.prefix,
    suffix: typeof raw.suffix === "string" ? raw.suffix : DEFAULT_SETTINGS.suffix,
    decimals: clampNum(raw.decimals, 0, 4, DEFAULT_SETTINGS.decimals),
    width: clampNum(raw.width, 640, 2400, DEFAULT_SETTINGS.width),
    height: clampNum(raw.height, 420, 2400, DEFAULT_SETTINGS.height),
    nodeWidth: clampNum(raw.nodeWidth, 6, 40, DEFAULT_SETTINGS.nodeWidth),
    nodeGap: clampNum(raw.nodeGap, 4, 64, DEFAULT_SETTINGS.nodeGap),
    flowOpacity: clampNum(raw.flowOpacity, 0.08, 0.95, DEFAULT_SETTINGS.flowOpacity),
    align: align === "left" || align === "right" || align === "center" || align === "justify" ? align : DEFAULT_SETTINGS.align,
    sort: sort === "value" || sort === "entry" ? sort : DEFAULT_SETTINGS.sort,
    showLabels: typeof raw.showLabels === "boolean" ? raw.showLabels : DEFAULT_SETTINGS.showLabels,
    showValues: typeof raw.showValues === "boolean" ? raw.showValues : DEFAULT_SETTINGS.showValues,
    paper: paper === "cream" || paper === "white" || paper === "ink" ? paper : DEFAULT_SETTINGS.paper,
  };
}

function clampNum(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function normalizeProject(input: unknown): Project | null {
  if (!isRecord(input) || typeof input.source !== "string") return null;
  const offsets: Record<string, number> = {};
  if (isRecord(input.offsets)) {
    for (const [key, value] of Object.entries(input.offsets)) {
      if (typeof value === "number" && Number.isFinite(value)) offsets[key] = value;
    }
  }
  return {
    v: 1,
    title: typeof input.title === "string" ? input.title : "Untitled",
    subtitle: typeof input.subtitle === "string" ? input.subtitle : "",
    source: input.source,
    settings: pickSettings(input.settings),
    offsets,
  };
}

export function readStoredProject(): Project | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return normalizeProject(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeStoredProject(project: Project) {
  try {
    localStorage.setItem(KEY, JSON.stringify(project));
  } catch {
    /* private mode or a full disk — the diagram still works */
  }
}

export async function packProject(project: Project): Promise<string> {
  const stream = new Blob([JSON.stringify(project)]).stream().pipeThrough(new CompressionStream("gzip"));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  let bin = "";
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function unpackProject(encoded: string): Promise<Project | null> {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((encoded.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();
  return normalizeProject(JSON.parse(text));
}

export async function projectFromLocation(): Promise<Project | null> {
  const hash = window.location.hash;
  if (!hash.startsWith("#f=")) return null;
  try {
    return await unpackProject(hash.slice(3));
  } catch {
    return null;
  }
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function svgToPng(svg: string, scale: number): Promise<Blob> {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;
  const width = Number(root.getAttribute("width"));
  const height = Number(root.getAttribute("height"));
  if (!width || !height) throw new Error("This diagram has no size yet.");
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not draw the image."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not draw the image.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Could not encode the PNG.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
