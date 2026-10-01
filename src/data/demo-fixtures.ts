import {
  AuditEvent,
  BasisQBER,
  MeasurementRecord,
  QuantumBasis,
  QuantumSession,
  QuantumStateName,
  SecurityAlert,
  SecurityReport,
  StatisticalEvidence,
  SystemMetrics,
} from "@/types";
import { computeLogLikelihoodRatio } from "@/lib/math-quantum";

// Deterministic measurement generator for realistic quantum positions
function generateDeterministicMeasurements(
  count: number,
  targetErrorRate: number,
  seed = 42
): MeasurementRecord[] {
  const records: MeasurementRecord[] = [];
  const bases: QuantumBasis[] = ["Z", "X", "Y"];
  const statesByBasis: Record<QuantumBasis, QuantumStateName[]> = {
    Z: ["|0⟩", "|1⟩"],
    X: ["|+⟩", "|−⟩"],
    Y: ["|+i⟩", "|−i⟩"],
  };
  const bellStates: Array<"00" | "01" | "10" | "11"> = ["00", "01", "10", "11"];
  const corrections: Array<"I" | "X" | "Z" | "XZ"> = ["I", "X", "Z", "XZ"];

  // Simple pseudo-random LCG for reproducible deterministic seed
  let s = seed;
  const nextRand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const basisIdx = Math.floor(nextRand() * 3);
    const basis = bases[basisIdx];
    const stateList = statesByBasis[basis];
    const stateIdx = Math.floor(nextRand() * 2);
    const expectedState = stateList[stateIdx];
    const bellIdx = Math.floor(nextRand() * 4);
    const bellResult = bellStates[bellIdx];
    const correction = corrections[bellIdx];

    const isMismatch = nextRand() < targetErrorRate;
    const measuredState = isMismatch
      ? stateList[1 - stateIdx]
      : expectedState;

    records.push({
      position: i + 1,
      expectedState,
      basis,
      bellResult,
      correction,
      measuredState,
      match: !isMismatch,
      llrDelta: isMismatch ? 2.525 : -0.278,
      usedForEarlyStop: i < 74,
    });
  }

  return records;
}

// 1. Intercept-Resend Session (Stopped early at step 74 via SPRT)
const irMeasurements = generateDeterministicMeasurements(200, 0.337, 1337);
const irMismatches = irMeasurements.map((m) => !m.match);
const irSprt = computeLogLikelihoodRatio(irMismatches);

export const interceptResendSession: QuantumSession = {
  id: "QDS-8F92A",
  signer: "Alice (0x7F2a...98B4)",
  verifier: "Bob (0x4E11...32F9)",
  messageHash: "0x8e5f2a1b9c3d4e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
  signatureLength: 200,
  threshold: 20,
  startedAt: "2026-10-01T14:32:00Z",
  completedAt: "2026-10-01T14:32:10Z",
  status: "REJECTED",
  decision: "REJECTED",
  qber: 0.337,
  fidelity: 0.661,
  mismatchCount: 25, // in first 74 measurements
  threatDetected: "Intercept-Resend Attack",
  executionTimeMs: 4.8,
  backend: "Stim",
  sprt: irSprt,
  measurements: irMeasurements,
  evidence: {
    observedQber: 0.337,
    expectedHonestQber: 0.02,
    mismatchCount: 25,
    totalMeasurements: 200,
    measurementsUsed: 74,
    pValue: 2.41e-28,
    sprtLlr: 18.72,
    sprtDecision: "ACCEPT_H1",
    upperBoundary: 6.907,
    lowerBoundary: -20.723,
    fidelity: 0.661,
    forgeryProbability: 3.27e-12,
    basisQber: {
      Z: { basis: "Z", qber: 0.341, count: 68, errors: 23, expectedQber: 0.02 },
      X: { basis: "X", qber: 0.332, count: 66, errors: 22, expectedQber: 0.02 },
      Y: { basis: "Y", qber: 0.338, count: 66, errors: 22, expectedQber: 0.02 },
    },
    triggeredRules: [
      {
        id: "RULE-QBER-THRESH",
        rule: "Observed QBER (33.7%) exceeds honest upper threshold (8.0%)",
        triggered: true,
        description: "Photon error distribution deviates from honest quantum channel noise by > 15 standard deviations.",
        severity: "CRITICAL",
      },
      {
        id: "RULE-SPRT-H1",
        rule: "SPRT Log Likelihood Ratio (+18.72) crossed H1 boundary (+6.91)",
        triggered: true,
        description: "Sequential hypothesis test deterministically rejected honest null hypothesis H0 in 74 steps.",
        severity: "CRITICAL",
      },
      {
        id: "RULE-BASIS-CONJ",
        rule: "Equi-partitioned conjugate basis error consistent with Intercept-Resend",
        triggered: true,
        description: "Eve basis mismatch causes deterministic 1/2 error rate in conjugate bases (Z: 34.1%, X: 33.2%, Y: 33.8%).",
        severity: "HIGH",
      },
    ],
  },
};

