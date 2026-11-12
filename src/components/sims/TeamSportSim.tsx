import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Grow, Wipe } from './kit/Beat';
import { br } from './kit/format';
import { CalcChip, DesignChip } from './kit/chips';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import { BALSOM, BALSOM_RATIO, COLUMNS, LEATT, LEATT_SAVED, SOURCE, STEPS, XIE, XIE_CI } from './ato9/teamSport.content';

/**
 * Slide 161 · CHO no Jogo. Uma cadeia da esquerda para a direita: do músculo ao tiro e do tiro à jogada.
 * Cada passo abre uma coluna (Wipe) com o detalhe; a coluna que fica para trás se resume ao seu número.
 * O efeito, nítido no começo, chega à jogada com o intervalo cruzando o zero.
 */

interface ColumnProps {
    index: number;
    step: number;
    /** O detalhe do estudo (só na coluna da vez). */
    detail: ReactNode;
    /** O que fica quando a coluna sai de foco: o número e duas palavras. */
    summary: ReactNode;
}

const Column = ({ index, step, detail, summary }: ColumnProps) => {
    const focus = step === index || (index === COLUMNS.length - 1 && step >= index);
    return (
        <Wipe show={step >= index} from="left" className="flex min-w-0 flex-1 flex-col gap-4 px-6"
            style={{ borderLeft: index ? '2px solid rgba(255,255,255,0.14)' : 'none' }}>
            <span className="font-display text-[26px] font-semibold text-white">{COLUMNS[index].title}</span>
            <div className="relative flex-1">
                <Reveal show={focus} className="absolute inset-0">{detail}</Reveal>
                <Reveal show={!focus && step > index} className="absolute inset-0">{summary}</Reveal>
            </div>
        </Wipe>
    );
};

const Summary = ({ value, label, color }: { value: string; label: string; color: string }) => (
    <div className="flex flex-col gap-2 pt-6">
        <span className="font-display text-[64px] font-bold leading-none" style={{ color }}>{value}</span>
        <span className="text-[20px] text-gray-200">{label}</span>
    </div>
);

/** Leatt 1989: glicogênio gasto no jogo, placebo × CHO. */
const Muscle = () => (
    <div className="flex flex-col gap-4">
        {[{ label: 'placebo', v: LEATT.placebo, color: C.co2 }, { label: 'CHO 7%', v: LEATT.cho, color: C.glucose }].map((r, i) => (
            <div key={r.label} className="flex flex-col gap-1">
                <span className="text-[20px] text-gray-200">{r.label}</span>
                <div className="flex items-center gap-3">
                    <div className="relative h-9 w-[220px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Grow value={r.v / LEATT.placebo} color={r.color} delay={0.2 + i * 0.15} />
                    </div>
                    <span className="font-mono text-[22px] tabular-nums text-white">{r.v}</span>
                </div>
            </div>
        ))}
        <span className="text-[18px] text-gray-300">mmol/kg ps gastos</span>
        <span className="font-display text-[48px] font-bold leading-none" style={{ color: C.glycogenSoft }}>−{LEATT_SAVED}%</span>
    </div>
);

/** Balsom 1999a: tiros de 6 s completados, 1 bloco = 10 tiros. */
const Sprints = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion();
    const rows = [{ label: 'glicogênio baixo', v: BALSOM.low, color: C.co2 }, { label: 'glicogênio alto', v: BALSOM.high, color: C.glycogen }];
    return (
        <div className="flex flex-col gap-4">
            {rows.map((r, ri) => (
                <div key={r.label} className="flex flex-col gap-2">
                    <span className="text-[20px] text-gray-200">{r.label} · <span className="font-mono text-white">{r.v}</span></span>
                    <div className="flex w-[300px] flex-wrap gap-[4px]">
                        {Array.from({ length: Math.round(r.v / 10) }, (_, i) => (
                            <motion.span key={i} className="block h-[14px] w-[14px] rounded-[3px]" style={{ background: r.color }}
                                initial={false} animate={{ opacity: show ? 1 : 0, scale: show || reduce ? 1 : 0.9 }}
                                transition={{ delay: show ? stagger(i, 0.2 + ri * 0.2, 0.02) : 0, duration: DUR.enter, ease: EASE_OUT }} />
                        ))}
                    </div>
                </div>
            ))}
            <span className="text-[18px] text-gray-300">1 bloco = 10 tiros</span>
            <span className="font-display text-[48px] font-bold leading-none" style={{ color: C.glycogenSoft }}>{br(BALSOM_RATIO)}×</span>
        </div>
    );
};

/** Xie 2026: g de Hedges para habilidade/decisão sob fadiga; o intervalo cruza o zero. */
const Skill = ({ cross }: { cross: boolean }) => {
    const x0 = 16;
    const x1 = 304;
    const sx = (v: number) => x0 + ((v + 0.4) / 1.2) * (x1 - x0);
    const ciColor = cross ? C.stone : C.glucose;
    return (
        <div className="flex flex-col gap-3">
            <svg viewBox="0 0 320 120" width={320} height={120} role="img" aria-label={`g = 0,26, ${XIE_CI}`}>
                <rect x={sx(-0.4)} y={26} width={sx(0) - sx(-0.4)} height={48} fill={C.risk} opacity={cross ? 0.25 : 0} />
                <line x1={sx(0)} x2={sx(0)} y1={16} y2={84} stroke={C.text} strokeWidth={3} strokeDasharray="5 5" />
                <line x1={sx(XIE.lo)} x2={sx(XIE.hi)} y1={50} y2={50} stroke={ciColor} strokeWidth={5} strokeLinecap="round" />
                <polygon points={`${sx(XIE.lo)},50 ${sx(XIE.g)},37 ${sx(XIE.hi)},50 ${sx(XIE.g)},63`} fill={ciColor} />
                <SvgText x={sx(0)} y={110} text="0" anchor="middle" size={18} color={C.text} />
            </svg>
            <span className="font-mono text-[22px] text-white">g = {br(XIE.g, 2)}</span>
            <span className="self-start rounded-md px-2 py-1 text-[20px] font-semibold" style={{ color: '#04080F', background: C.stone }}>certeza muito baixa</span>
        </div>
    );
};

export default function TeamSportSim() {
    const { step } = useSlideSteps(STEPS.length);
    const col = COLUMNS[Math.min(step, COLUMNS.length - 1)];
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={STEPS[step]} className="min-h-[68px]" chips={<>
                <DesignChip>{col.design}</DesignChip>
                {step < 2 && <CalcChip />}
                {step >= 2 && <span className="font-mono text-[16px] text-gray-300">{XIE_CI}</span>}
            </>} />
            <div className="mt-5 flex min-h-0 flex-1">
                <Column index={0} step={step} detail={<Muscle />} summary={<Summary value={`−${LEATT_SAVED}%`} label="glicogênio gasto" color={C.glycogenSoft} />} />
                <Column index={1} step={step} detail={<Sprints show={step === 1} />} summary={<Summary value={`${br(BALSOM_RATIO)}×`} label="tiros de 6 s" color={C.glycogenSoft} />} />
                <Column index={2} step={step} detail={<Skill cross={step >= 3} />} summary={null} />
            </div>
            <SourceLine>{SOURCE}</SourceLine>
        </SimBox>
    );
}
