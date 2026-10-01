import { useQuery } from "@tanstack/react-query";
import { getReports, getReportById } from "@/services/reports";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => getReportById(id),
    enabled: Boolean(id),
  });
}