// 2. Honest Ideal Session
const honestIdealMeasurements = generateDeterministicMeasurements(200, 0.008, 9999);
const honestIdealMismatches = honestIdealMeasurements.map((m) => !m.match);
const honestIdealSprt = computeLogLikelihoodRatio(honestIdealMismatches);

export const honestIdealSession: QuantumSession = {
  id: "QDS-3C19F",
  signer: "Alice (0x7F2a...98B4)",
  verifier: "Bob (0x4E11...32F9)",
  messageHash: "0x12ab34cd56ef789012ab34cd56ef789012ab34cd56ef789012ab34cd56ef7890",
  signatureLength: 200,
  threshold: 20,
  startedAt: "2026-10-01T14:30:15Z",
  completedAt: "2026-10-01T14:30:20Z",
  status: "ACCEPTED",
  decision: "ACCEPTED",
  qber: 0.008,
  fidelity: 0.994,
  mismatchCount: 2,
  executionTimeMs: 3.2,
  backend: "Stim",
  sprt: honestIdealSprt,
  measurements: honestIdealMeasurements,
  evidence: {
    observedQber: 0.008,
    expectedHonestQber: 0.02,
    mismatchCount: 2,
    totalMeasurements: 200,
    measurementsUsed: 200,
    pValue: 0.9998,
    sprtLlr: -16.42,
    sprtDecision: "ACCEPT_H0",
    upperBoundary: 6.907,
    lowerBoundary: -20.723,
    fidelity: 0.994,
    forgeryProbability: 1.1e-15,
    basisQber: {
      Z: { basis: "Z", qber: 0.007, count: 68, errors: 0, expectedQber: 0.02 },
      X: { basis: "X", qber: 0.009, count: 66, errors: 1, expectedQber: 0.02 },
      Y: { basis: "Y", qber: 0.008, count: 66, errors: 1, expectedQber: 0.02 },
    },
    triggeredRules: [],
  },
};

// 3. Honest Noisy Session (2.4% QBER, within 8% threshold)
const honestNoisyMeasurements = generateDeterministicMeasurements(200, 0.024, 7777);
const honestNoisySprt = computeLogLikelihoodRatio(honestNoisyMeasurements.map((m) => !m.match));

