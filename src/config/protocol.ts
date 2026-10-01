export interface ProtocolStage {
  id: string;
  order: number;
  name: string;
  shortName: string;
  actor: "Signer (Alice)" | "Quantum Channel" | "Verifier (Bob)" | "Detection Engine";
  description: string;
  quantumOperation: string;
  stateRepresentation: string;
}

export const PROTOCOL_STAGES: ProtocolStage[] = [
  {
    id: "stage-1",
    order: 1,
    name: "Signer Key & State Preparation",
    shortName: "STATE PREPARATION",
    actor: "Signer (Alice)",
    description: "Alice encodes message m into secret quantum states |ψ⟩ from mutually unbiased bases (Z, X, Y).",
    quantumOperation: "|ψ_k⟩ ∈ {|0⟩, |1⟩, |+⟩, |−⟩, |+i⟩, |−i⟩}",
    stateRepresentation: "|ψ_k⟩",
  },
  {
    id: "stage-2",
    order: 2,
    name: "Bell Pair Distribution (Entanglement)",
    shortName: "BELL PAIR",
    actor: "Quantum Channel",
    description: "Maximally entangled EPR pairs |Φ⁺⟩ are distributed between Alice and verifier nodes (Bob, Charlie).",
    quantumOperation: "|Φ⁺⟩ = (|00⟩ + |11⟩) / √2",
    stateRepresentation: "|Φ⁺⟩_AB",
  },
  {
    id: "stage-3",
    order: 3,
    name: "Quantum Channel Transmission",
    shortName: "QUANTUM CHANNEL",
    actor: "Quantum Channel",
    description: "Qubits propagate through optical fiber or free-space channel subject to environmental noise and possible eavesdropping.",
    quantumOperation: "E(ρ) = (1-p)ρ + p∑K_i ρ K_i†",
    stateRepresentation: "ρ_transit",
  },
  {
    id: "stage-4",
    order: 4,
    name: "Bell State Measurement (BSM)",
    shortName: "BELL MEASUREMENT",
    actor: "Signer (Alice)",
    description: "Alice performs joint Bell projection on state qubit and her half of the entangled EPR pair, obtaining 2 classical bits.",
    quantumOperation: "P_{ij} = |Φ_{ij}⟩⟨Φ_{ij}| -> (b1, b2) ∈ {00,01,10,11}",
    stateRepresentation: "{b1, b2}",
  },
  {
    id: "stage-5",
    order: 5,
    name: "Classical Feedforward Bits",
    shortName: "CLASSICAL BITS",
    actor: "Signer (Alice)",
    description: "Alice transmits the 2 measurement bits through authenticated classical channel to Bob.",
    quantumOperation: "Feedforward: [b1, b2] -> Bob",
    stateRepresentation: "(b1, b2) -> Bob",
  },
  {
    id: "stage-6",
    order: 6,
    name: "Pauli Unitary Correction",
    shortName: "PAULI CORRECTION",
    actor: "Verifier (Bob)",
    description: "Bob applies Pauli operator σ_x^{b2} σ_z^{b1} onto his EPR qubit to reconstruct Alice's original state |ψ⟩.",
    quantumOperation: "U_correction = σ_z^{b1} σ_x^{b2}",
    stateRepresentation: "U_corr |EPR_B⟩ = |ψ⟩",
  },
  {
    id: "stage-7",
    order: 7,
    name: "Projective Verification Measurement",
    shortName: "PROJECTIVE MEASUREMENT",
    actor: "Verifier (Bob)",
    description: "Bob measures reconstructed state in conjugate basis announced during key exchange to verify signature authenticity.",
    quantumOperation: "M_basis = {|v⟩⟨v|, |v_ortho⟩⟨v_ortho|}",
    stateRepresentation: "Outcome ∈ {MATCH, MISMATCH}",
  },
  {
    id: "stage-8",
    order: 8,
    name: "Statistical Detection & Decision",
    shortName: "VERIFICATION",
    actor: "Detection Engine",
    description: "Real-time SPRT analysis evaluates mismatch count. If mismatch ≤ t and SPRT accepts H0, signature is ACCEPTED.",
    quantumOperation: "SPRT: S_n = ∑ ln(f1(x_i)/f0(x_i)) vs (A, B)",
    stateRepresentation: "DECISION: ACCEPT / REJECT",
  },
];
