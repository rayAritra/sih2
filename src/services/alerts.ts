import { apiClient } from "./api-client";
import { SecurityAlert } from "@/types";
import { DEMO_ALERTS } from "@/data/demo-fixtures";

export async function getAlerts(): Promise<SecurityAlert[]> {
  return apiClient<SecurityAlert[]>("/alerts", { method: "GET" }, () => {
    return DEMO_ALERTS;
  });
}
