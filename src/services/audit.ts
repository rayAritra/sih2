import { apiClient } from "./api-client";
import { AuditEvent, LedgerVerificationReport } from "@/types";
import { DEMO_AUDIT_BLOCKS } from "@/data/demo-fixtures";

export async function getAuditLedger(): Promise<AuditEvent[]> {
  return apiClient<AuditEvent[]>("/audit", { method: "GET" }, () => {
    return DEMO_AUDIT_BLOCKS;
  });
}

export async function verifyLedgerChain(): Promise<LedgerVerificationReport> {
  return apiClient<LedgerVerificationReport>(
    "/audit/verify",
    { method: "POST" },
    () => {
      return {
        totalBlocks: DEMO_AUDIT_BLOCKS.length,
        verifiedBlocks: DEMO_AUDIT_BLOCKS.length,
        isValid: true,
        lastVerifiedAt: new Date().toISOString(),
      };
    }
  );
}
