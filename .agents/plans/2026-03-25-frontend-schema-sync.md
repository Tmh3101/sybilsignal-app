# Implementation Plan: Sync Frontend with Standardized API Schema (Phase 2)

## Overview

This plan focuses on updating the Next.js frontend to seamlessly consume the newly standardized "Golden Schema" from the FastAPI backend. We will update TypeScript definitions, remove legacy data-cleaning hacks, and ensure both graph components (`ClusterMap2D` and `EgoGraph2D`) and the Inspector UI render perfectly using the clean data.

**Core Objectives:**

1. **Type Safety:** Enforce strict TypeScript interfaces for `SybilNode`, `SybilEdge`, and `RiskClassification` across the app.
2. **Remove Workarounds:** Delete any frontend logic that was previously responsible for parsing labels (e.g., `split("_")`) or checking for missing `risk_score`.
3. **Unify Visuals:** Update color mapping dictionaries (`LABEL_COLORS`) to use the clean, prefix-less label strings.

## AI Agent Execution Directives

**CRITICAL:** You are instructed to execute these tasks sequentially. **After completing each task, you MUST open this plan document and update the checklist below by changing `[ ]` to `[x]` before proceeding to the next task.**

## Scope & File Structure

- **Types:** `src/types/api.d.ts`
- **UI Pages:** `src/app/inspector/page.tsx`
- **Graph Components:** `src/components/graph/ego-graph-2d.tsx`, `src/components/graph/cluster-map-2d.tsx`

## Step-by-Step Tasks & Checklist

### [x] Task 1: Update TypeScript Definitions (`src/types/api.d.ts`)

- **Action:** Open `src/types/api.d.ts`.
- **Classification Update:** Define `RiskClassification` strictly as `"BENIGN" | "LOW_RISK" | "HIGH_RISK" | "MALICIOUS"`.
- **Node Update:** Update the `SybilNode` interface:
  - Make `label` of type `RiskClassification`.
  - Make `risk_score` and `cluster_id` required (non-optional).
  - Explicitly define the expected shape of the `attributes` object (`follower_count`, `post_count`, `trust_score`, `reason`).
- **Edge Update:** Ensure `SybilEdge` explicitly uses the `edge_type` property instead of `type`.
- **Commit:** "refactor(types): sync SybilNode, SybilEdge, and RiskClassification with new backend schema"

### [x] Task 2: Update Inspector UI Logic (`src/app/inspector/page.tsx`)

- **Action:** Open `src/app/inspector/page.tsx`.
- **Color Switcher:** Locate the `getClassificationColor` function. Ensure the `switch` statement strictly matches the new clean strings (`"MALICIOUS"`, `"HIGH_RISK"`, `"LOW_RISK"`, `"BENIGN"`).
- **Remove Fallbacks:** Since `analysis.classification` from the backend is now clean and reliable, you can remove any legacy safety nets related to label parsing if they exist here.
- **Commit:** "refactor(ui): update inspector gauge colors for clean classifications"

### [x] Task 3: Clean Up Graph Visual Constants

- **Action:** Open `src/components/graph/cluster-map-2d.tsx` and `src/components/graph/ego-graph-2d.tsx`.
- **Label Colors Update:** Locate the `LABEL_COLORS` object in both files. Change the keys to remove the "0\_" prefixes.
  - Change `"0_BENIGN"` to `"BENIGN"`
  - Change `"1_LOW_RISK"` to `"LOW_RISK"`
  - Change `"2_HIGH_RISK"` to `"HIGH_RISK"`
  - Change `"3_MALICIOUS"` to `"MALICIOUS"`
- **Edge Colors Update:** Ensure that `RELATION_COLORS` mapping and link color callbacks strictly use `link.edge_type`.
- **Commit:** "refactor(graph): sync LABEL_COLORS keys with sanitized backend labels"

### [x] Task 4: Remove Legacy Tooltip & Parsing Hacks

- **Action:** In both graph components (`cluster-map-2d.tsx` and `ego-graph-2d.tsx`), locate the `nodeLabel` tooltip generation function.
- **Remove Sanitization:** Completely remove any local `label.split("_")` or `replace` functions. The tooltip should directly render `${node.label}`.
- **Remove Optional Chaining for Core Fields:** Because `risk_score` is now guaranteed, update tooltip logic from checking `(node.risk_score && node.risk_score >= 0.8)` to simply checking `(node.risk_score >= 0.8)` or better yet, checking `node.label === "MALICIOUS"`.
- **Commit:** "refactor(graph): remove legacy label parsing hacks from tooltips"

## Plan Review Loop

After writing the complete plan:

1. Dispatch a single plan-document-reviewer subagent with precisely crafted review context.
2. If ❌ Issues Found: fix the issues, re-dispatch reviewer for the whole plan.
3. If ✅ Approved: proceed to execution handoff.
