"use client";

import { Radar, FlaskConical, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 pt-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-5xl font-black tracking-tighter uppercase italic">
          SYSTEM <span className="text-accent-cyan">OVERVIEW</span>
        </h2>
        <p className="max-w-2xl font-mono text-sm leading-relaxed font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          SybilSignal is a high-performance detection and network discovery
          platform designed for large-scale sybil cluster identification and
          individual profile risk assessment.
        </p>
      </div>

      <div className="mt-4 grid gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-subtle border-border border-b pb-2 font-bold">
            Available Modules
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/inspector">
              <div className="group bg-surface border-border hover:border-accent-cyan relative cursor-pointer overflow-hidden rounded-sm border p-6 transition-all">
                <div className="group-hover:text-accent-cyan absolute top-0 right-0 p-2 opacity-10 transition-all group-hover:opacity-100">
                  <Radar size={32} />
                </div>
                <h4 className="text-foreground group-hover:text-accent-cyan text-xl font-bold tracking-widest uppercase italic transition-colors">
                  Profile Inspector
                </h4>
                <p className="mt-2 font-mono text-[10px] font-bold text-slate-500 uppercase">
                  Analyze individual wallets for sybil behavior and risk
                  scoring.
                </p>
              </div>
            </Link>
            <Link href="/discovery">
              <div className="group bg-surface border-border hover:border-accent-cyan relative cursor-pointer overflow-hidden rounded-sm border p-6 transition-all">
                <div className="group-hover:text-accent-cyan absolute top-0 right-0 p-2 opacity-10 transition-all group-hover:opacity-100">
                  <FlaskConical size={32} />
                </div>
                <h4 className="text-foreground group-hover:text-accent-cyan text-xl font-bold tracking-widest uppercase italic transition-colors">
                  Discovery Lab
                </h4>
                <p className="mt-2 font-mono text-[10px] font-bold text-slate-500 uppercase">
                  Identify large scale community clusters and fraudulent
                  networks.
                </p>
              </div>
            </Link>
            <Link href="/stats">
              <div className="group bg-surface border-border hover:border-accent-cyan relative cursor-pointer overflow-hidden rounded-sm border p-6 transition-all">
                <div className="group-hover:text-accent-cyan absolute top-0 right-0 p-2 opacity-10 transition-all group-hover:opacity-100">
                  <BarChart3 size={32} />
                </div>
                <h4 className="text-foreground group-hover:text-accent-cyan text-xl font-bold tracking-widest uppercase italic transition-colors">
                  Network Statistics
                </h4>
                <p className="mt-2 font-mono text-[10px] font-bold text-slate-500 uppercase">
                  Structural analysis and heuristic risk distribution overview.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
