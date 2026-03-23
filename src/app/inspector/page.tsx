"use client";

import { useMemo } from "react";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { TerminalLog } from "@/components/ui/terminal-log";
import {
  Wallet,
  ShieldCheck,
  User,
  Zap,
  AlertTriangle,
  Activity,
} from "lucide-react";

export default function InspectorPage() {
  const nodeOffsets = useMemo(() => {
    return [...Array(24)].map(() => 150 + Math.random() * 100);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black tracking-tighter text-foreground italic uppercase">
            Profile <span className="text-accent-cyan">Inspector</span>
          </h2>
          <span className="text-subtle">
            Target Identification & Risk Assessment Module
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-surface border border-border rounded-sm text-xs font-mono">
            ID: <span className="text-accent-cyan font-bold">0x71C...3B92</span>
          </div>
          <button className="px-6 py-2 bg-accent-red text-white dark:text-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all rounded-sm italic shadow-lg">
            QUARANTINE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Risk Score & Logs */}
        <div className="col-span-3 flex flex-col gap-6 overflow-hidden">
          <IndustrialCard
            title="RISK_SCORE_GAUGE"
            className="flex flex-col items-center"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* SVG Gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={502.4}
                  strokeDashoffset={502.4 * (1 - 0.85)}
                  className="text-accent-red drop-shadow-[0_0_8px_rgba(220,38,38,0)] dark:drop-shadow-[0_0_10px_rgba(255,23,68,0)]"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-accent-red italic tracking-tighter">
                  85%
                </span>
                <span className="text-subtle -mt-1">CRITICAL</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col items-center p-2 bg-surface-secondary/30 border border-border shadow-inner">
                <span className="text-[8px] text-slate-500 uppercase font-bold">
                  Suspicion
                </span>
                <span className="text-sm font-bold text-accent-red">HIGH</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-surface-secondary/30 border border-border shadow-inner">
                <span className="text-[8px] text-slate-500 uppercase font-bold">
                  Certainty
                </span>
                <span className="text-sm font-bold text-accent-cyan">92%</span>
              </div>
            </div>
          </IndustrialCard>

          <IndustrialCard
            title="LIVE_DETECTION_STREAM"
            className="flex-1 min-h-0 p-0"
          >
            <TerminalLog
              className="h-full border-0 bg-transparent"
              logs={[
                "[INFO] ANALYZING TRANSACTION TOPOLOGY...",
                "[WARN] HIGH CENTRALITY DETECTED",
                "[WARN] DEBT_CYCLE_FOUND: STACK_7",
                "[ALERT] SYBIL_CLUSTER_MATCH_v3: 88%",
                "[INFO] CROSS-CHAIN ENTROPY: 0.12",
                "[FATAL] MALICIOUS PATTERN IDENTIFIED",
              ]}
            />
          </IndustrialCard>
        </div>

        {/* Middle Column: Ego Graph */}
        <div className="col-span-6">
          <div className="h-full w-full bg-[#050608] border border-border rounded-sm relative overflow-hidden group shadow-2xl">
            {/* Background Grid - Visible on dark screen */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            {/* Mock Ego Graph SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 600"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Central Node Connection Lines */}
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="400"
                  y1="300"
                  x2={400 + Math.cos((i * 30 * Math.PI) / 180) * 180}
                  y2={300 + Math.sin((i * 30 * Math.PI) / 180) * 180}
                  stroke={i % 3 === 0 ? "#ff1744" : "#00f2ff"}
                  strokeWidth={i % 3 === 0 ? "2" : "0.5"}
                  strokeOpacity={i % 3 === 0 ? "0.8" : "0.4"}
                  strokeDasharray={i % 3 === 0 ? "5,5" : "0"}
                />
              ))}

              {/* Random Nodes */}
              {nodeOffsets.map((offset, i) => (
                <circle
                  key={i}
                  cx={
                    400 + Math.cos((i * 15 * Math.PI) / 180) * offset
                  }
                  cy={
                    300 + Math.sin((i * 15 * Math.PI) / 180) * offset
                  }
                  r={i % 4 === 0 ? "4" : "2"}
                  fill={i % 4 === 0 ? "#ff1744" : "#1e293b"}
                  stroke={i % 4 === 0 ? "white" : "#475569"}
                  strokeWidth="1"
                  className={i % 4 === 0 ? "animate-pulse" : ""}
                />
              ))}

              {/* Central Target Node */}
              <circle
                cx="400"
                cy="300"
                r="15"
                fill="#00f2ff"
                filter="url(#glow)"
                className="animate-pulse"
              />
              <circle
                cx="400"
                cy="300"
                r="25"
                fill="transparent"
                stroke="#00f2ff"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </svg>

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="px-2 py-1 bg-black/80 border border-slate-700 text-[9px] font-mono text-accent-cyan uppercase font-bold">
                EGO_GRAPH_v2
              </div>
              <div className="px-2 py-1 bg-black/80 border border-slate-700 text-[9px] font-mono text-slate-400 uppercase">
                3D_SPATIAL_MOCK
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-1 items-end">
              <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">
                Node Connections: 142
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">
                Network Depth: 4
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Data */}
        <div className="col-span-3 flex flex-col gap-6 overflow-hidden">
          <IndustrialCard title="ENTITY_IDENTITY">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-surface-secondary border-2 border-border rounded-sm flex items-center justify-center relative overflow-hidden group shadow-inner">
                <User
                  size={32}
                  className="text-slate-400 group-hover:text-accent-cyan transition-colors"
                />
                <div className="absolute inset-0 bg-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-subtle tracking-tighter">Alias</span>
                <span className="text-lg font-black text-foreground italic">
                  DARK_PULSE_99
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-surface-secondary/20 border border-border rounded-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                    Wallet
                  </span>
                </div>
                <span className="text-xs font-mono text-accent-cyan font-bold">
                  0x71...3B92
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-secondary/20 border border-border rounded-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-accent-green" />
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                    Trust Score
                  </span>
                </div>
                <span className="text-xs font-mono text-accent-green font-bold">
                  1.4 / 10
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-secondary/20 border border-border rounded-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-accent-red" />
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                    Activity
                  </span>
                </div>
                <span className="text-xs font-mono text-accent-red font-bold">
                  ANOMALOUS
                </span>
              </div>
            </div>
          </IndustrialCard>

          <IndustrialCard title="DETECTION_FLAGS" className="flex-1">
            <div className="space-y-3">
              {[
                { label: "IP_CLUSTER_REUSE", icon: Zap, status: "CRITICAL" },
                { label: "SEQUENTIAL_TIMING", icon: Activity, status: "HIGH" },
                {
                  label: "FUNDING_DISPERSION",
                  icon: AlertTriangle,
                  status: "MODERATE",
                },
                { label: "SOCIAL_GRAPH_ZERO", icon: User, status: "HIGH" },
              ].map((flag) => (
                <div key={flag.label} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <flag.icon size={12} className="text-slate-400" />
                      <span className="text-[9px] font-mono text-slate-500 font-bold">
                        {flag.label}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-bold font-mono ${
                        flag.status === "CRITICAL"
                          ? "text-accent-red"
                          : "text-orange-500"
                      }`}
                    >
                      {flag.status}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-surface-secondary overflow-hidden rounded-full">
                    <div
                      className={`h-full ${
                        flag.status === "CRITICAL"
                          ? "bg-accent-red"
                          : "bg-orange-500"
                      }`}
                      style={{
                        width: flag.status === "CRITICAL" ? "95%" : "70%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </IndustrialCard>
        </div>
      </div>
    </div>
  );
}
