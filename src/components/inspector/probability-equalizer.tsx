"use client";

import React from "react";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { RiskClassification } from "@/types/api";

interface ProbabilityEqualizerProps {
  probabilities: Record<string, number>;
  className?: string;
}

const CLASS_CONFIG: Record<
  RiskClassification,
  { label: string; color: string; bgColor: string }
> = {
  BENIGN: {
    label: "BENIGN PROBABILITY",
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
  LOW_RISK: {
    label: "LOW_RISK PROBABILITY",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
  },
  HIGH_RISK: {
    label: "HIGH_RISK PROBABILITY",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
  },
  MALICIOUS: {
    label: "MALICIOUS PROBABILITY",
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
};

const CLASSES: RiskClassification[] = [
  "BENIGN",
  "LOW_RISK",
  "HIGH_RISK",
  "MALICIOUS",
];

export const ProbabilityEqualizer: React.FC<ProbabilityEqualizerProps> = ({
  probabilities,
  className = "",
}) => {
  return (
    <IndustrialCard
      title="PROBABILITY DISTRIBUTION EQUALIZER"
      className={className}
    >
      <div className="space-y-4">
        {CLASSES.map((cls) => {
          const prob = probabilities[cls] || 0;
          const config = CLASS_CONFIG[cls];
          const percentage = Math.round(prob * 100);

          return (
            <div key={cls} className="group flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-mono text-[9px] font-bold tracking-widest uppercase">
                <span className="text-slate-500 transition-colors group-hover:text-slate-300">
                  {config.label}
                </span>
                <span className={`${config.color} italic`}>{percentage}%</span>
              </div>

              <div className="relative h-2.5 w-full overflow-hidden rounded-sm border border-slate-800/50 bg-slate-900/50 shadow-inner transition-colors duration-300 group-hover:border-slate-700/50">
                {/* Progress Bar with Glow Effect */}
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${config.bgColor}`}
                  style={{
                    width: `${percentage}%`,
                    boxShadow:
                      percentage > 0
                        ? `0 0 12px ${config.bgColor.replace("bg-", "")}`
                        : "none",
                  }}
                />

                {/* Technical Overlay: Ticks */}
                <div className="pointer-events-none absolute inset-0 flex justify-between px-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-full w-[1px] bg-black/20" />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </IndustrialCard>
  );
};
