import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';

/**
 * Elos numerados dos slides 166 (Calor e Altitude) e 167 (Mulheres e Jovens), no molde de `ato3/chainStrip`:
 * um estudo por elo, com número + estudo + quem/onde e o desenho dele (cada medida com o seu eixo e a sua unidade
 * escritos ao lado). Antes do passo, só a moldura tracejada com o nome do estudo, para o aluno ver o caminho inteiro.
 * Duas formas: `StudyBand` (faixa larga: rótulo à esquerda, desenho à direita) e `StudyCard` (cartão de coluna:
 * rótulo em cima, desenho embaixo).
 */

const DARK = '#04080F';
/** Cinza da referência (o grupo de comparação) e do "antes" dentro de uma barra. */
export const BEFORE = '#64748B';

interface LinkProps {
    n: number;
    title: ReactNode;
    /** Quem/onde (amostra, condição). */
    meta: ReactNode;
    show: boolean;
    born: boolean;
    children: ReactNode;
}

const frame = (show: boolean) => ({
    borderColor: show ? '#475569' : '#334155', borderStyle: show ? 'solid' : 'dashed', transition: 'border-color 300ms',
} as const);

const Head = ({ n, title, show }: { n: number; title: ReactNode; show: boolean }) => (
    <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold"
            style={{ background: show ? '#F3F4F6' : '#334155', color: show ? DARK : '#94A3B8' }}>{n}</span>
        <span className="flex items-center gap-1 whitespace-nowrap text-[17px] font-bold leading-tight" style={{ color: show ? '#FFFFFF' : '#94A3B8' }}>{title}</span>
    </div>
);

const Body = ({ born, children }: { born: boolean; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="min-w-0"
            initial={born && !reduce ? { opacity: 0, x: 10 } : false} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DUR.enter, delay: born ? 0.15 : 0, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

/** Faixa larga: número, estudo e quem/onde à esquerda; o desenho à direita. */
export const StudyBand = ({ n, title, meta, show, born, children }: LinkProps) => (
    <div className="grid grid-cols-[176px_1fr] items-center gap-2.5 rounded-xl border-2 px-3 py-0.5" style={frame(show)}>
        <div className="flex flex-col gap-0.5">
            <Head n={n} title={title} show={show} />
            {show && <span className="text-[16px] leading-tight text-gray-300">{meta}</span>}
        </div>
        {show ? <Body born={born}>{children}</Body> : <span />}
    </div>
);

/** Cartão de coluna: número, estudo e quem/onde em cima; o desenho embaixo. */
export const StudyCard = ({ n, title, meta, show, born, children }: LinkProps) => (
    <div className="flex flex-col gap-1.5 rounded-xl border-2 px-2 py-2" style={frame(show)}>
        <div className="flex flex-col gap-0.5">
            <Head n={n} title={title} show={show} />
            {show && <span className="text-[16px] leading-tight text-gray-300">{meta}</span>}
        </div>
        {show && <Body born={born}>{children}</Body>}
    </div>
);

/** Rótulo de grupo (CALOR, ALTITUDE, MULHERES, JOVENS) com ícone. */
export const GroupLabel = ({ icon: Icon, color, children }: { icon: LucideIcon; color: string; children: ReactNode }) => (
    <span className="flex items-center gap-1.5 text-[16px] font-semibold uppercase tracking-wide" style={{ color }}>
        <Icon size={18} strokeWidth={2.6} aria-hidden />{children}
    </span>
);

export interface BarRow {
    label: string;
    value: number;
    /** Texto do valor (vazio = barra ainda não medida neste passo). */
    text: ReactNode;
    color: string;
    /** Parte de baixo da barra pintada de cinza (o "antes"). */
    base?: number;
    delta?: string;
    deltaColor?: string;
}

interface BarsProps {
    rows: readonly BarRow[];
    max: number;
    labelWidth?: number;
    valueWidth?: number;
    /** Reserva a coluna do Δ (para alinhar as medidas de um mesmo elo). */
    deltaWidth?: number;
}

/** Uma barra por grupo, escala real a partir do zero; rótulo do grupo à esquerda, valor (e Δ) à direita. */
export const Bars = ({ rows, max, labelWidth = 66, valueWidth = 52, deltaWidth = 0 }: BarsProps) => (
    <div className="flex flex-col gap-1">
        {rows.map((r, i) => (
            <div key={r.label} className="flex items-center gap-2 leading-tight">
                <span className="shrink-0 whitespace-nowrap text-[16px] font-semibold text-gray-200" style={{ width: labelWidth }}>{r.label}</span>
                <div className="relative h-[20px] min-w-0 flex-1 overflow-hidden rounded-r" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <Grow value={r.value / max} color={r.color} delay={0.2 + i * 0.12} />
                    {r.base !== undefined && <Grow value={r.base / max} color={BEFORE} delay={0.2 + i * 0.12} />}
                </div>
                <span className="shrink-0 whitespace-nowrap text-right font-mono text-[17px] font-bold tabular-nums text-white" style={{ width: valueWidth }}>{r.text}</span>
                {deltaWidth > 0 && (
                    <span className="shrink-0 whitespace-nowrap text-right font-mono text-[17px] font-bold tabular-nums" style={{ width: deltaWidth, color: r.deltaColor ?? '#F3F4F6' }}>{r.delta ?? ''}</span>
                )}
            </div>
        ))}
    </div>
);

/** Legenda de uma medida: o que se mede (forte) e a unidade (fraca). */
export const Caption = ({ measure, unit }: { measure: string; unit: string }) => (
    <span className="whitespace-nowrap text-[16px] leading-tight">
        <span className="font-semibold text-gray-100">{measure}</span> <span className="text-gray-300">· {unit}</span>
    </span>
);

/** Medida com a legenda em cima das barras (cartão de coluna). */
export const Measure = ({ measure, unit, ...bars }: BarsProps & { measure: string; unit: string }) => (
    <div className="flex flex-col gap-0.5">
        <Caption measure={measure} unit={unit} />
        <Bars {...bars} />
    </div>
);

/** Medida com a legenda à esquerda das barras (faixa larga). */
export const MeasureSide = ({ measure, unit, legend, ...bars }: BarsProps & { measure: string; unit: string; legend?: ReactNode }) => (
    <div className="grid grid-cols-[132px_1fr] items-center gap-2">
        <div className="flex flex-col whitespace-nowrap leading-tight">
            <span className="text-[16px] font-semibold text-gray-100">{measure}</span>
            <span className="text-[16px] text-gray-300">{unit}</span>
            {legend}
        </div>
        <Bars {...bars} />
    </div>
);
