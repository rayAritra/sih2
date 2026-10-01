import { apiClient } from "./api-client";
import { SystemMetrics } from "@/types";
import { DEMO_METRICS } from "@/data/demo-fixtures";

export async function getSystemMetrics(): Promise<SystemMetrics> {
  return apiClient<SystemMetrics>("/metrics", { method: "GET" }, () => {
    return DEMO_METRICS;
  });
}
