import type { Settings } from "./types";

export function clean(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

export function formatNumber(n: number, settings: Pick<Settings, "prefix" | "suffix" | "decimals">): string {
  if (!Number.isFinite(n)) return "—";
  const digits = Math.min(4, Math.max(0, settings.decimals));
  const body = clean(n).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return `${settings.prefix}${body}${settings.suffix}`;
}

export function slug(title: string): string {
  const s = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "flume";
}

function entity(name: string): string {
  return `&${name};`;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, entity("amp"))
    .replace(/</g, entity("lt"))
    .replace(/>/g, entity("gt"))
    .replace(/"/g, entity("quot"));
}

export function expandHex(raw: string): string {
  const s = raw.toLowerCase();
  if (s.length === 3) return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
  return `#${s}`;
}
