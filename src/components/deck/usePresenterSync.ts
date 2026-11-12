import { useEffect, useRef } from 'react';
import { useSlideStepStore } from '../../store/useSlideSteps';
import { PRESENTER_CHANNEL, type PresenterMessage } from './presenterChannel';

interface Nav {
    next: () => void;
    prev: () => void;
    goTo: (index: number) => void;
}

/**
 * Sincroniza com a janela do apresentador (P) — ou, na prévia, com quem a abriu: publica slide e passo,
 * obedece aos comandos (avançar, voltar, ir para). Devolve o estado atual num ref (para o atalho P).
 */
export const usePresenterSync = (index: number, nav: Nav) => {
    const step = useSlideStepStore(st => st.step);
    const stepCount = useSlideStepStore(st => st.count);
    const channelRef = useRef<BroadcastChannel | null>(null);
    const navRef = useRef(nav);
    useEffect(() => { navRef.current = nav; }, [nav]);
    const stateRef = useRef({ index, step, stepCount });

    useEffect(() => {
        stateRef.current = { index, step, stepCount };
        channelRef.current?.postMessage({ type: 'state', index, step, stepCount } satisfies PresenterMessage);
    }, [index, step, stepCount]);

    useEffect(() => {
        const channel = new BroadcastChannel(PRESENTER_CHANNEL);
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
            const msg = e.data;
            if (msg.type === 'next') navRef.current.next();
            else if (msg.type === 'prev') navRef.current.prev();
            else if (msg.type === 'goto') navRef.current.goTo(msg.index);
            else if (msg.type === 'hello') channel.postMessage({ type: 'state', ...stateRef.current } satisfies PresenterMessage);
        };
        return () => { channel.close(); channelRef.current = null; };
    }, []);

    return stateRef;
};
