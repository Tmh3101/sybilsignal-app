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
import { resolvePictureUrl } from "@/lib/utils";
import {
  LABEL_COLORS,
  RELATION_COLORS,
  MIN_LINK_WIDTH,
} from "@/lib/graph-constants";
import GraphLegend from "./graph-legend";
import { useGraphProcessor, AggregatedLink } from "@/hooks/use-graph-processor";

interface ExtendedNode extends SybilNode {
  __img?: HTMLImageElement;
  __letterDrawn?: boolean;
}

export interface AttentionWeight {
  source: string;
  target: string;
  attention: number;
  edge_type: string;
  hop: number;
}

export interface UniversalGraph2DProps {
  graphData: {
    nodes: SybilNode[];
    links: SybilEdge[];
  };
  mode: "EGO" | "CLUSTER";
  targetId?: string;
  attentionWeights?: AttentionWeight[]; // full subgraph attention from API
  showAttention?: boolean; // toggle label visibility
  onClusterNodeClick?: (clusterId: number, nodes: SybilNode[]) => void;
  onNodeClick?: (node: SybilNode) => void;
  allNodes?: SybilNode[];
}

// ─── Attention lookup: O(1) ───
function buildAttentionMap(weights: AttentionWeight[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const w of weights) {
    // Store both directions so we can look up regardless of edge direction in graph
    const key1 = `${w.source}||${w.target}`;
    const key2 = `${w.target}||${w.source}`;
    const existing = map.get(key1) ?? 0;
    if (w.attention > existing) {
      map.set(key1, w.attention);
      map.set(key2, w.attention);
    }
  }
  return map;
}

