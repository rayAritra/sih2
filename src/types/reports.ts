import { StatisticalEvidence } from "./quantum";

export interface SecurityReport {
  id: string;
  reportNumber: string;
  sessionId: string;
  generatedAt: string;
  signer: string;
  verifier: string;
  decision: "ACCEPTED" | "REJECTED";
  threatDetected?: string;
  securityLevel: "MAXIMAL" | "STRONG" | "MARGINAL" | "COMPROMISED";
  executiveSummary: string;
  sessionDetails: {
    messageHash: string;
    signatureLength: number;
    threshold: number;
    durationMs: number;
    quantumBackend: string;
  };
  threatAnalysis: {
    attackClass: string;
    detectionMethod: string;
    deterministicProof: string;
    impactScore: string;
  };
  statisticalEvidence: StatisticalEvidence;
  sprtAnalysis: {
    upperBoundaryH1: number;
    lowerBoundaryH0: number;
    finalLLR: number;
    stoppingStep: number;
    efficiencyGainPercent: number;
  };
  forgeryProbability: {
    calculatedValue: number;
    theoreticalBound: string;
    attackerAssumption: string;
  };
  auditTrail: {
    blockNumber: number;
    blockHash: string;
    merkleRoot: string;
    ledgerVerified: boolean;
  };
  recommendations: string[];
}
