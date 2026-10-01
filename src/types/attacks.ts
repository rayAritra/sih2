export type AttackCategory =
  | "QUANTUM_EAVESDROPPING"
  | "FORGERY_IMPERSONATION"
  | "CHANNEL_NOISE_ENVIRONMENT"
  | "CLASSICAL_TAMPERING";

export type AttackTypeId =
  | "intercept-resend"
  | "blind-forgery"
  | "partial-intercept"
  | "depolarizing"
  | "dephasing"
  | "amplitude-damping"
  | "replay"
  | "impersonation"
  | "classical-tampering"
  | "photon-loss"
  | "detector-dark-counts";

export interface AttackDefinition {
  id: AttackTypeId;
  name: string;
  category: AttackCategory;
  description: string;
  affectedLayer: string;
  defaultSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  expectedQberIncrease: string;
  mathematicalSignature: string;
  configurableParams: {
    strengthLabel: string;
    minStrength: number;
    maxStrength: number;
    defaultStrength: number;
    step: number;
  };
}

export interface AttackSimulationConfig {
  attackType: AttackTypeId;
  attackStrength: number; // 0 to 1
  interceptFraction: number; // 0 to 1
  channelNoise: number; // e.g. 0.02
  signatureLength: number; // e.g. 200
  sprtEnabled: boolean;
  backend: "Stim" | "Demo";
}

export interface AttackResult {
  attackId: AttackTypeId;
  attackName: string;
  detected: boolean;
  decision: "SIGNATURE REJECTED" | "SIGNATURE ACCEPTED";
  detectionMethod: "SPRT Early Boundary" | "Binomial Threshold Exceeded" | "Basis Anomaly";
  observedQber: number;
  expectedHonestQber: number;
  sprtLlr: number;
  pValue: number;
  fidelity: number;
  measurementsUsed: number;
  totalMeasurements: number;
  savedMeasurements: number;
  basisQber: {
    Z: number;
    X: number;
    Y: number;
  };
  whyDetected: {
    title: string;
    explanation: string;
    mathematicalProof: string;
  };
  sessionId: string;
  timestamp: string;
}
