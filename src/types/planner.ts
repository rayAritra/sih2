export interface PlannerInput {
  channelError: number; // e.g. 0.02 (2%)
  attackerError: number; // e.g. 0.33 (33%)
  targetForgeryAcceptance: number; // e.g. 1e-9
  maxHonestRejection: number; // e.g. 1e-3
  safetyMargin: number; // e.g. 0.10 (10%)
}

export interface PlannerResult {
  signatureLengthL: number;
  maxMismatchesT: number;
  forgeryProbability: number;
  honestRejectionRate: number;
  securityStatus: "SAFE" | "MARGINAL" | "UNSAFE";
  thresholdRatio: number;
  distanceHonestToThreshold: number;
  distanceAttackerToThreshold: number;
  parametersCalculatedAt: string;
  notes: string[];
}

export interface SecurityEnvelopePoint {
  signatureLength: number; // 50 to 500
  channelNoise: number; // 0.005 to 0.12
  threshold: number;
  forgeryProbability: number;
  honestRejection: number;
  status: "SAFE" | "MARGINAL" | "UNSAFE";
}
