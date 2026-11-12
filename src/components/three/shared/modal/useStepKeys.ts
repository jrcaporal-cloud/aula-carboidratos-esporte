import { useEffect, useRef } from 'react';

export interface StepKeyActions {
    next: () => void;
    prev: () => void;
    togglePlay: () => void;
    close: () => void;
}

const FWD = ['ArrowRight', 'PageDown', 'ArrowDown'];
const BACK = ['ArrowLeft', 'PageUp', 'ArrowUp'];

/**
 * Teclado do modal, capturado antes da aula (fase de captura + stopPropagation): ←/→, PageUp/PageDown
 * e ↑/↓ trocam de etapa (o passador manda PageUp/PageDown), Espaço liga o ▶, Esc e 3 fecham.
 * Com Ctrl, Cmd ou Alt nada é capturado (atalhos do navegador). Ao desmontar, o teclado volta ao deck.
 */
export const useStepKeys = (actions: StepKeyActions): void => {
    const latest = useRef(actions);
    useEffect(() => { latest.current = actions; });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const a = latest.current;
            if (FWD.includes(e.key)) a.next();
            else if (BACK.includes(e.key)) a.prev();
            else if (e.key === ' ') a.togglePlay();
            else if (e.key === 'Escape' || e.key === '3') a.close();
            else return;
            e.preventDefault();
            e.stopPropagation();
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, []);
};
