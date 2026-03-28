import React from "react";
import {
  LABEL_COLORS,
  RELATION_COLORS,
  RELATION_GROUPS,
  LABEL_GROUPS,
} from "@/lib/graph-constants";

interface GraphLegendProps {
  showNodes?: boolean;
  showRelations?: boolean;
  showAttentionLegend?: boolean;
  extraItems?: React.ReactNode;
}

const GraphLegend: React.FC<GraphLegendProps> = ({
  showNodes = true,
  showRelations = true,
  showAttentionLegend = false,
  extraItems,
}) => {
  return (
    <div className="absolute top-6 right-6 z-10 flex min-w-[180px] flex-col gap-4 border border-slate-700/80 bg-black/85 p-4 shadow-2xl backdrop-blur-md">
      {/* Node risk labels */}
      {showNodes && (
        <div className="flex flex-col gap-2">
          <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Node Risk Labels
          </div>
          {extraItems}
          {LABEL_GROUPS.map(({ label, key }) => (
            <div key={key} className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${key === "MALICIOUS" ? "animate-pulse shadow-[0_0_8px_#ef4444]" : ""}`}
                style={{ backgroundColor: LABEL_COLORS[key] }}
              />
              <span className="font-mono text-[9px] font-bold text-slate-300 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Relation layers */}
      {showRelations && (
        <div
          className={`flex flex-col gap-2 ${showNodes ? "border-t border-slate-800 pt-3" : ""}`}
        >
          <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Relation Layers
          </div>
          {RELATION_GROUPS.map(({ label, type, directed }) => (
            <div key={type} className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div
                  className="h-px w-3"
                  style={{
                    backgroundColor:
                      RELATION_COLORS[type] || RELATION_COLORS.UNKNOWN,
                  }}
                />
                {directed ? (
                  // Arrow indicator for directed
                  <svg
                    width="5"
                    height="6"
                    viewBox="0 0 5 6"
                    style={{
                      color: RELATION_COLORS[type] || RELATION_COLORS.UNKNOWN,
                    }}
                  >
                    <polygon points="0,0 5,3 0,6" fill="currentColor" />
                  </svg>
                ) : (
                  // Diamond indicator for undirected
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    style={{
                      color:
                        (RELATION_COLORS[type] || RELATION_COLORS.UNKNOWN) +
                        "99",
                    }}
                  >
                    <polygon
                      points="2.5,0 5,2.5 2.5,5 0,2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.8"
                    />
                  </svg>
                )}
              </div>
              <span className="font-mono text-[9px] font-bold text-slate-300 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* GAT Attention scale */}
      {showAttentionLegend && (
        <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
          <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            GAT Attention
          </div>
          {/* Gradient bar */}
          <div className="flex flex-col gap-1">
            <div
              className="h-2 w-full rounded-sm"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,242,255,0.15), rgba(0,242,255,1))",
              }}
            />
            <div className="flex justify-between font-mono text-[7px] text-slate-600">
              <span>0.0000 (low)</span>
              <span>1.0000 (high)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00f2ff]" />
            <span className="font-mono text-[8px] text-slate-500">
              Label = softmax weight
            </span>
          </div>
          <div className="text-[7px] leading-tight text-slate-700">
            Layer 2 attention (heads=1). Higher = neighbor influences target
            more.
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphLegend;
