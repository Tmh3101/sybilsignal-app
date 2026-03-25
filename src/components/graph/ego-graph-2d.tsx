"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import * as d3 from "d3";
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
  LinkObject,
} from "react-force-graph-2d";
import { SybilNode, SybilEdge } from "@/types/api";

// --- VISUAL CONSTANTS (Unified with ClusterMap2D) ---
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

interface ExtendedNode extends SybilNode {
  __img?: HTMLImageElement;
}

interface ExtendedLink extends Omit<SybilEdge, "source" | "target"> {
  source: string | NodeObject<ExtendedNode>;
  target: string | NodeObject<ExtendedNode>;
  multiLinkIndex?: number;
  multiLinkCount?: number;
}

interface EgoGraph2DProps {
  graphData: {
    nodes: SybilNode[];
    links: SybilEdge[];
  };
  targetId: string;
  classification?: "BENIGN" | "WARNING" | "SYBIL";
}

const EgoGraph2D: React.FC<EgoGraph2DProps> = ({
  graphData,
  targetId,
  classification,
}) => {
  const fgRef = useRef<
    ForceGraphMethods<ExtendedNode, ExtendedLink> | undefined
  >(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const imgCache = useRef<Record<string, HTMLImageElement>>({});

  // Process data for multi-link support
  const processedData = useMemo(() => {
    const nodes = graphData.nodes.map((n) => {
      const isTarget = n.id === targetId;
      return {
        ...n,
        fx: isTarget ? 0 : undefined,
        fy: isTarget ? 0 : undefined,
      } as ExtendedNode;
    });
    const links = graphData.links.map((l) => ({ ...l }) as ExtendedLink);

    // Group links by pair
    const linkGroups: Record<string, ExtendedLink[]> = {};
    links.forEach((link) => {
      const id = [link.source, link.target].sort().join("-");
      if (!linkGroups[id]) linkGroups[id] = [];
      linkGroups[id].push(link);
    });

    // Assign indices for curvature
    Object.values(linkGroups).forEach((group) => {
      const count = group.length;
      group.forEach((link, i) => {
        link.multiLinkIndex = i;
        link.multiLinkCount = count;
      });
    });

    return { nodes, links };
  }, [graphData, targetId]);

  // Update dimensions based on parent container
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Physics Tuning
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("radial", d3.forceRadial(150, 0, 0));
      const charge = fgRef.current.d3Force("charge");
      if (charge) {
        (charge as d3.ForceManyBody<ExtendedNode>).strength(-200);
      }
      // Re-heat simulation to apply changes
      fgRef.current.d3ReheatSimulation();
    }
  }, [processedData]);

  const getTargetColor = useCallback(() => {
    if (classification === "SYBIL" || classification === "WARNING")
      return LABEL_COLORS["3_MALICIOUS"];
    return LABEL_COLORS["0_BENIGN"];
  }, [classification]);

  const getNodeColor = useCallback((node: NodeObject<ExtendedNode>) => {
    return (node.label && LABEL_COLORS[node.label]) || LABEL_COLORS.UNKNOWN;
  }, []);

  const drawNode = useCallback(
    (
      node: NodeObject<ExtendedNode>,
      ctx: CanvasRenderingContext2D,
      globalScale: number
    ) => {
      const isTarget = node.id === targetId;
      const size = isTarget ? 10 : 6;
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const color = isTarget ? getTargetColor() : getNodeColor(node);

      // 1. Draw Glow (Target only in EgoGraph)
      if (isTarget) {
        ctx.beginPath();
        ctx.arc(x, y, size + 4, 0, 2 * Math.PI, false);
        ctx.fillStyle = `${color}33`; // 0.2 opacity
        ctx.fill();
      }

      // 2. Avatar Logic (Ported from ClusterMap2D)
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

      // Draw Node Base (Clip for Avatar)
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
      ctx.clip();

      if (img && img.complete) {
        try {
          ctx.drawImage(img, x - size, y - size, size * 2, size * 2);
        } catch {
          ctx.fillStyle = "#1e293b";
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#1e293b";
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw Border (Stroke)
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
      ctx.strokeStyle = color;
      ctx.lineWidth = isTarget ? 2 : 1;
      ctx.stroke();

      // 4. Label (Handle)
      const label = node.attributes?.handle || (node.id as string).slice(0, 8);
      if (globalScale > 2) {
        ctx.font = `${10 / globalScale}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = color;
        ctx.fillText(label, x, y + size + 2);
      }
    },
    [targetId, getNodeColor, getTargetColor]
  );

  return (
    <div ref={containerRef} className="relative h-full min-h-[400px] w-full">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={processedData}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={drawNode}
        nodeCanvasObjectMode={() => "always"}
        // Link Rendering
        linkColor={(link: LinkObject<ExtendedNode, ExtendedLink>) => {
          const color =
            (link.type && RELATION_COLORS[link.type]) ||
            RELATION_COLORS.UNKNOWN;
          return `${color}CC`; // 0.8 opacity matching ClusterMap2D
        }}
        linkWidth={(link: LinkObject<ExtendedNode, ExtendedLink>) =>
          link.multiLinkCount && link.multiLinkCount > 1 ? 1.5 : 1
        }
        linkCurvature={(link: LinkObject<ExtendedNode, ExtendedLink>) => {
          if (!link.multiLinkCount || link.multiLinkCount <= 1) return 0;
          const index = link.multiLinkIndex ?? 0;
          const count = link.multiLinkCount;
          return (index - (count - 1) / 2) * 0.15;
        }}
        // Interactive tooltips
        nodeLabel={(node: NodeObject<ExtendedNode>) => {
          const isTarget = node.id === targetId;
          const isHighRisk =
            (node.risk_score && node.risk_score >= 0.8) ||
            (node.label && node.label.includes("MALICIOUS"));
          return `
            <div class="bg-black/95 border border-slate-700 p-3 font-mono text-[10px] shadow-2xl min-w-[200px]">
              <div class="flex items-center justify-between mb-1">
                <div class="text-accent-cyan font-bold text-xs">
                  ${node.attributes?.handle || "Unknown Handle"}
                  ${isTarget ? '<span class="ml-2 text-[8px] px-1 bg-accent-cyan/20 border border-accent-cyan/50 animate-pulse text-accent-cyan">[TARGET_ENTITY]</span>' : ""}
                </div>
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
        onNodeClick={(node: NodeObject<ExtendedNode>) => {
          if (fgRef.current && node.x !== undefined && node.y !== undefined) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(4, 1000);
          }
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />

      {/* Legend Overlay */}
      <div className="absolute top-6 right-6 z-10 flex min-w-[180px] flex-col gap-4 border border-slate-700 bg-black/80 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Node Map
          </div>
          {/* Target Entity Highlight (Specific to EgoGraph) */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-[#00f2ff] shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
            <span className="text-accent-cyan font-mono text-[9px] font-bold uppercase italic">
              Target Entity (Larger Node)
            </span>
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
                style={{
                  backgroundColor:
                    RELATION_COLORS[type] || RELATION_COLORS.UNKNOWN,
                }}
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

export default EgoGraph2D;
