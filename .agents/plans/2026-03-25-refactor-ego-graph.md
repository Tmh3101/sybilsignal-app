# Implementation Plan: Refactor EgoGraph2D to mirror ClusterMap2D

## Overview

This plan outlines the steps to refactor `src/components/graph/ego-graph-2d.tsx` so its visual aesthetics, styling variables, and legends perfectly match `src/components/graph/cluster-map-2d.tsx`. The only intentional differences remaining will be the target-centric physics (pinning the target node at `[0,0]` and using radial forces) and the preservation of link curvature for multigraph connections.

**Target File:** `src/components/graph/ego-graph-2d.tsx`
**Reference File:** `src/components/graph/cluster-map-2d.tsx`

## Scope & File Structure

- `src/components/graph/ego-graph-2d.tsx` (Will be extensively modified)
- No new files will be created. We apply DRY principles by porting the proven clean configuration from the cluster map directly into the ego graph.

## Step-by-Step Tasks

### Task 1: Unify Constants and Remove Legacy Schema

- **Action:** Open `src/components/graph/ego-graph-2d.tsx`.
- **Remove:** Delete the entire `MULTIGRAPH_SCHEMA` constant.
- **Add:** Copy the `LABEL_COLORS` and `RELATION_COLORS` constants directly from `src/components/graph/cluster-map-2d.tsx`.
- **Reasoning:** Ensures consistent visual language across both graph views.

### Task 2: Simplify Link Rendering

- **Action:** In the `<ForceGraph2D>` component properties inside `ego-graph-2d.tsx`:
- **Update `linkColor`:** Change it to use the `RELATION_COLORS` object mapped by `link.edge_type` or `link.type` (whichever is present in `ExtendedLink`), falling back to `RELATION_COLORS.UNKNOWN`.
- **Remove Animations:** Delete the `linkDirectionalArrowLength`, `linkDirectionalArrowRelPos`, `linkDirectionalParticles`, `linkDirectionalParticleWidth`, and `linkDirectionalParticleSpeed` properties. We are moving to a minimalist straight/curved line approach like the cluster map.
- **Keep:** Retain the `linkCurvature` and `linkWidth` logic (using `multiLinkCount`) to prevent multiple links between the same two nodes from overlapping.

### Task 3: Refactor Node Rendering (`nodeCanvasObject`)

- **Action:** Rewrite the `drawNode` callback in `ego-graph-2d.tsx`.
- **Align styling:** The primary color should be derived from `LABEL_COLORS[node.label || "UNKNOWN"]`.
- **Target Logic:** Determine `const isTarget = node.id === targetId`.
  - Set `size` to `isTarget ? 10 : 6`.
  - If `isTarget`, apply an outer glow matching its label color.
- **Avatar Clipping:** Port the clean avatar loading and circular clipping logic directly from `cluster-map-2d.tsx`. Remove the complex "industrial placeholder icon" logic and replace it with simple color fills if the image fails to load.
- **Border:** Draw the outer stroke using the label color. `isTarget` gets `lineWidth = 2`, others `1`.

### Task 4: Unify Tooltips and Legends

- **Action:** Update the HTML overlay components.
- **Tooltip (`nodeLabel`):** Copy the exact template literal from `cluster-map-2d.tsx` into `ego-graph-2d.tsx`. Modify it slightly to explicitly flag if the node is the `[TARGET_ENTITY]`. Ensure it safely checks `node.attributes?.handle`.
- **Legend:** Replace the entire absolute `<div>` legend at the bottom of `ego-graph-2d.tsx`. Copy the exact two-section legend ("Node Labels" and "Relation Layers") from `cluster-map-2d.tsx`. Add one extra item to the "Node Labels" section: "Target Entity (Larger Node)".

### Task 5: Physics Verification (No changes, just safeguard)

- **Action:** Ensure the `processedData` `useMemo` block still forcefully sets `fx: 0, fy: 0` for `node.id === targetId`.
- **Action:** Ensure the `useEffect` block handling `fgRef.current.d3Force("radial", ...)` remains intact to maintain the ego-centric pull.

## Plan Review Loop

After writing the complete plan:

1. Dispatch a single plan-document-reviewer subagent (see plan-document-reviewer-prompt.md) with precisely crafted review context — never your session history. This keeps the reviewer focused on the plan, not your thought process.
   - Provide: path to the plan document, path to spec document
2. If ❌ Issues Found: fix the issues, re-dispatch reviewer for the whole plan
3. If ✅ Approved: proceed to execution handoff

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-25-refactor-ego-graph.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints
