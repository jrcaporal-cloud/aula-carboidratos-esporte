import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br, signed } from '../kit/format';
import { CYCLE } from './womenYouth.content';

/** Peças do palco do slide 167: barras verticais (com marca do "antes"), régua do ciclo e barras horizontais. */

export interface VBar {
    label: string;
    value: number;
    color: string;
    /** Texto em cima da barra (padrão: o valor com `decimals`). */
    text?: string;
    /** Valor antes (marca tracejada escura dentro da barra). */
    before?: number;
}

interface VBarsProps {
    bars: readonly VBar[];
    max: number;
    height?: number;
    width?: number;
    decimals?: number;
    delay?: number;
}

export const VBars = ({ bars, max, height = 104, width = 42, decimals = 2, delay = 0 }: VBarsProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex items-end gap-2.5">
            {bars.map((b, i) => (
                <div key={b.label} className="flex flex-col items-center gap-1" style={{ width: width + 8 }}>
                    <span className="font-mono text-[16px] font-bold tabular-nums text-white">{b.text ?? br(b.value, decimals)}</span>
                    <div className="relative overflow-hidden rounded-t-md" style={{ width, height, background: 'rgba(255,255,255,0.07)' }}>
                        <Grow value={b.value / max} axis="y" color={b.color} delay={delay + i * 0.12} />
                        {b.before !== undefined && (
                            <motion.span aria-hidden className="absolute inset-x-0 block border-t-[3px] border-dashed"
                                style={{ borderColor: '#04080F', bottom: (b.before / max) * height }}
                                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ duration: DUR.enter, delay: delay + 0.5, ease: EASE_OUT }} />
                        )}
                    </div>
                    <span className="text-[16px] font-semibold text-gray-100">{b.label}</span>
                </div>
            ))}
        </div>
    );
};

/** McNulty 2020: um ponto quase em cima do zero, com o intervalo de credibilidade. */
export const CycleRuler = () => {
    const x0 = 16;
    const x1 = 184;
    const sx = (v: number) => x0 + ((v + 0.3) / 0.6) * (x1 - x0);
    return (
        <svg viewBox="0 0 200 104" width={200} height={104} role="img" aria-label="Tamanho de efeito −0,06, intervalo −0,16 a 0,04">
            <rect x={sx(-0.2)} y={30} width={sx(0.2) - sx(-0.2)} height={44} fill={C.stone} opacity={0.12} />
            <line x1={x0} x2={x1} y1={52} y2={52} stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
            <line x1={sx(0)} x2={sx(0)} y1={24} y2={80} stroke={C.text} strokeWidth={3} strokeDasharray="5 5" />
            <line x1={sx(CYCLE.lo)} x2={sx(CYCLE.hi)} y1={52} y2={52} stroke={C.stone} strokeWidth={7} strokeLinecap="round" />
            <circle cx={sx(CYCLE.es)} cy={52} r={10} fill={C.stone} stroke="#04080F" strokeWidth={3} />
            {[-0.3, 0, 0.3].map(t => <SvgText key={t} x={sx(t)} y={100} text={signed(t, t === 0 ? 0 : 1)} anchor="middle" size={16} color={C.muted} weight={500} />)}
            <SvgText x={sx(CYCLE.es)} y={20} text={`ES ${signed(CYCLE.es, 2)}`} anchor="middle" size={17} color={C.stone} weight={700} />
        </svg>
    );
};

export interface HBar {
    label: string;
    value: number;
    color: string;
}

/** Barras horizontais com rótulo à esquerda e valor à direita. */
export const HBars = ({ bars, max, decimals = 1, delay = 0 }: { bars: readonly HBar[]; max: number; decimals?: number; delay?: number }) => (
    <div className="flex flex-col gap-1.5">
        {bars.map((b, i) => (
            <div key={b.label} className="flex items-center gap-2">
                <span className="w-[70px] text-[16px] font-semibold text-gray-100">{b.label}</span>
                <div className="relative h-[22px] w-[140px] overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <Grow value={b.value / max} color={b.color} delay={delay + i * 0.12} />
                </div>
                <span className="font-mono text-[18px] font-bold tabular-nums text-white">{br(b.value, decimals)}</span>
            </div>
        ))}
    </div>
);

/** Cabeçalho de uma célula do palco: estudo e o que a medida é. */
export const CellHead = ({ title, sub, color = '#F3F4F6' }: { title: string; sub: ReactNode; color?: string }) => (
    <div className="flex flex-col">
        <span className="text-[16px] font-semibold leading-tight" style={{ color }}>{title}</span>
        <span className="text-[15px] leading-tight text-gray-300">{sub}</span>
    </div>
);
