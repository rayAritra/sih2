import { create } from "zustand";
import { AttackDefinition, AttackResult, AttackSimulationConfig, AttackTypeId } from "@/types";
import { ATTACK_CATALOG } from "@/config/threat-catalog";
import { runAttackSimulation } from "@/services/attacks";
import { useSystemStore } from "./useSystemStore";

interface AttackLabState {
  selectedAttack: AttackDefinition | null;
  configModalOpen: boolean;
  resultModalOpen: boolean;
  isLaunching: boolean;
  lastResult: AttackResult | null;

  openConfig: (attack: AttackDefinition) => void;
  closeConfig: () => void;
  closeResult: () => void;
  executeAttack: (config: AttackSimulationConfig) => Promise<void>;
}

export const useAttackLabStore = create<AttackLabState>((set, get) => ({
  selectedAttack: null,
  configModalOpen: false,
  resultModalOpen: false,
  isLaunching: false,
  lastResult: null,

  openConfig: (attack) => set({ selectedAttack: attack, configModalOpen: true }),
  closeConfig: () => set({ configModalOpen: false }),
  closeResult: () => set({ resultModalOpen: false }),

  executeAttack: async (config: AttackSimulationConfig) => {
    set({ isLaunching: true });
    try {
      const result = await runAttackSimulation(config);
      await new Promise((r) => setTimeout(r, 600)); // Controlled dramatic progression

      if (result.detected) {
        useSystemStore.getState().triggerAttackState(result.attackName);
      }

      set({
        isLaunching: false,
        configModalOpen: false,
        lastResult: result,
        resultModalOpen: true,
      });
    } catch (err) {
      console.error("Attack simulation failed", err);
      set({ isLaunching: false });
    }
  },
}));
