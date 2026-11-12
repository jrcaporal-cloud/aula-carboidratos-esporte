import type { CSSProperties, ReactNode } from 'react';
import { BODY_FONT } from '../kit/palette';
import { Source } from '../kit/ui';

/**
 * Moldura comum do Ato VI: caixa de 1136 × 500 px de projeto.
 * Em cima, a frase-chave (opcional) à esquerda e os selos do passo no canto superior direito;
 * no meio, o palco; embaixo, a linha de fonte à esquerda, largura total. Nada rola nem estoura.
 */
interface SimFrameProps {
    children: ReactNode;
    /** A frase-chave do passo (normalmente um <Beat><Lead/></Beat>). */
    lead?: ReactNode;
    /** Selos do kit (desenho, indústria, ilustrativo, tecla 3…), no canto superior direito. */
    chips?: ReactNode;
    /** Fonte curta do passo; a lista completa fica atrás da tecla D. */
    source?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export const SimFrame = ({ children, lead, chips, source, className = '', style }: SimFrameProps) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3" style={{ ...BODY_FONT, ...style }}>
        {(lead || chips) && (
            <div className="flex items-start gap-6">
                <div className="min-w-0 flex-1">{lead}</div>
                {chips && <div className="flex max-w-[460px] shrink-0 flex-wrap justify-end gap-2 pt-1">{chips}</div>}
            </div>
        )}
        <div className={`relative min-h-0 flex-1 ${className}`}>{children}</div>
        {source && <div className="w-full"><Source>{source}</Source></div>}
    </div>
);

/** A frase-chave do passo (26–34 px), em fonte de texto: lida de longe pela chamada. */
export const Lead = ({ children, color = '#F9FAFB', size = 28, className = '' }: {
    children: ReactNode; color?: string; size?: number; className?: string;
}) => (
    <p className={`m-0 font-semibold leading-[1.18] ${className}`} style={{ color, fontSize: size, textWrap: 'balance' }}>{children}</p>
);

/** Texto de apoio (≥ 20 px). */
export const Body = ({ children, className = '', color = '#D1D5DB' }: { children: ReactNode; className?: string; color?: string }) => (
    <p className={`m-0 text-[20px] leading-snug ${className}`} style={{ color, textWrap: 'pretty' }}>{children}</p>
);
