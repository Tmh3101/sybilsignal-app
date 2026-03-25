# Plan: Unified 2D Graph Component (UniversalGraph2D)

## 🎯 Overview

Consolidate `EgoGraph2D` and `ClusterMap2D` into a single `UniversalGraph2D` component. This refactor reduces code duplication, ensures a consistent "Hardcore Industrial" aesthetic, and leverages `useGraphProcessor` for centralized data handling.

**Core Strategy:**

- Use `ClusterMap2D` as the performance baseline.
- Add a `mode` prop (`'EGO' | 'CLUSTER'`) to toggle specific rendering behaviors.
- Use **Composition** by delegating Legend rendering to the existing `GraphLegend` component.

## 📁 File Structure Mapping

- `src/components/graph/universal-graph-2d.tsx` (**New**): The merged component.
- `src/app/inspector/page.tsx` (**Modify**): Replace `EgoGraph2D` with `UniversalGraph2D`.
- `src/app/discovery/page.tsx` (**Modify**): Replace `ClusterMap2D` with `UniversalGraph2D`.
- `src/components/graph/ego-graph-2d.tsx` (**Delete**): Post-migration.
- `src/components/graph/cluster-map-2d.tsx` (**Delete**): Post-migration.

---

## 🛠️ Execution Tasks & Checklist

### Phase 1: Creating the Universal Component

- [ ] **Task 1: Scaffold `UniversalGraph2D` (`src/components/graph/universal-graph-2d.tsx`)**
  - [ ] Create the file with `"use client"`.
  - [ ] Define the `UniversalGraph2DProps` interface:
    ```typescript
    interface UniversalGraph2DProps {
      graphData: { nodes: SybilNode[]; links: SybilEdge[] };
      mode: "EGO" | "CLUSTER";
      targetId?: string; // Required for EGO mode
      risk_label?: RiskClassification; // Optional highlight for EGO
    }
    ```
  - [ ] Initialize `useGraphProcessor` within the component. Set `aggregateEdges: true` for both modes to ensure clean visuals.

- [ ] **Task 2: Implement Smart Node Rendering (`nodeCanvasObject`)**
  - [ ] Port the Avatar/Image rendering logic from `ego-graph-2d.tsx`.
  - [ ] **Logic:** - If `mode === 'EGO'`, always attempt to render avatars and the glowing "Target Ring" for `targetId`.
    - If `mode === 'CLUSTER'`, render simple colored arcs (dots) by default.
    - _Optimization:_ If `nodes.length > 500`, skip image rendering entirely to preserve FPS.

- [ ] **Task 3: Implement Dynamic Link Rendering**
  - [ ] Configure `linkWidth` based on the logic:
    - `EGO`: `Math.sqrt(link.aggregated_weight || 1)`.
    - `CLUSTER`: Fixed `0.5` or `1.0` for structural clarity.
  - [ ] Configure `linkDirectionalParticles`:
    - `EGO`: Enable particles (count = `aggregated_weight`, max 5).
    - `CLUSTER`: Disable particles (`0`) to prevent WebGL overhead.

- [ ] **Task 4: Integrate Shared UI (Legend & Labels)**
  - [ ] Import and place `<GraphLegend />`.
  - [ ] Use `nodeLabel` to return the standardized Industrial Tooltip (HTML string).

### Phase 2: Migration & Integration

- [ ] **Task 5: Update Inspector Page (`src/app/inspector/page.tsx`)**
  - [ ] Replace the dynamic import of `EgoGraph2D` with `UniversalGraph2D`.
  - [ ] Update JSX: `<UniversalGraph2D mode="EGO" targetId={walletId} graphData={...} />`.

- [ ] **Task 6: Update Discovery Page (`src/app/discovery/page.tsx`)**
  - [ ] Replace `ClusterMap2D` with `UniversalGraph2D`.
  - [ ] Update JSX: `<UniversalGraph2D mode="CLUSTER" graphData={...} />`.

### Phase 3: Cleanup & Optimization

- [ ] **Task 7: Resource Cleanup**
  - [ ] Delete `src/components/graph/ego-graph-2d.tsx`.
  - [ ] Delete `src/components/graph/cluster-map-2d.tsx`.
- [ ] **Task 8: Final Performance Check**
  - [ ] Ensure `imgCache` is shared correctly within the universal component to prevent redundant image loads.

---

## 🧪 Testing & Verification

- [ ] **EGO Mode:** Search for `evan06`. Verify node target glows, avatars load, and edges between nodes are aggregated (thicker lines for multiple interactions).
- [ ] **CLUSTER Mode:** Load a large dataset. Verify the graph is responsive (60fps), particles are off, and colors match the `LABEL_COLORS` constants.

---

**Note to AI Agent:** Prioritize the `useGraphProcessor` hook for all data handling. Do not duplicate the aggregation logic inside the component. Adhere to the "Hardcore Industrial" theme for tooltips and legends.
