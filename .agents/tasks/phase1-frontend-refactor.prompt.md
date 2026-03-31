---
description: "Refactor frontend codebase to sync with new backend graph structures (Log-scale, REV edges, 2/3 constraints)"
agent: "edit"
tools: ["file_search", "read_file", "edit_file"]
---

# Frontend Refactor & Backend Sync (Phase 1)

You are an Expert Frontend Engineer specializing in Next.js, TypeScript, and Data Visualization (React Force Graph). 
Your task is to refactor the existing frontend codebase to safely handle new data structures returned by the backend, including reverse edges (`_REV`), log-scale weights, and new heuristic violation metadata.

## 🎯 Task Section
Execute the following 3 critical refactoring steps to synchronize the frontend with the backend's new logic. Do not implement new features (like the stats page) yet. Focus strictly on types, visual graph rendering, and the inspector panel.

## 📋 Instructions Section

### Step 1: Update Type Definitions
**Files to check/modify:** `src/types/graph.d.ts` and `src/types/api.d.ts`
1. Locate the `EdgeType` (or similar union type/enum) and append the `_REV` variants: `'FOLLOW_REV' | 'UPVOTE_REV' | 'REACTION_REV' | 'COMMENT_REV' | 'QUOTE_REV' | 'MIRROR_REV' | 'COLLECT_REV' | 'TIP_REV'`.
2. Locate the `GraphEdge` or `Link` interface and add an optional string array for constraint violations: `violations?: string[];`.

### Step 2: Adjust Visual Graph Logic (2D/3D Rendering)
**Files to check/modify:** `src/components/graph/universal-graph-2d.tsx` (and its 3D counterpart if applicable)
1. **Filter Reverse Edges:** Before passing `graphData.links` to the Force Graph component, filter out all edges where `type` ends with `_REV`. We only want to render the primary directed edges to avoid visual clutter and duplicate lines.
   *(Hint: Use `useMemo` to filter `links: graphData.links.filter(l => !l.type.endsWith('_REV'))`)*
2. **Update Edge Thickness:** The backend now uses Log-scale weights (ranging roughly from 1.0 to 15.0). Update the `linkWidth` prop in `react-force-graph`.
   *(Hint: Use something like `linkWidth={(link) => Math.max(1, link.weight * 1.2)}` to ensure important edges like Co-owner stand out without dominating the screen).*

### Step 3: Update Inspector & Detail Panels
**Files to check/modify:** `src/components/inspector/node-detail-panel.tsx` and edge detail components.
1. **Highlight Heuristics Reasons:** The backend now returns detailed reasoning strings (e.g., `"High Co-owner intensity (20.5%) +40"`). 
   - Update the UI where `reasons` are mapped. 
   - Implement a regex/string-matching helper to find penalty scores (e.g., `+40`, `+30`) at the end of the string and wrap them in a `<span className="font-bold text-red-500">` for high visibility.
2. **Display Edge Metadata:** When a user clicks on a `SIMILARITY` link, the edge detail panel must display the `violations` array (e.g., `["SIM_BIO", "CLOSE_CREATION_TIME"]`) to explain the 2/3 constraint logic visually.

## Context/Input Section
- The project uses `react-force-graph-2d` / `react-force-graph-3d`.
- Styling is done via Tailwind CSS.
- Ensure you do not mutate the original `graphData` object; create derived arrays for rendering.

## ✅ Quality/Validation Section
1. Run TypeScript checks to ensure the new `_REV` types and `violations` array do not break existing components.
2. Ensure no duplicate reverse edges appear on the canvas.
3. Verify that heuristic penalties (+xx) are successfully extracted and highlighted in red in the Node Detail panel.