---
description: "Fix CORS caching bugs and improve canvas drawing architecture for avatars in UniversalGraph2D"
agent: "edit"
tools: ["editFiles"]
---

# Fix Canvas Avatar CORS & Drawing Architecture

You are an expert in HTML5 Canvas, React, and WebGL optimization. We have a bug where avatars show up in standard HTML `<img>` tags but fail to render on the `ForceGraph2D` canvas due to Browser CORS caching conflicts and Canvas clipping order.

## Step-by-Step Instructions

### Step 1: Implement Global Avatar Cache

Open `src/components/graph/universal-graph-2d.tsx`.

1. Move the image cache outside of the `UniversalGraph2D` component definition so it survives React StrictMode remounts.
   - Delete: `const imgCache = useRef<Record<string, HTMLImageElement | "error" | "pending">>({});`
   - Add at the top of the file (after imports): `const AVATAR_CACHE: Record<string, HTMLImageElement | "error" | "pending"> = {};`

### Step 2: Fix Image Loader (CORS Cache-Buster)

Inside the `getOrLoadImage` callback:

1. Replace all instances of `imgCache.current` with the new global `AVATAR_CACHE`.
2. Inside `img.onload`:
   - Set `AVATAR_CACHE[url] = img;`
   - Keep `setAvatarTrigger((prev) => prev + 1);`
   - **DELETE** `fgRef.current?.d3ReheatSimulation();` (It causes physics explosions, the prop change from `avatarTrigger` is enough to force a redraw).
3. **CRITICAL CORS FIX:** Change the `img.src` assignment to bypass browser cache conflicts with Next.js images.
   - Change `img.src = url;` to `img.src = url + "&canvas=1";`

### Step 3: Architect 3-Layer Node Drawing

Inside the `drawNode` callback, replace the entire drawing block (from `ctx.save()` down to `ctx.restore()`) with this strict 3-layer architecture:

```javascript
        // LAYER 1: Solid Background
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = img ? "#1e293b" : color; // Dark bg if image loading, otherwise risk color
        ctx.fill();

        // LAYER 2: Clipped Image & Fallback
        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI, false);
          ctx.clip();
          ctx.drawImage(img, node.x! - size, node.y! - size, size * 2, size * 2);
          ctx.restore();
        } else {
          if (globalScale >= 1.5 && ext.attributes?.handle) {
            drawLetterAvatar(ctx, node.x!, node.y!, ext.attributes.handle, size);
          }
        }

        // LAYER 3: Crisp Border (Drawn over everything, unclipped)
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI, false);
        ctx.lineWidth = isTarget ? 2 : 1;
        ctx.strokeStyle = color;
        ctx.stroke();
```

## Quality Validation

- Ensure TypeScript compiles correctly.
- Ensure the `AVATAR_CACHE` object is accessed correctly without `.current`.
- Ensure no variables are deleted from the dependency array of `drawNode`.
