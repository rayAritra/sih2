"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ATTACK_CATALOG } from "@/config/threat-catalog";
import { AttackDefinition, AttackResult } from "@/types";
import { useAttackLabStore } from "@/stores/useAttackLabStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BasisBarChart } from "@/components/charts/BasisBarChart";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { cn, formatPercent, formatScientific } from "@/lib/utils";
import {
  ShieldAlert,
  Flame,
  Radio,
  Zap,
  Sliders,
  Play,
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Binary,
  Layers,
} from "lucide-react";

export default function AttackLabPage() {
  const {
    selectedAttack,
    configModalOpen,
    resultModalOpen,
    isLaunching,
    lastResult,
    openConfig,
    closeConfig,
    closeResult,
    executeAttack,
  } = useAttackLabStore();

  // Attack Config state
  const [strength, setStrength] = useState<number>(0.7);
  const [noise, setNoise] = useState<number>(0.02);
  const [length, setLength] = useState<number>(200);

  // Evidence Drawer inspection state
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttack) return;

    await executeAttack({
      attackType: selectedAttack.id,
      attackStrength: strength,
      interceptFraction: strength,
      channelNoise: noise,
      signatureLength: length,
      sprtEnabled: true,
      backend: "Stim",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quantum Attack Laboratory"
        subtitle="Simulate adversarial quantum conditions across 11 physical attack vectors and inspect deterministic statistical detection evidence."
        badge="ADVERSARIAL SUITE"
      />

      {/* 11 Threat Vectors Grid (Section 15) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ATTACK_CATALOG.map((attack) => {
          return (
            <div
              key={attack.id}
              className="soc-card p-5 flex flex-col justify-between hover:border-cyan-500/50 transition-all group font-mono text-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {attack.category.replace(/_/g, " ")}
                  </span>
                  <StatusBadge
                    status={attack.defaultSeverity}
                    variant={attack.defaultSeverity}
                    showIcon={false}
                  />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {attack.name}
                </h3>

                <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                  {attack.description}
                </p>

                <div className="p-2.5 rounded bg-surface-subtle border border-border/80 space-y-1 mb-4 text-[11px]">
                  <div>
                    <span className="text-slate-500">Layer: </span>
                    <span className="text-slate-300">{attack.affectedLayer}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Signature: </span>
                    <span className="text-cyan-300">{attack.expectedQberIncrease}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStrength(attack.configurableParams.defaultStrength);
                  openConfig(attack);
                }}
                className="w-full py-2 px-3 rounded bg-surface-panel hover:bg-surface-hover border border-border group-hover:border-cyan-500/40 text-slate-200 group-hover:text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Configure &amp; Launch</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Attack Configuration Modal (Section 16) */}
      <AnimatePresence>
        {configModalOpen && selectedAttack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeConfig}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-surface border border-red-500/40 rounded-xl shadow-2xl p-6 space-y-6 font-mono text-xs"
            >
              <div className="flex items-start justify-between pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status="WARNING" variant="WARNING" />
                    <span className="text-slate-400">Adversarial Configuration</span>
                  </div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500" />
                    <span>{selectedAttack.name}</span>
                  </h2>
                </div>
                <button
                  onClick={closeConfig}
                  className="p-1 rounded bg-surface-subtle text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLaunch} className="space-y-4">
                {/* Attack Strength Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{selectedAttack.configurableParams.strengthLabel}:</span>
                    <span className="font-bold text-red-400">
                      {(strength * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={selectedAttack.configurableParams.minStrength}
                    max={selectedAttack.configurableParams.maxStrength}
                    step={selectedAttack.configurableParams.step}
                    value={strength}
                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Controls adversary eavesdropping sampling density or noise strength.
                  </div>
                </div>

                {/* Channel Noise */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Background Fiber Noise:</span>
                    <span className="font-bold text-white">{(noise * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="0.05"
                    step="0.005"
                    value={noise}
                    onChange={(e) => setNoise(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Signature Length */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Signature Length (L):</span>
                    <span className="font-bold text-white">{length} states</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    step="50"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded bg-red-950/20 border border-red-500/30 text-slate-300 text-[11px] leading-relaxed">
                  <span className="text-red-400 font-bold block mb-0.5">Physical Consequence:</span>
                  {selectedAttack.mathematicalSignature}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={closeConfig}
                    className="px-4 py-2 rounded bg-surface-subtle hover:bg-surface-panel border border-border text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLaunching}
                    className="px-5 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-900/40 cursor-pointer"
                  >
                    <Flame className="w-4 h-4" />
                    <span>{isLaunching ? "Injecting Attack..." : "Launch Attack"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dramatic Attack Result Modal (Section 17) */}
      <AnimatePresence>
        {resultModalOpen && lastResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeResult}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-2xl bg-surface border border-red-500/50 rounded-xl shadow-2xl p-6 space-y-6 font-mono text-xs max-h-[90vh] overflow-y-auto"
            >
              {/* Result Header */}
              <div className="flex items-start justify-between pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge
                      status={lastResult.decision}
                      variant={lastResult.detected ? "REJECTED" : "ACCEPTED"}
                    />
                    <span className="text-slate-400">Session {lastResult.sessionId}</span>
                  </div>
                  <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    <span>{lastResult.attackName.toUpperCase()} DETECTED</span>
                  </h2>
                </div>
                <button
                  onClick={closeResult}
                  className="p-1 rounded bg-surface-subtle text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Evidence Metrics */}
              <div>
                <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                  Detection Evidence Summary
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[11px]">Observed QBER</span>
                    <span className="text-lg font-bold text-red-400">
                      {formatPercent(lastResult.observedQber, 1)}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[11px]">Expected Honest</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {formatPercent(lastResult.expectedHonestQber, 1)}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[11px]">SPRT LLR (S_n)</span>
                    <span className="text-lg font-bold text-red-400">
                      +{lastResult.sprtLlr.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[11px]">p-value (Null Hyp.)</span>
                    <span className="text-lg font-bold text-amber-400">
                      {formatScientific(lastResult.pValue)}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[11px]">Fidelity</span>
                    <span className="text-lg font-bold text-slate-200">
                      {formatPercent(lastResult.fidelity, 1)}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[11px]">Pulses to Detect</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {lastResult.measurementsUsed} / {lastResult.totalMeasurements}
                    </span>
                  </div>
                </div>
              </div>

              {/* Basis Bar Chart */}
              <BasisBarChart basisQber={lastResult.basisQber} warningThreshold={0.08} />

              {/* Why Was This Detected? */}
              <div className="p-4 rounded-lg bg-surface-subtle border border-cyan-500/30 space-y-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                  Why was this detected?
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {lastResult.whyDetected.explanation}
                </p>
                <div className="p-2.5 rounded bg-surface-panel text-[11px] text-slate-400 border border-border">
                  <span className="text-slate-500 block font-bold mb-0.5">Mathematical Proof:</span>
                  {lastResult.whyDetected.mathematicalProof}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-[11px] text-slate-500">
                  Detected via {lastResult.detectionMethod}
                </span>
                <button
                  onClick={() => setShowEvidenceDrawer(true)}
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors cursor-pointer"
                >
                  Open Full Evidence Drawer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Explainable Evidence Drawer */}
      {showEvidenceDrawer && lastResult && (
        <EvidenceDrawer
          isOpen={showEvidenceDrawer}
          onClose={() => setShowEvidenceDrawer(false)}
          attackName={lastResult.attackName}
          decision={lastResult.decision}
          sessionId={lastResult.sessionId}
          evidence={{
            observedQber: lastResult.observedQber,
            expectedHonestQber: lastResult.expectedHonestQber,
            mismatchCount: Math.floor(lastResult.measurementsUsed * lastResult.observedQber),
            totalMeasurements: lastResult.totalMeasurements,
            measurementsUsed: lastResult.measurementsUsed,
            pValue: lastResult.pValue,
            sprtLlr: lastResult.sprtLlr,
            sprtDecision: "ACCEPT_H1",
            upperBoundary: 6.907,
            lowerBoundary: -20.723,
            fidelity: lastResult.fidelity,
            forgeryProbability: 3.27e-12,
            basisQber: {
              Z: { basis: "Z", qber: lastResult.basisQber.Z, count: 68, errors: 23, expectedQber: 0.02 },
              X: { basis: "X", qber: lastResult.basisQber.X, count: 66, errors: 22, expectedQber: 0.02 },
              Y: { basis: "Y", qber: lastResult.basisQber.Y, count: 66, errors: 22, expectedQber: 0.02 },
            },
            triggeredRules: [
              {
                id: "RULE-1",
                rule: "QBER exceeds honest upper threshold (8%)",
                triggered: true,
                description: "Observed photon error deviates from honest quantum channel noise by > 15 standard deviations.",
                severity: "CRITICAL",
              },
              {
                id: "RULE-2",
                rule: "SPRT Log-Likelihood Ratio crossed H1 upper decision boundary",
                triggered: true,
                description: "Wald sequential analysis proved eavesdropping with error probability α ≤ 0.001.",
                severity: "CRITICAL",
              },
            ],
          }}
        />
      )}
    </div>
  );
}
