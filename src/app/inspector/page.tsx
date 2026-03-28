"use client";

import { Suspense, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useInspectProfile } from "@/hooks/use-sybil-inference";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { BootSequenceLoader } from "@/components/ui/boot-sequence-loader";
import { resolvePictureUrl } from "@/lib/utils";
import { ProbabilityEqualizer } from "@/components/inspector/probability-equalizer";
import { LABEL_COLORS } from "@/lib/graph-constants";
import Image from "next/image";
import {
  User,
  AlertTriangle,
  Loader2,
  Radar,
  Search,
  Network,
  BarChart3,
  GitBranch,
  Eye,
  EyeOff,
} from "lucide-react";
import type { AttentionWeight } from "@/components/graph/universal-graph-2d";

// ─── Dynamic imports ───
const UniversalGraph2D = dynamic(
  () => import("@/components/graph/universal-graph-2d"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#050608]">
        <Loader2 className="text-accent-cyan animate-spin" size={32} />
        <span className="text-accent-cyan animate-pulse font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
          INITIALIZING RENDER ENGINE...
        </span>
      </div>
    ),
  }
);

// ─── Search Form ───
const SearchForm = ({ defaultValue = "" }: { defaultValue?: string }) => {
  const router = useRouter();
  const [v, setV] = useState(defaultValue);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (v.trim()) router.push(`/inspector?wallet=${v.trim()}`);
  };
  return (
    <form onSubmit={handleSubmit} className="group relative w-full max-w-md">
      <Search
        className="group-focus-within:text-accent-cyan absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 transition-colors"
        size={16}
      />
      <input
        type="text"
        placeholder="ENTER PROFILE_ID..."
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="bg-background border-border focus:border-accent-cyan focus:ring-accent-cyan/20 w-full rounded-sm border px-10 py-2 font-mono text-xs tracking-widest uppercase transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none"
      />
    </form>
  );
};

type TabId = "graph" | "analytics";

