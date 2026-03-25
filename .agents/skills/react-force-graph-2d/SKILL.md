---
name: react-force-graph-2d-expert
description: "Standard practices and API reference for using react-force-graph-2d to render 2D force-directed graphs via HTML5 Canvas."
---

# react-force-graph-2d Expert Guide

You are an expert in data visualization using `react-force-graph-2d`. This library renders graph data structures in a 2D space using a force-directed iterative layout powered by HTML5 Canvas and `d3-force`.

## 1. Core Principles & Setup

- **Import:** Always use `import ForceGraph2D from 'react-force-graph-2d';`
- **Dynamic Import in Next.js:** Because it relies on the browser window and canvas, in Next.js (App Router), you MUST import it dynamically with SSR disabled:
  ```tsx
  import dynamic from "next/dynamic";
  const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
  });
  ```
- **Engine:** It uses HTML5 Canvas 2D (`CanvasRenderingContext2D`) for rendering, NOT WebGL/Three.js. Do not use any 3D properties (like `z` coordinates, `nodeThreeObject`, or materials).

## 2. Data Structure

The `graphData` prop expects an object with `nodes` and `links` arrays.

- **Nodes:** Must have a unique identifier. Default accessor is `id`.
- **Links:** Must have references to the source and target nodes. Default accessors are `source` and `target`.

```json
{
  "nodes": [{ "id": "node1", "name": "Node 1", "val": 5 }],
  "links": [{ "source": "node1", "target": "node2" }]
}
```

## 3. Key Props API Reference

### Layout & Container

- `width` / `height` (number): Canvas dimensions. Defaults to window size.
- `backgroundColor` (string): Canvas background color.

### Node Styling

- `nodeId` (string): Node object accessor attribute for unique ID (default: `"id"`).
- `nodeVal` (number | string | func): Accessor for node numeric value (affects node size).
- `nodeRelSize` (number): Ratio of node circle area per value unit (default: `4`).
- `nodeLabel` (string | func): Accessor for tooltip label. Supports plain text or HTML.
- `nodeColor` / `nodeAutoColorBy` (string | func): Accessors for node color.
- `nodeVisibility` (boolean | string | func): Whether to display the node.

### Link Styling

- `linkSource` / `linkTarget` (string): Accessors for link connections (defaults: `"source"`, `"target"`).
- `linkLabel` (string | func): Accessor for tooltip label. Supports plain text or HTML.
- `linkColor` / `linkAutoColorBy` (string | func): Accessors for link line color.
- `linkWidth` (number | string | func): Link line width (default: `1`).
- `linkCurvature` (number | string | func): Curvature radius. `0` is straight, `1` is semi-circle. Useful for multigraphs.
- `linkLineDash` (number[] | string | func): Determines dash pattern (e.g., `[5, 5]`).

### Directional Indicators (Arrows & Particles)

- `linkDirectionalArrowLength` (number | string | func): Length of arrow head. `0` hides it.
- `linkDirectionalArrowRelPos` (number | string | func): Position of arrow along the link (`0` to `1`).
- `linkDirectionalParticles` (number | string | func): Number of animated particles traveling over the link.
- `linkDirectionalParticleSpeed` / `linkDirectionalParticleWidth` / `linkDirectionalParticleColor`: Customization for particles.

## 4. Advanced Canvas Rendering (Custom Graphics)

To draw custom nodes or links, use the Canvas API directly.

**Custom Nodes (`nodeCanvasObject`):**

```tsx
nodeCanvasObject={(node, ctx, globalScale) => {
  const label = node.id;
  const fontSize = 12 / globalScale;
  ctx.font = `${fontSize}px Sans-Serif`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, node.x, node.y);
}}
nodeCanvasObjectMode={() => "replace"} // Can be 'replace', 'before', or 'after'
```

**Custom Links (`linkCanvasObject`):**
Signature: `linkCanvasObject(<link>, <canvas context>, <current global scale>)`

## 5. Interaction & Events

- `onNodeClick` / `onNodeRightClick` / `onNodeHover`
- `onLinkClick` / `onLinkRightClick` / `onLinkHover`
- `onBackgroundClick` / `onBackgroundRightClick`
- `enableZoomInteraction` / `enablePanInteraction` / `enableNodeDrag` (boolean): Toggle default behaviors.

## 6. Force Engine & Physics (`d3-force`)

The underlying physics engine is `d3-force`.

- `dagMode` (string): Enforces Directed Acyclic Graph layout constraints (`'td'`, `'bu'`, `'lr'`, `'rl'`, `'radialout'`, `'radialin'`).
- `d3AlphaDecay` (number): Simulation intensity decay (default `0.0228`). Lower values mean the graph takes longer to settle.
- `d3VelocityDecay` (number): Simulates medium resistance (friction) (default `0.4`).
- `cooldownTicks` (number): Frames to render before freezing layout (default `Infinity`).

## 7. Component Methods (Using Refs)

To call internal methods, attach a `ref` (typed as `ForceGraphMethods` in TS).

```tsx
import { useRef } from "react";
import { ForceGraphMethods } from "react-force-graph-2d";

const fgRef = useRef<ForceGraphMethods>();

// Example usages:
fgRef.current?.zoomToFit(400, 10); // Animate to fit all nodes (duration: 400ms, padding: 10px)
fgRef.current?.centerAt(x, y, 1000); // Pan to coordinates smoothly
fgRef.current?.d3Force("charge").strength(-120); // Tune d3 physics forces
fgRef.current?.d3ReheatSimulation(); // Re-trigger physics
```

## 8. Anti-Patterns (DO NOT DO THIS)

- ❌ Do not use `nodeThreeObject`, `linkMaterial`, `nodeResolution`, or `numDimensions`. These are for the 3D version only.
- ❌ Do not access `node.z` or `link.z`. Ensure all custom canvas drawing strictly uses `node.x` and `node.y`.
- ❌ Do not forget to handle `node.x` and `node.y` as potentially `undefined` during the first few warmup frames in `nodeCanvasObject`. Use fallback values `(node.x ?? 0)`.