const UniversalGraph2D: React.FC<UniversalGraph2DProps> = ({
  graphData,
  mode,
  targetId,
  attentionWeights = [],
  showAttention = true,
  onClusterNodeClick,
  onNodeClick,
  allNodes,
}) => {
  const fgRef = useRef<
    ForceGraphMethods<ExtendedNode, AggregatedLink> | undefined
  >(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [renderTick, setRenderTick] = useState(0);
  const imgCache = useRef<
    Record<string, HTMLImageElement | "loading" | "error">
  >({});

  const processedData = useGraphProcessor(graphData, {
    targetId: mode === "EGO" ? targetId : undefined,
    aggregateEdges: true,
  });

  // ── Attention lookup map ──
  const attentionMap = useMemo(
    () => buildAttentionMap(attentionWeights),
    [attentionWeights]
  );

  // ── Container resize ──
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        setDimensions({ width, height });
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Physics ──
  useEffect(() => {
    if (!fgRef.current) return;
    if (mode === "EGO") {
      fgRef.current.d3Force("radial", d3.forceRadial(150, 0, 0));
      const charge = fgRef.current.d3Force("charge");
      if (charge) (charge as d3.ForceManyBody<ExtendedNode>).strength(-300);
    } else {
      fgRef.current.d3Force("x", d3.forceX(0).strength(0.05));
      fgRef.current.d3Force("y", d3.forceY(0).strength(0.05));
      fgRef.current.d3Force("center", d3.forceCenter(0, 0));
      fgRef.current.d3Force("charge", d3.forceManyBody().strength(-100));
    }
    fgRef.current.d3ReheatSimulation();
  }, [processedData, mode, dimensions.width, dimensions.height]);

  // ── Image loader ──
  const loadImage = useCallback((url: string): HTMLImageElement | null => {
    if (!url) return null;
    const cached = imgCache.current[url];
    if (cached === "loading" || cached === "error") return null;
    if (cached instanceof HTMLImageElement) return cached;

    imgCache.current[url] = "loading";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgCache.current[url] = img;
      setRenderTick((t) => t + 1);
    };
    img.onerror = () => {
      imgCache.current[url] = "error";
    };
    img.src = url;
    return null;
  }, []);

  // ── Node canvas draw ──
  const drawNode = useCallback(
    (
      node: NodeObject<ExtendedNode>,
      ctx: CanvasRenderingContext2D,
      globalScale: number
    ) => {
      const isTarget = mode === "EGO" && String(node.id) === targetId;
      const isMalicious = node.risk_label === "MALICIOUS";
      const x = node.x ?? 0;
      const y = node.y ?? 0;

      let size = 5;
      if (mode === "EGO") size = isTarget ? 12 : 7;
      else size = isMalicious ? 8 : 5;

      // Use pre-computed __color from useGraphProcessor
      const color =
        (node as ExtendedNode & { __color?: string }).__color ||
        LABEL_COLORS[node.risk_label] ||
        LABEL_COLORS.UNKNOWN;

      // Glow
      if (isTarget) {
        const grad = ctx.createRadialGradient(x, y, size, x, y, size + 8);
        grad.addColorStop(0, color + "55");
        grad.addColorStop(1, color + "00");
        ctx.beginPath();
        ctx.arc(x, y, size + 8, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
      } else if (mode === "CLUSTER" && isMalicious) {
        ctx.beginPath();
        ctx.arc(x, y, size + 3, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(239,68,68,0.25)";
        ctx.fill();
      }

      // Draw node (with avatar or letter fallback)
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.clip();

      const skipImages = mode === "CLUSTER" && processedData.nodes.length > 500;
      let didDrawImage = false;

      if (!skipImages) {
        const rawUrl = node.attributes?.picture_url as string | undefined;
        const safeUrl = resolvePictureUrl(rawUrl);
        const img = safeUrl ? loadImage(safeUrl) : null;
        if (img) {
          ctx.drawImage(img, x - size, y - size, size * 2, size * 2);
          didDrawImage = true;
        }
      }

      if (!didDrawImage) {
        // Dark background
        ctx.fillStyle = "#0f1727";
        ctx.fill();

        // Letter avatar
        const handle = String(node.attributes?.handle || node.id || "?");
        const letter = handle.charAt(0).toUpperCase();
        ctx.fillStyle = color + "cc";
        ctx.font = `bold ${Math.max(size * 0.9, 6)}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(letter, x, y);
      }

      ctx.restore();

      // Border
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = isTarget
        ? 2.5
        : isMalicious && mode === "CLUSTER"
          ? 2
          : 1.2;
      ctx.stroke();

      // Target: dashed outer ring
      if (isTarget) {
        ctx.beginPath();
        ctx.arc(x, y, size + 4, 0, 2 * Math.PI);
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = color + "77";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label (EGO mode always, CLUSTER at high zoom)
      const showLabel =
        mode === "EGO" || (mode === "CLUSTER" && globalScale > 3);
      if (showLabel) {
        const label = String(node.attributes?.handle || node.id).slice(0, 12);
        const fontSize = Math.max(10 / globalScale, 7);
        ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = color;
        ctx.fillText(label, x, y + size + 3);
      }
    },
    [mode, targetId, processedData.nodes.length, loadImage]
  );

  // ── Link canvas draw (with attention label) ──
  const drawLink = useCallback(
    (
      link: LinkObject<ExtendedNode, AggregatedLink>,
      ctx: CanvasRenderingContext2D,
      globalScale: number
    ) => {
      // In EGO mode, draw attention weight label on EVERY edge that has attention data
      if (mode !== "EGO" || !showAttention || !attentionMap.size) return;

      const sNode = link.source as NodeObject<ExtendedNode>;
      const tNode = link.target as NodeObject<ExtendedNode>;
      if (!sNode?.x || !tNode?.x || !sNode?.y || !tNode?.y) return;

      const srcId = String(sNode.id);
      const tgtId = String(tNode.id);

      // ── KEY FIX: look up attention without zoom threshold ──
      const attnVal =
        attentionMap.get(`${srcId}||${tgtId}`) ??
        attentionMap.get(`${tgtId}||${srcId}`);

      // Only skip if we truly have no attention data for this edge
      if (attnVal === undefined) return;

      const mx = (sNode.x + tNode.x) / 2;
      const my = (sNode.y + tNode.y) / 2;

      // Attention color: map 0→cyan dim, 1→cyan bright
      const intensity = Math.min(attnVal, 1);
      const baseAlpha = Math.max(0.5, intensity);
      const alpha = Math.min(1.0, baseAlpha + 0.2);

      // Dot indicator (always visible regardless of zoom)
      ctx.beginPath();
      ctx.arc(mx, my, 2.5 / globalScale, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(0, 242, 255, ${alpha})`;
      ctx.fill();

      // Attention text (adaptive size — show at all zoom levels but scale with zoom)
      const fontSize = Math.max(8 / globalScale, 4);
      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Background pill for readability
      const label = attnVal.toFixed(4);
      const textW = ctx.measureText(label).width;
      const padX = 2 / globalScale;
      const padY = 1.5 / globalScale;
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(
        mx - textW / 2 - padX,
        my - fontSize / 2 - padY,
        textW + padX * 2,
        fontSize + padY * 2
      );

      // Text
      ctx.fillStyle = `rgba(0, 242, 255, ${alpha + 0.1})`;
      ctx.fillText(label, mx, my);
    },
    [mode, showAttention, attentionMap]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[400px] w-full bg-slate-950/40"
    >
      <ForceGraph2D
        key={`fg-${renderTick}-${mode}`}
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={processedData}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={drawNode}
        nodeCanvasObjectMode={() => "replace"}
        linkCanvasObjectMode={() => "after"}
        linkCanvasObject={drawLink}
        // Link appearance
        linkColor={(link: LinkObject<ExtendedNode, AggregatedLink>) => {
          const et = link.edge_type as string;
          const base = (et && RELATION_COLORS[et]) || RELATION_COLORS.UNKNOWN;
          return mode === "EGO" ? base + "bb" : base + "55";
        }}
        linkWidth={(link: LinkObject<ExtendedNode, AggregatedLink>) => {
          if (mode === "CLUSTER") return MIN_LINK_WIDTH;
          const w = link.aggregated_weight || 1;
          return Math.max(MIN_LINK_WIDTH, Math.sqrt(w) * 0.8);
        }}
        linkDirectionalArrowLength={(
          link: LinkObject<ExtendedNode, AggregatedLink>
        ) => {
          if (mode === "CLUSTER") return 0;
          const et = link.edge_type as string;
          // Show arrows for directed edge types
          const directed = [
            "FOLLOW",
            "UPVOTE",
            "REACTION",
            "COMMENT",
            "QUOTE",
            "MIRROR",
            "COLLECT",
            "TIP",
          ];
          return directed.includes(et) ? 4 : 0;
        }}
        linkDirectionalArrowRelPos={0.88}
        linkDirectionalParticles={0} // Disable particles — they conflict with attention labels
        linkCurvature={(link: LinkObject<ExtendedNode, AggregatedLink>) => {
          if (!link.multiLinkCount || link.multiLinkCount <= 1) return 0;
          const idx = link.multiLinkIndex ?? 0;
          const cnt = link.multiLinkCount;
          return (idx - (cnt - 1) / 2) * 0.2;
        }}
        nodeLabel={(node: NodeObject<ExtendedNode>) => {
          if (mode === "CLUSTER" && processedData.nodes.length > 300) return "";
          const rl = node.risk_label || "UNKNOWN";
          const color = LABEL_COLORS[rl] || LABEL_COLORS.UNKNOWN;
          const handle = node.attributes?.handle || node.id;
          const risk = ((node.risk_score || 0) * 100).toFixed(0);
          const reasons = ((node.attributes?.reasons as string[]) || []).slice(
            0,
            3
          );
          return `
            <div style="
              background:rgba(5,6,8,0.95);
              border:1px solid ${color}44;
              padding:10px 12px;
              font-family:'JetBrains Mono',monospace;
              font-size:10px;
              min-width:200px;
              max-width:280px;
            ">
              <div style="color:${color};font-weight:bold;font-size:12px;margin-bottom:4px;">
                ${handle}
              </div>
              <div style="color:#475569;font-size:8px;margin-bottom:6px;word-break:break-all;">
                ${node.id}
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:#64748b;font-size:8px;">RISK LABEL</span>
                <span style="color:${color};font-weight:bold;">${rl}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="color:#64748b;font-size:8px;">RISK SCORE</span>
                <span style="color:${color};font-weight:bold;">${risk}%</span>
              </div>
              ${
                reasons.length
                  ? `
              <div style="border-top:1px solid #1e293b;padding-top:6px;">
                <div style="color:#475569;font-size:7px;margin-bottom:3px;">DETECTION FLAGS</div>
                ${reasons.map((r) => `<div style="color:#94a3b8;font-size:7px;margin-bottom:2px;">• ${r}</div>`).join("")}
              </div>`
                  : ""
              }
            </div>
          `;
        }}
        onNodeClick={(node: NodeObject<ExtendedNode>) => {
          // Trigger side panel for inspector if prop provided
          if (onNodeClick) {
            onNodeClick(node as SybilNode);
          }

          if (mode === "CLUSTER" && onClusterNodeClick) {
            const cid = (node as ExtendedNode).cluster_id;
            if (cid !== undefined && cid !== null) {
              const clusterNodes = (allNodes || processedData.nodes).filter(
                (n) => (n as SybilNode).cluster_id === cid
              ) as SybilNode[];
              onClusterNodeClick(cid, clusterNodes);
            }
          }

          if (fgRef.current && node.x !== undefined && node.y !== undefined) {
            fgRef.current.centerAt(node.x, node.y, 800);
            fgRef.current.zoom(3.5, 800);
          }
        }}
        cooldownTicks={120}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />

      <GraphLegend
        showAttentionLegend={showAttention && attentionMap.size > 0}
        extraItems={
          mode === "EGO" ? (
            <div className="mb-1 flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-[#00f2ff] shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
              <span className="text-accent-cyan font-mono text-[9px] font-bold uppercase italic">
                Target Node
              </span>
            </div>
          ) : undefined
        }
      />
    </div>
  );
};

export default UniversalGraph2D;
