---
description: "Execute Task 2: Simplify link rendering by mapping RELATION_COLORS and removing directional animations"
agent: "edit"
tools: ["editFiles"]
---

# Simplify Link Rendering in Ego Graph

You are an expert React Developer and Data Visualization Engineer specializing in `react-force-graph-2d`.

## Task

Your task is to implement Task 2 of the ego-graph-2d refactoring plan: Simplify Link Rendering. You will strip out the complex, performance-heavy link animations and align the link coloring with the newly unified `RELATION_COLORS` constant.

## Instructions

1. Open the target file: `src/components/graph/ego-graph-2d.tsx`.
2. Locate the `<ForceGraph2D>` component rendering block.
3. **Update `linkColor`:** Modify the `linkColor` property to use the `RELATION_COLORS` constant (which was added in Task 1). Map it using the link's type (e.g., `link.type` or `link.edge_type`). If the type is undefined or not found, fall back to `RELATION_COLORS["UNKNOWN"]`.
4. **Remove Animations:** Delete the following properties from `<ForceGraph2D>` completely:
   - `linkDirectionalArrowLength`
   - `linkDirectionalArrowRelPos`
   - `linkDirectionalParticles`
   - `linkDirectionalParticleWidth`
   - `linkDirectionalParticleSpeed`
5. **Preserve Multigraph Logic:** DO NOT remove or alter `linkCurvature` and `linkWidth`. These rely on `multiLinkCount` and are essential to prevent multiple overlapping edges between the same two nodes.

## Context / Input

- Target file to modify: `src/components/graph/ego-graph-2d.tsx`
- Goal: Create a minimalist, performant visual style for links that matches `cluster-map-2d.tsx`, while keeping the functional multigraph curvature.

## Output

- Output format: Direct file edits to `src/components/graph/ego-graph-2d.tsx`.
- Keep the code clean and well-formatted.

## Quality & Validation

- **Success Criteria 1:** `linkColor` successfully utilizes `RELATION_COLORS`.
- **Success Criteria 2:** All `linkDirectional*` properties are removed from the component.
- **Success Criteria 3:** `linkCurvature` and `linkWidth` remain perfectly intact.
- **Success Criteria 4:** No TypeScript compilation errors are introduced.
