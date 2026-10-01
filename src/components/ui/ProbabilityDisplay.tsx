import React from "react";
import { cn, formatScientific } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface ProbabilityDisplayProps {
  probability: number;
  length?: number;
  threshold?: number;
  attackerError?: number;
  className?: string;
  compact?: boolean;
}

export function ProbabilityDisplay({
  probability,
  length = 200,
  threshold = 20,
  attackerError = 0.33,
  className,
  compact = false,
}: ProbabilityDisplayProps) {
  // Determine security tier
  const isStrong = probability <= 1e-9;
  const isMarginal = probability > 1e-9 && probability <= 1e-4;
  const isCompromised = probability > 1e-4;

  const tier = isStrong
    ? { label: "STRONG", color: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-500/30", icon: ShieldCheck }
    : isMarginal
    ? { label: "MARGINAL", color: "text-amber-400", bg: "bg-amber-950/40 border-amber-500/30", icon: AlertTriangle }
    : { label: "COMPROMISED", color: "text-red-400", bg: "bg-red-950/40 border-red-500/30", icon: ShieldAlert };

  // Calculate logarithmic position on a 1e-18 to 1 scale
  const logProb = Math.log10(Math.max(1e-18, probability));
  const normalizedBar = Math.min(100, Math.max(2, ((18 + logProb) / 18) * 100));

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 font-mono text-sm", className)}>
        <span className={tier.color}>{formatScientific(probability)}</span>
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded border uppercase", tier.bg, tier.color)}>
          {tier.label}
        </span>
      </div>
    );
  }

  const Icon = tier.icon;

  return (
    <div className={cn("soc-card p-5 relative overflow-hidden", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
          Current Forgery Probability
        </span>
        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono uppercase", tier.bg, tier.color)}>
          <Icon className="w-3 h-3" />
          {tier.label}
        </span>
      </div>

      <div className="text-2xl lg:text-3xl font-mono font-bold tracking-tight text-white mb-3">
        {formatScientific(probability)}
      </div>

      {/* Logarithmic scale visualization */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>10⁻¹⁸ (MAXIMAL)</span>
          <span>10⁻⁹ (THRESHOLD)</span>
          <span>1.0 (FORGED)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 border border-border/80 overflow-hidden relative">
          {/* Threshold marker at 50% */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-500/60 z-10" title="Security Threshold (10^-9)" />
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isStrong ? "bg-emerald-500 shadow-[0_0_8px_#10B981]" : isMarginal ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${normalizedBar}%` }}
          />
        </div>
      </div>

      {/* Parameter metadata */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[11px]">Signature (L)</span>
          <span className="text-slate-200 font-semibold">{length} states</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Threshold (t)</span>
          <span className="text-slate-200 font-semibold">{threshold} errors</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Attacker pf</span>
          <span className="text-slate-200 font-semibold">{attackerError.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
