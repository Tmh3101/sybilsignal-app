"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { EdgeDistributionItem } from "@/types/api";
import { useTranslations } from "next-intl";

interface NetworkStructureChartProps {
  data: EdgeDistributionItem[];
}

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"];

export const NetworkStructureChart: React.FC<NetworkStructureChartProps> = ({
  data,
}) => {
  const t = useTranslations("StatsPage");
  const tLayers = useTranslations("EdgeLayers");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous state update in effect to prevent cascading renders
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <IndustrialCard title={t("network_structure_title")} className="h-[400px]">
      <div className="h-full w-full flex-1">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="count"
                nameKey="layer"
                label={({ payload }) => `${payload.percentage}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const percentage =
                    (props?.payload as EdgeDistributionItem | undefined)
                      ?.percentage ?? 0;
                  const numValue = typeof value === "number" ? value : 0;

                  // Handle potential raw translation keys or underscores from backend
                  const rawKey =
                    String(name ?? "UNKNOWN")
                      .split(".")
                      .pop() || "UNKNOWN";
                  const normalizedKey = rawKey.toUpperCase().replace("_", "-");

                  const label = tLayers.has(normalizedKey)
                    ? tLayers(normalizedKey)
                    : tLayers.has(rawKey)
                      ? tLayers(rawKey)
                      : rawKey;

                  return [
                    `${numValue.toLocaleString()} (${percentage}%)`,
                    label.toUpperCase(),
                  ];
                }}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "4px",
                  color: "#f8fafc",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
                itemStyle={{ color: "#06b6d4" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => {
                  // Handle potential raw translation keys or underscores from backend
                  const rawKey = String(value).split(".").pop() || "UNKNOWN";
                  const normalizedKey = rawKey.toUpperCase().replace("_", "-");

                  const label = tLayers.has(normalizedKey)
                    ? tLayers(normalizedKey)
                    : tLayers.has(rawKey)
                      ? tLayers(rawKey)
                      : rawKey;

                  return (
                    <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                      {label}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </IndustrialCard>
  );
};
