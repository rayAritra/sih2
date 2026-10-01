"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import {
  Network,
  Cpu,
  Server,
  Shield,
  Layers,
  Activity,
  Sliders,
  FileText,
  Lock,
  ArrowDown,
  Atom,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface LayerInfo {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  modules: string[];
  techStack: string;
}

const ARCHITECTURE_LAYERS: LayerInfo[] = [
  {
    id: "presentation",
    name: "Presentation Layer (SOC)",
    subtitle: "Real-time Operations & Forensic Telemetry",
    icon: Activity,
    description:
      "High-performance Next.js and TypeScript frontend engineered for mission-critical quantum key and digital signature supervision, animated SPRT charts, and responsive threat alerts.",
    modules: ["Overview SOC Dashboard", "Live Monitor", "Simulator UI", "Attack Lab", "Security Planner"],
    techStack: "Next.js App Router, Tailwind CSS, Recharts, Framer Motion, Zustand, TanStack Query",
  },
  {
    id: "api",
    name: "REST / Real-Time API Layer",
    subtitle: "High-Throughput Ingestion & SSE WebSocket Stream",
    icon: Server,
    description:
      "Asynchronous FastAPI and WebSocket microservices providing low-latency telemetry transport, session dispatching, and secure JSON RPC endpoints.",
    modules: ["Session Controller", "Tomography Ingester", "Simulation Broker", "Audit Notary API"],
    techStack: "FastAPI, WebSockets, Pydantic, Redis Event Bus, AsyncIO",
  },
  {
    id: "detection",
    name: "Detection Engine",
    subtitle: "Wald Sequential Probability Ratio Test & Anomaly Classifier",
    icon: Shield,
    description:
      "Deterministic mathematical verification pipeline. Continuously evaluates pulse mismatches against dual hypothesis testing boundaries (H0 honest channel vs H1 adversary) with zero heuristic AI bias.",
    modules: ["SPRT Wald Engine", "Basis Asymmetry Detector", "Binomial Tail Bound Calculator", "Decision Engine"],
    techStack: "NumPy, SciPy Hypothesis Testing, Vectorized SPRT Core",
  },
  {
    id: "protocol",
    name: "Quantum Protocol Engine",
    subtitle: "Teleportation-Based QDS Protocol State Machine",
    icon: Atom,
    description:
      "Coordinates tripartite quantum non-repudiation between Alice (signer), Bob (verifier), and Charlie (verifier). Manages Bell state measurements, classical Pauli announcements, and unitary rotations.",
    modules: ["Bell State Analyzer (BSM)", "Pauli Feedforward Corrector", "Tripartite Nonce Tracker", "State Preparation"],
    techStack: "Python Clifford Frame Tracker, QDS Protocol Orchestrator",
  },
  {
    id: "backend",
    name: "Quantum Backend / Physical Emulation",
    subtitle: "Stim Stabilizer Simulation & Hardware Abstraction",
    icon: Cpu,
    description:
      "High-speed stabilizer circuit simulation capable of evaluating millions of Clifford Pauli teleportation operations per second with customizable fiber noise models and detector dark counts.",
    modules: ["Stim Clifford Simulator", "Noise Model Generator (Depolarizing, Dephasing)", "SNSPD Detector Emulation"],
    techStack: "Stim (Google Quantum AI), Qiskit-Aer Provider Fallback, Hardware Driver Interface",
  },
];

const SYSTEM_FLOW = [
  { step: 1, name: "Session Setup", desc: "Negotiate session nonce and distribute EPR pairs" },
  { step: 2, name: "Bell Pair Distribution", desc: "Entangled state distribution to Alice & Bob" },
  { step: 3, name: "State Preparation", desc: "Alice prepares secret message states in {Z, X, Y}" },
  { step: 4, name: "Teleportation Link", desc: "Alice performs joint Bell projection & announces bits" },
  { step: 5, name: "Pauli Unitary Correction", desc: "Bob applies σ_x^b2 σ_z^b1 onto his EPR qubit" },
  { step: 6, name: "Projective Verification", desc: "Bob measures reconstructed state in conjugate basis" },
  { step: 7, name: "Statistical Detection", desc: "SPRT evaluates cumulative Log-Likelihood Ratio" },
  { step: 8, name: "Attack Classification", desc: "Deterministically identify eavesdropping vector" },
  { step: 9, name: "ACCEPT / REJECT Decision", desc: "Authorize settlement or abort compromised contract" },
  { step: 10, name: "Audit Ledger Seal", desc: "Anchors SHA-256 state seal into tamper-evident block" },
];

