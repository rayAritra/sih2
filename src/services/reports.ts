import { apiClient } from "./api-client";
import { SecurityReport } from "@/types";
import { DEMO_REPORTS } from "@/data/demo-fixtures";

export async function getReports(): Promise<SecurityReport[]> {
  return apiClient<SecurityReport[]>("/reports", { method: "GET" }, () => {
    return DEMO_REPORTS;
  });
}

export async function getReportById(id: string): Promise<SecurityReport | null> {
  return apiClient<SecurityReport>(
    `/reports/${id}`,
    { method: "GET" },
    () => {
      return DEMO_REPORTS.find((r) => r.id === id) || DEMO_REPORTS[0];
    }
  );
}
