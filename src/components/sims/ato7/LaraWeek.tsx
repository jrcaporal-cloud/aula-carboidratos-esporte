import { motion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Tank } from '../kit/Tank';
import { Grow } from '../kit/Beat';
import { castOf } from '../kit/cast';
import { BAND, BAR_MAX, CONTROL, DAYS, GKG, GKG_TEXT, GRAMS, type Day } from './lara.content';

/**
 * Palco do slide 126: a semana da Lara em sete colunas (jogos nos dias 1, 4 e 7). Em cima, o tanque medido pelo
 * Krustrup 2011 (fim do jogo e 24 h; 48 e 72 h com "?"); embaixo, o carboidrato do dia da Premier League
 * (Anderson 2017) contra a faixa de 6–10 g/kg/d e, no fim, as gramas para os 60 kg dela (cálculo).
 */

const COL_W = 92;
const BAR_H = 104;
const lara = castOf('lara');

const yPct = (gkg: number): number => (gkg / BAR_MAX) * 100;

const enter = (show: boolean, delay = 0) => ({
    initial: false as const,
    animate: { opacity: show ? 1 : 0, y: show ? 0 : 8 },
    transition: { duration: DUR.enter, delay: show ? delay : 0, ease: EASE_OUT },
});

const LaraStrip = () => {
    const Icon = lara.icon;
    return (
        <div className="flex items-center gap-3.5">
            <Icon size={40} strokeWidth={2.2} color={C.text} aria-hidden />
            <div className="flex flex-col">
                <span className="text-[19px] font-semibold leading-tight text-white">
                    {lara.name} · {lara.age} anos · {lara.kg} kg · {lara.sport}
                </span>
                <span className="text-[17px] italic leading-tight text-gray-200">{lara.dilemma}</span>
            </div>
        </div>
    );
};

/** Chave "72 h" entre os centros de dois jogos. */
const Gap72 = ({ from, to }: { from: number; to: number }) => (
    <div className="absolute top-0 flex h-[24px] items-start" style={{ left: (from + 0.5) * COL_W, width: (to - from) * COL_W }}>
        <span aria-hidden className="absolute inset-x-0 top-[11px] h-[3px] rounded-full" style={{ background: C.stone }} />
        <span aria-hidden className="absolute left-0 top-[4px] h-[17px] w-[3px] rounded-full" style={{ background: C.stone }} />
        <span aria-hidden className="absolute right-0 top-[4px] h-[17px] w-[3px] rounded-full" style={{ background: C.stone }} />
        <span className="relative mx-auto bg-[#060b14] px-2 text-[16px] font-semibold leading-[24px]" style={{ color: C.stone }}>72 h</span>
    </div>
);

const RolePill = ({ day, warn }: { day: Day; warn: boolean }) => (
    day.role === 'jogo'
        ? <span className="rounded-md px-2 py-0.5 text-[16px] font-bold" style={{ background: C.stone, color: '#04080F' }}>jogo</span>
        : <span className="rounded-md border-2 px-1.5 text-[15px] font-semibold transition-colors duration-300"
            style={{ borderColor: warn ? C.risk : 'rgba(255,255,255,0.25)', color: warn ? '#FDA4AF' : '#E5E7EB' }}>{day.role}</span>
);

const TankCell = ({ day, i, step }: { day: Day; i: number; step: number }) => {
    if (day.tank) {
        return (
            <motion.div className="flex flex-col items-center gap-1" {...enter(step >= 1, stagger(i, 0.1, 0.15))}>
                <Tank level={day.tank.value / CONTROL} value={day.tank.text} width={46} height={80} active />
                <span className="text-[15px] text-gray-200">{day.tank.when}</span>
            </motion.div>
        );
    }
    if (day.unknown) {
        return (
            <motion.div className="flex flex-col items-center gap-1" {...enter(step >= 1, 0.45 + i * 0.1)}>
                <span className="font-mono text-[16px] text-gray-300">?</span>
                <span className="flex h-[80px] w-[46px] items-center justify-center rounded-[999px] border-2 border-dashed font-display text-[26px] text-gray-300"
                    style={{ borderColor: 'rgba(203,213,225,0.6)' }}>?</span>
                <span className="text-[15px] text-gray-200">{day.unknown}</span>
            </motion.div>
        );
    }
    return null;
};

