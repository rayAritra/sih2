"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { cn, formatPercent } from "@/lib/utils";

interface QBERDataPoint {
  time: string;
  overall: number;
  zBasis: number;
  xBasis: number;
  yBasis: number;
}

const mockHistory1m: QBERDataPoint[] = [
  { time: "14:31:10", overall: 0.019, zBasis: 0.018, xBasis: 0.021, yBasis: 0.019 },
  { time: "14:31:20", overall: 0.021, zBasis: 0.019, xBasis: 0.022, yBasis: 0.021 },
  { time: "14:31:30", overall: 0.020, zBasis: 0.017, xBasis: 0.023, yBasis: 0.020 },
  { time: "14:31:40", overall: 0.022, zBasis: 0.020, xBasis: 0.024, yBasis: 0.022 },
  { time: "14:31:50", overall: 0.021, zBasis: 0.018, xBasis: 0.023, yBasis: 0.022 },
  { time: "14:32:00", overall: 0.024, zBasis: 0.021, xBasis: 0.026, yBasis: 0.025 },
  { time: "14:32:10", overall: 0.0214, zBasis: 0.018, xBasis: 0.023, yBasis: 0.022 },
];

const mockHistory5m: QBERDataPoint[] = [
  { time: "14:27:00", overall: 0.018, zBasis: 0.017, xBasis: 0.019, yBasis: 0.018 },
  { time: "14:28:00", overall: 0.024, zBasis: 0.022, xBasis: 0.026, yBasis: 0.024 },
  { time: "14:29:00", overall: 0.020, zBasis: 0.018, xBasis: 0.021, yBasis: 0.020 },
  { time: "14:30:00", overall: 0.019, zBasis: 0.018, xBasis: 0.020, yBasis: 0.019 },
  { time: "14:31:00", overall: 0.021, zBasis: 0.019, xBasis: 0.022, yBasis: 0.021 },
  { time: "14:32:00", overall: 0.0214, zBasis: 0.018, xBasis: 0.023, yBasis: 0.022 },
];

const mockHistory15m: QBERDataPoint[] = [
  { time: "14:17:00", overall: 0.017, zBasis: 0.016, xBasis: 0.018, yBasis: 0.017 },
  { time: "14:20:00", overall: 0.046, zBasis: 0.048, xBasis: 0.045, yBasis: 0.046 },
  { time: "14:23:00", overall: 0.022, zBasis: 0.020, xBasis: 0.024, yBasis: 0.022 },
  { time: "14:26:00", overall: 0.025, zBasis: 0.022, xBasis: 0.027, yBasis: 0.025 },
  { time: "14:29:00", overall: 0.020, zBasis: 0.018, xBasis: 0.021, yBasis: 0.020 },
  { time: "14:32:00", overall: 0.0214, zBasis: 0.018, xBasis: 0.023, yBasis: 0.022 },
];

const mockHistory1h: QBERDataPoint[] = [
  { time: "13:30:00", overall: 0.019, zBasis: 0.018, xBasis: 0.020, yBasis: 0.019 },
  { time: "13:45:00", overall: 0.022, zBasis: 0.020, xBasis: 0.023, yBasis: 0.022 },
  { time: "14:00:00", overall: 0.025, zBasis: 0.023, xBasis: 0.026, yBasis: 0.025 },
  { time: "14:15:00", overall: 0.028, zBasis: 0.024, xBasis: 0.031, yBasis: 0.029 },
  { time: "14:30:00", overall: 0.021, zBasis: 0.019, xBasis: 0.022, yBasis: 0.021 },
];

export function LiveQBERChart() {
  const [range, setRange] = useState<"1m" | "5m" | "15m" | "1h">("5m");

  const data =
    range === "1m"
      ? mockHistory1m
      : range === "5m"
      ? mockHistory5m
      : range === "15m"
      ? mockHistory15m
      : mockHistory1h;

  return (
    <div className="soc-card p-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Quantum Bit Error Rate (QBER)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle text-slate-400 border border-border">
              REAL-TIME TOMOGRAPHY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Z, X, Y conjugate basis tracking with 8% warning boundary
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded border border-border text-xs font-mono">
          {(["1m", "5m", "15m", "1h"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-2.5 py-1 rounded transition-colors cursor-pointer",
                range === r
                  ? "bg-cyan-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2c44" opacity={0.6} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
              domain={[0, 0.12]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />

            {/* Warning threshold at 8% */}
            <ReferenceLine
              y={0.08}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: "Warning (8.0%)",
                fill: "#f59e0b",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="soc-card p-3 border-cyan-500/40 text-xs font-mono shadow-xl bg-surface/95 backdrop-blur-sm">
                      <div className="text-slate-400 mb-1.5 pb-1 border-b border-border font-bold">
                        {label}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4 text-cyan-300">
                          <span>Overall QBER:</span>
                          <span className="font-bold">
                            {formatPercent(Number(payload[0]?.value), 2)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span className="text-cyan-400">Z Basis:</span>
                          <span>{formatPercent(Number(payload[1]?.value), 2)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span className="text-emerald-400">X Basis:</span>
                          <span>{formatPercent(Number(payload[2]?.value), 2)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span className="text-purple-400">Y Basis:</span>
                          <span>{formatPercent(Number(payload[3]?.value), 2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Lines */}
            <Line
              type="monotone"
              dataKey="overall"
              name="Overall"
              stroke="#00f0ff"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#00f0ff" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="zBasis"
              name="Z Basis"
              stroke="#38bdf8"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="xBasis"
              name="X Basis"
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="yBasis"
              name="Y Basis"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-3 pt-3 border-t border-border/60 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-cyan-400 rounded-full" />
          <span className="text-slate-300">Overall</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-sky-400 border-t border-dashed" />
          <span className="text-slate-400">Z Basis (Computational)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-emerald-400 border-t border-dashed" />
          <span className="text-slate-400">X Basis (Hadamard)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-purple-400 border-t border-dashed" />
          <span className="text-slate-400">Y Basis (Circular)</span>
        </div>
      </div>
    </div>
  );
}
