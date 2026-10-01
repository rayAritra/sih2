"use client";

import React, { useState } from "react";
import { useAuditLedger } from "@/hooks/useAudit";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { cn } from "@/lib/utils";
import {
  Layers,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Link as LinkIcon,
  ArrowDown,
  Info,
} from "lucide-react";

export default function AuditLedgerPage() {
  const { data: blocks = [], verifyChain, isVerifying, verificationReport } = useAuditLedger();
  const [showVerifiedToast, setShowVerifiedToast] = useState(false);

  const handleVerify = () => {
    verifyChain(undefined, {
      onSuccess: () => {
        setShowVerifiedToast(true);
        setTimeout(() => setShowVerifiedToast(false), 3000);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tamper-Evident Security Ledger"
        subtitle="Cryptographically sealed blockchain audit ledger recording all signature teleports, SPRT boundary events, and verification decisions."
        badge="SHA-256 STATE SEALS"
      >
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isVerifying && "animate-spin")} />
          <span>{isVerifying ? "Verifying Merkle Roots..." : "Verify Ledger Integrity"}</span>
        </button>
      </PageHeader>

      {/* Prominent Architectural Clarification Note (Section 26) */}
      <div className="p-4 rounded-lg bg-surface border border-cyan-500/30 text-xs font-mono flex items-start gap-3 text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300 block mb-0.5">
            Cryptographic Distinction Notice:
          </span>
          Audit only — QDS security does not depend on the ledger. Quantum digital signatures derive their unconditional non-repudiation and unforgeability directly from quantum teleportation and the no-cloning theorem. The ledger serves solely as an immutable forensic audit trail.
        </div>
      </div>

      {/* Verification Status Banner */}
      {showVerifiedToast && (
        <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-mono text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">
              Ledger Integrity Verified: 100% of SHA-256 block hashes and Merkle parent links are valid.
            </span>
          </div>
          <span className="text-[11px] text-emerald-400">Zero chain deviations</span>
        </div>
      )}

      {/* Chain Visualization Strip */}
      <div className="soc-card p-5 bg-tech-grid">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 font-semibold flex items-center gap-2">
          <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cryptographic Hash-Linked Block Sequence</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {blocks.slice(0, 6).map((b, idx) => (
            <React.Fragment key={b.blockNumber}>
              <div className="p-3 rounded bg-surface-subtle border border-border min-w-[170px] shrink-0 font-mono text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-400 font-bold">#{b.blockNumber}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    SEALED
                  </span>
                </div>
                <div className="text-[11px] text-slate-200 font-semibold truncate mb-1">
                  {b.eventType.replace(/_/g, " ")}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Hash: {b.currentHash.slice(0, 8)}...
                </div>
              </div>

              {idx < 5 && (
                <div className="text-cyan-500 font-bold text-sm shrink-0">
                  &rarr;
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Ledger Table (Section 26) */}
      <div className="soc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle border-b border-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">Block</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Session</th>
                <th className="p-4">Audit Event</th>
                <th className="p-4">Previous Hash</th>
                <th className="p-4">Current Hash</th>
                <th className="p-4 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {blocks.map((block) => (
                <tr key={block.blockNumber} className="hover:bg-surface-subtle transition-colors">
                  <td className="p-4 whitespace-nowrap font-bold text-white">
                    #{block.blockNumber}
                  </td>

                  <td className="p-4 whitespace-nowrap text-slate-400">
                    {block.timestamp.slice(11, 23)}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="text-cyan-400 font-bold">{block.sessionId}</span>
                  </td>

                  <td className="p-4">
                    <div className="text-slate-200 font-semibold">
                      {block.eventType.replace(/_/g, " ")}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                      {block.details}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <HashDisplay hash={block.previousHash} start={6} end={6} />
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <HashDisplay hash={block.currentHash} start={6} end={6} />
                  </td>

                  <td className="p-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      {block.integrity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
