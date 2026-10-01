import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuditLedger, verifyLedgerChain } from "@/services/audit";

export function useAuditLedger() {
  const queryClient = useQueryClient();

  const ledgerQuery = useQuery({
    queryKey: ["audit-ledger"],
    queryFn: getAuditLedger,
  });

  const verifyMutation = useMutation({
    mutationFn: verifyLedgerChain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-ledger"] });
    },
  });

  return {
    ...ledgerQuery,
    verifyChain: verifyMutation.mutate,
    isVerifying: verifyMutation.isPending,
    verificationReport: verifyMutation.data,
  };
}