export const honestNoisySession: QuantumSession = {
  id: "QDS-5A84D",
  signer: "Alice (0x7F2a...98B4)",
  verifier: "Charlie (0x99A1...11B3)",
  messageHash: "0x44ee22bb11aa33cc55dd66ee77ff88aa99bb00cc11dd22ee33ff44aa55bb66cc",
  signatureLength: 200,
  threshold: 20,
  startedAt: "2026-10-01T14:28:00Z",
  completedAt: "2026-10-01T14:28:06Z",
  status: "ACCEPTED",
  decision: "ACCEPTED",
  qber: 0.024,
  fidelity: 0.978,
  mismatchCount: 5,
  executionTimeMs: 4.1,
  backend: "Stim",
  sprt: honestNoisySprt,
  measurements: honestNoisyMeasurements,
  evidence: {
    observedQber: 0.024,
    expectedHonestQber: 0.02,
    mismatchCount: 5,
    totalMeasurements: 200,
    measurementsUsed: 200,
    pValue: 0.842,
    sprtLlr: -12.18,
    sprtDecision: "ACCEPT_H0",
    upperBoundary: 6.907,
    lowerBoundary: -20.723,
    fidelity: 0.978,
    forgeryProbability: 3.4e-12,
    basisQber: {
      Z: { basis: "Z", qber: 0.022, count: 67, errors: 1, expectedQber: 0.02 },
      X: { basis: "X", qber: 0.026, count: 67, errors: 2, expectedQber: 0.02 },
      Y: { basis: "Y", qber: 0.024, count: 66, errors: 2, expectedQber: 0.02 },
    },
    triggeredRules: [],
  },
};

// 4. Blind Forgery Session (49.1% QBER)
const blindForgeryMeasurements = generateDeterministicMeasurements(200, 0.491, 5555);
const blindForgerySprt = computeLogLikelihoodRatio(blindForgeryMeasurements.map((m) => !m.match));

export const blindForgerySession: QuantumSession = {
  id: "QDS-991FE",
  signer: "Adversary (Forged Alice)",
  verifier: "Bob (0x4E11...32F9)",
  messageHash: "0xccaa55112233445566778899aabbccddeeff00112233445566778899aabbccdd",
  signatureLength: 200,
  threshold: 20,
  startedAt: "2026-10-01T14:25:00Z",
  completedAt: "2026-10-01T14:25:05Z",
  status: "REJECTED",
  decision: "REJECTED",
  qber: 0.491,
  fidelity: 0.509,
  mismatchCount: 22,
  threatDetected: "Blind Forgery Attack",
  executionTimeMs: 2.9,
  backend: "Stim",
  sprt: blindForgerySprt,
  measurements: blindForgeryMeasurements,
  evidence: {
    observedQber: 0.491,
    expectedHonestQber: 0.02,
    mismatchCount: 98,
    totalMeasurements: 200,
    measurementsUsed: 42,
    pValue: 1.15e-42,
    sprtLlr: 24.15,
    sprtDecision: "ACCEPT_H1",
    upperBoundary: 6.907,
    lowerBoundary: -20.723,
    fidelity: 0.509,
    forgeryProbability: 1.0,
    basisQber: {
      Z: { basis: "Z", qber: 0.485, count: 68, errors: 33, expectedQber: 0.02 },
      X: { basis: "X", qber: 0.495, count: 66, errors: 33, expectedQber: 0.02 },
      Y: { basis: "Y", qber: 0.493, count: 66, errors: 32, expectedQber: 0.02 },
    },
    triggeredRules: [
      {
        id: "RULE-BLIND-FORGE",
        rule: "Measured error approaches 50% maximal unentangled entropy limit",
        triggered: true,
        description: "Adversary states exhibit zero entanglement correlation with Bob's verification apparatus.",
        severity: "CRITICAL",
      },
    ],
  },
};

// 5. Replay Attack Session
export const replaySession: QuantumSession = {
  id: "QDS-7B21C",
  signer: "Unknown Node (Replay)",
  verifier: "Charlie (0x99A1...11B3)",
  messageHash: "0x8e5f2a1b9c3d4e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
  signatureLength: 200,
  threshold: 20,
  startedAt: "2026-10-01T14:20:00Z",
  completedAt: "2026-10-01T14:20:04Z",
  status: "REJECTED",
  decision: "REJECTED",
  qber: 0.465,
  fidelity: 0.535,
  mismatchCount: 93,
  threatDetected: "Replay Attack",
  executionTimeMs: 3.5,
  backend: "Stim",
  sprt: computeLogLikelihoodRatio(generateDeterministicMeasurements(200, 0.465, 3333).map((m) => !m.match)),
  measurements: generateDeterministicMeasurements(200, 0.465, 3333),
};

