"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d";
import { SybilNode, SybilEdge } from "@/types/api";

interface ClusterMap2DProps {
  graphData: {
    nodes: SybilNode[];
    links: SybilEdge[];
  };
}

const LABEL_COLORS: Record<string, string> = {
  "0_BENIGN": "#00f2ff",
  "1_LOW_RISK": "#4ade80",
  "2_HIGH_RISK": "#fb923c",
  "3_MALICIOUS": "#ef4444",
  UNKNOWN: "#94a3b8",
};

const RELATION_COLORS: Record<string, string> = {
  // Follow Layer
  FOLLOW: "#3b82f6",

  // Interact Layer
  UPVOTE: "#10b981",
  REACTION: "#10b981",
  COMMENT: "#10b981",
  QUOTE: "#10b981",
  MIRROR: "#10b981",
  COLLECT: "#10b981",
  TIP: "#10b981",
  INTERACT: "#10b981",

  // Co-Owner Layer
  "CO-OWNER": "#f97316",

  // Similarity Layer
  SAME_AVATAR: "#a855f7",
  FUZZY_HANDLE: "#a855f7",
  SIM_BIO: "#a855f7",
  CLOSE_CREATION_TIME: "#a855f7",
  SIMILARITY: "#a855f7",

  UNKNOWN: "#64748b",
};

const ClusterMap2D: React.FC<ClusterMap2DProps> = ({ graphData }) => {
  const fgRef = useRef<ForceGraphMethods<SybilNode, SybilEdge> | undefined>(
    undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Thêm cache cho avatar để tối ưu render giống ego-graph
  const imgCache = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Tune D3 Forces for compactness
  useEffect(() => {
    if (!fgRef.current) return;

    // Repulsion strength (negative is repulsion) - weaker repulsion means nodes stay closer
    fgRef.current.d3Force("charge")?.strength(-120);

    // Link distance - shorter distance brings linked nodes together
    fgRef.current.d3Force("link")?.distance(30);

    // Ensure collision force is active to prevent overlapping
    // Note: react-force-graph doesn't add 'collide' by default, we can add it
    // if needed, but let's see if the defaults + our tweaks are enough first.
    // fgRef.current.d3Force('collide', d3.forceCollide(8));
  }, [graphData]);

  const getNodeColor = useCallback((node: NodeObject<SybilNode>) => {
    return (node.label && LABEL_COLORS[node.label]) || LABEL_COLORS.UNKNOWN;
  }, []);

  // Custom vẽ Node: bao gồm Avatar và chỉnh size to hơn
  const drawNode = useCallback(
    (node: NodeObject<SybilNode>, ctx: CanvasRenderingContext2D) => {
      // Logic xác định size và color dựa trên label
      const isMalicious = node.label === "3_MALICIOUS";
      const size = isMalicious ? 8 : 5;
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const color = getNodeColor(node);

      // 1. Vẽ Glow (viền mờ) cho node malicious
      if (isMalicious) {
        ctx.beginPath();
        ctx.arc(x, y, size + 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
      }

      // 2. Logic load và vẽ Avatar
      const imgUrl = node.attributes?.picture_url;
      let img = null;
      if (imgUrl) {
        if (imgCache.current[imgUrl]) {
          img = imgCache.current[imgUrl];
        } else {
          const newImg = new Image();
          newImg.src = imgUrl;
          newImg.onload = () => {
            imgCache.current[imgUrl] = newImg;
          };
          imgCache.current[imgUrl] = newImg;
        }
      }

      // Vẽ nền node (Clip thành hình tròn cho avatar)
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
      ctx.clip();

      if (img && img.complete) {
        ctx.drawImage(img, x - size, y - size, size * 2, size * 2);
      } else {
        ctx.fillStyle = "#1e293b"; // Fallback color
        ctx.fill();
      }
      ctx.restore();

      // 3. Vẽ Viền (Stroke) thể hiện màu nhãn
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
      ctx.strokeStyle = color;
      ctx.lineWidth = isMalicious ? 2 : 1;
      ctx.stroke();
    },
    [getNodeColor]
  );

  return (
    <div ref={containerRef} className="relative h-full w-full bg-black/40">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        // --- SỬA CẠNH (LINKS) Ở ĐÂY ---
        linkColor={(link: SybilEdge) => {
          const color =
            (link.edge_type && RELATION_COLORS[link.edge_type]) ||
            RELATION_COLORS.UNKNOWN;
          return `${color}CC`; // 0.8 opacity (CC in hex)
        }}
        linkWidth={1}
        // --- SỬA NODE Ở ĐÂY ---
        nodeCanvasObjectMode={() => "replace"}
        nodeCanvasObject={drawNode}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        nodeLabel={(node: NodeObject<SybilNode>) => {
          const isHighRisk = node.risk_score && node.risk_score >= 0.8;
          return `
            <div class="bg-black/95 border border-slate-700 p-3 font-mono text-[10px] shadow-2xl min-w-[200px]">
              <div class="flex items-center justify-between mb-1">
                <div class="text-accent-cyan font-bold text-xs">${node.attributes?.handle || "Unknown Handle"}</div>
                <div class="text-[8px] font-bold text-slate-500 bg-slate-800/50 px-1 rounded uppercase">${node.label || "UNKNOWN"}</div>
              </div>
              <div class="text-slate-500 mb-2 break-all">ID: ${node.id}</div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-slate-400">RISK SCORE:</span>
                <span class="${isHighRisk ? "text-accent-red" : "text-green-500"} font-bold text-sm">
                  ${(node.risk_score || 0).toFixed(2)}
                </span>
              </div>
              <div class="text-slate-400 border-t border-slate-800 pt-2 italic leading-relaxed">
                ${node.attributes?.reason || "No reasoning provided."}
              </div>
            </div>
          `;
        }}
      />

      {/* Legend Overlay */}
      <div className="absolute top-6 right-6 z-10 flex min-w-[180px] flex-col gap-4 border border-slate-700 bg-black/80 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Node Map
          </div>
          {[
            {
              label: "Normal / Benign",
              color: LABEL_COLORS["0_BENIGN"],
              key: "0_BENIGN",
            },
            {
              label: "Low Risk Entity",
              color: LABEL_COLORS["1_LOW_RISK"],
              key: "1_LOW_RISK",
            },
            {
              label: "High Risk Entity",
              color: LABEL_COLORS["2_HIGH_RISK"],
              key: "2_HIGH_RISK",
            },
            {
              label: "Malicious / Sybil",
              color: LABEL_COLORS["3_MALICIOUS"],
              key: "3_MALICIOUS",
            },
          ].map(({ label, color, key }) => (
            <div key={key} className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${key === "3_MALICIOUS" ? "animate-pulse shadow-[0_0_8px_#ef4444]" : ""}`}
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-[9px] font-bold text-slate-300 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
          <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Relation Layers
          </div>
          {[
            { label: "Co-Owner", type: "CO-OWNER" },
            { label: "Follow", type: "FOLLOW" },
            { label: "Interact", type: "INTERACT" },
            { label: "Similarity", type: "SIMILARITY" },
          ].map(({ label, type }) => (
            <div key={type} className="flex items-center gap-3">
              <div
                className="h-0.5 w-3"
                style={{ backgroundColor: RELATION_COLORS[type] }}
              />
              <span className="font-mono text-[9px] font-bold text-slate-300 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClusterMap2D;
