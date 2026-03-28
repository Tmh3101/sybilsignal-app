---
description: "Fix and Improve GAT Attention Visualization in Inspector: Remove Particles and implement linear width/color scaling without thresholds"
agent: "edit"
tools: ["editFiles"]
---

# Fix: Visualize Global Attention Purely via Linear Edge Width & Color (No Thresholds)

Based on the screenshot analysis, the Inspector graph UI is inconsistent. Only high-attention edges are glowing/moving, while low-attention connected edges look like plain gray lines. The current code still has strict cut-off thresholds and particle effects, contrary to the desired 'clean' look.

## Core Objective
Stop using STRICT thresholds (e.g., `> 0.15` or `> 0.2`) for GAT attention visualization. Make every edge scale linearly in both thickness and red tint based on its `gat_attention` value, and remove all animated particle effects to keep the graph 'clean'.

## Step-by-Step Instructions

### Step 1: Remove Particle Effects (`src/components/graph/universal-graph-2d.tsx`)
1. Open `src/components/graph/universal-graph-2d.tsx`.
2. Locate the `<ForceGraph2D>` component invocation (around lines 220-270).
3. **DELETE** the following props completely to remove animated particles:
   - `linkDirectionalParticles`
   - `linkDirectionalParticleWidth`
   - `linkDirectionalParticleSpeed`
   - `linkDirectionalParticleColor`

### Step 2: Scale Width Linearly without Thresholds (`src/components/graph/universal-graph-2d.tsx`)
1. Open `src/components/graph/universal-graph-2d.tsx`.
2. Locate the `linkWidth` prop.
3. **INCREASE** the attention multiplier from **8** to **15** to make the width increase much more pronounced for lower attention scores.
   *Example logic update:*
   ```tsx
   linkWidth={(link) => {
     const l = link as AggregatedLink;
     const baseWidth = l.weight ? Math.min(l.weight, 5) : 1.8;
     // Add thickness proportionally with a stronger multiplier of 15
     const attentionBoost = (l.gat_attention || 0) * 15;
     return baseWidth + attentionBoost;
   }}
   ```

### Step 3: Implement Linear Red Gradient for Color (`src/components/graph/universal-graph-2d.tsx`)
Instead of an On/Off switch (`if > 0.2 return red`), we must use an RGBA gradient to tint edges based on their attention. 
1. Open `src/components/graph/universal-graph-2d.tsx`.
2. Locate the `linkColor` prop.
3. **DELETE** the old threshold logic: `if ((l.gat_attention || 0) > 0.2) return "#ef4444";`.
4. Replace it with a linear RGBA gradient for Red (`#ef4444` is `239, 68, 68`), where Opacity (Alpha) scales directly with `gat_attention`. Enforce a minimum alpha of 0.05 so a faint line is always visible.
   *Example logic update:*
   ```tsx
   linkColor={(link) => {
     const l = link as AggregatedLink;
     
     // SỬA Ở ĐÂY: Loại bỏ ngưỡng lọc màu. Tạo dải màu đỏ (RGBA) tuyến tính.
     // Cạnh attention 5% sẽ hồng nhạt (alpha 0.05), attention 100% sẽ đỏ đậm rực rỡ (alpha 1.0)
     const attValue = l.gat_attention || 0;
     const opacity = Math.min(Math.max(attValue, 0.05), 1.0);
     return `rgba(239, 68, 68, ${opacity})`;

     // DELETE THIS (it won't be reached):
     // if (l.types && l.types.length > 1) return "#94a3b8";
     // return RELATION_COLORS[l.edge_type || ""] || "#cbd5e1";
   }}
   ```

## Quality Constraints
- Make sure no lingering syntax errors are left after deleting props.
- All connected edges to the target node must have some level of red tint, proportional to their attention score.