// 6. Impersonation Session
export const impersonationSession: QuantumSession = {
  id: "QDS-4D18E",
  signer: "Mallory (Impersonator)",
  verifier: "Bob (0x4E11...32F9)",
  messageHash: "0xfa129845bcde671234567890abcdef1234567890abcdef1234567890abcdef12",
  signatureLength: 200,
  threshold: 20,
  startedAt: "2026-10-01T14:15:00Z",
  completedAt: "2026-10-01T14:15:04Z",
  status: "REJECTED",
  decision: "REJECTED",
  qber: 0.482,
  fidelity: 0.518,
  mismatchCount: 96,
  threatDetected: "Signer Impersonation",
  executionTimeMs: 3.1,
  backend: "Stim",
  sprt: computeLogLikelihoodRatio(generateDeterministicMeasurements(200, 0.482, 2222).map((m) => !m.match)),
  measurements: generateDeterministicMeasurements(200, 0.482, 2222),
};

// Complete session history
export const DEMO_SESSIONS: QuantumSession[] = [
  interceptResendSession,
  honestIdealSession,
  honestNoisySession,
  blindForgerySession,
  replaySession,
  impersonationSession,
  {
    id: "QDS-1102A",
    signer: "Alice (0x7F2a...98B4)",
    verifier: "Bob (0x4E11...32F9)",
    messageHash: "0x1102aabbccddeeff1102aabbccddeeff1102aabbccddeeff1102aabbccddeeff",
    signatureLength: 200,
    threshold: 20,
    startedAt: "2026-10-01T14:10:00Z",
    completedAt: "2026-10-01T14:10:05Z",
    status: "ACCEPTED",
    decision: "ACCEPTED",
    qber: 0.015,
    fidelity: 0.985,
    mismatchCount: 3,
    executionTimeMs: 3.8,
    backend: "Stim",
  },
  {
    id: "QDS-9081B",
    signer: "Alice (0x7F2a...98B4)",
    verifier: "Charlie (0x99A1...11B3)",
    messageHash: "0x9081bbccddeeaa11223344556677889900aabbccddeeff9081bbccddeeaa11",
    signatureLength: 200,
    threshold: 20,
    startedAt: "2026-10-01T14:05:00Z",
    completedAt: "2026-10-01T14:05:05Z",
    status: "ACCEPTED",
    decision: "ACCEPTED",
    qber: 0.021,
    fidelity: 0.979,
    mismatchCount: 4,
    executionTimeMs: 4.0,
    backend: "Stim",
  },
];

// System Metrics
export const DEMO_METRICS: SystemMetrics = {
  activeSessions: 12,
  signaturesVerified: 18492,
  threatsDetected: 147,
  currentQber: 0.0214, // 2.14%
  entanglementFidelity: 0.987, // 98.7%
  forgeryProbability: 3.2e-12, // 3.2 x 10^-12
  averageDetectionTimeMs: 4.8,
  sprtSavingsPercentage: 63.0,
  systemStatus: "SECURE",
  backendEngine: "Stim Quantum Simulator v1.12",
  channelIntegrity: 0.987,
};