export default function ArchitecturePage() {
  const [selectedLayer, setSelectedLayer] = useState<LayerInfo>(ARCHITECTURE_LAYERS[0]);
  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(7); // Default on Statistical Detection

  return (
    <div className="space-y-6 font-mono text-xs">
      <PageHeader
        title="System Architecture & Protocol Topology"
        subtitle="Layered architectural overview of QShield-QDS: presentation, detection engine, protocol state machine, and quantum backend."
        badge="SYSTEM BLUEPRINT"
      />

      {/* Layered System Stack (Section 28) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Architecture Stack */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            Five-Tier Architectural Hierarchy
          </div>

          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const isSelected = selectedLayer.id === layer.id;
            const Icon = layer.icon;

            return (
              <React.Fragment key={layer.id}>
                <button
                  onClick={() => setSelectedLayer(layer)}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-4 group",
                    isSelected
                      ? "bg-cyan-950/50 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                      : "bg-surface-subtle border-border/80 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg border flex items-center justify-center shrink-0",
                        isSelected
                          ? "bg-cyan-900/60 border-cyan-400 text-cyan-300"
                          : "bg-surface-panel border-border text-slate-400 group-hover:text-slate-200"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {layer.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{layer.subtitle}</div>
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isSelected ? "text-cyan-400 translate-x-1" : "text-slate-600"
                    )}
                  />
                </button>

                {idx < ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="flex justify-center -my-1 text-slate-600">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Selected Layer Deep Dive */}
        <div className="lg:col-span-6">
          <div className="soc-card p-6 h-full space-y-4 relative overflow-hidden bg-tech-grid">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <selectedLayer.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                  Layer Specification
                </span>
                <h3 className="text-base font-bold text-white">{selectedLayer.name}</h3>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                Description &amp; Operational Role
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {selectedLayer.description}
              </p>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mb-2">
                Core Modules &amp; Subsystems
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedLayer.modules.map((m) => (
                  <div
                    key={m}
                    className="p-2.5 rounded bg-surface-subtle border border-border/80 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-200 text-xs font-semibold">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                Technology Stack &amp; Libraries
              </span>
              <div className="p-3 rounded bg-surface-subtle border border-border/80 text-cyan-300 font-bold">
                {selectedLayer.techStack}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Flow Diagram (Section 29) */}
      <div className="soc-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              End-to-End Quantum Digital Signature Protocol Flow
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stage in the flow sequence to highlight verification criteria.
            </p>
          </div>
          <span className="text-cyan-400 text-xs font-bold">10-STEP PROTOCOL CYCLE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {SYSTEM_FLOW.map((flow) => {
            const isSelected = selectedFlowStep === flow.step;
            return (
              <button
                key={flow.step}
                onClick={() => setSelectedFlowStep(flow.step)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-28",
                  isSelected
                    ? "bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                    : "bg-surface-subtle/80 border-border/80 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-cyan-400">
                    STEP 0{flow.step}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </div>
                <div className="font-bold text-xs leading-snug">{flow.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight truncate">
                  {flow.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Flow Step Explanation */}
        <div className="p-4 rounded-lg bg-surface-subtle border border-cyan-500/30 flex items-center justify-between gap-4">
          <div>
            <span className="text-cyan-300 font-bold block mb-0.5">
              Step 0{selectedFlowStep}: {SYSTEM_FLOW[selectedFlowStep - 1].name}
            </span>
            <span className="text-slate-300 text-xs">
              {SYSTEM_FLOW[selectedFlowStep - 1].desc}. Guarantees complete information-theoretic non-repudiation between Alice and verifier nodes Bob &amp; Charlie.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
