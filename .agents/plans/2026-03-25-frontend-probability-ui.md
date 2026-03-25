# Implementation Plan: Frontend Probability Visualization Update

## 🎯 Overview

This plan focuses on updating the Frontend (Next.js) to consume the new `predict_label` and `predict_proba` fields from the Backend API. We will update the TypeScript definitions, fix the data binding for the Gauge Chart (calculating the risk score dynamically), and create a new `ProbabilityEqualizer` component to visualize the full class distribution in an industrial style.

**Core Objectives:**

1. Update `src/types/api.d.ts` to reflect the new ML-standard API response.
2. Update `src/app/inspector/page.tsx` to handle the new data structure and calculate the gauge score.
3. Build and integrate a new `<ProbabilityEqualizer />` UI component.

## 📁 File Structure Mapping

The following files will be modified or created:

- `src/types/api.d.ts`: Update `Analysis` interface.
- `src/app/inspector/page.tsx`: Update data bindings.
- `src/components/inspector/probability-equalizer.tsx` (New): Create the equalizer component.

---

## 🛠️ Execution Tasks & Checklist

### Task 1: Update TypeScript Interfaces

**Objective:** Align the frontend types with the new backend schema.

- [x] Open `src/types/api.d.ts`.
- [x] Locate the `Analysis` interface.
- [x] Remove `sybil_probability` and `risk_label` fields.
- [x] Add the following fields:
  ```typescript
  predict_label: string;
  predict_proba: Record<string, number>;
  ```

### Task 2: Create the Probability Equalizer Component

**Objective:** Build a reusable, industrial-styled component to display the class distribution.

- [x] Create a new file: `src/components/inspector/probability-equalizer.tsx`.
- [x] Ensure it starts with `"use client"`.
- [x] Define the props interface to accept `probabilities: Record<string, number>`.
- [x] Build the UI:
  - [x] Create a container (e.g., an `IndustrialCard` or a simple dark `div` with neumorphic inset shadows).
  - [x] Map over a predefined array of classes: `["BENIGN", "LOW_RISK", "HIGH_RISK", "MALICIOUS"]`.
  - [x] For each class, render a label (monospace font) and a progress bar.
  - [x] The width of the progress bar should be `probabilities[className] * 100 + "%"`.
  - [x] **Color Mapping:**
    - `BENIGN`: Green (e.g., `bg-green-500`)
    - `LOW_RISK`: Yellow (e.g., `bg-yellow-500`)
    - `HIGH_RISK`: Orange (e.g., `bg-orange-500`)
    - `MALICIOUS`: Red (e.g., `bg-red-500`)
  - [x] Ensure the component looks technical, using appropriate Tailwind classes for dark mode and hardware aesthetics.

### Task 3: Update Inspector Page & Data Bindings

**Objective:** Integrate the new data structure into the main Inspector view.

- [x] Open `src/app/inspector/page.tsx`.
- [x] Locate where the Gauge Chart's value is passed (previously `data.analysis.sybil_probability`).
- [x] Calculate the dynamic risk score for the Gauge Chart:
  ```typescript
  // 1.0 minus the probability of being completely benign
  const gaugeScore = 1.0 - (data.analysis.predict_proba["BENIGN"] || 0);
  ```
- [x] Pass `gaugeScore * 100` (or the appropriate format) to the Gauge Chart component.
- [x] Import the new `ProbabilityEqualizer` component.
- [x] Place `<ProbabilityEqualizer probabilities={data.analysis.predict_proba} />` in the UI. A good location is in the left column (Diagnostic Panel), either above or below the Gauge Chart / Reasoning Terminal.
- [x] Ensure any references to `data.analysis.risk_label` are updated to use `data.analysis.predict_label`.

### Task 4: Local Verification

**Objective:** Ensure the UI renders correctly without type errors.

- [x] Run the Next.js development server (`npm run dev`).
- [x] Search for a valid wallet address to trigger the API call.
- [x] **Verify:**
  - [x] The Gauge Chart correctly reflects the `1 - BENIGN` calculation.
  - [x] The new Equalizer component appears, showing 4 distinct bars with correct colors and widths representing the backend's distribution.
  - [x] The reasoning text and main risk label still display correctly.

---

**Note to AI Agent:** Adhere strictly to the established "Hardcore Industrial Tech" design tokens (slate colors, monospace fonts, neon accents) when building the Equalizer component.
