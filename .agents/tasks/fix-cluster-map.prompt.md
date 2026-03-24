---
description: "Refactor ClusterMap2D and Discovery Dashboard to sync with dynamic API payload"
agent: "edit"
tools: ["editFiles"]
---

# UI Refactoring for Sybil Discovery Module

You are an expert Frontend Engineer specializing in React, Next.js, and data visualization using `react-force-graph-2d`. I need you to fix the mismatch between the current UI and the actual API payload.

## Context
Review the provided `test.json`. Notice the structure:
- `graph_data.cluster_count` exists.
- `nodes` have `id`, `label`, `cluster_id`, `risk_score`, and nested `attributes` (handle, reason, etc.). Notice there is NO `is_high_risk` boolean.
- `links` have `edge_type` (e.g., "CO-OWNER").

## Task List

### Task 1: Update Scan Statistics (`page.tsx`)
In the `Scan Statistics` absolute overlay:
- Keep the `K (Max Nodes)` row.
- Add a new row below it: `CLUSTERS FOUND` mapping to `statusData.graph_data?.cluster_count || 0`. Color the value with `text-accent-cyan`.

### Task 2: Fix Node Logic & Enhance Tooltip (`cluster-map-2d.tsx`)
- Replace any usage of `node.is_high_risk` with `(node.risk_score && node.risk_score >= 0.8)`.
- Update the `nodeLabel` function in `ForceGraph2D` to return a rich, industrial-themed HTML tooltip. It must display:
  1. Handle (`node.attributes?.handle`) in bold cyan.
  2. Full Node ID.
  3. Risk Score (`node.risk_score`) - make it Red if >= 0.8, otherwise Green.
  4. Reason (`node.attributes?.reason`) - display this in a smaller, slate-colored italic text, wrapped nicely.

### Task 3: Implement Dynamic Edge Layer Coloring (`cluster-map-2d.tsx`)
Currently, all links are grey.
- Create a `RELATION_COLORS` constant mapping categories to distinct hex colors:
  - `FOLLOW`: Blue (`#3b82f6`)
  - `INTERACT` (or `COMMENT`, `QUOTE`, `UPVOTE`): Green (`#10b981`)
  - `CO-OWNER`: Orange/Red (`#f97316`)
  - `SIMILARITY`: Purple (`#a855f7`)
  - `UNKNOWN` / Default: Grey (`#64748b`)
- Update the `linkColor` property in `ForceGraph2D` to check `link.edge_type` and return the corresponding color. Increase opacity to `0.8` so the lines are visible.

### Task 4: Revamp the Legend (`page.tsx` & `cluster-map-2d.tsx`)
The current legend in `page.tsx` is hardcoded and nonsensical.
1. Remove the static "Cluster Engine A/B/C" from `page.tsx`.
2. Move the Legend overlay responsibility into `cluster-map-2d.tsx` (so it travels with the graph).
3. The new Legend should have two sections:
   - **NODE MAP**: "High Risk Sybil (Score > 0.8)" (Red with pulse) and "Normal Nodes" (Cyan).
   - **RELATION LAYERS**: Display a small line (`<div class="h-0.5 w-3...">`) next to labels for "Co-Owner", "Follow", "Interact", and "Similarity" matching the colors defined in Task 3.

## Output Requirements
Modify `page.tsx` and `cluster-map-2d.tsx` directly. Ensure styles match the existing dark/industrial theme using Tailwind CSS. Handle undefined attributes safely (e.g., `node.attributes?.handle || 'Unknown'`).