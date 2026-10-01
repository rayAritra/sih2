import { create } from "zustand";
import { SystemMetrics } from "@/types";
import { DEMO_METRICS } from "@/data/demo-fixtures";
import { isDemoMode, setDataMode } from "@/services/api-client";

interface SystemState {
  metrics: SystemMetrics;
  isDemo: boolean;
  systemAlertActive: boolean;
  activeAttackName: string | null;
  setMetrics: (metrics: SystemMetrics) => void;
  toggleDataMode: () => void;
  triggerAttackState: (attackName: string) => void;
  resetSecurityState: () => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  metrics: DEMO_METRICS,
  isDemo: typeof window !== "undefined" ? isDemoMode() : true,
  systemAlertActive: false,
  activeAttackName: null,

  setMetrics: (metrics) => set({ metrics }),

  toggleDataMode: () => {
    const current = get().isDemo;
    const next = !current;
    setDataMode(next ? "demo" : "api");
    set({ isDemo: next });
  },

  triggerAttackState: (attackName: string) => {
    set((state) => ({
      systemAlertActive: true,
      activeAttackName: attackName,
      metrics: {
        ...state.metrics,
        systemStatus: "ATTACK_DETECTED",
        currentQber: 0.337,
        channelIntegrity: 0.663,
        threatsDetected: state.metrics.threatsDetected + 1,
      },
    }));
  },

  resetSecurityState: () => {
    set({
      systemAlertActive: false,
      activeAttackName: null,
      metrics: DEMO_METRICS,
    });
  },
}));
