import { escapeXml } from "./format";
import type { Scene } from "./types";

const SANS = "Source Sans 3, Segoe UI, Helvetica, sans-serif";
const DISPLAY = "Fraunces, Georgia, Times New Roman, serif";

export function sceneToSvg(scene: Scene): string {
  const { paper } = scene;
  const grads = scene.links
    .filter((link) => link.gradient)
    .map((link) => {
      const g = link.gradient!;
      return `<linearGradient id="${g.id}" gradientUnits="userSpaceOnUse" x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}"><stop offset="0%" stop-color="${g.from}"/><stop offset="100%" stop-color="${g.to}"/></linearGradient>`;
    })
    .join("");

  const links = scene.links
    .map(
      (link) =>
        `<path data-flow="${escapeXml(link.id)}" data-source="${escapeXml(link.source)}" data-target="${escapeXml(link.target)}" data-opacity="${link.opacity}" d="${link.d}" fill="${link.fill}" opacity="${link.opacity}"/>`,
    )
    .join("");

  const nodes = scene.nodes
    .map(
      (node) =>
        `<rect data-node="${escapeXml(node.id)}" x="${node.x}" y="${node.y}" width="${node.w}" height="${Math.max(node.h, 0.8)}" rx="2" fill="${node.color}"/>`,
    )
    .join("");

  const labels = scene.labels
    .map((label) => {
      const value = label.showValue
        ? `<tspan x="${label.x}" dy="1.2em" fill="${paper.muted}" font-size="11">${escapeXml(label.value)}</tspan>`
        : "";
      const dy = label.showValue ? "-0.45em" : "0.35em";
      return `<text data-label="${escapeXml(label.id)}" x="${label.x}" y="${label.y}" text-anchor="${label.anchor}" fill="${paper.fg}" font-family="${SANS}" font-size="13" stroke="${paper.bg}" stroke-width="3" paint-order="stroke fill" stroke-linejoin="round"><tspan x="${label.x}" dy="${dy}">${escapeXml(label.name)}</tspan>${value}</text>`;
    })
    .join("");

  const title = scene.title
    ? `<text x="32" y="40" fill="${paper.fg}" font-family="${DISPLAY}" font-size="${scene.title.length > 42 ? 22 : 28}" font-weight="560">${escapeXml(scene.title)}</text>`
    : "";
  const subtitle = scene.subtitle
    ? `<text x="32" y="62" fill="${paper.muted}" font-family="${SANS}" font-size="14">${escapeXml(scene.subtitle)}</text>`
    : "";
  const ruleY = scene.title && scene.subtitle ? 74 : scene.title ? 56 : 0;
  const rule = scene.title ? `<rect x="32" y="${ruleY}" width="36" height="2" fill="${paper.rule}"/>` : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}" role="img" aria-label="${escapeXml(scene.title || "Sankey diagram")}">
<style>text{font-variant-numeric:tabular-nums}</style>
<rect width="100%" height="100%" fill="${paper.bg}"/>
${title}${subtitle}${rule}
<defs>${grads}</defs>
<g class="flows">${links}</g>
<g class="nodes">${nodes}</g>
<g class="labels">${labels}</g>
</svg>`;
}
