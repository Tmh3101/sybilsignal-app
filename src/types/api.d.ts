export interface SybilNode {
  id: string;
  label: string;
  trust_score: number;
  is_sybil: boolean;
  attributes: {
    follower_count?: number;
    following_count?: number;
    account_age?: string;
    [key: string]: any;
  };
}

export interface SybilEdge {
  source: string;
  target: string;
  type: "comment" | "follow" | "upvote" | "transfer";
  weight: number;
}

export interface InferenceReasoning {
  type: string; // e.g., "SIM_BIO", "PATTERN_XYZ"
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface InspectorResponse {
  profile_id: string;
  final_probability: number;
  classification: "SYBIL" | "HUMAN" | "SUSPICIOUS";
  reasoning: InferenceReasoning[];
  local_graph: {
    nodes: SybilNode[];
    links: SybilEdge[];
  };
}
