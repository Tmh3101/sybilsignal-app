---
description: "Update TypeScript type definitions in api.d.ts to match the new v1.2 FastAPI backend schema."
agent: "edit"
tools: ["read_file", "write_file"]
---

# Implement Phase 1: Standardize Data Types (api.d.ts)

You are an expert Frontend Developer and TypeScript architect specializing in Next.js and strict type safety.

## Task Section

Our FastAPI backend has recently been heavily refactored. The frontend's current type definitions are now out of sync, which will cause the UI to crash when mapping API responses.

Your task is to execute **Phase 1** of our integration plan: Overwrite the existing `src/types/api.d.ts` file with the newly standardized schema.

## Instructions Section

**Step 1: Update Graph Elements**

- Overwrite `SybilNode` and `SybilEdge`.
- CRITICAL: Change `total_mirrors` to `total_reposts` inside `SybilNode['attributes']`.
- Update the `type` property in `SybilEdge` to strictly accept the 12 new relation types.

**Step 2: Update Module 2 (Inspector) Types**

- Remove old `Analysis` and `LocalGraph` interfaces.
- Create a new `SybilReport` interface.
- Update `InspectorResponse` to use the new nested `report` and `ego_graph` properties.

**Step 3: Update Module 1 (Discovery) Types**

- Create `TimeRange` and `Hyperparameters` interfaces.
- Refactor `DiscoveryStartRequest` to use these nested objects instead of a flat structure.
- Update `DiscoveryStatusResponse` to include the new `cluster_count` property inside `graph_data`.

## Context/Input Section

- Target file: `src/types/api.d.ts`
- **Exact Schema to Apply:** Use the following TypeScript definitions as your absolute source of truth:

```typescript
export interface SybilNode {
  id: string;
  label: string;
  trust_score: number;
  cluster_id?: number;
  x?: number;
  y?: number;
  z?: number;
  attributes: {
    handle?: string;
    bio?: string;
    created_on?: string;
    days_active?: number;
    total_tips?: number;
    total_posts?: number;
    total_quotes?: number;
    total_reacted?: number;
    total_reactions?: number;
    total_reposts?: number; // STRICTLY total_reposts, not mirrors
    total_collects?: number;
    total_comments?: number;
    total_followers?: number;
    total_following?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface SybilEdge {
  source: string;
  target: string;
  type:
    | "FOLLOW"
    | "UPVOTE"
    | "REACTION"
    | "COMMENT"
    | "QUOTE"
    | "MIRROR"
    | "COLLECT"
    | "CO-OWNER"
    | "SAME_AVATAR"
    | "FUZZY_HANDLE"
    | "SIM_BIO"
    | "CLOSE_CREATION_TIME"
    | "UNKNOWN";
  weight: number;
}

export interface SybilReport {
  label: "BENIGN" | "LOW_RISK" | "HIGH_RISK" | "MALICIOUS";
  risk_score: number;
  risk_level: string;
  reasoning: string;
}

export interface InspectorResponse {
  profile_id: string;
  status: string;
  report: SybilReport;
  ego_graph: {
    nodes: SybilNode[];
    edges: SybilEdge[];
  };
  execution_time_ms: number;
}

export interface TimeRange {
  start_date: string;
  end_date: string;
}

export interface Hyperparameters {
  max_epochs?: number;
  patience?: number;
  learning_rate?: number;
}

export interface DiscoveryStartRequest {
  time_range: TimeRange;
  max_nodes?: number;
  hyperparameters?: Hyperparameters;
}

export interface DiscoveryStartResponse {
  task_id: string;
}

export interface DiscoveryStatusResponse {
  task_id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  current_step: string;
  graph_data: {
    cluster_count: number;
    nodes: SybilNode[];
    links: SybilEdge[];
  } | null;
  message: string | null;
}
```

## Output Section

- Replace the entire contents of `src/types/api.d.ts` with the provided code.
- Do not modify any other files in this step.

## Quality/Validation Section

- Verify that `total_mirrors` no longer exists anywhere in the file.
- Verify that `InspectorResponse` has an `edges` array inside `ego_graph` (not `links`).
- Ensure all TypeScript syntax is valid and all interfaces are properly exported.
