"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from "recharts";
import { formatPercent } from "@/lib/utils";

interface BasisBarChartProps {
  basisQber: {
    Z: number;
    X: number;
    Y: number;
  };
  warningThreshold?: number;
}

export function BasisBarChart({
  basisQber,
  warningThreshold = 0.08,
}: BasisBarChartProps) {
  const data = [
    { basis: "Z Basis (|0⟩/|1⟩)", qber: basisQber.Z, rawKey: "Z" },
    { basis: "X Basis (|+⟩/|−⟩)", qber: basisQber.X, rawKey: "X" },
    { basis: "Y Basis (|+i⟩/|−i⟩)", qber: basisQber.Y, rawKey: "Y" },
  ];

  return (
    <div className="soc-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            Per-Basis QBER Distribution
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Compares conjugate basis error rates to detect basis-selective eavesdropping
          </p>
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2c44" opacity={0.6} />
            <XAxis
              dataKey="basis"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
              domain={[0, 0.55]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />

            <ReferenceLine
              y={0.02}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: "Honest Baseline (2%)",
                fill: "#10b981",
                fontSize: 10,
                position: "insideBottomRight",
              }}
            />

            <ReferenceLine
              y={warningThreshold}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                value: `Abort Threshold (${(warningThreshold * 100).toFixed(0)}%)`,
                fill: "#ef4444",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="soc-card p-2.5 border-cyan-500/40 text-xs font-mono shadow-xl bg-surface/95 backdrop-blur-sm">
                      <div className="font-bold text-slate-200 mb-1">{item.basis}</div>
                      <div className="flex justify-between gap-4 text-cyan-300">
                        <span>Measured QBER:</span>
                        <span className="font-bold">{formatPercent(item.qber, 2)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey="qber" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                const color =
                  entry.qber > warningThreshold
                    ? "#ef4444"
                    : entry.rawKey === "Z"
                    ? "#00f0ff"
                    : entry.rawKey === "X"
                    ? "#10b981"
                    : "#8b5cf6";
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
