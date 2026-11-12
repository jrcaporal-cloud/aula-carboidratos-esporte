import type { ReactNode } from 'react';
import { Beat } from '../kit/Beat';
import { Source } from '../kit/ui';

/**
 * Peças de moldura do Ato IV (o tanque). Cada slide escolhe a sua composição;
 * aqui fica só o que todos repetem: a frase do passo com os selos à direita e a linha de fonte embaixo.
 */

/** Caixa do simulador: 1136 × 500 px de projeto, nada rola. */
export const SimBox = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`not-prose relative flex h-[500px] w-full flex-col overflow-hidden ${className}`}>{children}</div>
);

interface LeadProps {
    beat: string | number;
    children: ReactNode;
    /** Selos do passo (desenho do estudo, ilustrativo…): canto superior direito, alinhados com a frase. */
    chips?: ReactNode;
    /** Coluna estreita: os selos sobem para uma linha acima da frase, à direita. */
    stacked?: boolean;
    className?: string;
}

/** A frase-chave do passo (28 px), trocando com esmaecimento curto, com os selos do passo à direita. */
export const Lead = ({ beat, children, chips, stacked = false, className = '' }: LeadProps) => (
    <div className={`flex gap-6 ${stacked ? 'flex-col-reverse gap-3' : 'items-start justify-between'} ${className}`}>
        <Beat beat={beat} className="min-w-0 flex-1">
            <p className="m-0 text-[28px] font-medium leading-[1.22] text-gray-50" style={{ textWrap: 'balance' }}>{children}</p>
        </Beat>
        {chips && <div className={`flex flex-wrap justify-end gap-2 pt-1 ${stacked ? '' : 'max-w-[400px] shrink-0'}`}>{chips}</div>}
    </div>
);

/** Rodapé: a linha de fonte, à esquerda, largura total. */
export const Foot = ({ source }: { source: ReactNode }) => (
    <div className="mt-auto pt-3"><Source>{source}</Source></div>
);
