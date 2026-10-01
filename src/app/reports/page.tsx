"use client";

import React, { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { SecurityReport } from "@/types";
import { cn, formatPercent, formatScientific } from "@/lib/utils";
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  X,
  Printer,
  Share2,
} from "lucide-react";

export default function ReportsPage() {
  const { data: reports = [] } = useReports();
  const [selectedReport, setSelectedReport] = useState<SecurityReport | null>(null);

  const handleExportJSON = (report: SecurityReport) => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.reportNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = (report: SecurityReport) => {
    // Print window triggers native browser PDF export cleanly
    setSelectedReport(report);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Compliance Reports"
        subtitle="Forensic QDS verification audit dossiers, mathematical threat proofs, and cryptographic non-repudiation reports."
        badge={`${reports.length} DOSSIERS`}
      />

      {/* Reports Table (Section 27) */}
      <div className="soc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle border-b border-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">Report Number</th>
                <th className="p-4">Session</th>
                <th className="p-4">Date / Time</th>
                <th className="p-4">Decision</th>
                <th className="p-4">Security Level</th>
                <th className="p-4">Threat Class</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {reports.map((report) => {
                const isAccepted = report.decision === "ACCEPTED";
                return (
                  <tr key={report.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="p-4 whitespace-nowrap font-bold text-white">
                      {report.reportNumber}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="text-cyan-400 font-bold">{report.sessionId}</span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-slate-400">
                      {report.generatedAt.slice(0, 10)} {report.generatedAt.slice(11, 16)} UTC
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge
                        status={report.decision}
                        variant={isAccepted ? "ACCEPTED" : "REJECTED"}
                      />
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border uppercase",
                          report.securityLevel === "MAXIMAL" || report.securityLevel === "STRONG"
                            ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                            : "bg-red-950 border-red-500 text-red-400"
                        )}
                      >
                        {report.securityLevel}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {report.threatDetected ? (
                        <span className="text-red-400 font-semibold">{report.threatDetected}</span>
                      ) : (
                        <span className="text-slate-500">None (Legitimate)</span>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="View Full Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleExportPDF(report)}
                          className="p-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Export PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleExportJSON(report)}
                          className="p-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Export JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Report Viewer Modal (Section 27) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] bg-surface border border-cyan-500/40 rounded-xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
            {/* Header */}
            <div className="p-5 border-b border-border bg-surface-subtle flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-cyan-400 font-bold">{selectedReport.reportNumber}</span>
                  <StatusBadge
                    status={selectedReport.decision}
                    variant={selectedReport.decision === "ACCEPTED" ? "ACCEPTED" : "REJECTED"}
                  />
                </div>
                <h2 className="text-base font-bold text-white">Quantum Security Audit Dossier</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportPDF(selectedReport)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-slate-200 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => handleExportJSON(selectedReport)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-slate-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dossier Body (Section 27) */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* 1. Executive Summary */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  1. Executive Summary
                </h3>
                <p className="text-slate-300 leading-relaxed p-4 rounded bg-surface-subtle border border-border">
                  {selectedReport.executiveSummary}
                </p>
              </div>

              {/* 2. Session & Backend Information */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  2. Session Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">Session ID</span>
                    <span className="text-white font-bold">{selectedReport.sessionId}</span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">Signature Length</span>
                    <span className="text-white font-bold">
                      {selectedReport.sessionDetails.signatureLength} states
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">Threshold (t)</span>
                    <span className="text-amber-400 font-bold">
                      {selectedReport.sessionDetails.threshold} errors
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">Quantum Backend</span>
                    <span className="text-white font-bold">
                      {selectedReport.sessionDetails.quantumBackend}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Threat Analysis & Mathematical Proof */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  3. Deterministic Threat Analysis
                </h3>
                <div className="p-4 rounded bg-surface-subtle border border-border space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Attack Classification:</span>
                    <span className="text-red-400 font-bold">
                      {selectedReport.threatAnalysis.attackClass}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Detection Method:</span>
                    <span className="text-slate-200 font-semibold">
                      {selectedReport.threatAnalysis.detectionMethod}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border text-slate-300">
                    <span className="text-slate-500 block mb-0.5">Deterministic Proof:</span>
                    {selectedReport.threatAnalysis.deterministicProof}
                  </div>
                </div>
              </div>

              {/* 4. QBER & SPRT Diagnostics */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  4. QBER &amp; SPRT Sequential Analysis
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">Observed QBER</span>
                    <span className="text-white font-bold">
                      {formatPercent(selectedReport.statisticalEvidence.observedQber, 2)}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">SPRT Stopping Pulse</span>
                    <span className="text-cyan-400 font-bold">
                      #{selectedReport.sprtAnalysis.stoppingStep} of {selectedReport.sessionDetails.signatureLength}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">Final LLR Score</span>
                    <span className="text-white font-bold">
                      +{selectedReport.sprtAnalysis.finalLLR.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-surface-subtle border border-border">
                    <span className="text-slate-500 block text-[10px]">Efficiency Savings</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedReport.sprtAnalysis.efficiencyGainPercent}% saved
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Forgery Probability & Theoretical Bound */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  5. Attacker Forgery Bounds
                </h3>
                <div className="p-4 rounded bg-surface-subtle border border-border space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Calculated Forgery Probability (P_forge):</span>
                    <span className="text-emerald-400 font-bold">
                      {formatScientific(selectedReport.forgeryProbability.calculatedValue)}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Theoretical Formula: {selectedReport.forgeryProbability.theoreticalBound}
                  </div>
                </div>
              </div>

              {/* 6. Recommendations */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  6. Operational Recommendations
                </h3>
                <ul className="space-y-1.5 p-4 rounded bg-surface-subtle border border-border text-slate-300">
                  {selectedReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
