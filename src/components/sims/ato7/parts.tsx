import type { ReactNode } from 'react';
import { Beat } from '../kit/Beat';
import { BODY_FONT } from '../kit/palette';

/**
 * Peças comuns do Ato VII (recuperação). Só composição: a coreografia vem do kit (Beat, Grow, Wipe).
 */

interface PhraseProps {
    beat: string | number;
    children: ReactNode;
    /** Largura máxima da frase, para não brigar com os selos à direita. */
    width?: number;
    size?: number;
}

/** A frase do passo (26–30 px): o que o professor está dizendo agora. */
export const Phrase = ({ beat, children, width = 760, size = 28 }: PhraseProps) => (
    <Beat beat={beat} className="font-semibold leading-[1.18] text-white" style={{ ...BODY_FONT, fontSize: size, maxWidth: width }}>
        {children}
    </Beat>
);

/** Linha de topo: frase à esquerda, selos (desenho do estudo, caso fictício) à direita. */
export const HeadRow = ({ children, chips }: { children: ReactNode; chips?: ReactNode }) => (
    <div className="flex items-start justify-between gap-6">
        <div className="min-h-[68px]">{children}</div>
        {chips && <div className="flex max-w-[400px] shrink-0 flex-wrap justify-end gap-2 pt-1">{chips}</div>}
    </div>
);

/** Rótulo de série com quadradinho de cor (a legenda vive junto da coisa, não numa caixa à parte). */
export const Swatch = ({ color, children, hollow = false }: { color: string; children: ReactNode; hollow?: boolean }) => (
    <span className="inline-flex items-center gap-2 text-[18px] text-gray-100">
        <span aria-hidden className="h-4 w-4 shrink-0 rounded-[4px] border-2"
            style={{ borderColor: color, background: hollow ? 'transparent' : color }} />
        {children}
    </span>
);
