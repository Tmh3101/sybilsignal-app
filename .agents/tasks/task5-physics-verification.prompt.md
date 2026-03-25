---
description: "Execute Task 5: Verify and safeguard the ego-centric physics (radial force and target pinning) in ego-graph-2d"
agent: "edit"
tools: ["editFiles", "codebase"]
---

# Ego Graph Physics Safeguard

You are an expert React Developer and Data Visualization Engineer specializing in D3 physics and `react-force-graph-2d`.

## Task

Your task is to implement Task 5 of the ego-graph-2d refactoring plan: Physics Verification. Following extensive UI refactoring in previous tasks, you must safeguard and verify that the core ego-centric physical properties of the graph remain perfectly intact. The target node must remain pinned to the center, and radial forces must be active.

## Instructions

1. Open `src/components/graph/ego-graph-2d.tsx`.
2. **Verify Target Pinning:** Locate the `processedData` `useMemo` hook (or the logic where nodes are mapped before being passed to `ForceGraph2D`).
   - Ensure that the node matching `targetId` forcefully receives the properties `fx: 0` and `fy: 0`.
   - If this logic was accidentally removed during previous refactoring, you must restore it to ensure the target node is pinned to the center of the canvas.
3. **Verify Radial Physics:** Locate the `useEffect` hook responsible for physics tuning via `fgRef.current?.d3Force`.
   - Ensure the radial force is applied: `fgRef.current.d3Force("radial", d3.forceRadial(150, 0, 0))`.
   - Ensure the many-body `charge` force is explicitly set to a strong negative value (e.g., `-200`) so that satellite nodes repel each other evenly.
   - Ensure `fgRef.current.d3ReheatSimulation()` is called after applying these forces.
4. **Action Required:** If these physics rules are missing, commented out, or broken, apply the necessary code edits to restore them. If they are completely intact, simply output a confirmation and do not modify the file.

## Context / Input

- Target file: `src/components/graph/ego-graph-2d.tsx`
- Goal: Prevent regressions. The ego graph loses its entire purpose if the target node is allowed to float away or if neighbors do not form a proper orbit.

## Output

- Output format: Direct file edits to `src/components/graph/ego-graph-2d.tsx` (only if restorations are needed).

## Quality & Validation

- **Success Criteria 1:** The target node (`id === targetId`) is guaranteed to have `fx: 0` and `fy: 0`.
- **Success Criteria 2:** `d3.forceRadial` and `d3Force("charge")` are correctly invoked in a `useEffect` hook dependent on the graph data.
