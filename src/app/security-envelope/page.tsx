"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SecurityEnvelopeHeatmap } from "@/components/charts/SecurityEnvelopeHeatmap";
import { Grid, Layers, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

export default function SecurityEnvelopePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="QDS Security Envelope"
        subtitle="2D parametric boundary mapping safe operational envelopes against eavesdropping and channel noise thresholds."
        badge="PARAMETRIC ENVELOPE"
      />

      {/* Main Heatmap Card with Sliders */}
      <SecurityEnvelopeHeatmap />

      {/* Engineering Guidance Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="soc-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>SAFE OPERATING DOMAIN</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Channel error rate remains below 4% with signature lengths L ≥ 150. Forgery probability satisfies military and banking threshold bounds (P_forge ≤ 10⁻⁹).
          </p>
        </div>

        <div className="soc-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>MARGINAL BOUNDARY</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Close separation between channel noise and attacker error limits. Requires adaptive SPRT early stopping to avoid elevated false-rejection rates.
          </p>
        </div>

        <div className="soc-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>UNSAFE COMPROMISE REGION</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Optical fiber loss exceeds 8% or signature length is insufficient (L &lt; 100). Eavesdroppers can forge valid signatures without detection.
          </p>
        </div>
      </div>
    </div>
  );
}
