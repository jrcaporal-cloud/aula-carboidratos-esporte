import { create } from 'zustand';

/** Ponto da tela (relativo ao deck) onde a glicose pousa enquanto a abertura de ato está na tela. */
export interface GlucoseStop {
    x: number;
    y: number;
    size: number;
}

interface MotionState {
    /** Nó do ato atual na trilha da abertura; null = a glicose segue o título do slide. */
    stop: GlucoseStop | null;
    setStop: (stop: GlucoseStop | null) => void;
}

export const useMotionStore = create<MotionState>(set => ({
    stop: null,
    setStop: stop => set({ stop }),
}));
