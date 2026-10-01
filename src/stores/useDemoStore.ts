import { create } from "zustand";
import { QuantumSession } from "@/types";
import {
  honestIdealSession,
  honestNoisySession,
  blindForgerySession,
  interceptResendSession,
  replaySession,
  impersonationSession,
} from "@/data/demo-fixtures";
import { useSystemStore } from "./useSystemStore";

export interface DemoScenario {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  expectedResult: "ACCEPTED" | "REJECTED";
  threatClass: string;
  sessionData: QuantumSession;
  description: string;
  keyTakeaway: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "sc-1",
    number: "01",
    title: "Ideal Legitimate Signature",
    subtitle: "Baseline low-noise optical fiber teleportation",
    expectedResult: "ACCEPTED",
    threatClass: "None (Honest)",
    sessionData: honestIdealSession,
    description:
      "Alice generates a 200-state QDS signature under ideal lab conditions (0.8% QBER). Full projective verification succeeds with unconditional non-repudiation.",
    keyTakeaway: "Honest error floor is far below threshold t=20. SPRT confirms channel integrity rapidly.",
  },
  {
    id: "sc-2",
    number: "02",
    title: "Noisy Legitimate Channel",
    subtitle: "Realistic field fiber with environmental attenuation",
    expectedResult: "ACCEPTED",
    threatClass: "Channel Attenuation (2.4% QBER)",
    sessionData: honestNoisySession,
    description:
      "Simulates 25 km standard SMF-28 fiber with thermal polarization drift. QBER rises to 2.4%, well below the warning threshold (8.0%).",
    keyTakeaway: "System does not false-alarm on legitimate environmental noise; honest signatures settle securely.",
  },
  {
    id: "sc-3",
    number: "03",
    title: "Blind Forgery Attack",
    subtitle: "Unentangled random quantum state injection",
    expectedResult: "REJECTED",
    threatClass: "Blind Forgery (50% Error Limit)",
    sessionData: blindForgerySession,
    description:
      "An unauthenticated attacker guesses signature tokens randomly. Entanglement fidelity drops to 50.9%, triggering an immediate deterministic rejection.",
    keyTakeaway: "Without shared EPR pairs, attacker error rate is 50%, making forgery probability negligible (< 10⁻¹²).",
  },
  {
    id: "sc-4",
    number: "04",
    title: "Intercept-Resend Eavesdropping",
    subtitle: "Eve measures teleported qubits in transit",
    expectedResult: "REJECTED",
    threatClass: "Quantum Eavesdropping (33.7% QBER)",
    sessionData: interceptResendSession,
    description:
      "Eve intercepts qubits in optical transit and resends reconstructed states. Wavefunction collapse introduces 33.7% error. SPRT halts execution at pulse 74.",
    keyTakeaway: "Early stopping saves 63% of quantum pulses while proving eavesdropping with p = 2.41 × 10⁻²⁸.",
  },
  {
    id: "sc-5",
    number: "05",
    title: "Replay Attack",
    subtitle: "Adversary replays historical Bell feedforward bits",
    expectedResult: "REJECTED",
    threatClass: "Replay & Nonce Staleness",
    sessionData: replaySession,
    description:
      "Adversary replays intercepted classical Pauli feedforward bits from an old contract. Mismatches with fresh Bell pairs cause 46.5% QBER.",
    keyTakeaway: "Teleportation-based QDS inherently binds classical announcements to ephemeral quantum entanglement.",
  },
  {
    id: "sc-6",
    number: "06",
    title: "Signer Impersonation Attack",
    subtitle: "Malicious node attempts to sign contracts as Alice",
    expectedResult: "REJECTED",
    threatClass: "Tripartite Inconsistency",
    sessionData: impersonationSession,
    description:
      "Malicious node attempts to sign without Alice's entanglement distribution secrets. Bob and Charlie's verification measurements disagree by 48.2%.",
    keyTakeaway: "Tripartite non-repudiation guarantees that Bob and Charlie detect forgery synchronously.",
  },
];

interface DemoStoreState {
  isOpen: boolean;
  activeScenarioIndex: number;
  currentStep: number; // 0 to 6
  isStepRunning: boolean;

  openDemo: () => void;
  closeDemo: () => void;
  selectScenario: (idx: number) => void;
  runGuidedFlow: () => Promise<void>;
  nextScenario: () => void;
  prevScenario: () => void;
}

export const useDemoStore = create<DemoStoreState>((set, get) => ({
  isOpen: false,
  activeScenarioIndex: 0,
  currentStep: 0,
  isStepRunning: false,

  openDemo: () => set({ isOpen: true, currentStep: 0 }),
  closeDemo: () => set({ isOpen: false, isStepRunning: false }),

  selectScenario: (idx: number) => {
    set({ activeScenarioIndex: idx, currentStep: 0, isStepRunning: false });
  },

  nextScenario: () => {
    const nextIdx = (get().activeScenarioIndex + 1) % DEMO_SCENARIOS.length;
    set({ activeScenarioIndex: nextIdx, currentStep: 0, isStepRunning: false });
  },

  prevScenario: () => {
    const prevIdx =
      (get().activeScenarioIndex - 1 + DEMO_SCENARIOS.length) % DEMO_SCENARIOS.length;
    set({ activeScenarioIndex: prevIdx, currentStep: 0, isStepRunning: false });
  },

  runGuidedFlow: async () => {
    const { activeScenarioIndex } = get();
    const scenario = DEMO_SCENARIOS[activeScenarioIndex];

    set({ isStepRunning: true });

    // Step 1: Preparing 200-state signature
    set({ currentStep: 1 });
    await new Promise((r) => setTimeout(r, 700));

    // Step 2: Establishing Bell pairs
    set({ currentStep: 2 });
    await new Promise((r) => setTimeout(r, 700));

    // Step 3: Teleporting states
    set({ currentStep: 3 });
    await new Promise((r) => setTimeout(r, 700));

    // Step 4: Projective verification
    set({ currentStep: 4 });
    await new Promise((r) => setTimeout(r, 700));

    // Step 5: Statistical analysis
    set({ currentStep: 5 });
    await new Promise((r) => setTimeout(r, 700));

    // Step 6: Decision
    set({ currentStep: 6, isStepRunning: false });

    if (scenario.expectedResult === "REJECTED") {
      useSystemStore.getState().triggerAttackState(scenario.threatClass);
    } else {
      useSystemStore.getState().resetSecurityState();
    }
  },
}));
