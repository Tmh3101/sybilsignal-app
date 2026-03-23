export interface ProfileInfo {
  id: string;
  handle: string;
  picture_url: string;
  owned_by: string;
}

export interface InferenceReasoning {
  type: string; // e.g., "SIM_BIO", "PATTERN_XYZ"
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface Analysis {
  sybil_probability: number;
  classification: "BENIGN" | "WARNING" | "SYBIL";
  reasoning: string[];
}

export interface LocalGraph {
  nodes: any[]; // Detailed in Task 3
  links: any[];
}

export interface InspectorResponse {
  profile_info: ProfileInfo;
  analysis: Analysis;
  local_graph: LocalGraph;
}

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
