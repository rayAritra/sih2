"use client";

import React from "react";
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
import { SPRTResult } from "@/types";
import { Zap, ShieldAlert, CheckCircle2 } from "lucide-react";

interface SPRTChartProps {
  sprtData: SPRTResult;
  className?: string;
  attackName?: string;
}

export function SPRTChart({ sprtData, className, attackName = "Adversary Eavesdropping" }: SPRTChartProps) {
  const { trajectory, upperBoundary, lowerBoundary, stoppedAtStep, stepsSaved, savingsPercentage, decision } = sprtData;

  const isAttack = decision === "ACCEPT_H1";

  // Downsample trajectory for high-performance rendering if > 150 points
  const displayData = trajectory.filter((_, idx) => {
    if (trajectory.length <= 100) return true;
    return idx % 2 === 0 || idx === (stoppedAtStep ? stoppedAtStep - 1 : 0);
  });

  return (
    <div className="soc-card p-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Sequential Probability Ratio Test (SPRT)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-semibold">
              WALD HYPOTHESIS TEST
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time Log-Likelihood Ratio trajectory (S_n = ∑ ln[f1(x)/f0(x)])
          </p>
        </div>

        {/* Early detection savings badge */}
        {stepsSaved > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-subtle border border-cyan-500/30 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-cyan-300 font-bold">{stepsSaved} pulses saved</span>
              <span className="text-slate-400 text-[10px] ml-1.5">({savingsPercentage}% reduction)</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2c44" opacity={0.6} />
            <XAxis
              dataKey="index"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
              label={{
                value: "Measurement Pulse Index",
                position: "insideBottom",
                offset: -5,
                fill: "#64748b",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
              domain={[Math.min(-22, lowerBoundary - 2), Math.max(22, upperBoundary + 4)]}
              label={{
                value: "LLR (S_n)",
                angle: -90,
                position: "insideLeft",
                offset: 25,
                fill: "#64748b",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
            />

            {/* Upper H1 Boundary (Attack) */}
            <ReferenceLine
              y={upperBoundary}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `H1 Boundary (Attack: +${upperBoundary.toFixed(2)})`,
                fill: "#ef4444",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />

            {/* Lower H0 Boundary (Honest) */}
            <ReferenceLine
              y={lowerBoundary}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `H0 Boundary (Honest: ${lowerBoundary.toFixed(2)})`,
                fill: "#10b981",
                fontSize: 10,
                position: "insideBottomRight",
              }}
            />

            {/* Zero Baseline */}
            <ReferenceLine y={0} stroke="#334155" strokeDasharray="2 2" />

            {/* Early Stop Marker */}
            {stoppedAtStep && (
              <ReferenceLine
                x={stoppedAtStep}
                stroke={isAttack ? "#ef4444" : "#10b981"}
                strokeWidth={2}
                label={{
                  value: `Stopped at pulse #${stoppedAtStep}`,
                  fill: isAttack ? "#ef4444" : "#10b981",
                  fontSize: 10,
                  position: "top",
                }}
              />
            )}

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const step = payload[0].payload;
                  return (
                    <div className="soc-card p-3 border-cyan-500/40 text-xs font-mono shadow-xl bg-surface/95 backdrop-blur-sm">
                      <div className="text-slate-400 font-bold mb-1 pb-1 border-b border-border">
                        Pulse #{step.index}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4 text-cyan-300">
                          <span>LLR Score:</span>
                          <span className="font-bold">{step.llr}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Cumulative QBER:</span>
                          <span>{(step.cumulativeQber * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-400">
                          <span>State Result:</span>
                          <span className={step.mismatch ? "text-red-400 font-semibold" : "text-emerald-400"}>
                            {step.mismatch ? "MISMATCH" : "MATCH"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Line
              type="monotone"
              dataKey="llr"
              name="LLR Trajectory"
              stroke={isAttack ? "#ef4444" : "#00f0ff"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#00f0ff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Banner */}
      <div className="mt-3 pt-3 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          {isAttack ? (
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              EARLY ATTACK DETECTION: Crossed H1 at pulse {stoppedAtStep}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              HONEST CHANNEL ACCEPTED: S_n stayed within honest boundaries
            </span>
          )}
        </div>
        <div className="text-slate-400 text-[11px]">
          α = 0.001 (False Alarm) • β = 10⁻⁹ (Missed Detection)
        </div>
      </div>
    </div>
  );
}
