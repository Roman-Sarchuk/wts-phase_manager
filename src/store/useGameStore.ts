import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PhaseType = "basic" | "special";

/**
 * Basic phase usually have durationSeconds but no description,
 * while special phase can have description but no durationSeconds.
 *
 * If description is null, it will not be shown in the UI,
 * and if durationSeconds is null, progress bar and time display will not be shown in the UI.
 */
export interface Phase {
  id: string;
  type: PhaseType;
  name: string;
  description: string | null;
  durationSeconds: number | null;
  // sound: string | null   // TODO: will be implemented in the future
  color: {
    background: string;
    text: string;
  };
}

const BASIC_PHASE_ORDER = [
  "team",
  "actions",
  "diplomacy",
  "endOfTurn",
] as const;
export const SPECIAL_PHASES = [
  "preparation",
  "introduction",
  "summary",
  "break",
] as const;

type BasicPhaseId = (typeof BASIC_PHASE_ORDER)[number];
type SpecialPhaseId = (typeof SPECIAL_PHASES)[number];
type PhaseId = BasicPhaseId | SpecialPhaseId;

type StrictPhaseMap = {
  [K in PhaseId]: Omit<Phase, "id"> & { id: K };
};

type BasicPhase = StrictPhaseMap[BasicPhaseId];
type SpecialPhase = StrictPhaseMap[SpecialPhaseId];
type PhaseUpdate = Partial<Omit<Phase, "id" | "type">>;

export const PHASES = {
  // Basic phases
  team: {
    id: "team",
    type: "basic",
    name: "Фаза команд",
    description: null,
    durationSeconds: 480, // 8 minutes
    color: {
      background: "bg-[#2ECC71]",
      text: "text-black",
    },
  },
  actions: {
    id: "actions",
    type: "basic",
    name: "Фаза дій",
    description: null,
    durationSeconds: 900, // 15 minutes
    color: {
      background: "bg-[#E67E22]",
      text: "text-black",
    },
  },
  diplomacy: {
    id: "diplomacy",
    type: "basic",
    name: "Фаза дипломатії",
    description: null,
    durationSeconds: 480, // 8 minutes
    color: {
      background: "bg-[#8E44AD]",
      text: "text-white",
    },
  },
  endOfTurn: {
    id: "endOfTurn",
    type: "basic",
    name: "Фаза кінця ходу",
    description: null,
    durationSeconds: 240, // 4 minutes
    color: {
      background: "bg-[#C0392B]",
      text: "text-white",
    },
  },
  // Special phases
  preparation: {
    id: "preparation",
    type: "special",
    name: "Підготовка до гри",
    description: null,
    durationSeconds: null,
    color: {
      background: "bg-[#1A1A1B]",
      text: "text-yellow-main",
    },
  },
  introduction: {
    id: "introduction",
    type: "special",
    name: "Ознайомчий брифінг",
    description: null,
    durationSeconds: null,
    color: {
      background: "bg-[#2F3542]",
      text: "text-white",
    },
  },
  summary: {
    id: "summary",
    type: "special",
    name: "Підсумковий брифінг",
    description: null,
    durationSeconds: null,
    color: {
      background: "bg-[#464C59]",
      text: "text-white",
    },
  },
  break: {
    id: "break",
    type: "special",
    name: "Перерва",
    description: "До 30 хвилин",
    durationSeconds: null,
    color: {
      background: "bg-[#3498DB]",
      text: "text-white",
    },
  },
} satisfies StrictPhaseMap;

const INITIAL_SPECIAL_PHASE_ID: SpecialPhaseId = "preparation";

interface GameState {
  // States
  phases: StrictPhaseMap;
  currentBasePhase: BasicPhase;
  specialPhase: SpecialPhase | null; // Overlay basic phase when special phase is active, otherwise null
  timeLeft: number | null; // null means timer is not setted for the current phase
  isRunning: boolean;
  round: number;
  // soundEnabled: boolean  // TODO: will be implemented in the future

  // Actions
  setBasicPhase: (phaseId: BasicPhaseId) => void;
  updatePhase: (phaseId: PhaseId, updates: PhaseUpdate) => void;
  nextBasicPhase: () => void;
  prevBasicPhase: () => void;

  showSpecialPhase: (phaseId: SpecialPhaseId) => void;
  closeSpecialPhase: () => void;

  setRound: (round: number) => void;
  incrementRound: () => void;
  decrementRound: () => void;

  setCurrentPhaseTime: (seconds: number | null) => void;
  setLeftTimer: (seconds: number) => void;
  toggleTimer: () => void;
  tick: () => void;
  // setSoundEnabled: (enabled: boolean) => void    // TODO: will be implemented in the future
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // States
      phases: PHASES,
      currentBasePhase: PHASES[BASIC_PHASE_ORDER[0]],
      specialPhase: PHASES[INITIAL_SPECIAL_PHASE_ID],
      timeLeft: PHASES[BASIC_PHASE_ORDER[0]].durationSeconds,
      isRunning: false,
      round: 1,
      // soundEnabled: false,  // TODO: will be implemented in the future

