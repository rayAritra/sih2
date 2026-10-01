import { StatisticalEvidence } from "./quantum";
import { AttackTypeId } from "./attacks";

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";

export type ThreatCategory =
  | "FORGERY"
  | "IMPERSONATION"
  | "REPLAY"
  | "CHANNEL_MANIPULATION"
  | "SYSTEM";

export interface SecurityAlert {
  id: string;
  severity: AlertSeverity;
  category: ThreatCategory;
  attackName: string;
  attackType?: AttackTypeId;
  sessionId: string;
  timestamp: string;
  qber: number;
  honestQberBaseline: number;
  llr: number;
  status: "ACTIVE" | "CONTAINED" | "RESOLVED";
  summary: string;
  deterministicReason: string;
  evidence: StatisticalEvidence;
}

export interface AlertFilter {
  severity?: AlertSeverity | "ALL";
  category?: ThreatCategory | "ALL";
  search?: string;
}
