---
description: "Execute Task 3: Refactor Node Rendering (nodeCanvasObject) in ego-graph-2d to match cluster-map-2d aesthetics"
agent: "edit"
tools: ["editFiles", "codebase"]
---

# Refactor Ego Graph Node Rendering

You are an expert React Developer and Data Visualization Engineer specializing in HTML5 Canvas and `react-force-graph-2d`.

## Task

Your task is to implement Task 3 of the ego-graph-2d refactoring plan: Refactor Node Rendering. You need to rewrite the `drawNode` callback in `src/components/graph/ego-graph-2d.tsx` so that its avatar clipping, sizing, and coloring logic align with `src/components/graph/cluster-map-2d.tsx`, while preserving the specific highlight logic for the `targetId`.

## Instructions

1. Open `src/components/graph/ego-graph-2d.tsx` and locate the `drawNode` callback function used in `nodeCanvasObject`.
2. **Coloring Logic:** Remove the old `isHighRisk` boolean logic for colors. The primary node color MUST be derived from `LABEL_COLORS[node.label || "UNKNOWN"]`.
3. **Target Node Logic:** Check if the node is the target: `const isTarget = node.id === targetId`.
   - Node size: `isTarget ? 10 : 6`.
   - Glow effect: If `isTarget`, draw a larger circle behind the node filled with the primary color (with reduced opacity, e.g., 0.2) to create a glow effect.
4. **Avatar & Clipping:** Look at `cluster-map-2d.tsx` to see how avatars are cached (`imgCache`), loaded, and clipped into a perfect circle. Port this clean logic into `ego-graph-2d.tsx`.
5. **Fallback Shape:** Remove the complex "industrial placeholder icon" (the stylized silhouette drawing with arc paths). If there is no image or it fails to load, simply fill the circular path with `#1e293b`.
6. **Border (Stroke):** Draw the outer stroke using the primary color. Set `lineWidth` to `2` if `isTarget`, otherwise `1`.

## Context / Input

- Target file to modify: `src/components/graph/ego-graph-2d.tsx`
- Reference file: `src/components/graph/cluster-map-2d.tsx` (for the avatar clipping and drawing technique).
- You can assume `LABEL_COLORS` is already present in `ego-graph-2d.tsx` (completed in Task 1).

## Output

- Output format: Direct file edits to `src/components/graph/ego-graph-2d.tsx`.
- Keep the code clean, readable, and properly utilizing the Canvas 2D API (`ctx`).

## Quality & Validation

- **Success Criteria 1:** The "industrial placeholder icon" canvas paths are completely removed.
- **Success Criteria 2:** Node colors strictly rely on `LABEL_COLORS` mapped by `node.label`.
- **Success Criteria 3:** Images are correctly clipped into circles, and the target node has the correct size (10) and glow effect.
- **Success Criteria 4:** TypeScript compiles without errors (ensure `node.label` is accessed safely).
