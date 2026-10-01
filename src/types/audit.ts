export interface AuditEvent {
  blockNumber: number;
  timestamp: string;
  sessionId: string;
  eventType:
    | "SESSION_INITIALIZED"
    | "ENTANGLEMENT_VERIFIED"
    | "STATE_TELEPORTED"
    | "SPRT_BOUNDARY_CROSSED"
    | "ATTACK_CLASSIFIED"
    | "SIGNATURE_ACCEPTED"
    | "SIGNATURE_REJECTED"
    | "AUDIT_BLOCK_SEALED";
  signer: string;
  verifier: string;
  payloadDigest: string;
  previousHash: string;
  currentHash: string;
  merkleRoot: string;
  integrity: "VERIFIED" | "CORRUPTED";
  details: string;
}

export interface LedgerVerificationReport {
  totalBlocks: number;
  verifiedBlocks: number;
  isValid: boolean;
  tamperedBlockIndex?: number;
  lastVerifiedAt: string;
}
