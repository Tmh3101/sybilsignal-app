"use client";

import { IndustrialCard } from "@/components/ui/industrial-card";
import {
  Radar,
  FlaskConical,
  ShieldAlert,
  Activity,
  Cpu,
  HardDrive,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl font-black tracking-tighter text-foreground italic uppercase">
          SYSTEM <span className="text-accent-cyan">OVERVIEW</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm max-w-2xl leading-relaxed uppercase tracking-wider font-bold">
          Sybil Engine is a high-performance detection and network discovery
          platform designed for large-scale sybil cluster identification and
          individual profile risk assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IndustrialCard
          title="THREAT_LEVEL"
          className="border-l-4 border-l-accent-red"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-accent-red italic tracking-tighter">
                CRITICAL
              </span>
              <span className="text-subtle mt-1 font-bold">
                Active clusters detected
              </span>
            </div>
            <ShieldAlert size={48} className="text-accent-red opacity-20" />
          </div>
        </IndustrialCard>

        <IndustrialCard
          title="CORE_UTILIZATION"
          className="border-l-4 border-l-accent-cyan"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-foreground italic tracking-tighter">
                42.8%
              </span>
              <span className="text-subtle mt-1 font-bold">
                GAE Training in progress
              </span>
            </div>
            <Cpu size={48} className="text-accent-cyan opacity-20" />
          </div>
        </IndustrialCard>

        <IndustrialCard
          title="NODE_CAPACITY"
          className="border-l-4 border-l-accent-green"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-foreground italic tracking-tighter">
                1.4M
              </span>
              <span className="text-subtle mt-1 font-bold">
                Indexed addresses
              </span>
            </div>
            <HardDrive size={48} className="text-accent-green opacity-20" />
          </div>
        </IndustrialCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-subtle border-b border-border pb-2 font-bold">
            Available Modules
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/inspector">
              <div className="group p-6 bg-surface border border-border rounded-sm hover:border-accent-cyan transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 group-hover:text-accent-cyan transition-all">
                  <Radar size={40} />
                </div>
                <h4 className="text-xl font-bold text-foreground group-hover:text-accent-cyan transition-colors italic uppercase tracking-widest">
                  Profile Inspector
                </h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase mt-2 font-bold">
                  Analyze individual wallets for sybil behavior and risk
                  scoring.
                </p>
              </div>
            </Link>
            <Link href="/discovery">
              <div className="group p-6 bg-surface border border-border rounded-sm hover:border-accent-cyan transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 group-hover:text-accent-cyan transition-all">
                  <FlaskConical size={40} />
                </div>
                <h4 className="text-xl font-bold text-foreground group-hover:text-accent-cyan transition-colors italic uppercase tracking-widest">
                  Discovery Lab
                </h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase mt-2 font-bold">
                  Identify large scale community clusters and fraudulent
                  networks.
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-subtle border-b border-border pb-2 font-bold">
            System Diagnostics
          </h3>
          <div className="bg-surface border border-border rounded-sm p-6 flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-mono uppercase font-bold">
                <span className="text-slate-500">Memory Integrity</span>
                <span className="text-accent-cyan">98.2%</span>
              </div>
              <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden shadow-inner">
                <div className="w-[98.2%] h-full bg-accent-cyan shadow-[0_0_8px_rgba(var(--accent-cyan),0.6)]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-mono uppercase font-bold">
                <span className="text-slate-500">Heuristic Accuracy</span>
                <span className="text-accent-green">94.5%</span>
              </div>
              <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden shadow-inner">
                <div className="w-[94.5%] h-full bg-accent-green shadow-[0_0_8px_rgba(var(--accent-green),0.6)]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-mono uppercase font-bold">
                <span className="text-slate-500">Database Latency</span>
                <span className="text-accent-cyan">12ms</span>
              </div>
              <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden shadow-inner">
                <div className="w-[12%] h-full bg-accent-cyan shadow-[0_0_8px_rgba(var(--accent-cyan),0.6)]" />
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase border-t border-border pt-4 font-bold">
              <Activity size={14} className="text-accent-green animate-pulse" />
              <span>Diagnostic Sync: Nominal [Last check: 0.02s ago]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
