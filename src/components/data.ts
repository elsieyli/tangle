export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface Node {
  id: string;
  name: string;
  notes: string;
  x?: number
  y?: number
  z?: number
}

export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}
