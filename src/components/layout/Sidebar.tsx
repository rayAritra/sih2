"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useSystemStore } from "@/stores/useSystemStore";
import { cn } from "@/lib/utils";
import {
  Activity,
  Radio,
  Atom,
  ShieldAlert,
  Workflow,
  AlertTriangle,
  Sliders,
  Grid,
  Layers,
  FileText,
  Network,
  BookOpen,
  Settings,
  Shield,
  Server,
  Cpu,
  Database,
  CheckCircle2,
} from "lucide-react";

// Icon mapping helper
const iconMap: Record<string, React.ElementType> = {
  Activity,
  Radio,
  Atom,
  ShieldAlert,
  Workflow,
  AlertTriangle,
  Sliders,
  Grid,
  Layers,
  FileText,
  Network,
  BookOpen,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const isDemo = useSystemStore((s) => s.isDemo);
  const systemAlertActive = useSystemStore((s) => s.systemAlertActive);

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen shrink-0 sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform">
            <Atom className="w-5 h-5 text-black animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white font-mono tracking-tight text-base">
                QShield-QDS
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 block tracking-wider uppercase">
              SIH 2026 • SIH26141
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 font-mono text-xs">
        {siteConfig.mainNav.map((item) => {
          const Icon = iconMap[item.icon] || Activity;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-md transition-all group",
                isActive
                  ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface-subtle"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded text-[10px] font-bold border",
                    systemAlertActive
                      ? "bg-red-950 border-red-500 text-red-400 animate-pulse"
                      : "bg-surface-subtle border-border text-slate-400"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status & Diagnostics (Prompt Section 4) */}
      <div className="p-4 border-t border-border bg-surface-subtle/70 space-y-3 font-mono text-[11px]">
        {/* Development / Demo State Badge */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Telemetry Source</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider",
              isDemo
                ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                : "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
            )}
          >
            {isDemo ? "DEMO DATA" : "LIVE API"}
          </span>
        </div>

        {/* Backend & Engine Diagnostics */}
        <div className="space-y-1.5 text-slate-400 pt-1 border-t border-border/40">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Server className="w-3 h-3 text-cyan-400" />
              API Link
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Quantum Backend
            </span>
            <span className="text-slate-200 font-semibold">Stim (v1.12)</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3 h-3 text-cyan-400" />
              QDS Engine
            </span>
            <span className="text-emerald-400 font-semibold">Operational</span>
          </div>
        </div>

        {/* System Version */}
        <div className="pt-2 border-t border-border/40 text-[10px] text-slate-500 text-center">
          {siteConfig.version}
        </div>
      </div>
    </aside>
  );
}