// ─── Main content ───
function InspectorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const walletId = searchParams.get("wallet");
  const { data, isLoading, isError } = useInspectProfile(walletId);

  const [activeTab, setActiveTab] = useState<TabId>("graph");
  const [graphDepth, setGraphDepth] = useState<1 | 2>(2);
  const [showAttentionLabels, setShowAttentionLabels] = useState(true);

  // ── Parse attention weights from API response ──
  // The API returns them in analysis.attention_weights
  const attentionWeights: AttentionWeight[] = useMemo(
    () =>
      (data?.analysis as { attention_weights?: AttentionWeight[] })
        ?.attention_weights || [],
    [data?.analysis]
  );

  // ── Depth-filtered graph ──
  const displayGraphData = useMemo(() => {
    if (!data?.local_graph || !walletId) return { nodes: [], links: [] };
    if (graphDepth === 2) return data.local_graph;
    const directIds = new Set<string>([walletId]);
    data.local_graph.links.forEach((l) => {
      const s = String(
        typeof l.source === "object"
          ? (l.source as { id: string }).id
          : l.source
      );
      const t = String(
        typeof l.target === "object"
          ? (l.target as { id: string }).id
          : l.target
      );
      if (s === walletId) directIds.add(t);
      if (t === walletId) directIds.add(s);
    });
    return {
      nodes: data.local_graph.nodes.filter((n) => directIds.has(String(n.id))),
      links: data.local_graph.links.filter((l) => {
        const s = String(
          typeof l.source === "object"
            ? (l.source as { id: string }).id
            : l.source
        );
        const t = String(
          typeof l.target === "object"
            ? (l.target as { id: string }).id
            : l.target
        );
        return directIds.has(s) && directIds.has(t);
      }),
    };
  }, [data, graphDepth, walletId]);

  const analysis = data?.analysis;
  const profile = data?.profile_info;
  const riskLabel = analysis?.predict_label || "UNKNOWN";
  const riskColor = LABEL_COLORS[riskLabel] || LABEL_COLORS.UNKNOWN;

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "graph", label: "EGO GRAPH", icon: <Network size={11} /> },
    { id: "analytics", label: "ANALYTICS", icon: <BarChart3 size={11} /> },
  ];

  // ── Standby state ──
  if (!walletId) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="bg-surface/50 border-border relative flex h-[500px] w-full max-w-2xl flex-col items-center justify-center overflow-hidden rounded-sm border shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,var(--accent-cyan)_0%,transparent_70%)]" />
          </div>
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative">
              <Radar className="text-slate-700" size={120} strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-accent-cyan/40 h-2 w-2 animate-ping rounded-full" />
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-foreground/40 mb-2 text-2xl font-black tracking-tighter uppercase italic">
                [ SYSTEM STANDBY ]
              </h2>
              <div className="mb-6 flex items-center gap-3">
                <span className="bg-border h-[1px] w-8" />
                <p className="text-accent-cyan/60 font-mono text-xs tracking-[0.3em] uppercase">
                  Awaiting Target Input
                </p>
                <span className="bg-border h-[1px] w-8" />
              </div>
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <BootSequenceLoader />;

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <div className="border-accent-red/20 bg-accent-red/5 max-w-lg rounded-lg border-2 p-8 text-center">
          <AlertTriangle className="text-accent-red mx-auto mb-4" size={48} />
          <h2 className="text-accent-red mb-4 text-xl font-black uppercase italic">
            [ERR] Failed to Fetch Target Data
          </h2>
          <SearchForm defaultValue={walletId || ""} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-foreground text-3xl font-black tracking-tighter uppercase italic">
            Profile <span className="text-accent-cyan">Inspector</span>
          </h2>
          <span className="text-subtle">
            Target Identification & Risk Assessment Module
          </span>
        </div>
        <div className="flex items-center gap-3">
          <SearchForm defaultValue={walletId || ""} />
          <button
            onClick={() => router.push("/inspector")}
            className="text-accent-cyan rounded-sm border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-black tracking-widest whitespace-nowrap uppercase italic shadow-lg transition-all hover:bg-slate-700 active:translate-y-0.5"
          >
            RESET
          </button>
        </div>
      </div>

      {/* ── Info Cards ── */}
      <div className="grid grid-cols-12 gap-5">
        {/* Profile info */}
        <div className="col-span-4">
          <IndustrialCard title="ANALYSIS OVERVIEW" className="h-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border-2"
                  style={{
                    borderColor: riskColor + "55",
                    background: riskColor + "0a",
                  }}
                >
                  {profile?.picture_url ? (
                    <Image
                      src={resolvePictureUrl(profile.picture_url)}
                      alt={profile.handle || "profile"}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User size={28} style={{ color: riskColor + "88" }} />
                  )}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-subtle text-[9px] uppercase">
                    Handle
                  </span>
                  <span
                    className="max-w-[180px] truncate text-lg font-black uppercase italic"
                    style={{ color: riskColor }}
                  >
                    {profile?.handle || "UNKNOWN"}
                  </span>
                </div>
              </div>
              <div className="font-mono text-[9px] break-all">
                <span className="text-slate-500">PROFILE ID:</span>
                <br />
                <span className="font-bold" style={{ color: riskColor + "cc" }}>
                  {walletId}
                </span>
              </div>
              <div
                className="flex items-center gap-2 rounded-sm border px-3 py-2"
                style={{
                  borderColor: riskColor + "44",
                  background: riskColor + "08",
                }}
              >
                <div
                  className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full"
                  style={{ backgroundColor: riskColor }}
                />
                <span
                  className="text-base font-black italic"
                  style={{ color: riskColor }}
                >
                  {riskLabel}
                </span>
                {attentionWeights.length > 0 && (
                  <span className="ml-auto font-mono text-[7px] text-slate-700">
                    {attentionWeights.length} attn edges
                  </span>
                )}
              </div>
            </div>
          </IndustrialCard>
        </div>

        {/* Probability */}
        <div className="col-span-4">
          <ProbabilityEqualizer
            probabilities={analysis?.predict_proba || {}}
            className="h-full"
          />
        </div>

        {/* Reasoning */}
        <div className="col-span-4">
          <IndustrialCard title="DETECTION METRICS" className="h-full">
            <div className="flex flex-col gap-2">
              <span className="text-subtle text-[9px] font-bold uppercase">
                Reasoning:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(analysis?.reasoning || []).map((r, i) => (
                  <span
                    key={i}
                    className="border px-1.5 py-0.5 font-mono text-[9px] uppercase"
                    style={{
                      borderColor: riskColor + "33",
                      color: riskColor + "aa",
                      background: riskColor + "08",
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </IndustrialCard>
        </div>
      </div>

      {/* ── Tab container ── */}
      <div className="flex min-h-[700px] flex-1 flex-col">
        {/* Tab bar */}
        <div className="flex items-center gap-px border-b border-slate-800/80 bg-[#050608]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-5 py-2.5 font-mono text-[10px] font-bold tracking-[0.15em] uppercase transition-all ${
                activeTab === tab.id
                  ? "border-accent-cyan text-accent-cyan"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "analytics" && attentionWeights.length > 0 && (
                <span
                  className="ml-1 rounded-sm px-1 font-mono text-[7px] font-bold"
                  style={{
                    background: "#00f2ff22",
                    color: "#00f2ff99",
                    border: "1px solid #00f2ff33",
                  }}
                >
                  {attentionWeights.length}
                </span>
              )}
            </button>
          ))}

          {/* Graph controls (only on graph tab) */}
          {activeTab === "graph" && (
            <div className="mr-3 ml-auto flex items-center gap-2">
              {/* Depth toggle */}
              <div className="flex items-center gap-1.5 border border-slate-700/80 bg-black/60 px-2 py-1">
                <GitBranch size={9} className="text-slate-600" />
                <span className="font-mono text-[7px] text-slate-600 uppercase">
                  Depth
                </span>
                {([1, 2] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setGraphDepth(d)}
                    className="px-1.5 py-0.5 font-mono text-[9px] font-bold transition-all"
                    style={{
                      color: graphDepth === d ? "#00f2ff" : "#334155",
                      background:
                        graphDepth === d
                          ? "rgba(0,242,255,0.1)"
                          : "transparent",
                      border: `1px solid ${graphDepth === d ? "rgba(0,242,255,0.3)" : "transparent"}`,
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {/* Attention toggle */}
              {attentionWeights.length > 0 && (
                <button
                  onClick={() => setShowAttentionLabels((v) => !v)}
                  className="flex items-center gap-1.5 border border-slate-700/80 bg-black/60 px-2 py-1 transition-all hover:border-slate-600"
                  title={
                    showAttentionLabels
                      ? "Hide attention labels"
                      : "Show attention labels"
                  }
                >
                  {showAttentionLabels ? (
                    <Eye size={9} className="text-accent-cyan" />
                  ) : (
                    <EyeOff size={9} className="text-slate-600" />
                  )}
                  <span
                    className="font-mono text-[7px] font-bold uppercase"
                    style={{
                      color: showAttentionLabels ? "#00f2ff" : "#334155",
                    }}
                  >
                    Attention
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab content */}
        <div className="relative flex-1 overflow-hidden rounded-b-sm border border-t-0 border-slate-800/70 bg-[#050608]">
          {/* ── Graph tab ── */}
          {activeTab === "graph" && (
            <div className="relative h-full w-full">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:40px_40px]" />

              {/* Target badge */}
              {walletId && (
                <div className="pointer-events-none absolute top-4 left-4 z-10">
                  <div
                    className="flex items-center gap-2 border px-3 py-1.5 backdrop-blur-sm"
                    style={{
                      borderColor: riskColor + "33",
                      background: "rgba(0,0,0,0.75)",
                    }}
                  >
                    <div
                      className="h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{ backgroundColor: riskColor }}
                    />
                    <span
                      className="font-mono text-[8px] font-bold tracking-widest uppercase"
                      style={{ color: riskColor }}
                    >
                      TARGET: {walletId.slice(0, 12)}…
                    </span>
                  </div>
                </div>
              )}

              <UniversalGraph2D
                mode="EGO"
                graphData={displayGraphData}
                targetId={walletId || ""}
                attentionWeights={attentionWeights}
                showAttention={showAttentionLabels}
              />

              {/* Info overlay */}
              <div className="pointer-events-none absolute right-16 bottom-6 flex flex-col items-end gap-0.5">
                <span className="text-accent-cyan/50 font-mono text-[7px] uppercase">
                  2D RENDER ENGINE ACTIVE
                </span>
                <span className="font-mono text-[7px] text-slate-800">
                  Depth {graphDepth} · {displayGraphData.nodes.length} nodes ·{" "}
                  {displayGraphData.links.length} edges
                  {attentionWeights.length > 0 &&
                    ` · ${attentionWeights.length} attn`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InspectorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <Loader2 className="text-accent-cyan animate-spin" size={48} />
          <span className="text-accent-cyan animate-pulse font-mono text-sm font-bold tracking-[0.2em] uppercase">
            INITIALIZING MODULE...
          </span>
        </div>
      }
    >
      <InspectorContent />
    </Suspense>
  );
}
