"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPercent, formatScientific } from "@/lib/utils";
import { StatisticalEvidence, DecisionType } from "@/types";
import { X, CheckCircle2, AlertOctagon, Scale, ShieldAlert, Binary } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  attackName: string;
  decision: DecisionType | "SIGNATURE REJECTED" | "SIGNATURE ACCEPTED";
  evidence: StatisticalEvidence;
  sessionId: string;
}

export function EvidenceDrawer({
  isOpen,
  onClose,
  attackName,
  decision,
  evidence,
  sessionId,
}: EvidenceDrawerProps) {
  if (!isOpen) return null;

  const isRejected = decision.includes("REJECTED");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative z-10 w-full max-w-xl h-full bg-surface border-l border-border shadow-2xl flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-start justify-between sticky top-0 bg-surface/95 backdrop-blur-sm z-20">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <StatusBadge
                  status={isRejected ? "SIGNATURE REJECTED" : "SIGNATURE ACCEPTED"}
                  variant={isRejected ? "REJECTED" : "ACCEPTED"}
                />
                <span className="text-xs font-mono text-slate-400">Session {sessionId}</span>
              </div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>{attackName}</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-surface-subtle hover:bg-surface-panel border border-border text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Deterministic Science Notice */}
            <div className="p-3.5 rounded bg-surface-subtle border border-cyan-500/30 text-xs font-mono text-slate-300 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-cyan-300 block mb-0.5">
                  Deterministic Mathematical Detection
                </span>
                No heuristic AI confidence score is applied. Detection is governed by quantum state collapse, binomial probability bounds, and Wald&apos;s Sequential Probability Ratio Test (SPRT).
              </div>
            </div>

            {/* Core Statistical Evidence Grid */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Binary className="w-4 h-4 text-cyan-400" />
                <span>Deterministic Evidence Matrix</span>
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Observed QBER</span>
                  <span className="text-base font-bold text-red-400">
                    {formatPercent(evidence.observedQber, 2)}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Expected Honest QBER</span>
                  <span className="text-base font-bold text-emerald-400">
                    {formatPercent(evidence.expectedHonestQber, 2)}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Mismatch Count</span>
                  <span className="text-base font-bold text-slate-100">
                    {evidence.mismatchCount} / {evidence.measurementsUsed}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Signature Length (L)</span>
                  <span className="text-base font-bold text-slate-100">
                    {evidence.totalMeasurements} states
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">p-value (Honest Occur.)</span>
                  <span className="text-base font-bold text-amber-400">
                    {formatScientific(evidence.pValue)}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">SPRT LLR (S_n)</span>
                  <span className="text-base font-bold text-red-400">
                    +{evidence.sprtLlr.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Upper Boundary (H1)</span>
                  <span className="text-base font-bold text-slate-300">
                    +{evidence.upperBoundary.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Lower Boundary (H0)</span>
                  <span className="text-base font-bold text-slate-300">
                    {evidence.lowerBoundary.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Entanglement Fidelity</span>
                  <span className="text-base font-bold text-slate-200">
                    {formatPercent(evidence.fidelity, 1)}
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-slate-500 block text-[11px]">Attacker Forgery Prob.</span>
                  <span className="text-base font-bold text-emerald-400">
                    {formatScientific(evidence.forgeryProbability)}
                  </span>
                </div>
              </div>
            </div>

            {/* Per-Basis QBER Breakdown */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Conjugate Basis Distribution (Z / X / Y)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-cyan-400 font-bold block mb-1">Z Basis</span>
                  <span className="text-lg font-bold text-white block">
                    {formatPercent(evidence.basisQber.Z.qber, 1)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {evidence.basisQber.Z.errors} / {evidence.basisQber.Z.count} errors
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-emerald-400 font-bold block mb-1">X Basis</span>
                  <span className="text-lg font-bold text-white block">
                    {formatPercent(evidence.basisQber.X.qber, 1)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {evidence.basisQber.X.errors} / {evidence.basisQber.X.count} errors
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border/80">
                  <span className="text-purple-400 font-bold block mb-1">Y Basis</span>
                  <span className="text-lg font-bold text-white block">
                    {formatPercent(evidence.basisQber.Y.qber, 1)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {evidence.basisQber.Y.errors} / {evidence.basisQber.Y.count} errors
                  </span>
                </div>
              </div>
            </div>

            {/* Triggered Rules */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Triggered Verification Rules
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {evidence.triggeredRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded bg-red-950/20 border border-red-500/30 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-red-300 block mb-0.5">{rule.rule}</span>
                      <span className="text-slate-400 text-[11px] block">{rule.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Decision Banner */}
            <div className="pt-2">
              <div
                className={cn(
                  "p-4 rounded border text-center font-mono font-bold tracking-wider uppercase text-sm",
                  isRejected
                    ? "bg-red-950/50 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    : "bg-emerald-950/50 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                )}
              >
                DECISION: {decision}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
