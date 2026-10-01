"use client";

import React, { useState } from "react";
import { cn, formatPercent, formatScientific } from "@/lib/utils";
import { calculateForgeryProbability, calculateHonestRejectionRate } from "@/lib/math-quantum";
import { Sliders, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

export function SecurityEnvelopeHeatmap() {
  const [attackerModel, setAttackerModel] = useState<number>(0.33); // 33% intercept-resend
  const [targetLog, setTargetLog] = useState<number>(9); // 10^-9
  const [thresholdRatio, setThresholdRatio] = useState<number>(0.1); // 10% threshold

  const targetForgery = Math.pow(10, -targetLog);

  const lengths = [60, 100, 150, 200, 250, 300, 350, 400];
  const channelErrors = [0.12, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01];

  const [hoveredCell, setHoveredCell] = useState<{
    L: number;
    channelError: number;
    t: number;
    pf: number;
    pr: number;
    status: "SAFE" | "MARGINAL" | "UNSAFE";
  } | null>(null);

  return (
    <div className="soc-card p-6 space-y-6">
      {/* Interactive Sliders Panel */}
      <div className="p-4 rounded bg-surface-subtle border border-border/80 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-2">
            <span>Attacker Model (p_f):</span>
            <span className="font-bold text-cyan-400">{(attackerModel * 100).toFixed(0)}% Error</span>
          </div>
          <input
            type="range"
            min="0.20"
            max="0.50"
            step="0.01"
            value={attackerModel}
            onChange={(e) => setAttackerModel(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>20% (Optimistic Eve)</span>
            <span>33% (I-R)</span>
            <span>50% (Blind)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-2">
            <span>Security Target (P_forge):</span>
            <span className="font-bold text-emerald-400">10⁻{targetLog}</span>
          </div>
          <input
            type="range"
            min="4"
            max="15"
            step="1"
            value={targetLog}
            onChange={(e) => setTargetLog(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>10⁻⁴ (Basic)</span>
            <span>10⁻⁹ (Defense)</span>
            <span>10⁻¹⁵ (Maximal)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-2">
            <span>Threshold Ratio (t/L):</span>
            <span className="font-bold text-amber-400">{(thresholdRatio * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.25"
            step="0.01"
            value={thresholdRatio}
            onChange={(e) => setThresholdRatio(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>5%</span>
            <span>10% (Default)</span>
            <span>25%</span>
          </div>
        </div>
      </div>

      {/* 2D Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>Y: Optical Channel Error Rate</span>
            <span>X: Signature Length (L states) →</span>
          </div>

          <div className="grid grid-cols-9 gap-1.5 font-mono text-xs">
            {/* Corner header */}
            <div className="p-2 text-slate-500 text-[10px] flex items-center justify-center font-bold">
              QBER \ L
            </div>
            {lengths.map((L) => (
              <div key={L} className="p-2 text-center text-slate-300 font-bold bg-surface-subtle/50 rounded">
                {L}
              </div>
            ))}

            {channelErrors.map((ce) => (
              <React.Fragment key={ce}>
                {/* Y-axis label */}
                <div className="p-2 text-right text-slate-300 font-bold bg-surface-subtle/50 rounded flex items-center justify-end">
                  {(ce * 100).toFixed(1)}%
                </div>

                {/* Grid cells */}
                {lengths.map((L) => {
                  const t = Math.floor(L * thresholdRatio);
                  const pf = calculateForgeryProbability(L, t, attackerModel);
                  const pr = calculateHonestRejectionRate(L, t, ce);

                  let status: "SAFE" | "MARGINAL" | "UNSAFE" = "SAFE";
                  if (pf > targetForgery || pr > 0.01) {
                    status = pf > targetForgery * 100 || pr > 0.05 ? "UNSAFE" : "MARGINAL";
                  }

                  const cellColor =
                    status === "SAFE"
                      ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80"
                      : status === "MARGINAL"
                      ? "bg-amber-950/70 border-amber-500/40 text-amber-300 hover:bg-amber-900/80"
                      : "bg-red-950/70 border-red-500/40 text-red-300 hover:bg-red-900/80";

                  return (
                    <button
                      key={`${L}-${ce}`}
                      onMouseEnter={() => setHoveredCell({ L, channelError: ce, t, pf, pr, status })}
                      className={cn(
                        "h-12 rounded border p-1 flex flex-col items-center justify-center transition-all cursor-pointer",
                        cellColor
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase">{status}</span>
                      <span className="text-[9px] opacity-75 font-mono">t={t}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Info Card */}
      <div className="p-4 rounded bg-surface-subtle border border-cyan-500/30 text-xs font-mono">
        {hoveredCell ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Position:</span>
              <span className="text-white font-bold">L = {hoveredCell.L} states</span>
              <span className="text-slate-600">•</span>
              <span className="text-white font-bold">Channel = {formatPercent(hoveredCell.channelError, 1)}</span>
              <span className="text-slate-600">•</span>
              <span className="text-white font-bold">Threshold t = {hoveredCell.t}</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400">Forgery Prob: </span>
                <span className="text-cyan-300 font-bold">{formatScientific(hoveredCell.pf)}</span>
              </div>
              <div>
                <span className="text-slate-400">Honest Rejection: </span>
                <span className="text-amber-300 font-bold">{formatScientific(hoveredCell.pr)}</span>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded font-bold uppercase text-[10px] border",
                  hoveredCell.status === "SAFE"
                    ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                    : hoveredCell.status === "MARGINAL"
                    ? "bg-amber-950 border-amber-500 text-amber-400"
                    : "bg-red-950 border-red-500 text-red-400"
                )}
              >
                {hoveredCell.status}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-center">
            Hover over any cell in the security matrix to inspect detailed Chernoff bounds and error probabilities.
          </div>
        )}
      </div>

      {/* Region Legend */}
      <div className="flex flex-wrap items-center justify-center gap-8 pt-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-emerald-500/80 border border-emerald-400" />
          <span className="text-slate-300">SAFE: Forgery &lt; Target &amp; Rejection &lt; 0.1%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-500/80 border border-amber-400" />
          <span className="text-slate-300">MARGINAL: Meets baseline but narrow margin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-500/80 border border-red-400" />
          <span className="text-slate-300">UNSAFE: Vulnerable to forgery or high false rejections</span>
        </div>
      </div>
    </div>
  );
}
