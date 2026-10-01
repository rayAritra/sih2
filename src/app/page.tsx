"use client";

import React, { useState } from "react";
import { useSystemStore } from "@/stores/useSystemStore";
import { useMetrics } from "@/hooks/useMetrics";
import { SecurityHero } from "@/components/ui/SecurityHero";
import { MetricCard } from "@/components/ui/MetricCard";
import { LiveQBERChart } from "@/components/charts/LiveQBERChart";
import { ProbabilityDisplay } from "@/components/ui/ProbabilityDisplay";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { interceptResendSession } from "@/data/demo-fixtures";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Clock,
  Radio,
  FileCheck,
  AlertTriangle,
  Flame,
  ChevronRight,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/utils";

// Live Security Events from Prompt Section 10
interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  severity: "INFO" | "VERIFIED" | "WARNING" | "CRITICAL";
  details: string;
  hasEvidence?: boolean;
}

const INITIAL_EVENTS: TimelineEvent[] = [
  {
    id: "evt-7",
    time: "14:32:10",
    title: "AUDIT EVENT COMMITTED",
    severity: "INFO",
    details: "Block #10482 sealed on tamper-evident ledger with SHA-256 digest.",
  },
  {
    id: "evt-6",
    time: "14:32:10",
    title: "SESSION REJECTED",
    severity: "CRITICAL",
    details: "QDS-8F92A signature transmission aborted; verifier Bob notified.",
    hasEvidence: true,
  },
  {
    id: "evt-5",
    time: "14:32:09",
    title: "INTERCEPT-RESEND DETECTED",
    severity: "CRITICAL",
    details: "Wavefunction collapse signature confirmed. Conjugate error = 33.7%.",
    hasEvidence: true,
  },
  {
    id: "evt-4",
    time: "14:32:09",
    title: "SPRT BOUNDARY CROSSED",
    severity: "CRITICAL",
    details: "LLR score +18.72 crossed upper decision boundary H1 at pulse #74.",
    hasEvidence: true,
  },
  {
    id: "evt-3",
    time: "14:32:08",
    title: "QBER DEVIATION DETECTED",
    severity: "WARNING",
    details: "Consecutive pulse mismatches exceeded binomial 3σ confidence interval.",
  },
  {
    id: "evt-2",
    time: "14:32:04",
    title: "SESSION INITIALIZED",
    severity: "INFO",
    details: "Alice and Bob negotiated EPR distribution seed for 200 qubit states.",
  },
  {
    id: "evt-1",
    time: "14:32:01",
    title: "SIGNATURE VERIFIED",
    severity: "VERIFIED",
    details: "Session QDS-3C19F accepted. QBER: 0.8%, P_f: 1.1 × 10⁻¹⁵.",
  },
];

