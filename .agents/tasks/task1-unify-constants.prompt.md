---
description: "Execute Task 1: Unify constants by replacing MULTIGRAPH_SCHEMA with LABEL_COLORS and RELATION_COLORS"
agent: "edit"
tools: ["editFiles", "codebase"]
---

# Unify Ego Graph Constants

You are an expert React Developer and Data Visualization Engineer.

## Task

Your task is to implement Task 1 of the ego-graph-2d refactoring plan: Unify Constants and Remove Legacy Schema. You need to make the visual constants in `ego-graph-2d.tsx` perfectly match those in `cluster-map-2d.tsx` to ensure a consistent design language.

## Instructions

1. Use your codebase tools to read `src/components/graph/cluster-map-2d.tsx` and locate the `LABEL_COLORS` and `RELATION_COLORS` object constants.
2. Open the target file: `src/components/graph/ego-graph-2d.tsx`.
3. Locate and completely delete the `MULTIGRAPH_SCHEMA` constant.
4. Paste the `LABEL_COLORS` and `RELATION_COLORS` constants (copied from `cluster-map-2d.tsx`) into `ego-graph-2d.tsx`, placing them where the old schema used to be.
5. Search for any immediate references to `MULTIGRAPH_SCHEMA` in `ego-graph-2d.tsx`. Since we are only doing Task 1, if you find references (e.g., in `linkColor` or the Legend), you may temporarily comment them out or map them to `RELATION_COLORS["UNKNOWN"]` just to prevent fatal TypeScript compilation errors. Do not over-engineer the fix, as the full rendering logic will be updated in Task 2.

## Context / Input

- Target file to modify: `src/components/graph/ego-graph-2d.tsx`
- Reference file for copying: `src/components/graph/cluster-map-2d.tsx`
- Goal: Apply DRY principles to our graph visual configuration.

## Output

- Output format: Direct file edits to `src/components/graph/ego-graph-2d.tsx`.
- Maintain existing imports and interfaces unless they directly rely on `MULTIGRAPH_SCHEMA`.

## Quality & Validation

- **Success Criteria 1:** `MULTIGRAPH_SCHEMA` is completely removed from `ego-graph-2d.tsx`.
- **Success Criteria 2:** `LABEL_COLORS` and `RELATION_COLORS` exist in `ego-graph-2d.tsx` and exactly match the reference file.
- **Success Criteria 3:** The file compiles without fatal syntax errors regarding the missing constant.
