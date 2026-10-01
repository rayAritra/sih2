import { create } from "zustand";
import { MeasurementRecord, QuantumSession } from "@/types";
import { runSimulation, SimulationParams } from "@/services/simulator";
import { honestIdealSession } from "@/data/demo-fixtures";

interface SimulatorState {
  isRunning: boolean;
  activeStageIndex: number;
  currentMeasurementIndex: number;
  totalMeasurements: number;
  mismatchCount: number;
  currentQber: number;
  sprtLlr: number;
  threshold: number;
  activeSession: QuantumSession | null;
  activeRecord: MeasurementRecord | null;

  startSimulation: (params: SimulationParams) => Promise<void>;
  resetSimulation: () => void;
  jumpToPosition: (pos: number) => void;
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  isRunning: false,
  activeStageIndex: 0,
  currentMeasurementIndex: 47,
  totalMeasurements: 200,
  mismatchCount: 2,
  currentQber: 0.0425,
  sprtLlr: -7.82,
  threshold: 20,
  activeSession: honestIdealSession,
  activeRecord: honestIdealSession.measurements ? honestIdealSession.measurements[46] : null,

  startSimulation: async (params: SimulationParams) => {
    set({
      isRunning: true,
      activeStageIndex: 1,
      currentMeasurementIndex: 0,
      mismatchCount: 0,
      currentQber: 0,
      sprtLlr: 0,
      totalMeasurements: params.signatureLength,
      threshold: params.threshold,
    });

    try {
      const session = await runSimulation(params);

      // Animate stages smoothly
      for (let stage = 1; stage <= 8; stage++) {
        set({ activeStageIndex: stage });
        await new Promise((r) => setTimeout(r, 180));
      }

      // Simulate measurement progression
      const measurements = session.measurements || [];
      const stopAt = session.sprt?.stoppedAtStep || measurements.length;

      const stepIncrement = Math.max(1, Math.floor(stopAt / 15));
      for (let i = 0; i <= stopAt; i += stepIncrement) {
        const curIdx = Math.min(i, stopAt);
        const curRecord = measurements[curIdx > 0 ? curIdx - 1 : 0];
        const stepMismatches = measurements.slice(0, curIdx).filter((m) => !m.match).length;
        const qber = curIdx > 0 ? stepMismatches / curIdx : 0;
        const llr = session.sprt?.trajectory[curIdx > 0 ? curIdx - 1 : 0]?.llr || 0;

        set({
          currentMeasurementIndex: curIdx,
          mismatchCount: stepMismatches,
          currentQber: qber,
          sprtLlr: llr,
          activeRecord: curRecord,
        });

        await new Promise((r) => setTimeout(r, 60));
      }

      set({
        isRunning: false,
        activeSession: session,
        currentMeasurementIndex: stopAt,
        mismatchCount: session.mismatchCount,
        currentQber: session.qber,
        sprtLlr: session.sprt?.currentLlr || 0,
        activeRecord: measurements[stopAt - 1] || null,
      });
    } catch (err) {
      console.error("Simulation error", err);
      set({ isRunning: false });
    }
  },

  resetSimulation: () => {
    set({
      isRunning: false,
      activeStageIndex: 0,
      currentMeasurementIndex: 0,
      mismatchCount: 0,
      currentQber: 0,
      sprtLlr: 0,
    });
  },

  jumpToPosition: (pos: number) => {
    const session = get().activeSession;
    if (session && session.measurements && pos > 0 && pos <= session.measurements.length) {
      const record = session.measurements[pos - 1];
      set({
        currentMeasurementIndex: pos,
        activeRecord: record,
      });
    }
  },
}));
