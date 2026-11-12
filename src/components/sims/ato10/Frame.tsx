import type { ReactNode } from 'react';
import { Beat } from '../kit/Beat';
import { Source } from '../kit/ui';
import { SIM_H } from './units';


interface FrameProps {
    /** Passo atual: troca a frase com o esmaecimento do Beat. */
    step: number;
    /** A frase do passo (26–30 px). */
    line: ReactNode;
    /** Selos de honestidade à direita da frase. */
    chips?: ReactNode;
    /** Linha de fonte no pé. */
    source?: ReactNode;
    children: ReactNode;
}

/**
 * Moldura comum do ato: frase do passo no alto (espaço de duas linhas reservado, para nada pular),
 * selos à direita, palco no meio, fonte no pé. O que muda de slide para slide é o palco.
 */
export const Frame = ({ step, line, chips, source, children }: FrameProps) => (
    <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
        <div className="flex min-h-[70px] items-start justify-between gap-6">
            <Beat beat={step} className="max-w-[790px] text-[28px] font-semibold leading-[1.2] text-white">{line}</Beat>
            {chips && <div className="flex max-w-[330px] shrink-0 flex-wrap justify-end gap-2 pt-1">{chips}</div>}
        </div>
        <div className="relative min-h-0 flex-1">{children}</div>
        {source && <Source>{source}</Source>}
    </div>
);
