import { useEffect, useRef } from "react";
import type { Scene, SceneLink } from "@/lib/flume/types";

export type Focus = { kind: "node"; id: string } | { kind: "link"; id: string } | null;

const SANS = "Source Sans 3, Segoe UI, Helvetica, sans-serif";
const DISPLAY = "Fraunces, Georgia, Times New Roman, serif";

function linkHot(link: SceneLink, focus: Focus): boolean {
  if (!focus) return true;
  if (focus.kind === "link") return link.id === focus.id;
  return link.source === focus.id || link.target === focus.id;
}

function nodeHot(id: string, focus: Focus, links: SceneLink[]): boolean {
  if (!focus) return true;
  if (focus.kind === "node") {
    if (id === focus.id) return true;
    return links.some((link) => (link.source === focus.id || link.target === focus.id) && (link.source === id || link.target === id));
  }
  const link = links.find((item) => item.id === focus.id);
  return link?.source === id || link?.target === id;
}

export function SankeySvg({
  scene,
  focus,
  offsets,
  onFocus,
  onOffset,
}: {
  scene: Scene;
  focus: Focus;
  offsets: Record<string, number>;
  onFocus: (focus: Focus) => void;
  onOffset: (id: string, offset: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: string; y: number; scale: number; base: number } | null>(null);
  const onOffsetRef = useRef(onOffset);
  onOffsetRef.current = onOffset;

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const current = drag.current;
      if (!current) return;
      onOffsetRef.current(current.id, current.base + (event.clientY - current.y) * current.scale);
    };
    const up = () => {
      drag.current = null;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const ruleY = scene.title && scene.subtitle ? 74 : scene.title ? 56 : 0;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${scene.width} ${scene.height}`}
      width={scene.width}
      height={scene.height}
      className="block h-auto w-full select-none"
      role="group"
      aria-label={scene.title || "Sankey diagram"}
      onPointerLeave={() => onFocus(null)}
    >
      <rect width="100%" height="100%" fill={scene.paper.bg} />
      {scene.title ? (
        <text
          x={32}
          y={40}
          fill={scene.paper.fg}
          fontFamily={DISPLAY}
          fontSize={scene.title.length > 42 ? 22 : 28}
          fontWeight={560}
        >
          {scene.title}
        </text>
      ) : null}
      {scene.subtitle ? (
        <text x={32} y={62} fill={scene.paper.muted} fontFamily={SANS} fontSize={14}>
          {scene.subtitle}
        </text>
      ) : null}
      {scene.title ? <rect x={32} y={ruleY} width={36} height={2} fill={scene.paper.rule} /> : null}
      <defs>
        {scene.links.map((link) =>
          link.gradient ? (
            <linearGradient
              key={link.gradient.id}
              id={link.gradient.id}
              gradientUnits="userSpaceOnUse"
              x1={link.gradient.x1}
              y1={link.gradient.y1}
              x2={link.gradient.x2}
              y2={link.gradient.y2}
            >
              <stop offset="0%" stopColor={link.gradient.from} />
              <stop offset="100%" stopColor={link.gradient.to} />
            </linearGradient>
          ) : null,
        )}
      </defs>
      <g>
        {scene.links.map((link) => {
          const hot = linkHot(link, focus);
          return (
            <path
              key={link.id}
              d={link.d}
              fill={link.fill}
              opacity={hot ? Math.min(0.92, link.opacity + (focus ? 0.28 : 0)) : link.opacity * 0.12}
              className="cursor-pointer transition-opacity duration-150"
              onPointerEnter={() => onFocus({ kind: "link", id: link.id })}
            >
              <title>{`${link.source} → ${link.target}`}</title>
            </path>
          );
        })}
      </g>
      <g>
        {scene.nodes.map((node) => {
          const hot = nodeHot(node.id, focus, scene.links);
          const hitHeight = Math.max(node.h, 18);
          return (
            <g key={node.id} opacity={hot ? 1 : 0.22} className="transition-opacity duration-150">
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={Math.max(node.h, 0.8)}
                rx={2}
                fill={node.color}
                pointerEvents="none"
              />
              <rect
                x={node.x - 8}
                y={node.y - (hitHeight - node.h) / 2}
                width={node.w + 16}
                height={hitHeight}
                fill="transparent"
                className="cursor-ns-resize touch-none"
                onPointerEnter={() => onFocus({ kind: "node", id: node.id })}
                onPointerDown={(event) => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  event.preventDefault();
                  const rect = svg.getBoundingClientRect();
                  const box = svg.viewBox.baseVal;
                  drag.current = {
                    id: node.id,
                    y: event.clientY,
                    scale: box.height / rect.height,
                    base: offsets[node.id] ?? 0,
                  };
                }}
                onDoubleClick={(event) => {
                  event.preventDefault();
                  drag.current = null;
                  onOffset(node.id, 0);
                }}
              >
                <title>{`${node.id}. Drag to nudge, double-click to reset.`}</title>
              </rect>
            </g>
          );
        })}
      </g>
      <g pointerEvents="none" style={{ fontVariantNumeric: "tabular-nums" }}>
        {scene.labels.map((label) => {
          const hot = nodeHot(label.id, focus, scene.links);
          return (
            <text
              key={label.id}
              x={label.x}
              y={label.y}
              textAnchor={label.anchor}
              fill={scene.paper.fg}
              fontFamily={SANS}
              fontSize={13}
              stroke={scene.paper.bg}
              strokeWidth={3}
              paintOrder="stroke fill"
              strokeLinejoin="round"
              opacity={hot ? 1 : 0.28}
              className="transition-opacity duration-150"
            >
              <tspan x={label.x} dy={label.showValue ? "-0.45em" : "0.35em"}>
                {label.name}
              </tspan>
              {label.showValue ? (
                <tspan x={label.x} dy="1.2em" fill={scene.paper.muted} fontSize={11} stroke={scene.paper.bg}>
                  {label.value}
                </tspan>
              ) : null}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
