import React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, Clock, CheckCircle2, XCircle } from "lucide-react";

export type StatusVariant =
  | "SECURE"
  | "ATTACK"
  | "WARNING"
  | "INFO"
  | "ACCEPTED"
  | "REJECTED"
  | "ACTIVE"
  | "TELEPORTING"
  | "PREPARING"
  | "VERIFYING"
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  variant,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const normalized = (variant || status).toUpperCase() as StatusVariant;

  const getStyle = () => {
    switch (normalized) {
      case "SECURE":
      case "ACCEPTED":
        return {
          bg: "bg-emerald-950/60 border-emerald-500/40 text-emerald-400",
          dot: "bg-emerald-400 shadow-[0_0_8px_#10B981]",
          icon: ShieldCheck,
        };
      case "ATTACK":
      case "REJECTED":
      case "CRITICAL":
        return {
          bg: "bg-red-950/60 border-red-500/40 text-red-400",
          dot: "bg-red-400 shadow-[0_0_8px_#EF4444]",
          icon: ShieldAlert,
        };
      case "WARNING":
      case "HIGH":
      case "MEDIUM":
        return {
          bg: "bg-amber-950/60 border-amber-500/40 text-amber-400",
          dot: "bg-amber-400 shadow-[0_0_8px_#F59E0B]",
          icon: AlertTriangle,
        };
      case "ACTIVE":
      case "TELEPORTING":
      case "VERIFYING":
        return {
          bg: "bg-cyan-950/60 border-cyan-500/40 text-cyan-400",
          dot: "bg-cyan-400 shadow-[0_0_8px_#00F0FF] animate-pulse",
          icon: Clock,
        };
      case "INFO":
      case "PREPARING":
      default:
        return {
          bg: "bg-slate-900 border-slate-700 text-slate-300",
          dot: "bg-slate-400",
          icon: Info,
        };
    }
  };

  const style = getStyle();
  const IconComp = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border tracking-wide uppercase",
        style.bg,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {showIcon && <IconComp className="w-3 h-3" />}
      <span>{status}</span>
    </span>
  );
}
