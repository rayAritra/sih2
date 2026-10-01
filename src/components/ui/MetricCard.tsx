import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  badge?: string;
  variant?: "default" | "secure" | "warning" | "attack" | "cyan";
  className?: string;
  sparklineData?: number[];
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  trend,
  icon: Icon,
  badge,
  variant = "default",
  className,
  sparklineData,
}: MetricCardProps) {
  const variantStyles = {
    default: "border-border hover:border-border-strong",
    secure: "border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-950/10",
    warning: "border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10",
    attack: "border-red-500/30 hover:border-red-500/50 bg-red-950/10",
    cyan: "border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-950/10",
  }[variant];

  return (
    <div
      className={cn(
        "soc-card p-4 transition-all duration-200 relative group overflow-hidden",
        variantStyles,
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono font-medium tracking-wide text-slate-400 uppercase truncate">
          {title}
        </span>
        {Icon && (
          <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mb-1">
        <div className="text-2xl font-mono font-bold tracking-tight text-white font-mono-numbers">
          {value}
        </div>
        {badge && (
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-surface-subtle text-slate-300 border border-border">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono">
        {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
        {change && (
          <span
            className={cn(
              "font-medium ml-auto shrink-0",
              trend === "up" && "text-emerald-400",
              trend === "down" && "text-red-400",
              trend === "neutral" && "text-slate-400"
            )}
          >
            {change}
          </span>
        )}
      </div>

      {/* Optional micro sparkline */}
      {sparklineData && sparklineData.length > 1 && (
        <div className="mt-3 pt-2 border-t border-border/40 flex items-end gap-1 h-6">
          {sparklineData.map((val, idx) => {
            const max = Math.max(...sparklineData, 1);
            const height = Math.max(15, (val / max) * 100);
            return (
              <div
                key={idx}
                className="flex-1 bg-cyan-500/30 hover:bg-cyan-400 rounded-t transition-all"
                style={{ height: `${height}%` }}
                title={`Point ${idx + 1}: ${val}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
