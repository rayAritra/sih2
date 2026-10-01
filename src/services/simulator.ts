import { apiClient } from "./api-client";
import { QuantumSession, QuantumStateName, QuantumBasis, MeasurementRecord } from "@/types";
import { computeLogLikelihoodRatio, calculateSPRTBoundaries } from "@/lib/math-quantum";

export interface SimulationParams {
  message: string;
  signatureLength: number;
  channelNoise: number;
  threshold: number;
  backend: "Stim" | "Demo";
  sprtEnabled: boolean;
}

export async function runSimulation(params: SimulationParams): Promise<QuantumSession> {
  return apiClient<QuantumSession>(
    "/simulations/run",
    {
      method: "POST",
      body: JSON.stringify(params),
    },
    () => {
      // Deterministic simulation generator based on params
      const L = params.signatureLength || 200;
      const noise = params.channelNoise || 0.02;
      const t = params.threshold || Math.floor(L * 0.1);

      const bases: QuantumBasis[] = ["Z", "X", "Y"];
      const statesByBasis: Record<QuantumBasis, QuantumStateName[]> = {
        Z: ["|0⟩", "|1⟩"],
        X: ["|+⟩", "|−⟩"],
        Y: ["|+i⟩", "|−i⟩"],
      };
      const bellStates: Array<"00" | "01" | "10" | "11"> = ["00", "01", "10", "11"];
      const corrections: Array<"I" | "X" | "Z" | "XZ"> = ["I", "X", "Z", "XZ"];

      // Deterministic pseudo-random sequence
      let s = params.message.split("").reduce((acc, c) => acc + c.charCodeAt(0), 12345);
      const rand = () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
      };

      const measurements: MeasurementRecord[] = [];
      let mismatches = 0;
      let zErrors = 0, zCount = 0;
      let xErrors = 0, xCount = 0;
      let yErrors = 0, yCount = 0;

      for (let i = 0; i < L; i++) {
        const bIdx = Math.floor(rand() * 3);
        const basis = bases[bIdx];
        const stateIdx = Math.floor(rand() * 2);
        const expected = statesByBasis[basis][stateIdx];
        const bellIdx = Math.floor(rand() * 4);
        const bell = bellStates[bellIdx];
        const corr = corrections[bellIdx];

        const isMismatch = rand() < noise;
        if (isMismatch) mismatches++;

        if (basis === "Z") { zCount++; if (isMismatch) zErrors++; }
        if (basis === "X") { xCount++; if (isMismatch) xErrors++; }
        if (basis === "Y") { yCount++; if (isMismatch) yErrors++; }

        const measured = isMismatch
          ? statesByBasis[basis][1 - stateIdx]
          : expected;

        measurements.push({
          position: i + 1,
          expectedState: expected,
          basis,
          bellResult: bell,
          correction: corr,
          measuredState: measured,
          match: !isMismatch,
          llrDelta: isMismatch ? 2.525 : -0.278,
          usedForEarlyStop: true,
        });
      }

      const sprt = computeLogLikelihoodRatio(measurements.map((m) => !m.match));
      const observedQber = mismatches / L;
      const accepted = mismatches <= t && (!params.sprtEnabled || sprt.decision !== "ACCEPT_H1");

      const session: QuantumSession = {
        id: `QDS-${Math.abs(s % 65535).toString(16).toUpperCase().padStart(4, "0")}`,
        signer: "Alice (0x7F2a...98B4)",
        verifier: "Bob (0x4E11...32F9)",
        messageHash: "0x" + Array.from({ length: 64 }, () => Math.floor(rand() * 16).toString(16)).join(""),
        signatureLength: L,
        threshold: t,
        startedAt: new Date(Date.now() - 3000).toISOString(),
        completedAt: new Date().toISOString(),
        status: accepted ? "ACCEPTED" : "REJECTED",
        decision: accepted ? "ACCEPTED" : "REJECTED",
        qber: Number(observedQber.toFixed(4)),
        fidelity: Number((1 - observedQber).toFixed(4)),
        mismatchCount: mismatches,
        executionTimeMs: Number((2.5 + rand() * 2).toFixed(1)),
        backend: params.backend || "Stim",
        sprt,
        measurements,
        evidence: {
          observedQber,
          expectedHonestQber: 0.02,
          mismatchCount: mismatches,
          totalMeasurements: L,
          measurementsUsed: sprt.stoppedAtStep || L,
          pValue: accepted ? 0.985 : 1.4e-12,
          sprtLlr: sprt.currentLlr,
          sprtDecision: sprt.decision === "CONTINUE" ? "INCONCLUSIVE" : sprt.decision,
          upperBoundary: sprt.upperBoundary,
          lowerBoundary: sprt.lowerBoundary,
          fidelity: 1 - observedQber,
          forgeryProbability: accepted ? 3.2e-12 : 0.99,
          basisQber: {
            Z: { basis: "Z", qber: zCount ? zErrors / zCount : 0, count: zCount, errors: zErrors, expectedQber: 0.02 },
            X: { basis: "X", qber: xCount ? xErrors / xCount : 0, count: xCount, errors: xErrors, expectedQber: 0.02 },
            Y: { basis: "Y", qber: yCount ? yErrors / yCount : 0, count: yCount, errors: yErrors, expectedQber: 0.02 },
          },
          triggeredRules: accepted
            ? []
            : [
                {
                  id: "RULE-THRESH",
                  rule: `Mismatch count (${mismatches}) exceeded maximum tolerance threshold (${t})`,
                  triggered: true,
                  description: "Deterministic signature authentication abort criteria reached.",
                  severity: "CRITICAL",
                },
              ],
        },
      };

      return session;
    }
  );
}
