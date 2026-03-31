---
description: "Build the Statistics Dashboard page using Recharts and integrate 4 new backend analytics API endpoints."
agent: "edit"
tools: ["file_search", "read_file", "edit_file", "run_terminal_command"]
---

# Phase 2: Build Statistics Dashboard

You are an Expert Frontend Engineer specializing in Next.js (App Router), TypeScript, Tailwind CSS, and Data Visualization using `recharts`. Your task is to build a new Statistics Dashboard that visualizes the network's structural and heuristic data fetched from the backend.

## 🎯 Task Section
Implement the `/stats` page from scratch. This includes installing dependencies, updating the navigation sidebar, writing the data fetching hooks, and building a responsive CSS Grid layout containing 4 distinct chart/KPI components using `recharts`.

## 📋 Instructions Section

### Step 1: Install Dependencies & Setup Navigation
1. **Action:** If `recharts` is not in `package.json`, run the terminal command to install it: `npm install recharts` (or `pnpm add recharts` depending on the lockfile).
2. **File to modify:** `src/components/layout/sidebar.tsx`
   - Add a new navigation item for "Statistics" (or "Thống kê").
   - Use a relevant icon (e.g., a Chart/BarChart icon from `lucide-react` or the project's standard SVG icons).
   - Set the `href` to `/stats`.

### Step 2: Write Data Fetching Hooks
1. **File to create:** `src/hooks/use-stats.ts`
   - **Crucial:** Add `'use client';` at the top.
   - Inspect existing hooks (like `use-sybil-discovery.ts` or `use-sybil-inference.ts`) to match the project's data-fetching pattern (e.g., React Query `useQuery` or native `fetch`).
   - Create a unified hook (e.g., `useStats()`) that fetches data from these 4 endpoints:
     - `GET /api/v1/stats/overview`
     - `GET /api/v1/stats/risk-distribution`
     - `GET /api/v1/stats/trust-scores`
     - `GET /api/v1/stats/clusters`
   - Return a unified state: `{ data, isLoading, isError }`. Ensure graceful degradation if one endpoint fails.
   - Define proper TypeScript interfaces for the expected responses based on standard analytical shapes.

### Step 3: Create the UI Layout
1. **File to create:** `src/app/stats/page.tsx`
   - Create a clean, responsive page layout with a title (e.g., "Network Statistics").
   - Call the `useStats()` hook. Render a spinner or skeleton loader while `isLoading` is true.
   - Use a Tailwind CSS Grid layout divided into 3 tiers:
     - **Tier 1 (Top):** A row containing KPI Cards (Grid cols: 1 on mobile, 2 on tablet, 4 on desktop).
     - **Tier 2 (Middle):** Two columns split 50/50 on desktop (100% on mobile). Left: Donut Chart. Right: Bar Chart.
     - **Tier 3 (Bottom):** A single full-width column for the Histogram.

### Step 4: Build Recharts Components
**Directory to create:** `src/components/stats/`
*(Note: All chart components MUST include `'use client';` at the top because `recharts` relies on client-side React features).*

1. **Create `kpi-cards.tsx`**: 
   - Accepts props: `totalNodes`, `totalEdges`, `totalClusters` (crucial: e.g., 178), `avgClusterSize`.
   - Render these as beautifully styled cards (use the project's existing card UI like `industrial-card.tsx` if available, or build clean Tailwind cards).
2. **Create `network-structure-chart.tsx`**:
   - Accepts `edge_distribution` array.
   - Use Recharts `<PieChart>` with `<Pie innerRadius={...}>` to create a Donut Chart showing the percentage of Social vs. Similarity vs. Co-owner edges. Add a `<Tooltip>` and `<Legend>`.
3. **Create `risk-distribution-chart.tsx`**:
   - Accepts `distribution` array (counts of BENIGN, LOW_RISK, HIGH_RISK, MALICIOUS).
   - Use Recharts `<BarChart>` to display the class imbalance. Assign distinct semantic colors (e.g., Green for BENIGN, Red for MALICIOUS).
4. **Create `trust-score-histogram.tsx`**:
   - Accepts `bins` array (0-10, 10-20, etc.).
   - Use Recharts `<BarChart>` to simulate a Histogram of trust scores.

## Context/Input Section
- The project uses Next.js App Router (`src/app`).
- Use Tailwind CSS for all styling. Rely on CSS variables for colors if the project supports dark mode (e.g., `bg-card`, `text-foreground`, `border-border`).
- Do not build a fake API. Rely entirely on the backend endpoints assuming they return valid JSON.

## ✅ Quality/Validation Section
1. Verify that `recharts` renders without hydration errors (ensure `'use client'` is placed correctly).
2. Verify the layout is fully responsive (stacks to a single column on mobile screens).
3. Ensure the TypeScript types for the hook match the props passed to the chart components.
4. Ensure error and loading states are handled gracefully so the page does not crash if the backend is slow.