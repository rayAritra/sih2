"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { solveSecureQDSParameters } from "@/lib/math-quantum";
import { PlannerResult } from "@/types";
import { cn, formatPercent, formatScientific } from "@/lib/utils";
import {
  Sliders,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

export default function SecurityPlannerPage() {
  // Inputs
  const [channelError, setChannelError] = useState(0.02); // 2%
  const [attackerError, setAttackerError] = useState(0.33); // 33%
  const [targetForgeryLog, setTargetForgeryLog] = useState(9); // 10^-9
  const [maxRejectionLog, setMaxRejectionLog] = useState(3); // 10^-3
  const [safetyMargin, setSafetyMargin] = useState(0.1); // 10%

  // Result state
  const [result, setResult] = useState<PlannerResult>(() =>
    solveSecureQDSParameters(0.02, 0.33, 1e-9, 1e-3, 0.1)
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const calculated = solveSecureQDSParameters(
      channelError,
      attackerError,
      Math.pow(10, -targetForgeryLog),
      Math.pow(10, -maxRejectionLog),
      safetyMargin
    );
    setResult(calculated);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Signature Security Planner"
        subtitle="Calculate mathematically secure QDS parameters from optical channel conditions and target security guarantees."
        badge="PARAMETER OPTIMIZER"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleCalculate}
            className="soc-card p-5 space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Physical Constraints</span>
              </span>
              <span className="text-[10px] text-slate-500">Chernoff Bounds</span>
            </div>

            {/* Channel Error */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Honest Channel Error (p₀):</span>
                <span className="font-bold text-white">{(channelError * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.08"
                step="0.005"
                value={channelError}
                onChange={(e) => setChannelError(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0.5% (Lab)</span>
                <span>2.0% (Field Fiber)</span>
                <span>8.0%</span>
              </div>
            </div>

            {/* Attacker Error */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Attacker Model Error (p_f):</span>
                <span className="font-bold text-red-400">{(attackerError * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="0.50"
                step="0.01"
                value={attackerError}
                onChange={(e) => setAttackerError(parseFloat(e.target.value))}
                className="w-full accent-red-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>20% (Transverse)</span>
                <span>33% (Intercept-Resend)</span>
                <span>50% (Blind)</span>
              </div>
            </div>

            {/* Target Forgery Acceptance */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Target Forgery Acceptance (P_forge):</span>
                <span className="font-bold text-emerald-400">10⁻{targetForgeryLog}</span>
              </div>
              <input
                type="range"
                min="6"
                max="15"
                step="1"
                value={targetForgeryLog}
                onChange={(e) => setTargetForgeryLog(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>10⁻⁶ (Standard)</span>
                <span>10⁻⁹ (Defense-Grade)</span>
                <span>10⁻¹⁵</span>
              </div>
            </div>

            {/* Maximum Honest Rejection */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Max Honest Rejection (P_reject):</span>
                <span className="font-bold text-amber-400">10⁻{maxRejectionLog}</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={maxRejectionLog}
                onChange={(e) => setMaxRejectionLog(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>10⁻² (1%)</span>
                <span>10⁻³ (0.1%)</span>
                <span>10⁻⁶</span>
              </div>
            </div>

            {/* Safety Margin */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Adversarial Safety Margin:</span>
                <span className="font-bold text-slate-200">{(safetyMargin * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.20"
                step="0.01"
                value={safetyMargin}
                onChange={(e) => setSafetyMargin(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Parameters</span>
            </button>
          </form>

          {/* Theoretical Guarantee Note */}
          <div className="p-4 rounded-lg bg-surface-subtle border border-border/80 text-xs font-mono space-y-2 text-slate-400">
            <span className="text-white font-bold block flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              Information-Theoretic Security
            </span>
            <p className="leading-relaxed">
              Parameters are computed by solving the dual Chernoff tail bounds between the honest binomial channel distribution B(L, p₀) and the eavesdropper distribution B(L, p_f).
            </p>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Result Card */}
          <div className="soc-card p-6 relative overflow-hidden font-mono">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  Recommended Configuration
                </span>
                <span className="text-xl font-bold text-white">
                  Deterministic QDS Guarantee
                </span>
              </div>

              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider flex items-center gap-1.5",
                  result.securityStatus === "SAFE"
                    ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-400"
                    : result.securityStatus === "MARGINAL"
                    ? "bg-amber-950/70 border-amber-500/50 text-amber-400"
                    : "bg-red-950/70 border-red-500/50 text-red-400"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                {result.securityStatus}
              </span>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded bg-surface-subtle border border-border">
                <span className="text-[11px] text-slate-500 block mb-1">Signature Length (L)</span>
                <span className="text-3xl font-extrabold text-cyan-400">
                  {result.signatureLengthL}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">states</span>
              </div>

              <div className="p-4 rounded bg-surface-subtle border border-border">
                <span className="text-[11px] text-slate-500 block mb-1">Max Mismatches (t)</span>
                <span className="text-3xl font-extrabold text-amber-400">
                  {result.maxMismatchesT}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  t/L = {result.thresholdRatio}
                </span>
              </div>

              <div className="p-4 rounded bg-surface-subtle border border-border">
                <span className="text-[11px] text-slate-500 block mb-1">Forgery Prob. (P_f)</span>
                <span className="text-xl font-bold text-emerald-400">
                  {formatScientific(result.forgeryProbability)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Bound satisfied</span>
              </div>

              <div className="p-4 rounded bg-surface-subtle border border-border">
                <span className="text-[11px] text-slate-500 block mb-1">Honest Rejection</span>
                <span className="text-xl font-bold text-slate-200">
                  {formatScientific(result.honestRejectionRate)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">False alarm rate</span>
              </div>
            </div>

            {/* Threshold Separation Scale */}
            <div className="p-4 rounded bg-surface-subtle border border-border/80 space-y-2 mb-6 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Honest Noise: {(channelError * 100).toFixed(1)}%</span>
                <span className="font-bold text-amber-400">Threshold: {(result.thresholdRatio * 100).toFixed(1)}%</span>
                <span>Attacker: {(attackerError * 100).toFixed(1)}%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-900 border border-border overflow-hidden relative">
                <div
                  className="absolute top-0 bottom-0 bg-emerald-500"
                  style={{ width: `${channelError * 100 * 2}%` }}
                  title="Honest Channel Region"
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10"
                  style={{ left: `${result.thresholdRatio * 100 * 2}%` }}
                  title="Decision Threshold t"
                />
                <div
                  className="absolute top-0 bottom-0 right-0 bg-red-500/80"
                  style={{ width: `${(1 - attackerError) * 100 * 2}%` }}
                  title="Attacker Region"
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Honest Margin: +{result.distanceHonestToThreshold}%</span>
                <span>Attacker Distance: +{result.distanceAttackerToThreshold}%</span>
              </div>
            </div>

            {/* Verification Proof Notes */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">
                Mathematical Verification Proof
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {result.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
