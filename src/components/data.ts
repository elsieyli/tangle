import { Id } from "../../convex/_generated/dataModel";
export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface Node {
  id: string;
  name: string;
  notes: string;
  embeddingId: Id<"peopleEmbedding">;
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
