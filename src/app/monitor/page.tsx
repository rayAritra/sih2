"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSessions } from "@/hooks/useSessions";
import { useMetrics } from "@/hooks/useMetrics";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { QuantumSession } from "@/types";
import { interceptResendSession } from "@/data/demo-fixtures";
import { cn, formatPercent } from "@/lib/utils";
import {
  Radio,
  Workflow,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Server,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

const PIPELINE_NODES = [
  "Signer (Alice)",
  "Entanglement (EPR)",
  "Quantum Channel",
  "Bell Measurement",
  "Pauli Correction",
  "Verification (Bob)",
];

export default function LiveMonitorPage() {
  const { data: sessions = [] } = useSessions();
  const { metrics } = useMetrics();
  const [inspectingSession, setInspectingSession] = useState<QuantumSession | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Quantum Monitor"
        subtitle="Real-time session traffic across teleportation pipeline stages and statistical verification boundaries."
        badge="TELEMETRY STREAM"
      >
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">Continuous Channel Tomography Active</span>
        </div>
      </PageHeader>

      {/* Top: System Health Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="soc-card p-4">
          <span className="text-xs font-mono text-slate-400 block mb-1">Optical Channel Integrity</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {formatPercent(metrics.channelIntegrity, 1)}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Fiber attenuation: 0.18 dB/km</span>
        </div>
        <div className="soc-card p-4">
          <span className="text-xs font-mono text-slate-400 block mb-1">Concurrent Sessions</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">{metrics.activeSessions}</span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Multi-user QDS multiplexing</span>
        </div>
        <div className="soc-card p-4">
          <span className="text-xs font-mono text-slate-400 block mb-1">Current QBER Drift</span>
          <span className="text-2xl font-bold font-mono text-slate-200">
            {formatPercent(metrics.currentQber, 2)}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Threshold limit: 8.0%</span>
        </div>
        <div className="soc-card p-4">
          <span className="text-xs font-mono text-slate-400 block mb-1">SPRT Verification Engine</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">Deterministic</span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Sequential hypothesis test</span>
        </div>
      </div>

      {/* Pipeline Stage Architecture Overview */}
      <div className="soc-card p-5 bg-tech-grid">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 font-semibold">
          Teleportation-Based QDS Protocol Pipeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          {PIPELINE_NODES.map((node, idx) => (
            <div
              key={node}
              className="p-3 rounded bg-surface-subtle/80 border border-border flex flex-col items-center justify-center text-center relative"
            >
              <span className="text-[10px] text-cyan-400 font-bold mb-1">STAGE 0{idx + 1}</span>
              <span className="font-semibold text-slate-200 text-xs">{node}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Live Session Traffic */}
      <div className="soc-card p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/80">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Active Signature Sessions
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live teleportation progress, mismatch counts, and SPRT decision points
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {sessions.length} active sessions
          </span>
        </div>

        <div className="space-y-3">
          {sessions.map((session, index) => {
            const isAccepted = session.decision === "ACCEPTED";
            const isRejected = session.decision === "REJECTED";
            const progress =
              session.sprt?.stoppedAtStep && session.signatureLength
                ? (session.sprt.stoppedAtStep / session.signatureLength) * 100
                : 100;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-surface-subtle/70 border border-border/80 hover:border-slate-600 transition-all font-mono text-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Identity and Message */}
                  <div className="space-y-1.5 min-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{session.id}</span>
                      <StatusBadge
                        status={session.status}
                        variant={
                          isAccepted
                            ? "ACCEPTED"
                            : isRejected
                            ? "REJECTED"
                            : "ACTIVE"
                        }
                      />
                    </div>
                    <div className="text-slate-400 text-xs flex items-center gap-2">
                      <span>{session.signer}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span>{session.verifier}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-slate-500 text-[11px]">Digest:</span>
                      <HashDisplay hash={session.messageHash} start={6} end={6} />
                    </div>
                  </div>

                  {/* Middle: Progress Bar & Measurement Count */}
                  <div className="flex-1 max-w-md space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Verification Progress</span>
                      <span className="text-slate-200">
                        {session.sprt?.stoppedAtStep || session.signatureLength} / {session.signatureLength} pulses
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 border border-border overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isRejected ? "bg-red-500" : isAccepted ? "bg-emerald-500" : "bg-cyan-500"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Mismatches: {session.mismatchCount}</span>
                      <span>Threshold: t={session.threshold}</span>
                    </div>
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0">
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">Observed QBER</span>
                      <span
                        className={cn(
                          "font-bold text-sm",
                          session.qber > 0.08 ? "text-red-400" : "text-emerald-400"
                        )}
                      >
                        {formatPercent(session.qber, 1)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">Fidelity</span>
                      <span className="font-bold text-slate-200 text-sm">
                        {formatPercent(session.fidelity, 1)}
                      </span>
                    </div>

                    {session.evidence && (
                      <button
                        onClick={() => setInspectingSession(session)}
                        className="px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
                      >
                        Evidence
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Evidence Drawer */}
      {inspectingSession && inspectingSession.evidence && (
        <EvidenceDrawer
          isOpen={Boolean(inspectingSession)}
          onClose={() => setInspectingSession(null)}
          attackName={inspectingSession.threatDetected || "Adversarial State Perturbation"}
          decision={inspectingSession.decision || "SIGNATURE REJECTED"}
          sessionId={inspectingSession.id}
          evidence={inspectingSession.evidence}
        />
      )}
    </div>
  );
}
