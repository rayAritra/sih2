"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSessions } from "@/hooks/useSessions";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { cn, formatPercent } from "@/lib/utils";
import {
  Workflow,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  Clock,
  ShieldAlert,
} from "lucide-react";

export default function SessionsListPage() {
  const { data: sessions = [] } = useSessions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = sessions.filter((s) => {
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.signer.toLowerCase().includes(q) ||
        s.verifier.toLowerCase().includes(q) ||
        (s.threatDetected && s.threatDetected.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quantum Digital Signature Sessions"
        subtitle="Historical and live teleportation verification sessions with per-pulse measurement logs."
        badge={`${filtered.length} SESSIONS`}
      />

      {/* Filter and Search Bar */}
      <div className="soc-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search session ID, signer, or threat..."
            className="w-full pl-9 pr-4 py-2 rounded bg-surface-subtle border border-border text-white focus:border-cyan-400 placeholder:text-slate-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {(["ALL", "ACCEPTED", "REJECTED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-2.5 py-1 rounded transition-colors uppercase text-[11px] cursor-pointer",
                statusFilter === st
                  ? "bg-cyan-600 text-white font-bold"
                  : "bg-surface-subtle text-slate-400 hover:text-slate-200 border border-border"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      <div className="soc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle border-b border-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">Session ID</th>
                <th className="p-4">Signer &rarr; Verifier</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Length (L)</th>
                <th className="p-4">QBER</th>
                <th className="p-4">Fidelity</th>
                <th className="p-4">Decision</th>
                <th className="p-4">Threat Class</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((s) => {
                const isAccepted = s.decision === "ACCEPTED";
                const isRejected = s.decision === "REJECTED";

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-surface-subtle transition-colors group"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <Link
                        href={`/sessions/${s.id}`}
                        className="font-bold text-cyan-400 hover:underline"
                      >
                        {s.id}
                      </Link>
                    </td>

                    <td className="p-4">
                      <div className="text-slate-200">{s.signer}</div>
                      <div className="text-[11px] text-slate-500">to {s.verifier}</div>
                    </td>

                    <td className="p-4 whitespace-nowrap text-slate-400">
                      {s.startedAt.slice(11, 19)} UTC
                    </td>

                    <td className="p-4 whitespace-nowrap text-slate-200">
                      {s.signatureLength}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "font-bold",
                          s.qber > 0.08 ? "text-red-400" : "text-emerald-400"
                        )}
                      >
                        {formatPercent(s.qber, 1)}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-slate-200">
                      {formatPercent(s.fidelity, 1)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge
                        status={s.decision || s.status}
                        variant={isAccepted ? "ACCEPTED" : isRejected ? "REJECTED" : "ACTIVE"}
                      />
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {s.threatDetected ? (
                        <span className="text-red-400 flex items-center gap-1.5 font-semibold">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{s.threatDetected}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">None (Honest)</span>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap text-right">
                      <Link
                        href={`/sessions/${s.id}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold group-hover:translate-x-1 transition-transform"
                      >
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
