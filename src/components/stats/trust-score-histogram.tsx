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
} from 'recharts';
import { IndustrialCard } from '@/components/ui/industrial-card';
import { TrustScoreBin } from '@/types/api';

interface TrustScoreHistogramProps {
  data: TrustScoreBin[];
}

export const TrustScoreHistogram: React.FC<TrustScoreHistogramProps> = ({
  data,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <IndustrialCard title="TRUST SCORE DISTRIBUTION" className="h-[400px]">
      <div className="h-full w-full flex-1">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="bin"
                stroke="#64748b"
                fontSize={10}
                fontFamily="monospace"
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
              <Bar dataKey="count" fill="#06b6d4" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </IndustrialCard>
  );
};
