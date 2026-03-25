---
description: "Execute Task 4: Unify Tooltips and Legends in ego-graph-2d to match cluster-map-2d"
agent: "edit"
tools: ["editFiles", "codebase"]
---

# Unify Ego Graph Tooltip and Legend

You are an expert React Developer and UI/UX Engineer.

## Task

Your task is to implement Task 4 of the ego-graph-2d refactoring plan: Unify Tooltips and Legends. You need to synchronize the interactive HTML tooltips (`nodeLabel`) and the static UI Legend overlay in `src/components/graph/ego-graph-2d.tsx` with the design established in `src/components/graph/cluster-map-2d.tsx`, adding specific context for the "Target Entity".

## Instructions

1. **Analyze Reference:** Open `src/components/graph/cluster-map-2d.tsx` and examine the `nodeLabel` function and the absolute `<div>` legend overlay at the bottom of the component.
2. **Update Tooltip (`nodeLabel`):** - Open `src/components/graph/ego-graph-2d.tsx` and replace its current `nodeLabel` string/function with the layout logic from `cluster-map-2d.tsx`.
   - **Crucial Modification:** Modify this new tooltip in `ego-graph-2d.tsx` to check `if (node.id === targetId)`. If true, append a prominent, animated badge (e.g., `[TARGET_ENTITY]`) in cyan color to the tooltip.
   - Ensure you use Optional Chaining (`node.attributes?.handle`) to prevent crashes.
3. **Update Legend Overlay:**
   - Locate the absolute `<div>` legend at the bottom of `ego-graph-2d.tsx` and completely replace it.
   - Copy the two-section legend ("Node Labels" / "NODE MAP" and "Relation Layers") from `cluster-map-2d.tsx`.
   - **Crucial Modification:** In the "Node Labels" section of the new legend in `ego-graph-2d.tsx`, inject one additional row at the top: "Target Entity (Larger Node)". Style its color swatch with Cyan (`#00f2ff`) and make the dot slightly larger (e.g., `h-3 w-3`) to distinguish it from a normal benign node.

## Context / Input

- Target file to modify: `src/components/graph/ego-graph-2d.tsx`
- Reference file: `src/components/graph/cluster-map-2d.tsx`
- `LABEL_COLORS` and `RELATION_COLORS` are assumed to be present in `ego-graph-2d.tsx` (from Task 1).

## Output

- Output format: Direct file edits to `src/components/graph/ego-graph-2d.tsx`.
- The HTML strings returned by `nodeLabel` must be valid and maintain the dark/industrial Tailwind CSS aesthetic.

## Quality & Validation

- **Success Criteria 1:** The `nodeLabel` safely handles undefined attributes and explicitly highlights the `targetId`.
- **Success Criteria 2:** The Legend overlay contains both Node Labels and Relation Layers matching `cluster-map-2d.tsx`.
- **Success Criteria 3:** The Legend overlay includes a specific entry for the "Target Entity".
- **Success Criteria 4:** No missing variables or Tailwind syntax errors in the interpolated HTML templates.
