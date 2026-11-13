import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { SvgText } from '../kit/ui';
import { ChainCell as Cell } from '../ato3/chainStrip';
import { KONDO, LANES, NCAA, type Lane } from './refeed.content';

/**
 * Palco do slide 165 (680 × 460): a cadeia em 3 faixas numeradas, ligadas por setas, um estudo por elo.
 * 1 Kondo: o glicogênio não volta em 13 h → 2 Reale: o tempo entre pesagem e luta muda o que o reganho vale →
 * 3 CDC 1998 + Oppliger 2006: as mortes de 1997 e a regra da NCAA. Tom sóbrio nas mortes (sem ícone, sem vermelho).
 */

const W = 444;
const H = 122;
const BASE_Y = 24;
const PER_PCT = 1.4;
const TROUGH_Y = BASE_Y + Number(KONDO.dropPct.replace(',', '.')) * PER_PCT;
const WEIGH_X = 200;
const MEAL_END = 262;
const END_X = 420;
const END_Y = 42;

/** Curva didática (só os marcos são do estudo): cai até a pesagem, sobe com a comida e para abaixo da base. */
const KondoCurve = () => {
    const reduce = useReducedMotion() ?? false;
    const d = `M8 ${BASE_Y} L60 ${BASE_Y} C 130 ${BASE_Y + 2}, 170 ${TROUGH_Y}, ${WEIGH_X} ${TROUGH_Y} C 235 ${TROUGH_Y}, 250 62, 290 52 C 340 44, 380 ${END_Y + 1}, ${END_X} ${END_Y}`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img"
            aria-label="Glicogênio cai 36,5% até a pesagem; 13 horas depois, mesmo com 7,1 g/kg de carboidrato, ainda está abaixo da base">
            <rect x={WEIGH_X} y={BASE_Y} width={MEAL_END - WEIGH_X} height={H - 22 - BASE_Y} fill={C.glucose} opacity={0.18} />
            <line x1={8} x2={W - 4} y1={BASE_Y} y2={BASE_Y} stroke={C.text} strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
            <SvgText x={8} y={BASE_Y - 8} text="base" size={16} color={C.muted} weight={500} />
            <motion.path d={d} fill="none" stroke={C.glycogen} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: DUR.draw, delay: 0.2, ease: EASE_OUT }} />
            <line x1={WEIGH_X} x2={WEIGH_X} y1={4} y2={H - 22} stroke={C.text} strokeWidth={3} />
            <SvgText x={WEIGH_X + 8} y={16} text="pesagem" size={16} color={C.text} />
            <SvgText x={WEIGH_X - 8} y={TROUGH_Y + 22} text={`−${KONDO.dropPct}%`} anchor="end" size={22} color={C.glycogenSoft} weight={700} />
            {/* o que falta para a base, 13 h depois: colchete rotulado */}
            <line x1={END_X + 10} x2={END_X + 10} y1={BASE_Y + 2} y2={END_Y} stroke={C.glycogenSoft} strokeWidth={3} />
            <SvgText x={END_X + 2} y={END_Y + 22} text="ainda abaixo" anchor="end" size={16} color={C.glycogenSoft} weight={700} />
            <SvgText x={8} y={H - 4} text={`corte: −${KONDO.lossPct}% em ${KONDO.hours} h`} size={16} color={C.text} weight={500} />
            <SvgText x={WEIGH_X + 6} y={H - 4} text={`${KONDO.choGkg} g/kg em ${KONDO.mealHours} h`} size={16} color={C.glucoseSoft} weight={600} />
            <SvgText x={W - 4} y={H - 4} text={`+${KONDO.after} h`} anchor="end" size={16} color={C.text} weight={700} />
        </svg>
    );
};

/** Uma coluna por esporte: a regra de pesagem e o que o reganho valeu. */
const LaneCol = ({ lane }: { lane: Lane }) => (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span className="text-[16px] leading-tight text-gray-200"><b className="text-[18px] text-white">{lane.sport}</b> · {lane.gapLabel}</span>
        <span className="rounded-md px-2 py-0.5 text-[16px] font-bold leading-tight" style={{ background: lane.color, color: '#04080F' }}>{lane.verdict}</span>
    </div>
);

/** Seta entre duas faixas, com a pergunta que leva de um elo ao seguinte. */
const Link = ({ show, text }: { show: boolean; text: string }) => (
    <motion.div className="flex h-[20px] items-center gap-2 pl-[22px] text-[15px] text-gray-300" initial={false}
        animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? 0.3 : 0 }}>
        <ArrowDown size={18} strokeWidth={2.6} color={C.text} aria-hidden />{text}
    </motion.div>
);

const Deaths = ({ step }: { step: number }) => (
    <div className="flex items-center gap-2">
        <div className="flex w-[190px] shrink-0 flex-col leading-snug">
            <span className="text-[17px] font-semibold text-white">1997 · 3 lutadores mortos</span>
            <span className="text-[15px] text-gray-300">{NCAA.window}, hipertermia e desidratação no corte</span>
        </div>
        <motion.div className="flex min-w-0 flex-1 items-center gap-2" initial={false}
            animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : -8 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <ArrowRight size={20} strokeWidth={2.6} color={C.ok} aria-hidden className="shrink-0" />
            <div className="flex flex-col gap-0.5 leading-snug">
                <span className="text-[16px] font-semibold text-white">regra NCAA</span>
                <span className="flex items-baseline gap-2">
                    {step >= 3 && <KeyFact color={C.ok} delay={0.5}><span className="font-display text-[26px] font-bold leading-none" style={{ color: C.ok }}>{NCAA.loss}</span></KeyFact>}
                    <span className="text-[15px] leading-tight text-gray-200">perda nas 20 h antes</span>
                </span>
                <span className="text-[15px] text-gray-300">1999–2004 · {NCAA.wrestlers} lutadores</span>
            </div>
        </motion.div>
    </div>
);

export const RefeedStage = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-[140px_auto_104px_auto_1fr] gap-1 p-2">
        <Cell n={1} title="13 h não repõem o glicogênio" note={`Kondo 2021 · n = ${KONDO.n} · 13C-MRS`} show={step >= 0} born={step === 0}>
            <KondoCurve />
        </Cell>
        <Link show={step >= 1} text="e quanto tempo há até a luta?" />
        <Cell n={2} title="O tempo até a luta muda o que vale" note="Reale 2016 (n = 86) e 2017 (n = 100)" show={step >= 1} born={step === 1}>
            <div className="flex gap-3">{LANES.map(l => <LaneCol key={l.key} lane={l} />)}</div>
        </Cell>
        <Link show={step >= 2} text="quando o corte vai ao extremo" />
        <Cell n={3} title="Três mortes, depois uma regra" note="CDC 1998 · Oppliger 2006" show={step >= 2} born={step === 2}>
            <Deaths step={step} />
        </Cell>
    </div>
);
