'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { IndustrialCard } from '@/components/ui/industrial-card';
import { RiskDistributionItem } from '@/types/api';

interface RiskDistributionChartProps {
  data: RiskDistributionItem[];
}

const RISK_COLORS: Record<string, string> = {
  BENIGN: '#10b981', // green-500
  LOW_RISK: '#3b82f6', // blue-500
  HIGH_RISK: '#f59e0b', // amber-500
  MALICIOUS: '#ef4444', // red-500
};

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  data,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <IndustrialCard title="RISK DISTRIBUTION (NODES)" className="h-[400px]">
      <div className="h-full w-full flex-1">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="category"
                stroke="#64748b"
                fontSize={10}
                fontFamily="monospace"
                tickFormatter={(value) => value.replace('_', ' ')}
                angle={-25}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={RISK_COLORS[entry.category] || '#64748b'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </IndustrialCard>
  );
};
