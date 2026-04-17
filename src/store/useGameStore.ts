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

const BASIC_PHASE_ORDER = ["team", "actions", "diplomacy", "endOfTurn"] as const;
export const SPECIAL_PHASES = ["preparation", "introduction", "summary", "break"] as const;

type BasicPhaseId = (typeof BASIC_PHASE_ORDER)[number];
type SpecialPhaseId = (typeof SPECIAL_PHASES)[number];
type PhaseId = BasicPhaseId | SpecialPhaseId;

type StrictPhaseMap = {
  [K in PhaseId]: Omit<Phase, "id"> & { id: K };
};

type BasicPhase = StrictPhaseMap[BasicPhaseId];
type SpecialPhase = StrictPhaseMap[SpecialPhaseId];

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
  currentBasePhase: BasicPhase;
  specialPhase: SpecialPhase | null; // Overlay basic phase when special phase is active, otherwise null
  timeLeft: number | null; // null means timer is not setted for the current phase
  isRunning: boolean;
  round: number;
  // soundEnabled: boolean  // TODO: will be implemented in the future

  // Actions
  setBasicPhase: (phaseId: BasicPhaseId) => void;
  nextBasicPhase: () => void;
  prevBasicPhase: () => void;

  showSpecialPhase: (phaseId: SpecialPhaseId) => void;
  closeSpecialPhase: () => void;

  setRound: (round: number) => void;
  incrementRound: () => void;
  decrementRound: () => void;

  toggleTimer: () => void;
  tick: () => void;
  // setSoundEnabled: (enabled: boolean) => void    // TODO: will be implemented in the future
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // States
      currentBasePhase: PHASES[BASIC_PHASE_ORDER[0]],
      specialPhase: PHASES[INITIAL_SPECIAL_PHASE_ID],
      timeLeft: null,
      isRunning: false,
      round: 1,
      // soundEnabled: false,  // TODO: will be implemented in the future

      // Actions
      setBasicPhase: (phaseId) => {
        set({
          currentBasePhase: PHASES[phaseId],
          timeLeft: PHASES[phaseId].durationSeconds,
          isRunning: false,
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
          if (state.round <= 1)
            return; // Do not allow going to previous phase if it's already the first round
          state.decrementRound();
          prevIndex =
            (prevIndex + BASIC_PHASE_ORDER.length) % BASIC_PHASE_ORDER.length;
        }

        const prevId = BASIC_PHASE_ORDER[prevIndex];
        state.setBasicPhase(prevId);
      },

      showSpecialPhase: (phaseId) => {
        set({ specialPhase: PHASES[phaseId] });
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

      toggleTimer: () => {
        set((state) => ({ isRunning: !state.isRunning }));
      },
      tick: () => {
        const state = get();

        if (state.isRunning && state.timeLeft !== null && state.timeLeft > 0) {
          set({ timeLeft: state.timeLeft - 1 });
        }
      },
    }),
    {
      // Persistence settings
      name: "dicecon-phase-storage",

      partialize: (state) => ({
        currentBasePhase: state.currentBasePhase,
        specialPhase: state.specialPhase,
        timeLeft: state.timeLeft,
        round: state.round,
        // soundEnabled: state.soundEnabled // TODO: will be implemented in the future
      }),
    },
  ),
);