      // Actions
      setBasicPhase: (phaseId) => {
        const state = get();
        const phase = state.phases[phaseId];

        set({
          currentBasePhase: phase,
          timeLeft: phase.durationSeconds,
          isRunning: false,
        });
      },
      updatePhase: (phaseId, updates) => {
        set((state) => {
          const nextPhase = {
            ...state.phases[phaseId],
            ...updates,
            id: phaseId,
          } as StrictPhaseMap[typeof phaseId];

          const nextPhases = {
            ...state.phases,
            [phaseId]: nextPhase,
          } as StrictPhaseMap;

          const nextState: Partial<GameState> = {
            phases: nextPhases,
          };

          const activePhaseId = state.specialPhase
            ? state.specialPhase.id
            : state.currentBasePhase.id;

          if (state.currentBasePhase.id === phaseId) {
            nextState.currentBasePhase = nextPhase as BasicPhase;
          }

          if (state.specialPhase?.id === phaseId) {
            nextState.specialPhase = nextPhase as SpecialPhase;
          }

          if (
            activePhaseId === phaseId &&
            Object.prototype.hasOwnProperty.call(updates, "durationSeconds")
          ) {
            const duration = nextPhase.durationSeconds;

            if (duration === null) {
              nextState.timeLeft = null;
            } else if (state.timeLeft === null) {
              nextState.timeLeft = duration;
            } else {
              nextState.timeLeft = Math.min(state.timeLeft, duration);
            }
          }

          return nextState;
        });
      },
      nextBasicPhase: () => {
        const state = get();

        const currentId = state.currentBasePhase.id;
        const currentIndex = BASIC_PHASE_ORDER.indexOf(currentId);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= BASIC_PHASE_ORDER.length) {
          state.incrementRound();
          nextIndex = nextIndex % BASIC_PHASE_ORDER.length;
        }

        const nextId = BASIC_PHASE_ORDER[nextIndex];
        state.setBasicPhase(nextId);
      },
      prevBasicPhase: () => {
        const state = get();

        const currentId = state.currentBasePhase.id;
        const currentIndex = BASIC_PHASE_ORDER.indexOf(currentId);
        let prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
          if (state.round <= 1) return; // Do not allow going to previous phase if it's already the first round
          state.decrementRound();
          prevIndex =
            (prevIndex + BASIC_PHASE_ORDER.length) % BASIC_PHASE_ORDER.length;
        }

        const prevId = BASIC_PHASE_ORDER[prevIndex];
        state.setBasicPhase(prevId);
      },

      setCurrentPhaseTime: (seconds) => {
        if (seconds !== null && seconds < 0) return;

        const state = get();

        const phaseId = state.specialPhase
          ? state.specialPhase.id
          : state.currentBasePhase.id;
        state.updatePhase(phaseId, { durationSeconds: seconds });
      },
      showSpecialPhase: (phaseId) => {
        const state = get();
        set({ specialPhase: state.phases[phaseId] });
      },
      closeSpecialPhase: () => {
        set({ specialPhase: null });
      },

      setRound: (round) => {
        set({ round });
      },
      incrementRound: () => {
        set((state) => ({ round: state.round + 1 }));
      },
      decrementRound: () => {
        set((state) => ({ round: Math.max(1, state.round - 1) }));
      },

      setLeftTimer: (seconds) => {
        const state = get();
        const activePhase = state.specialPhase ?? state.currentBasePhase;
        const maxDuration = activePhase.durationSeconds;

        if (maxDuration === null || state.timeLeft === null) return;

        const nextTimeLeft = Math.max(0, Math.min(maxDuration, state.timeLeft + seconds));
        set({ timeLeft: nextTimeLeft });
      },
      toggleTimer: () => {
        set((state) => {
          const activePhase = state.specialPhase ?? state.currentBasePhase;

          if (activePhase.durationSeconds === null || state.timeLeft === null) {
            return { isRunning: false };
          }

          if (state.timeLeft <= 0) {
            return { isRunning: false };
          }

          return { isRunning: !state.isRunning };
        });
      },
      tick: () => {
        const state = get();

        if (!state.isRunning || state.timeLeft === null) return;

        if (state.timeLeft <= 0) {
          set({ isRunning: false, timeLeft: 0 });
          return;
        }

        const nextTimeLeft = state.timeLeft - 1;
        set({ timeLeft: nextTimeLeft, isRunning: nextTimeLeft > 0 });
      },
    }),
    {
      // Persistence settings
      name: "wts-phase-storage",

      partialize: (state) => ({
        phases: state.phases,
        currentBasePhase: state.currentBasePhase,
        specialPhase: state.specialPhase,
        timeLeft: state.timeLeft,
        round: state.round,
        // soundEnabled: state.soundEnabled // TODO: will be implemented in the future
      }),
    },
  ),
);
