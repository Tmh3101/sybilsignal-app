"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useInspectProfile } from "@/hooks/use-sybil-inference";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { BootSequenceLoader } from "@/components/ui/boot-sequence-loader";
import { resolvePictureUrl } from "@/lib/utils";
import Image from "next/image";
import {
  ShieldCheck,
  User,
  // Activity,
  AlertTriangle,
  Loader2,
  Radar,
  Search,
} from "lucide-react";

const SearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("wallet") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/inspector?wallet=${searchValue.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="group relative w-full max-w-md">
      <Search
        className="group-focus-within:text-accent-cyan absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 transition-colors"
        size={16}
      />
      <input
        type="text"
        placeholder="ENTER PROFILE_ID..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="bg-background border-border focus:border-accent-cyan focus:ring-accent-cyan/20 w-full rounded-sm border px-10 py-2 font-mono text-xs tracking-widest uppercase transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none"
      />
    </form>
  );
};

const EgoGraph2D = dynamic(() => import("@/components/graph/ego-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/20">
      <Loader2 className="text-accent-cyan animate-spin" size={32} />
      <span className="text-accent-cyan animate-pulse font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
        INITIALIZING 2D RENDER ENGINE...
      </span>
    </div>
  ),
});

function InspectorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const walletId = searchParams.get("wallet");
  const { data, isLoading, isError } = useInspectProfile(walletId);

  const handleReset = () => {
    router.push("/inspector");
  };

  const getClassificationColor = (risk_label: string) => {
    switch (risk_label) {
      case "MALICIOUS":
        return "text-accent-red";
      case "HIGH_RISK":
        return "text-rose-500";
      case "LOW_RISK":
        return "text-orange-500";
      case "BENIGN":
        return "text-accent-green";
      default:
        return "text-accent-cyan";
    }
  };

  if (!walletId) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="bg-surface/50 border-border relative flex h-[500px] w-full max-w-2xl flex-col items-center justify-center overflow-hidden rounded-sm border shadow-2xl transition-colors duration-300">
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,var(--accent-cyan)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--border-rgb),0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--border-rgb),0.5)_1px,transparent_1px)] bg-[size:30px_30px] dark:bg-[size:40px_40px]" />
          </div>

          <div className="relative flex flex-col items-center gap-8">
            <div className="relative">
              <Radar
                className="text-slate-300 dark:text-slate-700"
                size={120}
                strokeWidth={1}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-accent-cyan/40 h-2 w-2 animate-ping rounded-full" />
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <h2 className="text-foreground/40 mb-2 text-2xl font-black tracking-tighter uppercase italic dark:text-slate-400">
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

  if (isLoading) {
    return <BootSequenceLoader />;
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <div className="border-accent-red/20 bg-accent-red/5 max-w-lg rounded-lg border-2 p-8 text-center backdrop-blur-sm">
          <AlertTriangle className="text-accent-red mx-auto mb-4" size={48} />
          <h2 className="text-accent-red mb-2 text-xl font-black tracking-tighter uppercase italic">
            [ERR] Failed to Fetch Target Data
          </h2>
          <p className="text-subtle mb-6 font-mono text-sm leading-relaxed tracking-widest uppercase">
            The sybil engine encountered an error while analyzing the target.
            Please verify the ID and try again.
          </p>
          <div className="flex justify-center">
            <SearchForm />
          </div>
        </div>
      </div>
    );
  }

  const analysis = data?.analysis;
  const profile = data?.profile_info;
  const prob = (analysis?.sybil_probability || 0) * 100;
  const colorClass = getClassificationColor(analysis?.risk_label || "");

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-foreground text-3xl font-black tracking-tighter uppercase italic">
            Profile <span className="text-accent-cyan">Inspector</span>
          </h2>
          <span className="text-subtle">
            Target Identification & Risk Assessment Module
          </span>
        </div>

        <div className="flex flex-1 justify-center px-12">
          <SearchForm />
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-surface border-border rounded-sm border px-4 py-2 font-mono text-xs shadow-sm">
            PROFILE ID:{" "}
            <span className="text-accent-cyan font-bold uppercase">
              {walletId}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-accent-cyan rounded-sm border border-slate-700 bg-slate-800 px-6 py-2 text-xs font-black tracking-widest uppercase italic shadow-lg transition-all hover:bg-slate-700 active:translate-y-0.5"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Top Info Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Profile & Risk Merged Card */}
        <div className="col-span-7">
          <IndustrialCard title="ENTITY_ANALYSIS_OVERVIEW" className="h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-surface-secondary border-border group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-sm border-2 shadow-inner transition-colors duration-300">
                  {profile?.picture_url ? (
                    <Image
                      src={resolvePictureUrl(profile.picture_url)}
                      alt={profile.handle}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User
                      size={40}
                      className="group-hover:text-accent-cyan text-slate-400 transition-colors"
                    />
                  )}
                  <div className="bg-accent-cyan/10 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <span className="text-subtle tracking-tighter">Handle</span>
                    <span className="text-foreground max-w-[220px] truncate text-xl font-black uppercase italic">
                      {profile?.handle || "UNKNOWN_ENTITY"}
                    </span>
                  </div>
                  <div className="bg-surface-secondary/40 border-border flex items-center gap-2 rounded-sm border px-3 py-1 shadow-sm">
                    <ShieldCheck
                      size={14}
                      className={
                        prob > 70 ? "text-accent-red" : "text-accent-green"
                      }
                    />
                    <span
                      className={`font-mono text-xs font-bold ${colorClass}`}
                    >
                      {analysis?.risk_label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-border/20 h-16 w-[1px]" />

              <div className="flex items-center gap-6 pr-4">
                <div>
                  <span className="text-subtle font-mono text-[10px] font-bold uppercase">
                    Sybil_Probability
                  </span>
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-slate-100 dark:text-slate-800"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 * (1 - prob / 100)}
                        className={`${colorClass} transition-all duration-1000 ease-out`}
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center">
                      <span
                        className={`text-xl font-black tracking-tighter italic ${colorClass}`}
                      >
                        {Math.round(prob)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </IndustrialCard>
        </div>

        {/* Detection Metrics */}
        <div className="col-span-5">
          <IndustrialCard title="DETECTION_METRICS" className="h-full">
            <div className="flex flex-col gap-2">
              <span className="text-subtle px-1 font-mono text-[9px] font-bold uppercase">
                Reasoning Tokens:
              </span>
              <div className="flex flex-wrap gap-2">
                {(analysis?.reasoning || []).slice(0, 8).map((r, i) => {
                  const tag = r.split(":")[0].replace("[", "").replace("]", "");
                  return (
                    <span
                      key={i}
                      className="bg-surface-secondary border-border border px-2 py-0.5 font-mono text-[8px] text-slate-500 uppercase transition-colors duration-300 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </IndustrialCard>
        </div>
      </div>

      {/* Main Graph Section */}
      <div className="min-h-[800px] flex-1">
        <div className="border-border bg-background group relative h-full w-full overflow-hidden rounded-sm border shadow-2xl transition-colors duration-300">
          {/* Background Grid */}
          <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--border-rgb),0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--border-rgb),0.3)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 dark:opacity-20" />

          {/* Live 2D Ego Graph */}
          <EgoGraph2D
            graphData={data?.local_graph || { nodes: [], links: [] }}
            targetId={walletId || ""}
            risk_label={data?.analysis?.risk_label}
          />

          {/* Overlays */}
          <div className="pointer-events-none absolute right-4 bottom-4 flex flex-col items-end gap-1">
            <span className="text-accent-cyan/80 animate-pulse font-mono text-[8px] font-bold uppercase">
              [ 2D RENDER ENGINE ACTIVE ]
            </span>
            <span className="text-subtle font-mono text-[8px] font-bold uppercase">
              Node Connections: {data?.local_graph?.nodes?.length || 0}
            </span>
            <span className="text-subtle font-mono text-[8px] font-bold uppercase">
              Network Depth: 2
            </span>
          </div>
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
            [SYS] INITIALIZING MODULE...
          </span>
        </div>
      }
    >
      <InspectorContent />
    </Suspense>
  );
}
