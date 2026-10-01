import { apiClient } from "./api-client";
import { PlannerInput, PlannerResult, SecurityEnvelopePoint } from "@/types";
import { solveSecureQDSParameters, calculateForgeryProbability, calculateHonestRejectionRate } from "@/lib/math-quantum";

export async function calculatePlannerParameters(
  input: PlannerInput
): Promise<PlannerResult> {
  return apiClient<PlannerResult>(
    "/planner/calculate",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    () => {
      return solveSecureQDSParameters(
        input.channelError,
        input.attackerError,
        input.targetForgeryAcceptance,
        input.maxHonestRejection,
        input.safetyMargin
      );
    }
  );
}

export async function getSecurityEnvelopePoints(
  attackerError = 0.33,
  targetForgery = 1e-9
): Promise<SecurityEnvelopePoint[]> {
  return apiClient<SecurityEnvelopePoint[]>(
    "/security/envelope",
    { method: "GET" },
    () => {
      const points: SecurityEnvelopePoint[] = [];
      const lengths = [60, 100, 150, 200, 250, 300, 350, 400];
      const channelErrors = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12];

      for (const L of lengths) {
        for (const ce of channelErrors) {
          const t = Math.floor(L * 0.1);
          const pf = calculateForgeryProbability(L, t, attackerError);
          const pr = calculateHonestRejectionRate(L, t, ce);

          let status: "SAFE" | "MARGINAL" | "UNSAFE" = "SAFE";
          if (pf > targetForgery || pr > 0.01) {
            status = pf > targetForgery * 100 || pr > 0.05 ? "UNSAFE" : "MARGINAL";
          }

          points.push({
            signatureLength: L,
            channelNoise: ce,
            threshold: t,
            forgeryProbability: pf,
            honestRejection: pr,
            status,
          });
        }
      }
      return points;
    }
  );
}
