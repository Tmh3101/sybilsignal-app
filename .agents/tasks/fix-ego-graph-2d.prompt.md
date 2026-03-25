---
description: "Fix crash issues, correct data mapping, and implement radial physics for EgoGraph2D"
agent: "edit"
tools: ["editFiles"]
---

# Ego Graph 2D Stabilization and Physics Tuning

You are an expert Data Visualization Engineer and React Developer specializing in `react-force-graph-2d`. The current Ego Graph component in the Inspector page is crashing due to unsafe data access and failing to render the correct topology for an ego-centric network. I need you to fix these critical issues.

## Context

- **Target File:** `ego-graph-2d.tsx`
- **Data Structure Reality:** The API payload does NOT have an `is_sybil` boolean on nodes. It uses `risk_score` (0 to 1) and `label` (e.g., "0_BENIGN", "3_MALICIOUS"). Also, `attributes` can be undefined or missing specific keys like `picture_url` or `total_reposts`.

## Task List & Instructions

### Task 1: Prevent Crashes (Safe Data Access & Mapping)

- Locate all instances of `node.is_sybil` and replace them with a check on the risk score: `(node.risk_score && node.risk_score >= 0.8)` or checking `node.label`.
- Implement Optional Chaining (`?.`) for ALL accesses to `node.attributes`. For example: change `node.attributes.picture_url` to `node.attributes?.picture_url`.
- Apply this safety check rigorously inside the `drawNode` function and the `nodeLabel` (tooltip) string.

### Task 2: Implement Ego-Centric Physics (Target Node Pinning)

An ego graph must center the target node. The current implementation lets it float away.

1. Modify the `processedData` useMemo hook (or the initial graph load):
   - Find the node where `node.id === targetId`.
   - Forcefully pin it to the center of the canvas by setting `node.fx = 0` and `node.fy = 0`.
2. Locate the `useEffect` or configuration for `d3Force`.
   - Add a radial force to pull neighbor nodes towards the center: `fgRef.current.d3Force('radial', d3.forceRadial(150, 0, 0))`.
   - Tune the `charge` force to `-200` to ensure neighbor nodes repel each other enough to form a clean ring/cluster around the pinned target.

### Task 3: Fix Multigraph Arrows & Tooltip

- **Arrows:** Curved lines with `linkDirectionalArrowRelPos={0.5}` often look messy. Change `linkDirectionalArrowRelPos` to `0.8` or `1` so arrows point clearly at the target node's border.
- **Tooltip (`nodeLabel`):** Update the HTML template to safely display:
  - Node Handle (`node.attributes?.handle || node.id.slice(0, 8)`)
  - Risk Score (formatted to 2 decimals)
  - Change the `[SYBIL_WARNING]` logic to rely on the new `risk_score >= 0.8` check.

### Task 4: Complete the Legend Overlay

The current Legend only shows "Relationship Layers" (Edges) but ignores Node Types.

1. Update the Legend JSX at the bottom of the component.
2. Add a new section above or beside "Relationship Layers" titled "NODE MAP".
3. Add three items to this new section:
   - **Target Entity:** Cyan color with a larger circle icon.
   - **High Risk Neighbor:** Red color (`#ff1744`).
   - **Benign Neighbor:** Cyan/Blue color (`#00f2ff`).

## Output Requirements

Modify `ego-graph-2d.tsx` directly. Ensure the component compiles without TypeScript errors regarding `fx`, `fy`, or optional properties. The code must gracefully handle missing avatar images without crashing the canvas context.
