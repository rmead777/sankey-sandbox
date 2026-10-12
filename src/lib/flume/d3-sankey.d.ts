declare module "d3-sankey" {
  export function sankey(): SankeyGenerator;
  export function sankeyJustify(node: SankeyNode, n: number): number;
  export function sankeyLeft(node: SankeyNode, n: number): number;
  export function sankeyRight(node: SankeyNode, n: number): number;
  export function sankeyCenter(node: SankeyNode, n: number): number;

  interface SankeyNode {
    id?: string;
    index?: number;
    value?: number;
    depth?: number;
    height?: number;
    layer?: number;
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    sourceLinks?: SankeyLink[];
    targetLinks?: SankeyLink[];
    [key: string]: unknown;
  }

  interface SankeyLink {
    source: SankeyNode | string;
    target: SankeyNode | string;
    value: number;
    width?: number;
    y0?: number;
    y1?: number;
    index?: number;
    [key: string]: unknown;
  }

  interface SankeyGraph {
    nodes: SankeyNode[];
    links: SankeyLink[];
  }

  interface SankeyGenerator {
    (graph: { nodes: SankeyNode[]; links: SankeyLink[] }): SankeyGraph;
    update(graph: SankeyGraph): SankeyGraph;
    nodeId(fn: (node: SankeyNode) => string): this;
    nodeWidth(width: number): this;
    nodePadding(padding: number): this;
    nodeAlign(fn: (node: SankeyNode, n: number) => number): this;
    nodeSort(compare: ((a: SankeyNode, b: SankeyNode) => number) | null): this;
    extent(extent: [[number, number], [number, number]]): this;
    iterations(n: number): this;
  }
}
