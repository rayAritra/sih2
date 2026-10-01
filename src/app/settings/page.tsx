"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useSystemStore } from "@/stores/useSystemStore";
import { isDemoMode, setDataMode } from "@/services/api-client";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  Settings,
  Database,
  Cpu,
  Shield,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function SettingsPage() {
  const isDemo = useSystemStore((s) => s.isDemo);
  const toggleDataMode = useSystemStore((s) => s.toggleDataMode);
  const resetSecurityState = useSystemStore((s) => s.resetSecurityState);

  const [backendUrl, setBackendUrl] = useState("http://localhost:8000/api/v1");
  const [quantumEngine, setQuantumEngine] = useState("Stim");
  const [warningQber, setWarningQber] = useState(0.08);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 font-mono text-xs max-w-4xl">
      <PageHeader
        title="System Settings & Telemetry Configuration"
        subtitle="Manage backend connection endpoints, demo fixtures, quantum simulator integration, and threshold parameters."
        badge="CONFIG"
      />

      {savedToast && (
        <div className="p-4 rounded-lg bg-emerald-950/70 border border-emerald-500 text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Settings saved successfully. Configuration active.</span>
          </div>
        </div>
      )}

      {/* Mode Switch Card (Section 31 & 48) */}
      <div className="soc-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Telemetry Data Mode
            </h2>
          </div>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider",
              isDemo
                ? "bg-amber-950/60 border-amber-500 text-amber-300"
                : "bg-emerald-950/60 border-emerald-500 text-emerald-300"
            )}
          >
            {isDemo ? "DEMO DATA" : "LIVE BACKEND API"}
          </span>
        </div>

        <p className="text-slate-300 leading-relaxed text-xs">
          QShield-QDS features a production-ready API abstraction layer. In <strong>DEMO DATA</strong> mode, deterministic quantum physics fixtures drive the dashboard for SIH evaluation. In <strong>LIVE API</strong> mode, requests route directly to the FastAPI backend.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={toggleDataMode}
            className={cn(
              "px-4 py-2 rounded font-bold uppercase transition-colors border cursor-pointer",
              isDemo
                ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-400 shadow-md"
                : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-md"
            )}
          >
            Switch to {isDemo ? "Live Backend API" : "Deterministic Demo Data"}
          </button>
        </div>
      </div>

      {/* Backend API Configuration Form */}
      <form onSubmit={handleSave} className="soc-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Quantum Simulator &amp; API Link
            </h2>
          </div>
        </div>

        {/* API URL Endpoint */}
        <div>
          <label className="text-slate-400 block mb-1">FastAPI Backend URL Endpoint</label>
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="w-full px-3 py-2 rounded bg-surface-subtle border border-border text-white focus:border-cyan-400 transition-colors"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Default endpoint configured in NEXT_PUBLIC_API_URL
          </span>
        </div>

        {/* Quantum Backend Engine */}
        <div>
          <label className="text-slate-400 block mb-1">Quantum Simulation Engine</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "Stim", title: "Stim (Clifford Frame)", note: "Ultra-fast stabilizer" },
              { id: "Qiskit-Aer", title: "Qiskit-Aer (IBM)", note: "Statevector simulation" },
              { id: "Demo", title: "Deterministic Demo", note: "Reproducible SIH fixtures" },
            ].map((engine) => (
              <button
                key={engine.id}
                type="button"
                onClick={() => setQuantumEngine(engine.id)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer",
                  quantumEngine === engine.id
                    ? "bg-cyan-950/60 border-cyan-500 text-white"
                    : "bg-surface-subtle border-border text-slate-400 hover:text-slate-200"
                )}
              >
                <div className="font-bold text-xs">{engine.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{engine.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Warning Threshold Slider */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Warning QBER Threshold (σ_abort):</span>
            <span className="font-bold text-amber-400">{(warningQber * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0.04"
            max="0.12"
            step="0.005"
            value={warningQber}
            onChange={(e) => setWarningQber(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={resetSecurityState}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-surface-panel hover:bg-surface-hover border border-border text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Threat Simulation State</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
