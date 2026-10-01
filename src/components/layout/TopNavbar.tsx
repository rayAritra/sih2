"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSystemStore } from "@/stores/useSystemStore";
import { useDemoStore } from "@/stores/useDemoStore";
import { cn } from "@/lib/utils";
import {
  Radio,
  Bell,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  Database,
  Sliders,
} from "lucide-react";

export function TopNavbar() {
  const pathname = usePathname();
  const openDemo = useDemoStore((s) => s.openDemo);
  const isDemo = useSystemStore((s) => s.isDemo);
  const toggleDataMode = useSystemStore((s) => s.toggleDataMode);
  const systemAlertActive = useSystemStore((s) => s.systemAlertActive);

  // Derive breadcrumb and title
  const cleanPath = pathname.replace("/", "");
  const pageTitle =
    cleanPath === ""
      ? "Security Operations"
      : cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1).replace("-", " ");

  return (
    <header className="h-14 bg-surface border-b border-border sticky top-0 z-30 px-6 flex items-center justify-between font-mono text-xs">
      {/* Left: Title & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          QShield-QDS
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-100 font-semibold">{pageTitle}</span>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center gap-4">
        {/* Live Monitoring Pulse */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-surface-subtle border border-border">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
          <span className="text-slate-300 font-medium">Monitoring</span>
        </div>

        {/* Backend Indicator */}
        <button
          onClick={toggleDataMode}
          title="Click to toggle between DEMO DATA and LIVE API mode"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-subtle border border-border hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isDemo ? "Mode: Demo" : "Mode: API"}</span>
        </button>

        {/* Threat Alert Icon if active */}
        {systemAlertActive && (
          <Link
            href="/alerts"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/70 border border-red-500/50 text-red-300 animate-pulse font-bold"
          >
            <Bell className="w-3.5 h-3.5 text-red-400" />
            <span>ATTACK ACTIVE</span>
          </Link>
        )}

        {/* SIH DEMO Button (Section 5 & 30) */}
        <button
          onClick={openDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wider uppercase border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>SIH DEMO</span>
        </button>

        {/* Profile / Node Identity */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border text-slate-400">
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-border flex items-center justify-center text-[10px] text-slate-300">
            SOC
          </div>
          <span className="text-slate-300">Node-Alpha</span>
        </div>
      </div>
    </header>
  );
}
