import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, ShieldCheck, Database, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = ShieldCheck,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "soc-card p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border-dashed",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center mb-4 text-cyan-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white font-mono mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Quantum Backend Unavailable",
  message = "Unable to retrieve live measurements from quantum simulation node. Previously synchronized telemetry remains available in local cache.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "soc-card p-8 border-red-500/30 bg-red-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded bg-red-950/40 border border-red-500/40 text-red-400 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-400 font-mono mb-0.5">{title}</h4>
          <p className="text-xs text-slate-300 max-w-xl">{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-hover border border-border text-xs font-mono text-slate-200 transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Handshake</span>
        </button>
      )}
    </div>
  );
}