// Security Alerts
export const DEMO_ALERTS: SecurityAlert[] = [
  {
    id: "ALT-2026-0941",
    severity: "CRITICAL",
    category: "CHANNEL_MANIPULATION",
    attackName: "Intercept-Resend Attack",
    attackType: "intercept-resend",
    sessionId: "QDS-8F92A",
    timestamp: "14:32:09 UTC",
    qber: 0.337,
    honestQberBaseline: 0.02,
    llr: 18.72,
    status: "ACTIVE",
    summary: "SPRT boundary crossed at pulse #74. Symmetric error rate 33.7% in conjugate measurement bases.",
    deterministicReason:
      "Mathematical violation: Observed error rate 33.7% exceeds honest threshold (8.0%) by 15.2 standard deviations (p = 2.41e-28).",
    evidence: interceptResendSession.evidence!,
  },
  {
    id: "ALT-2026-0940",
    severity: "CRITICAL",
    category: "FORGERY",
    attackName: "Blind Forgery Attack",
    attackType: "blind-forgery",
    sessionId: "QDS-991FE",
    timestamp: "14:25:03 UTC",
    qber: 0.491,
    honestQberBaseline: 0.02,
    llr: 24.15,
    status: "CONTAINED",
    summary: "Random guess states detected. QBER surged to 49.1%, matching theoretical 50% unentangled limit.",
    deterministicReason: "Zero entanglement correlation detected across all three mutually unbiased bases (Z, X, Y).",
    evidence: blindForgerySession.evidence!,
  },
  {
    id: "ALT-2026-0938",
    severity: "HIGH",
    category: "REPLAY",
    attackName: "Replay Attack",
    attackType: "replay",
    sessionId: "QDS-7B21C",
    timestamp: "14:20:02 UTC",
    qber: 0.465,
    honestQberBaseline: 0.02,
    llr: 16.89,
    status: "CONTAINED",
    summary: "Stale Bell measurement tokens replayed against fresh quantum state seeds.",
    deterministicReason: "Nonce freshness failure combined with orthogonal Bell projection error rate of 46.5%.",
    evidence: {
      ...interceptResendSession.evidence!,
      observedQber: 0.465,
      mismatchCount: 93,
    },
  },
  {
    id: "ALT-2026-0935",
    severity: "HIGH",
    category: "IMPERSONATION",
    attackName: "Signer Impersonation",
    attackType: "impersonation",
    sessionId: "QDS-4D18E",
    timestamp: "14:15:02 UTC",
    qber: 0.482,
    honestQberBaseline: 0.02,
    llr: 21.04,
    status: "RESOLVED",
    summary: "Signer credentials rejected. Tripartite Bell correlation violated.",
    deterministicReason: "Verifier stations Bob and Charlie cross-consistency test failed with mismatch > 48%.",
    evidence: {
      ...interceptResendSession.evidence!,
      observedQber: 0.482,
      mismatchCount: 96,
    },
  },
  {
    id: "ALT-2026-0929",
    severity: "MEDIUM",
    category: "CHANNEL_MANIPULATION",
    attackName: "Fiber Dephasing Anomaly",
    attackType: "dephasing",
    sessionId: "QDS-5A84D",
    timestamp: "13:58:12 UTC",
    qber: 0.074,
    honestQberBaseline: 0.02,
    llr: 4.12,
    status: "RESOLVED",
    summary: "Asymmetric QBER increase in X/Y bases (7.4%) while Z basis remained 1.8%.",
    deterministicReason: "Phase modulator temperature drift detected; automatic piezo phase alignment compensated.",
    evidence: {
      ...honestNoisySession.evidence!,
      observedQber: 0.074,
      basisQber: {
        Z: { basis: "Z", qber: 0.018, count: 68, errors: 1, expectedQber: 0.02 },
        X: { basis: "X", qber: 0.074, count: 66, errors: 5, expectedQber: 0.02 },
        Y: { basis: "Y", qber: 0.071, count: 66, errors: 5, expectedQber: 0.02 },
      },
    },
  },
  {
    id: "ALT-2026-0912",
    severity: "INFO",
    category: "SYSTEM",
    attackName: "SPRT Adaptive Early Stopping",
    sessionId: "QDS-3C19F",
    timestamp: "13:45:00 UTC",
    qber: 0.008,
    honestQberBaseline: 0.02,
    llr: -16.42,
    status: "RESOLVED",
    summary: "Early acceptance boundary reached. 126 pulse measurements saved (63% reduction).",
    deterministicReason: "Sequential test accepted H0 with confidence level 1 - alpha = 0.999.",
    evidence: honestIdealSession.evidence!,
  },
];