const BarCell = ({ day, i, step }: { day: Day; i: number; step: number }) => {
    const kind = day.role === 'jogo' ? 'jogo' : 'treino';
    const v = GKG[kind];
    return (
        <div className="relative w-full" style={{ height: BAR_H }}>
            <motion.span className="absolute left-0 right-0 text-center font-display text-[18px] font-semibold tabular-nums"
                style={{ bottom: `calc(${yPct(v)}% + 4px)`, color: kind === 'jogo' ? C.glucoseSoft : '#FDE68A' }} {...enter(step >= 2, 0.3 + stagger(i))}>
                {GKG_TEXT[kind]}
            </motion.span>
            <div className="absolute bottom-0 left-1/2 w-[40px] -translate-x-1/2 overflow-hidden rounded-t-md" style={{ height: `${yPct(v)}%` }}>
                <Grow axis="y" value={step >= 2 ? 1 : 0} color={kind === 'jogo' ? C.glucose : C.glucoseDeep} delay={stagger(i)} />
            </div>
            <motion.span className="absolute -bottom-[23px] left-0 right-0 text-center text-[16px] font-semibold tabular-nums text-white" {...enter(step >= 4, 0.3 + stagger(i))}>
                {GRAMS[kind]}
            </motion.span>
        </div>
    );
};

export const LaraWeek = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2 px-4 py-3">
        <LaraStrip />
        <div className="relative mt-1" style={{ width: COL_W * DAYS.length }}>
            <div className="relative h-[24px]">
                <Gap72 from={0} to={3} />
                <Gap72 from={3} to={6} />
            </div>
            <div className="flex">
                {DAYS.map(d => (
                    <div key={d.n} className="flex flex-col items-center gap-1" style={{ width: COL_W }}>
                        <span className="text-[16px] text-gray-300">dia {d.n}</span>
                        <RolePill day={d} warn={step >= 3} />
                    </div>
                ))}
            </div>
            {/* glicogênio medido (Krustrup 2011) */}
            <div className="relative mt-2 flex h-[128px] items-end">
                {DAYS.map((d, i) => <div key={d.n} className="flex justify-center" style={{ width: COL_W }}><TankCell day={d} i={i} step={step} /></div>)}
                <div className="absolute bottom-[14px] right-0 flex w-[262px] flex-col gap-2 text-[15px] leading-snug text-gray-300">
                    <motion.span {...enter(step >= 1, 0.6)}>tanques: mmol/kg de peso seco; cheio = controle sem jogo (449)</motion.span>
                    <motion.span {...enter(step >= 2, 0.6)}>barras: CHO do dia, g/kg (Premier League){step >= 4 ? '; embaixo, gramas para 60 kg' : ''}</motion.span>
                </div>
            </div>
            {/* carboidrato do dia (Premier League) contra a faixa de carga alta */}
            <div className="relative mt-3" style={{ height: BAR_H }}>
                <motion.div className="absolute inset-x-0 border-y-2" initial={false}
                    animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step >= 3 ? 0.2 : 0 }}
                    style={{ bottom: `${yPct(BAND.lo)}%`, height: `${yPct(BAND.hi) - yPct(BAND.lo)}%`, borderColor: C.ok, background: 'rgba(52,211,153,0.16)' }}>
                    <span className="absolute left-[100px] top-1/2 -translate-y-1/2 text-[16px] font-bold" style={{ color: '#6EE7B7' }}>faixa {BAND.text}</span>
                    {step >= 4 && <span className="absolute left-[388px] top-1/2 -translate-y-1/2 text-[16px] font-bold text-white">60 kg: {BAND.grams}</span>}
                </motion.div>
                <div className="absolute inset-0 flex">
                    {DAYS.map((d, i) => <div key={d.n} style={{ width: COL_W }}><BarCell day={d} i={i} step={step} /></div>)}
                </div>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: C.co2 }} />
            </div>
        </div>
    </div>
);
