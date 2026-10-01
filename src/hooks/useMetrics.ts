import { useQuery } from "@tanstack/react-query";
import { getSystemMetrics } from "@/services/metrics";
import { useSystemStore } from "@/stores/useSystemStore";
import { useEffect } from "react";

export function useMetrics() {
  const setMetrics = useSystemStore((s) => s.setMetrics);
  const storeMetrics = useSystemStore((s) => s.metrics);

  const query = useQuery({
    queryKey: ["metrics"],
    queryFn: getSystemMetrics,
    refetchInterval: 5000,
    initialData: storeMetrics,
  });

  useEffect(() => {
    if (query.data) {
      setMetrics(query.data);
    }
  }, [query.data, setMetrics]);

  return {
    ...query,
    metrics: storeMetrics || query.data,
  };
}
