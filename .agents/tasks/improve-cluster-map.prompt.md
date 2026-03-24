---
description: "Refactor ClusterMap2D node coloring by label and increase graph compactness"
agent: "edit"
tools: ["editFiles"]
---

# Enhance Node Visualization & Graph Physics in Module 1

You are an expert Data Visualization Engineer specializing in React, TypeScript, and D3 Force simulations via `react-force-graph-2d`. I need you to update the `cluster-map-2d.tsx` component to reflect detailed node labels and make the overall graph visualization more compact.

## Context & Input Verification
- Target File: `cluster-map-2d.tsx`
- Referencing Data File: `test.json` - verify that `nodes` have a `label` property (e.g., "0_NORMAL", "3_MALICIOUS").

## Task List

### Task 1: Implement Dynamic Node Border Coloring by Label (`cluster-map-2d.tsx`)
Currently, the node border color logic only distinguishes between high/low risk. Replace this with detailed label coloring.
1.  Define a new constant `LABEL_COLORS` within `cluster-map-2d.tsx`:
    - `0_NORMAL`: Teal/Cyan (`#00f2ff`)
    - `1_SPAMMER`: Green (`#4ade80`)
    - `2_BOT`: Orange (`#fb923c`)
    - `3_MALICIOUS`: Red (`#ef4444`)
    - *Fallback/Default*: Slate (`#94a3b8`)
2.  Locate the custom `drawNode` callback used in `nodeCanvasObject`.
3.  Modify the logic calculating the node's border (stroke) color. It must use the `node.label` to fetch the corresponding hex color from `LABEL_COLORS`.
4.  Remove all remaining logic that relies on `node.is_high_risk` or `node.risk_score >= 0.8` for determining the primary node color. (Tooltips should still show risk_score, but node colors should follow labels).
5.  Ensure the "glow" effect (if used) matches the new label color.

### Task 2: Update Node Legend Overlay (`cluster-map-2d.tsx`)
The Legend overlay (moved here previously) must be updated to match the new label coloring.
1.  Find the Legend UI rendering block.
2.  Locate the "NODE MAP" section.
3.  Replace the static "Normal Nodes" and "High Risk Sybil" list items.
4.  Iteratively render new legend items based on the keys and colors in `LABEL_COLORS`. Display the human-readable label text (e.g., "Malicious" instead of "3_MALICIOUS") next to a small color swatch mimicking the node border style.

### Task 3: Increase Graph Compactness via D3 Force Tuning (`cluster-map-2d.tsx`)
The current graph visualization is too sparse. We need to bring clusters closer together.
1.  Locate the `useEffect` hook where the `fgRef.current.d3Force(...)` configuration happens.
2.  Adjust the `charge` force (Many-Body repulsion): Set the strength to be weaker (less negative). A good starting experimental value is `-120`.
    - `fgRef.current.d3Force('charge').strength(-120);`
3.  Adjust the `link` force: Reduce the default distance between linked nodes.
    - `fgRef.current.d3Force('link').distance(30);`
4.  Also, ensure the `collide` force is active to prevent node overlap while they are clustered closely.

## Output Requirements
Modify `cluster-map-2d.tsx` directly. Ensure safety checks exist when accessing `node.label`. All styles must maintain the existing dark/cyberpunk aesthetic using Tailwind CSS.