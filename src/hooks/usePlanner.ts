import { useMutation, useQuery } from "@tanstack/react-query";
import { calculatePlannerParameters, getSecurityEnvelopePoints } from "@/services/planner";
import { PlannerInput } from "@/types";

export function usePlanner() {
  const mutation = useMutation({
    mutationFn: (input: PlannerInput) => calculatePlannerParameters(input),
  });

  const envelopeQuery = useQuery({
    queryKey: ["security-envelope"],
    queryFn: () => getSecurityEnvelopePoints(),
  });

  return {
    calculate: mutation.mutate,
    isCalculating: mutation.isPending,
    result: mutation.data,
    envelopePoints: envelopeQuery.data || [],
    isLoadingEnvelope: envelopeQuery.isLoading,
  };
}
