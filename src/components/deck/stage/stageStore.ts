import { create } from 'zustand';
import { C } from '../../sims/kit/palette';

/**
 * Cores da caneta: vermelho (atenção, a cor de risco da aula) e branco (neutro). Nenhuma das duas
 * é uma cor de molécula: o risco na tela nunca se confunde com glicose, glicogênio ou lactato.
 */
export const PEN_COLORS = [
    { id: 'vermelha', label: 'vermelha', hex: C.risk },
    { id: 'branca', label: 'branca', hex: C.text },
] as const;

export type PenColorId = (typeof PEN_COLORS)[number]['id'];

interface StageToolsState {
    /** Holofote (L): escurece tudo menos um círculo em volta do mouse. */
    spotlight: boolean;
    /** Clique fixa o holofote no lugar; outro clique solta. */
    spotlightPinned: boolean;
    /** Caneta (K): traço chapado que se apaga sozinho. */
    pen: boolean;
    penColor: PenColorId;
    toggleSpotlight: () => void;
    togglePinned: () => void;
    togglePen: () => void;
    cyclePenColor: () => void;
    setPenColor: (color: PenColorId) => void;
    allOff: () => void;
}

export const useStageTools = create<StageToolsState>(set => ({
    spotlight: false,
    spotlightPinned: false,
    pen: false,
    penColor: 'vermelha',
    toggleSpotlight: () => set(s => ({ spotlight: !s.spotlight, spotlightPinned: false })),
    togglePinned: () => set(s => ({ spotlightPinned: !s.spotlightPinned })),
    togglePen: () => set(s => ({ pen: !s.pen })),
    cyclePenColor: () => set(s => ({ penColor: s.penColor === 'vermelha' ? 'branca' : 'vermelha' })),
    setPenColor: penColor => set({ penColor }),
    allOff: () => set({ spotlight: false, spotlightPinned: false, pen: false }),
}));

export const penHex = (id: PenColorId): string => PEN_COLORS.find(c => c.id === id)?.hex ?? C.risk;
