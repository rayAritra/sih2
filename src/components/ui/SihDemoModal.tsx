"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore, DEMO_SCENARIOS } from "@/stores/useDemoStore";
import { StatusBadge } from "./StatusBadge";
import { cn, formatPercent } from "@/lib/utils";
import {
  X,
  Play,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Radio,
} from "lucide-react";

export function SihDemoModal() {
  const {
    isOpen,
    closeDemo,
    activeScenarioIndex,
    currentStep,
    isStepRunning,
    selectScenario,
    runGuidedFlow,
    nextScenario,
    prevScenario,
  } = useDemoStore();

  if (!isOpen) return null;

  const current = DEMO_SCENARIOS[activeScenarioIndex];

  const steps = [
    { num: 1, title: "State Preparation", desc: "Generating 200 secret qubit states across Z, X, Y bases" },
    { num: 2, title: "Entanglement Setup", desc: "Distributing EPR pairs |Φ⁺⟩ between Alice & Verifier nodes" },
    { num: 3, title: "Teleportation Link", desc: "Alice performs joint Bell projection & transmits classical bits" },
    { num: 4, title: "Pauli & Projective", desc: "Bob applies unitary correction and measures in conjugate basis" },
    { num: 5, title: "Statistical Test", desc: "Real-time Sequential Probability Ratio Test (SPRT) evaluation" },
    { num: 6, title: "Deterministic Decision", desc: "Mathematical settlement on blockchain audit ledger" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDemo}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-surface border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-border bg-surface-subtle/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold font-mono text-white">
                    SIH Demonstration Mode
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
                    SIH26141 JURY WORKFLOW
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Guided end-to-end evaluation scenarios for teleportation-based quantum digital signatures
                </p>
              </div>
            </div>
            <button
              onClick={closeDemo}
              className="p-1.5 rounded-lg bg-surface-panel hover:bg-surface-hover border border-border text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scenario Selector Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-border bg-surface-panel/40 p-2 gap-1 text-xs font-mono">
            {DEMO_SCENARIOS.map((sc, idx) => {
              const isSelected = idx === activeScenarioIndex;
              return (
                <button
                  key={sc.id}
                  onClick={() => selectScenario(idx)}
                  className={cn(
                    "p-2 rounded text-left transition-all border cursor-pointer",
                    isSelected
                      ? "bg-cyan-950/70 border-cyan-500/60 text-white shadow-sm"
                      : "bg-surface-subtle/60 border-border/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] text-cyan-400">{sc.number}</span>
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        sc.expectedResult === "ACCEPTED" ? "bg-emerald-400" : "bg-red-400"
                      )}
                    />
                  </div>
                  <div className="truncate font-semibold text-[11px]">{sc.title}</div>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Active Scenario Card */}
            <div className="p-5 rounded-lg bg-surface-subtle border border-border/80 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      SCENARIO {current.number}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400">{current.threatClass}</span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white">{current.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">{current.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <StatusBadge
                    status={current.expectedResult}
                    variant={current.expectedResult === "ACCEPTED" ? "ACCEPTED" : "REJECTED"}
                  />
                </div>
              </div>

              <div className="p-3 rounded bg-surface-panel/80 border border-border/60 text-xs font-mono text-slate-300">
                <span className="text-cyan-300 font-semibold block mb-0.5">Jury Evaluation Takeaway:</span>
                {current.keyTakeaway}
              </div>
            </div>

            {/* 6-Step Guided Flow Progression */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Pipeline Execution Steps
                </span>
                <span className="text-cyan-400">
                  {currentStep === 0
                    ? "Ready to run"
                    : currentStep === 6
                    ? "Execution Finished"
                    : `Running Step ${currentStep} of 6`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
                {steps.map((step) => {
                  const isDone = currentStep > step.num;
                  const isCurrent = currentStep === step.num;
                  const isPending = currentStep < step.num;

                  return (
                    <div
                      key={step.num}
                      className={cn(
                        "p-3 rounded border transition-all relative overflow-hidden",
                        isDone
                          ? "bg-emerald-950/20 border-emerald-500/40 text-slate-200"
                          : isCurrent
                          ? "bg-cyan-950/40 border-cyan-500 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                          : "bg-surface-subtle/50 border-border/60 text-slate-500"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[10px] text-slate-400">
                          STEP 0{step.num}
                        </span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {isCurrent && <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
                      </div>
                      <div className="font-bold text-[11px] mb-0.5">{step.title}</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result Snapshot upon Step 6 */}
            {currentStep === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-lg border text-xs font-mono",
                  current.expectedResult === "ACCEPTED"
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    : "bg-red-950/30 border-red-500/40 text-red-300"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                    {current.expectedResult === "ACCEPTED" ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                    )}
                    Outcome: {current.expectedResult}
                  </span>
                  <span>Observed QBER: {formatPercent(current.sessionData.qber, 1)}</span>
                </div>
                <div className="text-slate-300 text-xs">
                  {current.expectedResult === "ACCEPTED"
                    ? `Signature verified with ${current.sessionData.mismatchCount} mismatches out of ${current.sessionData.signatureLength}. SPRT accepted honest hypothesis H0.`
                    : `Eavesdropping anomaly identified. SPRT crossed H1 decision boundary with LLR ${current.sessionData.evidence?.sprtLlr || "+18.72"}. Signature aborted.`}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-border bg-surface-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={prevScenario}
                disabled={isStepRunning}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-xs font-mono text-slate-300 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={nextScenario}
                disabled={isStepRunning}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-xs font-mono text-slate-300 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                <span>Next Scenario</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={runGuidedFlow}
              disabled={isStepRunning}
              className="flex items-center gap-2 px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isStepRunning ? "Simulating Pipeline..." : "Run Guided Demo"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
