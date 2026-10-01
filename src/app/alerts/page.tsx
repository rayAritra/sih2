"use client";

import React, { useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { SecurityAlert, AlertSeverity, ThreatCategory } from "@/types";
import { cn, formatPercent } from "@/lib/utils";
import {
  AlertTriangle,
  ShieldAlert,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ThreatAlertsPage() {
  const { data: alerts = [] } = useAlerts();

  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ThreatCategory | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filteredAlerts = alerts.filter((alert) => {
    if (categoryFilter !== "ALL" && alert.category !== categoryFilter) return false;
    if (severityFilter !== "ALL" && alert.severity !== severityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        alert.attackName.toLowerCase().includes(q) ||
        alert.sessionId.toLowerCase().includes(q) ||
        alert.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Threat Alerts & Anomaly Feed"
        subtitle="Audited deterministic threat notifications triggered by SPRT boundary crossing and quantum channel tomography."
        badge={`${filteredAlerts.length} ALERTS`}
      />

      {/* Filters and Search Bar */}
      <div className="soc-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by attack name, session ID, or summary..."
            className="w-full pl-9 pr-4 py-2 rounded bg-surface-subtle border border-border text-white focus:border-cyan-400 placeholder:text-slate-500 transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {(
            [
              "ALL",
              "FORGERY",
              "IMPERSONATION",
              "REPLAY",
              "CHANNEL_MANIPULATION",
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-2.5 py-1 rounded transition-colors uppercase text-[11px] cursor-pointer",
                categoryFilter === cat
                  ? "bg-cyan-600 text-white font-bold"
                  : "bg-surface-subtle text-slate-400 hover:text-slate-200 border border-border"
              )}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="soc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle border-b border-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">Severity</th>
                <th className="p-4">Attack Vector</th>
                <th className="p-4">Session</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">QBER</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No active threat alerts matching filter criteria. Quantum channels are operating within nominal boundaries.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="hover:bg-surface-subtle transition-colors cursor-pointer group"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={alert.severity} variant={alert.severity} />
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {alert.attackName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {alert.summary}
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold text-cyan-400">{alert.sessionId}</span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-slate-400">
                      {alert.timestamp}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "font-bold",
                          alert.qber > 0.08 ? "text-red-400" : "text-emerald-400"
                        )}
                      >
                        {formatPercent(alert.qber, 1)}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border uppercase",
                          alert.status === "ACTIVE"
                            ? "bg-red-950 border-red-500 text-red-400 animate-pulse"
                            : alert.status === "CONTAINED"
                            ? "bg-amber-950 border-amber-500 text-amber-400"
                            : "bg-surface-subtle border-border text-slate-400"
                        )}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlert(alert);
                        }}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold group-hover:translate-x-1 transition-transform cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainable Evidence Drawer Modal */}
      {selectedAlert && (
        <EvidenceDrawer
          isOpen={Boolean(selectedAlert)}
          onClose={() => setSelectedAlert(null)}
          attackName={selectedAlert.attackName}
          decision="SIGNATURE REJECTED"
          sessionId={selectedAlert.sessionId}
          evidence={selectedAlert.evidence}
        />
      )}
    </div>
  );
}
