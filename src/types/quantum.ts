export type QuantumBasis = "Z" | "X" | "Y";

export type QuantumStateName = "|0⟩" | "|1⟩" | "|+⟩" | "|−⟩" | "|+i⟩" | "|−i⟩";

export type SessionStatus =
  | "PREPARING"
  | "TELEPORTING"
  | "VERIFYING"
  | "ACCEPTED"
  | "REJECTED"
  | "WARNING";

export type DecisionType = "ACCEPTED" | "REJECTED";

export interface BasisQBER {
  basis: QuantumBasis;
  qber: number; // e.g. 0.021
  count: number;
  errors: number;
  expectedQber: number;
}

export interface SPRTStep {
  index: number;
  llr: number;
  mismatch: boolean;
  cumulativeQber: number;
  upperBoundary: number;
  lowerBoundary: number;
  status: "CONTINUE" | "ACCEPT_H0" | "ACCEPT_H1";
}

export interface SPRTResult {
  currentLlr: number;
  upperBoundary: number; // H1 (attack)
  lowerBoundary: number; // H0 (honest)
  decision: "CONTINUE" | "ACCEPT_H0" | "ACCEPT_H1";
  stoppedAtStep?: number;
  totalLength: number;
  stepsSaved: number;
  savingsPercentage: number;
  trajectory: SPRTStep[];
}

export interface MeasurementRecord {
  position: number;
  expectedState: QuantumStateName;
  basis: QuantumBasis;
  bellResult: "00" | "01" | "10" | "11";
  correction: "I" | "X" | "Z" | "XZ";
  measuredState: QuantumStateName;
  match: boolean;
  llrDelta: number;
  usedForEarlyStop: boolean;
}

export interface StatisticalEvidence {
  observedQber: number;
  expectedHonestQber: number;
  mismatchCount: number;
  totalMeasurements: number;
  measurementsUsed: number;
  pValue: number;
  sprtLlr: number;
  sprtDecision: "ACCEPT_H0" | "ACCEPT_H1" | "INCONCLUSIVE";
  upperBoundary: number;
  lowerBoundary: number;
  fidelity: number;
  forgeryProbability: number;
  basisQber: {
    Z: BasisQBER;
    X: BasisQBER;
    Y: BasisQBER;
  };
  triggeredRules: Array<{
    id: string;
    rule: string;
    triggered: boolean;
    description: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  }>;
}

export interface QuantumSession {
  id: string;
  signer: string;
  verifier: string;
  messageHash: string;
  signatureLength: number; // L
  threshold: number; // t
  startedAt: string;
  completedAt?: string;
  status: SessionStatus;
  decision?: DecisionType;
  qber: number;
  fidelity: number;
  mismatchCount: number;
  threatDetected?: string;
  executionTimeMs: number;
  backend: "Stim" | "Qiskit-Aer" | "Demo";
  evidence?: StatisticalEvidence;
  sprt?: SPRTResult;
  measurements?: MeasurementRecord[];
}

export interface SystemMetrics {
  activeSessions: number;
  signaturesVerified: number;
  threatsDetected: number;
  currentQber: number;
  entanglementFidelity: number;
  forgeryProbability: number;
  averageDetectionTimeMs: number;
  sprtSavingsPercentage: number;
  systemStatus: "SECURE" | "ATTACK_DETECTED" | "ELEVATED_NOISE";
  backendEngine: string;
  channelIntegrity: number;
}
