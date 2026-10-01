"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSimulatorStore } from "@/stores/useSimulatorStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuantumStateBadge } from "@/components/ui/QuantumStateBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PROTOCOL_STAGES } from "@/config/protocol";
import { cn, formatPercent } from "@/lib/utils";
import {
  Play,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  Sliders,
  Radio,
  ArrowDown,
  Atom,
} from "lucide-react";

export default function QuantumSimulatorPage() {
  const {
    isRunning,
    activeStageIndex,
    currentMeasurementIndex,
    totalMeasurements,
    mismatchCount,
    currentQber,
    sprtLlr,
    threshold,
    activeSession,
    activeRecord,
    startSimulation,
    resetSimulation,
    jumpToPosition,
  } = useSimulatorStore();

  // Local config form state
  const [message, setMessage] = useState("SIH-2026-QUANTUM-DIGITAL-SIGNATURE");
  const [length, setLength] = useState(200);
  const [noise, setNoise] = useState(0.02);
  const [thresholdInput, setThresholdInput] = useState(20);
  const [sprtEnabled, setSprtEnabled] = useState(true);
  const [backend, setBackend] = useState<"Stim" | "Demo">("Stim");

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    await startSimulation({
      message,
      signatureLength: length,
      channelNoise: noise,
      threshold: thresholdInput,
      backend,
      sprtEnabled,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teleportation-Based QDS Simulator"
        subtitle="Step-by-step physical simulation of Alice's state preparation, EPR Bell distribution, Pauli correction, and projective verification."
        badge="PHYSICS ENGINE: STIM"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={resetSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-xs font-mono text-slate-300 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </PageHeader>

      {/* Grid: Left Config Panel + Right Simulation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleRun} className="soc-card p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Simulation Parameters</span>
              </span>
              <span className="text-[10px] text-slate-500">v1.12 Clifford</span>
            </div>

            {/* Message input */}
            <div>
              <label className="text-slate-400 block mb-1">Contract / Message String</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isRunning}
                className="w-full px-3 py-2 rounded bg-surface-subtle border border-border text-white focus:border-cyan-400 transition-colors"
                placeholder="Contract string or hash"
              />
            </div>

            {/* Signature Length L */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Signature Length (L states):</span>
                <span className="text-white font-bold">{length}</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="25"
                value={length}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setLength(val);
                  setThresholdInput(Math.floor(val * 0.1));
                }}
                disabled={isRunning}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>50</span>
                <span>200 (Std)</span>
                <span>400</span>
              </div>
            </div>

            {/* Channel Noise (QBER Baseline) */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Fiber Channel Noise:</span>
                <span className="text-white font-bold">{(noise * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.00"
                max="0.10"
                step="0.005"
                value={noise}
                onChange={(e) => setNoise(parseFloat(e.target.value))}
                disabled={isRunning}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0.0% (Ideal)</span>
                <span>2.0% (Honest)</span>
                <span>10.0% (Noisy)</span>
              </div>
            </div>

            {/* Acceptance Threshold t */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Acceptance Threshold (t):</span>
                <span className="text-white font-bold">{thresholdInput} mismatches</span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.floor(length * 0.25)}
                value={thresholdInput}
                onChange={(e) => setThresholdInput(parseInt(e.target.value, 10))}
                disabled={isRunning}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Backend Selector & SPRT Toggle */}
            <div className="pt-2 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Simulation Backend:</span>
                <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded border border-border">
                  {(["Stim", "Demo"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBackend(b)}
                      className={cn(
                        "px-2.5 py-1 rounded transition-colors cursor-pointer",
                        backend === b
                          ? "bg-cyan-600 text-white font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-300 block font-semibold">Enable SPRT Early Stopping</span>
                  <span className="text-[10px] text-slate-500">Wald sequential analysis</span>
                </div>
                <input
                  type="checkbox"
                  checked={sprtEnabled}
                  onChange={(e) => setSprtEnabled(e.target.checked)}
                  disabled={isRunning}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isRunning}
              className="w-full py-2.5 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? "Simulating Quantum States..." : "Run Simulation"}</span>
            </button>
          </form>

          {/* Section 13: Quantum State Card */}
          {activeRecord && (
            <div className="soc-card p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">
                  Qubit Inspection
                </span>
                <span className="text-cyan-400 font-bold">
                  Pulse #{activeRecord.position.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-surface-subtle border border-border">
                  <span className="text-slate-500 block text-[11px] mb-1">Expected State</span>
                  <QuantumStateBadge state={activeRecord.expectedState} basis={activeRecord.basis} />
                </div>

                <div className="p-2.5 rounded bg-surface-subtle border border-border">
                  <span className="text-slate-500 block text-[11px] mb-1">Basis</span>
                  <span className="text-base font-bold text-white">{activeRecord.basis} Basis</span>
                </div>

                <div className="p-2.5 rounded bg-surface-subtle border border-border">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Bell Result (b1,b2)</span>
                  <span className="text-base font-bold text-slate-200">{activeRecord.bellResult}</span>
                </div>

                <div className="p-2.5 rounded bg-surface-subtle border border-border">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Pauli Correction</span>
                  <span className="text-base font-bold text-cyan-400">σ_{activeRecord.correction}</span>
                </div>

                <div className="p-2.5 rounded bg-surface-subtle border border-border">
                  <span className="text-slate-500 block text-[11px] mb-1">Measured State</span>
                  <QuantumStateBadge state={activeRecord.measuredState} basis={activeRecord.basis} />
                </div>

                <div className="p-2.5 rounded bg-surface-subtle border border-border flex flex-col justify-center">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Verification</span>
                  <span
                    className={cn(
                      "font-bold text-xs uppercase flex items-center gap-1",
                      activeRecord.match ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {activeRecord.match ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>MATCH</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>MISMATCH</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Main Quantum Protocol Pipeline Visualization */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 14: Verification Progress Telemetry Bar */}
          <div className="soc-card p-5 grid grid-cols-2 sm:grid-cols-5 gap-4 font-mono text-center">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Measurement</span>
              <span className="text-xl font-bold text-white">
                {currentMeasurementIndex} / {totalMeasurements}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Mismatches</span>
              <span
                className={cn(
                  "text-xl font-bold",
                  mismatchCount > threshold ? "text-red-400" : "text-slate-200"
                )}
              >
                {mismatchCount}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Current QBER</span>
              <span
                className={cn(
                  "text-xl font-bold",
                  currentQber > 0.08 ? "text-red-400" : "text-emerald-400"
                )}
              >
                {formatPercent(currentQber, 2)}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">SPRT LLR (S_n)</span>
              <span
                className={cn(
                  "text-xl font-bold",
                  sprtLlr >= 6.91 ? "text-red-400" : "text-cyan-400"
                )}
              >
                {sprtLlr > 0 ? `+${sprtLlr.toFixed(2)}` : sprtLlr.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Max Threshold (t)</span>
              <span className="text-xl font-bold text-amber-400">{threshold}</span>
            </div>
          </div>

          {/* Interactive Protocol Pipeline (Section 12) */}
          <div className="soc-card p-6 bg-tech-grid relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Atom className="w-4 h-4 text-cyan-400" />
                <span>Teleportation Pipeline Stages</span>
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {activeStageIndex === 0
                  ? "Standby"
                  : `Active Stage ${activeStageIndex} of 8`}
              </span>
            </div>

            {/* Stages Stack */}
            <div className="space-y-3 font-mono text-xs">
              {PROTOCOL_STAGES.map((stage, idx) => {
                const isActive = activeStageIndex === stage.order;
                const isCompleted = activeStageIndex > stage.order;

                return (
                  <React.Fragment key={stage.id}>
                    <motion.div
                      animate={{
                        scale: isActive ? 1.01 : 1,
                        borderColor: isActive ? "#00f0ff" : "#1e2c44",
                      }}
                      className={cn(
                        "p-4 rounded-lg border transition-all relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3",
                        isActive
                          ? "bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                          : isCompleted
                          ? "bg-surface-subtle/90 border-border"
                          : "bg-surface-subtle/40 border-border/40 text-slate-500"
                      )}
                    >
                      {/* Left: Stage identity */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[10px] text-cyan-400">
                            STAGE 0{stage.order}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-xs font-semibold">
                            {stage.actor}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white">{stage.shortName}</div>
                        <div className="text-slate-400 text-xs">{stage.description}</div>
                      </div>

                      {/* Right: Quantum State Math */}
                      <div className="shrink-0 p-2.5 rounded bg-surface-panel/80 border border-border/80 text-right min-w-[200px]">
                        <span className="text-[10px] text-slate-500 block mb-0.5">
                          Quantum Operation
                        </span>
                        <code className="text-xs text-cyan-300 font-bold block">
                          {stage.quantumOperation}
                        </code>
                      </div>
                    </motion.div>

                    {/* Thin connector arrow */}
                    {idx < PROTOCOL_STAGES.length - 1 && (
                      <div className="flex justify-center -my-1 text-slate-600">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
