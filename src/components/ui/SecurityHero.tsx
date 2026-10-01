"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn, formatPercent } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, Radio, Activity, Zap, Cpu } from "lucide-react";
import { useSystemStore } from "@/stores/useSystemStore";

interface SecurityHeroProps {
  status: "SECURE" | "ATTACK_DETECTED" | "ELEVATED_NOISE";
  channelIntegrity: number; // e.g. 0.987
  qber: number; // e.g. 0.0214
  fidelity: number; // e.g. 0.987
  activeSessions: number;
  threatLevel: string;
  onResetAttack?: () => void;
}

export function SecurityHero({
  status,
  channelIntegrity,
  qber,
  fidelity,
  activeSessions,
  threatLevel,
  onResetAttack,
}: SecurityHeroProps) {
  const isAttack = status === "ATTACK_DETECTED";
  const activeAttackName = useSystemStore((s) => s.activeAttackName);

  return (
    <div
      className={cn(
        "soc-card p-6 relative overflow-hidden transition-all duration-700 bg-tech-grid",
        isAttack
          ? "border-red-500/40 bg-gradient-to-b from-red-950/20 via-surface to-surface"
          : "border-cyan-500/30 bg-gradient-to-b from-cyan-950/15 via-surface to-surface"
      )}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Security Status Badge & Overview */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border uppercase tracking-wider backdrop-blur-sm">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isAttack ? "bg-red-500 shadow-[0_0_8px_#EF4444] animate-ping" : "bg-emerald-400 shadow-[0_0_8px_#10B981]"
              )}
            />
            <span className={isAttack ? "text-red-400 font-bold" : "text-emerald-400"}>
              {isAttack ? "CRITICAL ADVERSARY EVENT" : "CHANNELS NORMAL • ZERO ADVERSARIAL DRIFT"}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
              {isAttack ? (
                <>
                  <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
                  <span className="text-red-400 font-mono">ATTACK DETECTED</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                  <span>SYSTEM SECURE</span>
                </>
              )}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              {isAttack
                ? `Adversary signature detected: ${activeAttackName || "Intercept-Resend Wavefunction Collapse"}. SPRT boundary crossed. Signatures quarantined deterministically.`
                : "Continuous quantum channel tomography active. Teleportation-based signatures verified with unconditional statistical non-repudiation."}
            </p>
          </div>

          {isAttack && onResetAttack && (
            <div className="pt-1">
              <button
                onClick={onResetAttack}
                className="px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Reset to Baseline Operational State
              </button>
            </div>
          )}
        </div>

        {/* Center: Circular Security Indicator */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer animated ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className={cn(
                "absolute inset-0 rounded-full border border-dashed",
                isAttack ? "border-red-500/40" : "border-cyan-500/30"
              )}
            />

            {/* Glowing circular backdrop */}
            <div
              className={cn(
                "w-36 h-36 rounded-full flex flex-col items-center justify-center border transition-all duration-700 shadow-xl",
                isAttack
                  ? "bg-red-950/40 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)]"
                  : "bg-surface-subtle border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-mono tracking-widest uppercase font-semibold",
                  isAttack ? "text-red-400" : "text-emerald-400"
                )}
              >
                {isAttack ? "ALERT" : "SECURE"}
              </span>

              <span className="text-3xl font-mono font-extrabold text-white my-0.5">
                {formatPercent(channelIntegrity, 1)}
              </span>

              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                Channel Integrity
              </span>
            </div>
          </div>
        </div>

        {/* Right: Surrounding Core Telemetry */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 font-mono">
          <div className="p-3 rounded bg-surface-subtle/80 border border-border/80 min-w-[130px]">
            <span className="text-[11px] text-slate-400 block mb-0.5">Current QBER</span>
            <span
              className={cn(
                "text-lg font-bold block",
                qber > 0.08 ? "text-red-400" : "text-slate-100"
              )}
            >
              {formatPercent(qber, 2)}
            </span>
            <span className="text-[10px] text-slate-500">Threshold: 8.0%</span>
          </div>

          <div className="p-3 rounded bg-surface-subtle/80 border border-border/80 min-w-[130px]">
            <span className="text-[11px] text-slate-400 block mb-0.5">EPR Fidelity</span>
            <span
              className={cn(
                "text-lg font-bold block",
                fidelity < 0.8 ? "text-amber-400" : "text-emerald-400"
              )}
            >
              {formatPercent(fidelity, 1)}
            </span>
            <span className="text-[10px] text-slate-500">Target: &gt;95.0%</span>
          </div>

          <div className="p-3 rounded bg-surface-subtle/80 border border-border/80 min-w-[130px]">
            <span className="text-[11px] text-slate-400 block mb-0.5">Active Sessions</span>
            <span className="text-lg font-bold text-cyan-400 block">{activeSessions}</span>
            <span className="text-[10px] text-slate-500">Concurrent Links</span>
          </div>

          <div className="p-3 rounded bg-surface-subtle/80 border border-border/80 min-w-[130px]">
            <span className="text-[11px] text-slate-400 block mb-0.5">Threat Level</span>
            <span
              className={cn(
                "text-lg font-bold block uppercase",
                isAttack ? "text-red-400" : "text-emerald-400"
              )}
            >
              {isAttack ? "DEFCON 2" : threatLevel}
            </span>
            <span className="text-[10px] text-slate-500">SPRT Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
