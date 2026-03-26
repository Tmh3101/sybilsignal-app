"use client";

import React, { useMemo } from "react";
import { SybilNode, RiskClassification } from "@/types/api";
import { LABEL_COLORS } from "@/lib/graph-constants";
import {
  X,
  AlertTriangle,
  ShieldCheck,
  Shield,
  ShieldAlert,
  Users,
  MessageSquare,
  Activity,
} from "lucide-react";
import { resolvePictureUrl } from "@/lib/utils";
import Image from "next/image";

interface ClusterDetailPanelProps {
  clusterId: number;
  nodes: SybilNode[];
  onClose: () => void;
}

const RISK_ICONS: Record<string, React.ReactNode> = {
  MALICIOUS: <AlertTriangle size={10} />,
  HIGH_RISK: <ShieldAlert size={10} />,
  LOW_RISK: <Shield size={10} />,
  BENIGN: <ShieldCheck size={10} />,
};

const ClusterDetailPanel: React.FC<ClusterDetailPanelProps> = ({
  clusterId,
  nodes,
  onClose,
}) => {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalRisk = 0;
    for (const n of nodes) {
      counts[n.risk_label] = (counts[n.risk_label] || 0) + 1;
      totalRisk += n.risk_score || 0;
    }
    return {
      counts,
      avgRisk: nodes.length > 0 ? totalRisk / nodes.length : 0,
      dominantLabel: Object.entries(counts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] as RiskClassification,
    };
  }, [nodes]);

  const dominantColor =
    LABEL_COLORS[stats.dominantLabel] || LABEL_COLORS.UNKNOWN;
  const sortedNodes = [...nodes].sort(
    (a, b) => (b.risk_score || 0) - (a.risk_score || 0)
  );

  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-slate-800/80 bg-[#050810] font-mono">
      {/* ── Header ── */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-800/80 px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: dominantColor,
                boxShadow: `0 0 6px ${dominantColor}88`,
              }}
            />
            <span className="text-accent-cyan text-[10px] font-bold tracking-[0.18em] uppercase italic">
              CLUSTER #{clusterId}
            </span>
            <span
              className="ml-1 border px-1.5 py-0.5 text-[7px] font-bold tracking-widest uppercase"
              style={{
                borderColor: dominantColor + "44",
                color: dominantColor,
                backgroundColor: dominantColor + "0a",
              }}
            >
              {stats.dominantLabel.replace("_", " ")}
            </span>
          </div>
          <span className="text-[9px] text-slate-600">
            {nodes.length} accounts · avg risk{" "}
            {(stats.avgRisk * 100).toFixed(0)}%
          </span>
        </div>
        <button
          onClick={onClose}
          className="hover:border-accent-red/40 hover:text-accent-red flex h-7 w-7 items-center justify-center border border-slate-800 text-slate-500 transition-all"
        >
          <X size={13} />
        </button>
      </div>

      {/* ── Node list ── */}
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {sortedNodes.map((node, idx) => {
          const rl = node.risk_label || "UNKNOWN";
          const color = LABEL_COLORS[rl] || LABEL_COLORS.UNKNOWN;
          const isHigh = rl === "MALICIOUS" || rl === "HIGH_RISK";
          const pictureUrl = node.attributes?.picture_url
            ? resolvePictureUrl(String(node.attributes.picture_url))
            : "";
          const handle = String(
            node.attributes?.handle || node.id || "Unknown"
          );
          const reasons = (node.attributes?.reasons as string[]) || [];

          return (
            <div
              key={node.id}
              className="group border-b border-slate-800/40 px-4 py-3 transition-colors hover:bg-slate-900/40"
            >
              <div className="flex items-start gap-3">
                {/* Index + avatar */}
                <div className="flex flex-shrink-0 flex-col items-center gap-1">
                  <span className="text-[8px] text-slate-700 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm border"
                    style={{
                      borderColor: color + "44",
                      backgroundColor: color + "0d",
                    }}
                  >
                    {pictureUrl ? (
                      <Image
                        src={pictureUrl}
                        alt={handle}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                        unoptimized
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[12px] font-bold" style={{ color }}>
                        {handle.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="max-w-[130px] truncate text-[11px] font-bold uppercase italic"
                      style={{ color }}
                    >
                      {handle}
                    </span>
                    <div
                      className="flex flex-shrink-0 items-center gap-1"
                      style={{ color }}
                    >
                      {RISK_ICONS[rl]}
                      <span className="text-[8px] font-bold tabular-nums">
                        {((node.risk_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-0.5 truncate text-[8px] text-slate-600">
                    {node.id}
                  </div>

                  {/* Mini stats row */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[7px] font-medium tracking-tight">
                    <div className="flex items-center gap-1 border-r border-slate-800 pr-3 last:border-0">
                      <Activity size={8} className="text-slate-500" />
                      <span className="text-slate-600 uppercase">Trust:</span>
                      <span className="text-slate-300 font-bold tabular-nums">
                        {Number(node.attributes?.trust_score || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 border-r border-slate-800 pr-3 last:border-0">
                      <Users size={8} className="text-slate-500" />
                      <span className="text-slate-600 uppercase">Followers:</span>
                      <span className="text-slate-300 font-bold tabular-nums">
                        {node.attributes?.follower_count ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={8} className="text-slate-500" />
                      <span className="text-slate-600 uppercase">Posts:</span>
                      <span className="text-slate-300 font-bold tabular-nums">
                        {node.attributes?.post_count ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Reason flags */}
                  {isHigh && reasons.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {reasons.slice(0, 2).map((r, i) => (
                        <span
                          key={i}
                          className="border px-1.5 py-0.5 text-[7px]"
                          style={{
                            borderColor: color + "33",
                            color: color + "99",
                            backgroundColor: color + "0a",
                          }}
                        >
                          {r.split("+")[0].trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-slate-800/60 px-4 py-2">
        <span className="text-[8px] tracking-widest text-slate-700 uppercase">
          Click node on graph to inspect
        </span>
      </div>
    </div>
  );
};

export default ClusterDetailPanel;
