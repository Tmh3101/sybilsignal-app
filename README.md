# SYBIL ENGINE | INDUSTRIAL DASHBOARD

> [!IMPORTANT]
> **AUTONOMOUS SYBIL DETECTION & DISCOVERY PLATFORM**
> A high-performance detection and network discovery platform designed for large-scale sybil cluster identification and individual profile risk assessment.

<!-- ![Industrial Dashboard Overview](public/globe.svg) Using globe.svg as a placeholder/icon if it fits the vibe -->

## 🛠️ CORE MODULES

### [Profile Inspector (Module 2)](/inspector)

Analyze individual wallets for sybil behavior and risk scoring.

- **Interactive 3D Ego-Graphs:** Visualize wallet networks with orbital controls using `react-force-graph-3d`.
- **Heuristic Reasoning:** Detailed breakdown of suspicious activities through live terminal logs.
- **Risk Assessment:** Dynamic "final_probability" scoring and cold start handling.

### [Discovery Lab (Module 1)](/discovery)

Identify large-scale community clusters and fraudulent networks.

- **Batch Processing:** Trigger GAE (Graph Autoencoder) training for massive dataset analysis.
- **Task Polling:** Real-time job status tracking and diagnostic streaming.
- **Cluster Visualization:** Mapping interconnected sybil groups at scale.

## 🚀 TECH STACK

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Industrial Design Tokens)
- **Data Fetching:** [TanStack React Query v5](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Visualization:** [Three.js](https://threejs.org/), [react-force-graph-3d](https://github.com/vasturiano/react-force-graph-3d), [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)

## ⚡ FEATURES

- **Industrial UI/UX:** High-contrast design, CRT scanline effects, and retro-future aesthetics.
- **Real-time Diagnostics:** Live system monitoring, memory integrity, and database latency metrics.
- **Autonomous Boot Sequence:** Cold-start handling with specialized loading skeletons and animations.
- **Responsive Layout:** Sidebar-driven navigation with a focus on data-heavy content.

## ⚙️ GETTING STARTED

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/sybil-detection-app.git
   cd sybil-detection-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=https://your-modal-backend-url.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 📊 SYSTEM ARCHITECTURE

Sybil Engine follows a distributed architecture with a Next.js frontend and a Modal-hosted FastAPI backend. The frontend communicates via a specialized API layer (`src/lib/api.ts`) and manages state through a combination of React Query (for server state) and Zustand (for global UI state).

> [!NOTE]
> The application uses "Hardcore Industrial" design tokens, prioritizing raw data visibility and system-level transparency.
