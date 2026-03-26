---
description: "Deep fix for Avatar rendering on HTML5 Canvas: Resolving hook data loss and Browser CORS cache conflicts"
agent: "edit"
tools: ["editFiles", "codebase"]
---

# Deep Fix: Canvas Avatar Rendering

You are an expert React, Next.js, and HTML5 Canvas Developer. We have a critical bug where node avatars (images) fail to render on the `ForceGraph2D` canvas. Instead, the fallback letter avatar (`drawLetterAvatar`) is always drawn.

The images render perfectly in standard HTML `<img>` tags (e.g., in the sidebar/detail panel), which points to a mix of **data loss during hook processing** and **Browser CORS caching conflicts**.

## Step-by-Step Instructions

You must modify exactly two files to fix this end-to-end.

### Step 1: Fix Data Loss in `src/hooks/use-graph-processor.ts`

The processor hook is stripping nested objects.

1. Open `src/hooks/use-graph-processor.ts`.
2. Locate the `.map()` function applied to `rawData.nodes` (usually near the end of the hook where it returns the processed data).
3. **CRITICAL:** Ensure you use the spread operator `...node` to retain ALL original properties (especially `attributes` and `risk_label`) BEFORE assigning calculated properties like `id`.
   _Example:_
   ```typescript
   nodes: rawData.nodes.map((node) => ({
     ...node, // MUST BE HERE
     id: node.id,
     // ... other calculations
   }));
   ```

### Step 2: Fix CORS Cache & URL Resolution in `src/components/graph/universal-graph-2d.tsx`

We must bypass the browser cache and ensure `rawUrl` is extracted safely.

1. Open `src/components/graph/universal-graph-2d.tsx`.
2. **Safe URL Extraction:** Inside the `drawNode` callback, locate where `rawUrl` is defined. The node attributes might be flat or nested depending on the force-graph internal state.
   - Change it to:
     ```typescript
     const rawUrl =
       ext.attributes?.picture_url || (ext as any).picture_url
         ? String(ext.attributes?.picture_url || (ext as any).picture_url)
         : undefined;
     ```
3. **CORS Cache Buster:** Locate the `img.src = url;` line inside the `getOrLoadImage` callback.
   - Change it to bypass the browser cache (which conflicts with Next.js `<Image>` tags that don't request CORS):
     ```typescript
     img.src = url + (url.includes("?") ? "&" : "?") + "canvas=1";
     ```
4. **State Trigger Update:** Ensure that `img.onload` correctly triggers the react state `setAvatarTrigger((prev) => prev + 1);` and that `avatarTrigger` is included in the `drawNode` dependency array.

## Quality Validation

- Do not modify D3 physics logic.
- Ensure TypeScript compiles successfully (use `(ext as any)` only where strictly necessary for the force-graph flattened object).
- The final goal is that `getOrLoadImage` receives a valid HTTP URL, successfully loads it with `crossOrigin="anonymous"`, and triggers a canvas redraw.
