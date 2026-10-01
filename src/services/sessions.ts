import { apiClient } from "./api-client";
import { QuantumSession } from "@/types";
import { DEMO_SESSIONS } from "@/data/demo-fixtures";

export async function getSessions(): Promise<QuantumSession[]> {
  return apiClient<QuantumSession[]>("/sessions", { method: "GET" }, () => {
    return DEMO_SESSIONS;
  });
}

export async function getSessionById(id: string): Promise<QuantumSession | null> {
  return apiClient<QuantumSession>(
    `/sessions/${id}`,
    { method: "GET" },
    () => {
      const match = DEMO_SESSIONS.find((s) => s.id === id);
      return match || DEMO_SESSIONS[0]; // fallback to first session if matching
    }
  );
}