export default function SOCDashboardPage() {
  const { metrics } = useMetrics();
  const systemAlertActive = useSystemStore((s) => s.systemAlertActive);
  const resetSecurityState = useSystemStore((s) => s.resetSecurityState);

  // Evidence Drawer state
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              Quantum Security Operations
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
              LIVE SOC
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Real-time monitoring and statistical threat analysis for teleportation-based quantum digital signatures.
          </p>
        </div>

        {/* Global status banner */}
        <div className="flex items-center gap-3">
          <StatusBadge
            status={systemAlertActive ? "ATTACK DETECTED" : "SYSTEM SECURE"}
            variant={systemAlertActive ? "ATTACK" : "SECURE"}
          />
        </div>
      </div>

      {/* Security Status Hero (Section 7) */}
      <SecurityHero
        status={metrics.systemStatus}
        channelIntegrity={metrics.channelIntegrity}
        qber={metrics.currentQber}
        fidelity={metrics.entanglementFidelity}
        activeSessions={metrics.activeSessions}
        threatLevel={systemAlertActive ? "CRITICAL" : "LOW"}
        onResetAttack={systemAlertActive ? resetSecurityState : undefined}
      />

      {/* High-Value Metric Cards (Section 6) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Sessions"
          value={metrics.activeSessions}
          subtitle="Concurrent links"
          change="+2 vs last hr"
          trend="up"
          icon={Radio}
          sparklineData={[8, 9, 10, 11, 10, 12]}
        />
        <MetricCard
          title="Signatures Verified"
          value={formatNumber(metrics.signaturesVerified, 0)}
          subtitle="All-time throughput"
          change="99.98% valid"
          trend="up"
          icon={FileCheck}
          sparklineData={[18200, 18310, 18390, 18450, 18492]}
        />
        <MetricCard
          title="Threats Detected"
          value={metrics.threatsDetected}
          subtitle="Deterministic aborts"
          change={systemAlertActive ? "+1 Active Alert" : "0 in last 10m"}
          trend={systemAlertActive ? "down" : "neutral"}
          variant={systemAlertActive ? "attack" : "default"}
          icon={ShieldAlert}
          sparklineData={[142, 143, 145, 146, 147]}
        />
        <MetricCard
          title="Current QBER"
          value={formatPercent(metrics.currentQber, 2)}
          subtitle="Threshold: 8.0%"
          change={metrics.currentQber > 0.08 ? "VIOLATION" : "Optimal"}
          trend={metrics.currentQber > 0.08 ? "down" : "up"}
          variant={metrics.currentQber > 0.08 ? "attack" : "secure"}
          icon={Activity}
          sparklineData={[0.02, 0.021, 0.019, 0.022, metrics.currentQber]}
        />

        <MetricCard
          title="Entanglement Fidelity"
          value={formatPercent(metrics.entanglementFidelity, 1)}
          subtitle="Target: >95.0%"
          change="EPR state quality"
          trend="up"
          variant="secure"
          icon={Zap}
        />
        <MetricCard
          title="Forgery Probability"
          value="3.2 × 10⁻¹²"
          subtitle="Theoretical bound"
          change="L=200, t=20"
          trend="up"
          variant="cyan"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Avg Detection Time"
          value={`${metrics.averageDetectionTimeMs} ms`}
          subtitle="Real-time latency"
          change="Near wire-speed"
          trend="neutral"
          icon={Clock}
        />
        <MetricCard
          title="SPRT Savings"
          value={`${metrics.sprtSavingsPercentage}%`}
          subtitle="Pulse reduction"
          change="126 pulses saved"
          trend="up"
          variant="secure"
          icon={Zap}
        />
      </div>

      {/* Main Grid: Live QBER Chart + Forgery Probability & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveQBERChart />
        </div>
        <div>
          <ProbabilityDisplay
            probability={metrics.forgeryProbability}
            length={200}
            threshold={20}
            attackerError={0.33}
          />
        </div>
      </div>

      {/* Live Security Event Feed (Section 10) */}
      <div className="soc-card p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Live Security Event Timeline
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border text-slate-400">
                AUDITED LOG STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Click any event to inspect deterministic quantum evidence drawer
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/40 font-mono text-xs">
          {INITIAL_EVENTS.map((evt) => (
            <div
              key={evt.id}
              onClick={() => evt.hasEvidence && setSelectedEvent(evt)}
              className={`py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded transition-colors ${
                evt.hasEvidence ? "hover:bg-surface-subtle cursor-pointer group" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-mono text-[11px] shrink-0">
                  {evt.time}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider uppercase shrink-0 ${
                    evt.severity === "CRITICAL"
                      ? "bg-red-950/60 border-red-500/50 text-red-400"
                      : evt.severity === "WARNING"
                      ? "bg-amber-950/60 border-amber-500/50 text-amber-400"
                      : evt.severity === "VERIFIED"
                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400"
                      : "bg-surface-panel border-border text-slate-400"
                  }`}
                >
                  {evt.title}
                </span>

                <span className="text-slate-300 text-xs truncate max-w-lg">
                  {evt.details}
                </span>
              </div>

              {evt.hasEvidence && (
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs shrink-0 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Evidence</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explainable Evidence Drawer Modal */}
      {selectedEvent && (
        <EvidenceDrawer
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          attackName="Intercept-Resend Eavesdropping"
          decision="SIGNATURE REJECTED"
          sessionId="QDS-8F92A"
          evidence={interceptResendSession.evidence!}
        />
      )}
    </div>
  );
}
