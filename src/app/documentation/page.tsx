"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Code,
  ShieldCheck,
  Scale,
  Atom,
  HelpCircle,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("sprt");

  return (
    <div className="space-y-6 font-mono text-xs">
      <PageHeader
        title="Protocol & Mathematical Documentation"
        subtitle="Theoretical foundation, Chernoff bounds, and Wald SPRT formulas for teleportation-based quantum digital signatures."
        badge="SIH26141 REFERENCE"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-1">
          {[
            { id: "sprt", title: "1. Sequential Probability Ratio Test (SPRT)" },
            { id: "teleportation", title: "2. Teleportation-Based QDS Protocol" },
            { id: "forgery", title: "3. Forgery & Binomial Tail Bounds" },
            { id: "threats", title: "4. Threat Models & Basis Disturbance" },
            { id: "tripartite", title: "5. Tripartite Non-Repudiation" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer font-bold",
                activeSection === item.id
                  ? "bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-sm"
                  : "bg-surface-subtle border-border/80 text-slate-400 hover:text-slate-200 hover:bg-surface-panel"
              )}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8 soc-card p-6 space-y-6">
          {activeSection === "sprt" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Wald&apos;s Sequential Probability Ratio Test (SPRT)</span>
              </h2>

              <p className="text-slate-300 leading-relaxed">
                Rather than collecting a fixed sample size of \(L = 200\) quantum measurements before rendering an authentication decision, QShield-QDS utilizes the Sequential Probability Ratio Test. This allows early detection of eavesdropping with minimal photon pulses.
              </p>

              <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
                <span className="font-bold text-cyan-300 block">Hypotheses Definition:</span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>H₀ (Honest Channel):</strong> QBER follows honest baseline error rate \(p_0 \approx 0.02\) (2%).</li>
                  <li>• <strong>H₁ (Adversary Present):</strong> Eavesdropper elevates error rate to \(p_1 \ge 0.25\) (25% to 33.7%).</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
                <span className="font-bold text-cyan-300 block">Log-Likelihood Ratio (LLR) Increments:</span>
                <p className="text-slate-300">
                  {"At each pulse measurement x_i in {0, 1} (0 = match, 1 = mismatch), the cumulative test statistic S_n updates as:"}
                </p>
                <div className="p-2.5 rounded bg-surface-panel font-bold text-white">
                  Mismatch (x_i = 1): &Delta;S = ln(p_1 / p_0) &approx; ln(0.25 / 0.02) = +2.525
                </div>
                <div className="p-2.5 rounded bg-surface-panel font-bold text-white">
                  Match (x_i = 0): &Delta;S = ln((1 - p_1) / (1 - p_0)) &approx; ln(0.75 / 0.98) = -0.268
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
                <span className="font-bold text-cyan-300 block">Stopping Boundaries:</span>
                <p className="text-slate-300">
                  {"With false alarm rate \u03b1 = 10\u207b\u00b3 and missed detection rate \u03b2 = 10\u207b\u2079:"}
                </p>
                <div className="text-red-400 font-bold">
                  Upper Boundary A = ln((1 - &beta;) / &alpha;) &approx; +6.907 &rarr; Stop and REJECT (Attack Detected)
                </div>
                <div className="text-emerald-400 font-bold">
                  Lower Boundary B = ln(&beta; / (1 - &alpha;)) &approx; -20.723 &rarr; Stop and ACCEPT (Honest)
                </div>
              </div>
            </div>
          )}

          {activeSection === "teleportation" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                <Atom className="w-4 h-4 text-cyan-400" />
                <span>Teleportation-Based Quantum Digital Signatures</span>
              </h2>

              <p className="text-slate-300 leading-relaxed">
                Traditional QDS relies on direct quantum memory storage, which is prone to decoherence. Teleportation-based QDS replaces physical storage with real-time EPR entanglement distribution and authenticated feedforward Pauli operators.
              </p>

              <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
                <span className="font-bold text-cyan-300 block">EPR Pair Distribution:</span>
                <p className="text-slate-300">
                  A central source distributes maximally entangled Bell pairs:
                </p>
                <code className="text-slate-200 block bg-surface-panel p-2 rounded">
                  |&Phi;&sdot;⟩_AB = (|00⟩ + |11⟩) / &radic;2
                </code>
              </div>

              <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
                <span className="font-bold text-cyan-300 block">Bell State Measurement &amp; Pauli Feedforward:</span>
                <p className="text-slate-300">
                  {"Alice measures her state qubit and her half of the EPR pair in the Bell basis, obtaining classical bits b_1, b_2 in {0, 1}. Bob applies unitary correction:"}
                </p>
                <code className="text-slate-200 block bg-surface-panel p-2 rounded">
                  {"U = \u03c3_z^{b1} \u03c3_x^{b2}"}
                </code>
                <p className="text-slate-300 text-xs">
                  This reconstructs Alice&apos;s state at Bob with 100% theoretical fidelity in the absence of noise or eavesdropping.
                </p>
              </div>
            </div>
          )}

          {activeSection === "forgery" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Forgery &amp; Binomial Probability Bounds</span>
              </h2>

              <p className="text-slate-300 leading-relaxed">
                An adversary attempting to forge Alice&apos;s signature without possessing the entangled key states is subject to the no-cloning theorem.
              </p>

              <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
                <span className="font-bold text-cyan-300 block">Exact Binomial Forgery Formulation:</span>
                <p className="text-slate-300">
                  For signature length L, threshold t, and attacker error probability p_f = 0.33:
                </p>
                <code className="text-slate-200 block bg-surface-panel p-2 rounded">
                  {"P_forge = \u2211_{k=0}^t C(L, k) \u00b7 p_f^k \u00b7 (1 - p_f)^{L - k}"}
                </code>
                <p className="text-slate-300 text-xs">
                  {"For L = 200, t = 20, P_forge = 3.27 \u00d7 10\u207b\u00b9\u00b2, guaranteeing cryptographic non-repudiation superior to 2048-bit RSA."}
                </p>
              </div>
            </div>
          )}

          {activeSection === "threats" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Threat Models &amp; Basis Disturbance</span>
              </h2>

              <p className="text-slate-300 leading-relaxed">
                Eavesdropping on qubits in transit inevitably collapses superposition states, introducing basis-dependent error patterns that cannot be concealed by classical manipulation.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-surface-subtle border border-border">
                  <span className="text-red-400 font-bold block mb-1">Intercept-Resend</span>
                  <span className="text-slate-300">
                    Causes 33.3% theoretical error across mutually unbiased bases.
                  </span>
                </div>
                <div className="p-3 rounded bg-surface-subtle border border-border">
                  <span className="text-amber-400 font-bold block mb-1">Dephasing Anomaly</span>
                  <span className="text-slate-300">
                    Spikes X and Y basis QBER while Z basis remains unaffected.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === "tripartite" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Tripartite Non-Repudiation</span>
              </h2>

              <p className="text-slate-300 leading-relaxed">
                To prevent Alice from repudiating her own signature (claiming Bob forged it), the protocol distributes entangled keys across three parties: Alice (signer), Bob (verifier), and Charlie (verifier). Symmetrical error bounds guarantee that if Bob accepts a signature, Charlie will also accept it with overwhelming probability \(1 - 10^{-9}\).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
