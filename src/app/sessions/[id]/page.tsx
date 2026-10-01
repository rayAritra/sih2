"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/hooks/useSessions";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { QuantumStateBadge } from "@/components/ui/QuantumStateBadge";
import { SPRTChart } from "@/components/charts/SPRTChart";
import { BasisBarChart } from "@/components/charts/BasisBarChart";
import { MeasurementRecord } from "@/types";
import { cn, formatPercent, formatScientific } from "@/lib/utils";
import {
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Sparkles,
  Zap,
  Radio,
  FileCheck,
  Scale,
} from "lucide-react";

export default function SessionDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "QDS-8F92A";

  const { data: session } = useSession(id);
  const [activeTab, setActiveTab] = useState<
    "overview" | "measurements" | "statistics" | "threat" | "audit"
  >("measurements");

  // Selected measurement for explorer modal/details
  const [selectedRecord, setSelectedRecord] = useState<MeasurementRecord | null>(null);

  if (!session) {
    return <div className="p-8 font-mono text-xs text-slate-400">Loading session telemetry...</div>;
  }

  const isAccepted = session.decision === "ACCEPTED";
  const isRejected = session.decision === "REJECTED";
  const measurements = session.measurements || [];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between pb-2">
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sessions</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">Backend Simulator:</span>
          <span className="text-cyan-400 font-bold">{session.backend}</span>
        </div>
      </div>

      {/* Header Banner (Section 23) */}
      <div className="soc-card p-6 relative overflow-hidden bg-tech-grid">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold font-mono text-white">
                Session {session.id}
              </h1>
              <StatusBadge
                status={session.decision || session.status}
                variant={isAccepted ? "ACCEPTED" : "REJECTED"}
              />
            </div>
            <div className="text-slate-400 text-xs flex items-center gap-3">
              <span>Signer: {session.signer}</span>
              <span className="text-slate-600">•</span>
              <span>Verifier: {session.verifier}</span>
              <span className="text-slate-600">•</span>
              <span>Started: {session.startedAt.slice(11, 19)} UTC</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Message Digest:</span>
            <HashDisplay hash={session.messageHash} start={8} end={8} />
          </div>
        </div>

        {/* Telemetry Strip (Section 23) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 text-center">
          <div className="p-2.5 rounded bg-surface-subtle border border-border">
            <span className="text-[10px] text-slate-500 block mb-0.5">Signature (L)</span>
            <span className="text-base font-bold text-white">{session.signatureLength}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border">
            <span className="text-[10px] text-slate-500 block mb-0.5">Threshold (t)</span>
            <span className="text-base font-bold text-amber-400">{session.threshold}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border">
            <span className="text-[10px] text-slate-500 block mb-0.5">Observed QBER</span>
            <span
              className={cn(
                "text-base font-bold",
                session.qber > 0.08 ? "text-red-400" : "text-emerald-400"
              )}
            >
              {formatPercent(session.qber, 1)}
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border">
            <span className="text-[10px] text-slate-500 block mb-0.5">Fidelity</span>
            <span className="text-base font-bold text-slate-200">
              {formatPercent(session.fidelity, 1)}
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border">
            <span className="text-[10px] text-slate-500 block mb-0.5">Mismatches</span>
            <span className="text-base font-bold text-white">{session.mismatchCount}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border">
            <span className="text-[10px] text-slate-500 block mb-0.5">Execution Time</span>
            <span className="text-base font-bold text-cyan-400">
              {session.executionTimeMs} ms
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border">
            <span className="text-[10px] text-slate-500 block mb-0.5">SPRT Savings</span>
            <span className="text-base font-bold text-emerald-400">
              {session.sprt?.savingsPercentage || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-1 border-b border-border bg-surface-subtle/40 p-1 rounded-t-lg">
        {[
          { key: "measurements", label: "Measurement Explorer (Grid)" },
          { key: "statistics", label: "SPRT & Basis Statistics" },
          { key: "threat", label: "Deterministic Threat Evidence" },
          { key: "audit", label: "Audit Ledger Block" },
          { key: "overview", label: "Protocol Summary" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              "px-4 py-2 rounded transition-colors uppercase font-bold text-xs cursor-pointer",
              activeTab === tab.key
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface-panel"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Measurement Explorer (Section 24) */}
      {activeTab === "measurements" && (
        <div className="soc-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Quantum Measurement Matrix Explorer
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Click any position to inspect basis, Bell measurement bits, Pauli correction, and outcome.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500 text-[10px] flex items-center justify-center text-emerald-400">✓</span>
                <span className="text-slate-300">Match</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-950 border border-red-500 text-[10px] flex items-center justify-center text-red-400">✕</span>
                <span className="text-slate-300">Mismatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700 text-[10px] flex items-center justify-center text-slate-500">•</span>
                <span className="text-slate-500">Unused (Early-Stop)</span>
              </div>
            </div>
          </div>

          {/* 200 Positions Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-1.5">
            {measurements.map((rec) => {
              const isSelected = selectedRecord?.position === rec.position;
              const isUnused =
                session.sprt?.stoppedAtStep && rec.position > session.sprt.stoppedAtStep;

              return (
                <button
                  key={rec.position}
                  onClick={() => setSelectedRecord(rec)}
                  className={cn(
                    "p-1.5 rounded border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                    isSelected
                      ? "ring-2 ring-cyan-400 scale-105 z-10"
                      : "",
                    isUnused
                      ? "bg-slate-950/60 border-slate-800 text-slate-600 hover:border-slate-600"
                      : rec.match
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40"
                      : "bg-red-950/50 border-red-500/50 text-red-400 hover:bg-red-900/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                  )}
                  title={`Pulse #${rec.position}: ${rec.match ? "Match" : "Mismatch"}`}
                >
                  <span className="text-[9px] font-bold opacity-75">
                    {rec.position.toString().padStart(3, "0")}
                  </span>
                  <span className="text-xs font-extrabold">
                    {isUnused ? "•" : rec.match ? "✓" : "✕"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Position Detail Card */}
          {selectedRecord ? (
            <div className="p-4 rounded-lg bg-surface-subtle border border-cyan-500/40 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="p-2.5 rounded bg-surface-panel border border-border">
                <span className="text-[10px] text-slate-500 block mb-0.5">Position</span>
                <span className="text-base font-bold text-cyan-400">
                  #{selectedRecord.position.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="p-2.5 rounded bg-surface-panel border border-border">
                <span className="text-[10px] text-slate-500 block mb-0.5">Basis</span>
                <span className="text-base font-bold text-white">{selectedRecord.basis}</span>
              </div>

              <div className="p-2.5 rounded bg-surface-panel border border-border">
                <span className="text-[10px] text-slate-500 block mb-0.5">Expected State</span>
                <QuantumStateBadge state={selectedRecord.expectedState} basis={selectedRecord.basis} size="sm" />
              </div>

              <div className="p-2.5 rounded bg-surface-panel border border-border">
                <span className="text-[10px] text-slate-500 block mb-0.5">Bell Bits (b1, b2)</span>
                <span className="text-base font-bold text-slate-200">{selectedRecord.bellResult}</span>
              </div>

              <div className="p-2.5 rounded bg-surface-panel border border-border">
                <span className="text-[10px] text-slate-500 block mb-0.5">Pauli Correction</span>
                <span className="text-base font-bold text-cyan-300">σ_{selectedRecord.correction}</span>
              </div>

              <div className="p-2.5 rounded bg-surface-panel border border-border">
                <span className="text-[10px] text-slate-500 block mb-0.5">Measured State</span>
                <QuantumStateBadge state={selectedRecord.measuredState} basis={selectedRecord.basis} size="sm" />
              </div>

              <div className="p-2.5 rounded bg-surface-panel border border-border flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 block mb-0.5">Outcome</span>
                <span
                  className={cn(
                    "text-xs font-bold uppercase",
                    selectedRecord.match ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {selectedRecord.match ? "MATCH (0)" : "MISMATCH (1)"}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded bg-surface-subtle/60 border border-border text-center text-slate-500">
              Click any position in the 200-pulse matrix to inspect individual Bell states, Pauli corrections, and projective outcomes.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Statistics & SPRT Visualizer (Section 25) */}
      {activeTab === "statistics" && (
        <div className="space-y-6">
          {session.sprt && (
            <SPRTChart
              sprtData={session.sprt}
              attackName={session.threatDetected || "Quantum Eavesdropping"}
            />
          )}

          {session.evidence && (
            <BasisBarChart
              basisQber={{
                Z: session.evidence.basisQber.Z.qber,
                X: session.evidence.basisQber.X.qber,
                Y: session.evidence.basisQber.Y.qber,
              }}
              warningThreshold={0.08}
            />
          )}
        </div>
      )}

      {/* TAB 3: Threat Evidence (Section 19) */}
      {activeTab === "threat" && session.evidence && (
        <div className="soc-card p-6 space-y-6">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Deterministic Threat Analysis
              </span>
              <h3 className="text-lg font-bold text-white">
                {session.threatDetected || "Honest Channel Verification"}
              </h3>
            </div>
            <StatusBadge
              status={session.decision || "REJECTED"}
              variant={isAccepted ? "ACCEPTED" : "REJECTED"}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-surface-subtle border border-border">
              <span className="text-slate-500 block text-[11px]">Observed QBER</span>
              <span className="text-base font-bold text-red-400">
                {formatPercent(session.evidence.observedQber, 2)}
              </span>
            </div>
            <div className="p-3 rounded bg-surface-subtle border border-border">
              <span className="text-slate-500 block text-[11px]">Expected Honest QBER</span>
              <span className="text-base font-bold text-emerald-400">
                {formatPercent(session.evidence.expectedHonestQber, 2)}
              </span>
            </div>
            <div className="p-3 rounded bg-surface-subtle border border-border">
              <span className="text-slate-500 block text-[11px]">p-value (Null Hyp.)</span>
              <span className="text-base font-bold text-amber-400">
                {formatScientific(session.evidence.pValue)}
              </span>
            </div>
            <div className="p-3 rounded bg-surface-subtle border border-border">
              <span className="text-slate-500 block text-[11px]">SPRT LLR (S_n)</span>
              <span className="text-base font-bold text-red-400">
                +{session.evidence.sprtLlr.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Triggered Rules List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Evaluated Verification Rules
            </span>
            {session.evidence.triggeredRules.length === 0 ? (
              <div className="p-4 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All verification checks passed. No adversary rules triggered.</span>
              </div>
            ) : (
              session.evidence.triggeredRules.map((rule) => (
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
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Audit Trail */}
      {activeTab === "audit" && (
        <div className="soc-card p-6 space-y-4">
          <div className="pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tamper-Evident Ledger Commit
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographic SHA-256 state seal anchored to block ledger.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Block Number:</span>
              <span className="text-white font-bold">#10482</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Block Digest:</span>
              <HashDisplay hash="0x73ae991bf2840ac897d10e52b6140f7c9e01358a" start={8} end={8} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Merkle Root:</span>
              <HashDisplay hash="0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c" start={8} end={8} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Integrity Check:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED SEAL
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-border">
            Audit only — QDS security does not depend on the ledger. Quantum non-repudiation is unconditionally guaranteed by the teleportation protocol.
          </div>
        </div>
      )}

      {/* TAB 5: Overview Summary */}
      {activeTab === "overview" && (
        <div className="soc-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-border">
            Protocol Overview
          </h3>
          <p className="text-slate-300 leading-relaxed text-xs">
            Alice generated {session.signatureLength} quantum states drawn from mutually unbiased bases (Z, X, Y) and teleported them to Bob via EPR Bell pairs. Upon applying the feedforward Pauli unitary operators, Bob measured the states in conjugate bases.
          </p>
          <div className="p-3 rounded bg-surface-subtle border border-border text-xs text-slate-400">
            Final Verdict: <strong className={isAccepted ? "text-emerald-400" : "text-red-400"}>{session.decision}</strong>. Mismatch count: {session.mismatchCount} out of {session.signatureLength}. Observed QBER: {formatPercent(session.qber, 1)}.
          </div>
        </div>
      )}
    </div>
  );
}