// Audit Ledger Blocks
export const DEMO_AUDIT_BLOCKS: AuditEvent[] = [
  {
    blockNumber: 10482,
    timestamp: "2026-10-01T14:32:10.842Z",
    sessionId: "QDS-8F92A",
    eventType: "SIGNATURE_REJECTED",
    signer: "0x7F2a...98B4",
    verifier: "0x4E11...32F9",
    payloadDigest: "0x9f8e7d6c5b4a3928170123456789abcdef012345",
    previousHash: "0x4a8c9b2e1f3d5a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    currentHash: "0x73ae991bf2840ac897d10e52b6140f7c9e01358a",
    merkleRoot: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    integrity: "VERIFIED",
    details: "Signature rejected due to SPRT H1 boundary violation (LLR: +18.72, QBER: 33.7%).",
  },
  {
    blockNumber: 10481,
    timestamp: "2026-10-01T14:32:09.112Z",
    sessionId: "QDS-8F92A",
    eventType: "SPRT_BOUNDARY_CROSSED",
    signer: "0x7F2a...98B4",
    verifier: "0x4E11...32F9",
    payloadDigest: "0x2840ac897d10e52b6140f7c9e01358a9f8e7d6c5",
    previousHash: "0x89ab12cd34ef56017890123456789abcdef01234",
    currentHash: "0x4a8c9b2e1f3d5a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    merkleRoot: "0x8899aabbccddeeff00112233445566778899aabb",
    integrity: "VERIFIED",
    details: "SPRT test stopped at pulse #74; threshold crossed with 25 mismatches observed.",
  },
  {
    blockNumber: 10480,
    timestamp: "2026-10-01T14:32:04.421Z",
    sessionId: "QDS-8F92A",
    eventType: "STATE_TELEPORTED",
    signer: "0x7F2a...98B4",
    verifier: "0x4E11...32F9",
    payloadDigest: "0x10e52b6140f7c9e01358a9f8e7d6c52840ac897d",
    previousHash: "0x3344556677889900aabbccddeeff0123456789ab",
    currentHash: "0x89ab12cd34ef56017890123456789abcdef01234",
    merkleRoot: "0x2233445566778899aabbccddeeff001122334455",
    integrity: "VERIFIED",
    details: "Alice transmitted 2-bit feedforward Pauli corrections to Bob over TLS classical channel.",
  },
  {
    blockNumber: 10479,
    timestamp: "2026-10-01T14:32:01.005Z",
    sessionId: "QDS-8F92A",
    eventType: "SESSION_INITIALIZED",
    signer: "0x7F2a...98B4",
    verifier: "0x4E11...32F9",
    payloadDigest: "0x7c9e01358a9f8e7d6c52840ac897d10e52b6140f",
    previousHash: "0x66778899aabbccddeeff00112233445566778899",
    currentHash: "0x3344556677889900aabbccddeeff0123456789ab",
    merkleRoot: "0x445566778899aabbccddeeff0011223344556677",
    integrity: "VERIFIED",
    details: "Session initialized for contract hash 0x8e5f2a1b9c3d4e7f with L=200 states.",
  },
  {
    blockNumber: 10478,
    timestamp: "2026-10-01T14:30:20.198Z",
    sessionId: "QDS-3C19F",
    eventType: "SIGNATURE_ACCEPTED",
    signer: "0x7F2a...98B4",
    verifier: "0x4E11...32F9",
    payloadDigest: "0x8a9f8e7d6c52840ac897d10e52b6140f7c9e0135",
    previousHash: "0x112233445566778899aabbccddeeff0011223344",
    currentHash: "0x66778899aabbccddeeff00112233445566778899",
    merkleRoot: "0x66778899aabbccddeeff00112233445566778899",
    integrity: "VERIFIED",
    details: "Signature accepted. QBER: 0.8%, Forgery probability P_f: 1.1e-15, Mismatches: 2/200.",
  },
  {
    blockNumber: 10477,
    timestamp: "2026-10-01T14:28:06.314Z",
    sessionId: "QDS-5A84D",
    eventType: "SIGNATURE_ACCEPTED",
    signer: "0x7F2a...98B4",
    verifier: "0x99A1...11B3",
    payloadDigest: "0x52b6140f7c9e01358a9f8e7d6c52840ac897d10e",
    previousHash: "0x99aabbccddeeff00112233445566778899aabbcc",
    currentHash: "0x112233445566778899aabbccddeeff0011223344",
    merkleRoot: "0x8899aabbccddeeff00112233445566778899aabb",
    integrity: "VERIFIED",
    details: "Signature accepted under noisy channel conditions. QBER: 2.4%, Mismatches: 5/200.",
  },
  {
    blockNumber: 10476,
    timestamp: "2026-10-01T14:25:05.102Z",
    sessionId: "QDS-991FE",
    eventType: "SIGNATURE_REJECTED",
    signer: "0xAdversary",
    verifier: "0x4E11...32F9",
    payloadDigest: "0x01358a9f8e7d6c52840ac897d10e52b6140f7c9e",
    previousHash: "0x5566778899aabbccddeeff001122334455667788",
    currentHash: "0x99aabbccddeeff00112233445566778899aabbcc",
    merkleRoot: "0x112233445566778899aabbccddeeff0011223344",
    integrity: "VERIFIED",
    details: "Signature rejected: Blind Forgery attempt detected. QBER: 49.1%, LLR: +24.15.",
  },
  {
    blockNumber: 10475,
    timestamp: "2026-10-01T14:20:04.887Z",
    sessionId: "QDS-7B21C",
    eventType: "SIGNATURE_REJECTED",
    signer: "0xUnknown",
    verifier: "0x99A1...11B3",
    payloadDigest: "0x897d10e52b6140f7c9e01358a9f8e7d6c52840ac",
    previousHash: "0x00112233445566778899aabbccddeeff00112233",
    currentHash: "0x5566778899aabbccddeeff001122334455667788",
    merkleRoot: "0x33445566778899aabbccddeeff00112233445566",
    integrity: "VERIFIED",
    details: "Signature rejected: Replay attack with expired nonce hash.",
  },
];

