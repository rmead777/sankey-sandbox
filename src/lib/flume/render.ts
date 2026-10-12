import { buildDiagram, type DiagramMeta } from "./layout";
import { sceneToSvg } from "./svg";
import type { Project, Scene } from "./types";

export type RenderResult = {
  scene: Scene | null;
  svg: string;
  meta: DiagramMeta;
};

export function render(project: Project): RenderResult {
  const diagram = buildDiagram(project);
  return {
    scene: diagram.scene,
    svg: diagram.scene ? sceneToSvg(diagram.scene) : "",
    meta: diagram.meta,
  };
}
