import { useQuery } from "@tanstack/react-query";
import { getSessions, getSessionById } from "@/services/sessions";

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id),
    enabled: Boolean(id),
  });
}