// Security Reports
export const DEMO_REPORTS: SecurityReport[] = [
  {
    id: "REP-2026-001",
    reportNumber: "QSHIELD-AUDIT-2026-1001-8F92A",
    sessionId: "QDS-8F92A",
    generatedAt: "2026-10-01T14:35:00Z",
    signer: "Alice (0x7F2a...98B4)",
    verifier: "Bob (0x4E11...32F9)",
    decision: "REJECTED",
    threatDetected: "Intercept-Resend Attack",
    securityLevel: "COMPROMISED",
    executiveSummary:
      "A deterministic Intercept-Resend eavesdropping attempt was detected during quantum state teleportation verification. The adversary forced wavefunction collapse resulting in a 33.7% QBER, exceeding the threshold of 8.0%. The Sequential Probability Ratio Test (SPRT) terminated the session at pulse 74 of 200, successfully mitigating the attack while saving 63% in quantum channel resources.",
    sessionDetails: {
      messageHash: "0x8e5f2a1b9c3d4e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
      signatureLength: 200,
      threshold: 20,
      durationMs: 4.8,
      quantumBackend: "Stim (Clifford-Frame Simulator)",
    },
    threatAnalysis: {
      attackClass: "Quantum Eavesdropping (Intercept-Resend)",
      detectionMethod: "Sequential Probability Ratio Test (SPRT) H1 Boundary Crossing",
      deterministicProof:
        "The probability of observing 25 mismatches in 74 pulses under an honest channel (p0 = 0.02) is p = 2.41 × 10⁻²⁸. This statistically rules out innocent optical attenuation with > 99.9999999999% certainty.",
      impactScore: "CRITICAL (0.95 / 1.00)",
    },
    statisticalEvidence: interceptResendSession.evidence!,
    sprtAnalysis: {
      upperBoundaryH1: 6.907,
      lowerBoundaryH0: -20.723,
      finalLLR: 18.72,
      stoppingStep: 74,
      efficiencyGainPercent: 63.0,
    },
    forgeryProbability: {
      calculatedValue: 3.27e-12,
      theoreticalBound: "P_forge <= (1/2)^L * sum_{k=0}^t C(L, k) = 3.27 x 10^-12",
      attackerAssumption: "Attacker error rate p_f = 0.33",
    },
    auditTrail: {
      blockNumber: 10482,
      blockHash: "0x73ae991bf2840ac897d10e52b6140f7c9e01358a",
      merkleRoot: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
      ledgerVerified: true,
    },
    recommendations: [
      "Quarantine optical link segment AB-04 immediately for OTDR fiber reflectometry inspection.",
      "Re-key EPR distribution seeds between Alice and Bob before authorizing subsequent signature requests.",
      "Increase minimum signature length parameter L from 200 to 250 in Security Planner to maintain security envelope margin under elevated adversary activity.",
      "Notify network operations center of potential physical interceptor tap at rack junction J-12.",
    ],
  },
  {
    id: "REP-2026-002",
    reportNumber: "QSHIELD-AUDIT-2026-1001-3C19F",
    sessionId: "QDS-3C19F",
    generatedAt: "2026-10-01T14:32:00Z",
    signer: "Alice (0x7F2a...98B4)",
    verifier: "Bob (0x4E11...32F9)",
    decision: "ACCEPTED",
    securityLevel: "MAXIMAL",
    executiveSummary:
      "Signature verification completed with exceptional channel fidelity (99.4%) and minimal QBER (0.8%). The teleportation-based quantum digital signature meets all deterministic criteria for unconditional non-repudiation and unforgeability with an attacker forgery probability of 1.1 × 10⁻¹⁵.",
    sessionDetails: {
      messageHash: "0x12ab34cd56ef789012ab34cd56ef789012ab34cd56ef789012ab34cd56ef7890",
      signatureLength: 200,
      threshold: 20,
      durationMs: 3.2,
      quantumBackend: "Stim",
    },
    threatAnalysis: {
      attackClass: "None (Honest Optical Transmission)",
      detectionMethod: "SPRT H0 Acceptance & Binomial Bound",
      deterministicProof: "Observed mismatch count (2/200) conforms to Poissonian photon detection error floor.",
      impactScore: "SECURE (0.00 / 1.00)",
    },
    statisticalEvidence: honestIdealSession.evidence!,
    sprtAnalysis: {
      upperBoundaryH1: 6.907,
      lowerBoundaryH0: -20.723,
      finalLLR: -16.42,
      stoppingStep: 200,
      efficiencyGainPercent: 0,
    },
    forgeryProbability: {
      calculatedValue: 1.1e-15,
      theoreticalBound: "P_forge <= 1.1 x 10^-15",
      attackerAssumption: "Attacker error rate p_f = 0.33",
    },
    auditTrail: {
      blockNumber: 10478,
      blockHash: "0x66778899aabbccddeeff00112233445566778899",
      merkleRoot: "0x66778899aabbccddeeff00112233445566778899",
      ledgerVerified: true,
    },
    recommendations: [
      "Signature accepted for settlement on enterprise distributed ledger.",
      "Retain tamper-evident audit receipt #10478 in permanent verification archive.",
    ],
  },
];
