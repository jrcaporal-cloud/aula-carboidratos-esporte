import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Source } from './kit/ui';
import { Tank } from './kit/Tank';
import { Grow } from './kit/Beat';
import { castOf } from './kit/cast';
import { CalcChip, DesignChip, FictionChip } from './kit/chips';
import { HeadRow, Phrase } from './ato7/parts';
import { BAR_MAX, DAYS, DESIGN, GKG, GKG_TEXT, LARA_G, PHRASES, SOURCE, type Day } from './ato7/lara.content';

/**
 * Slide 126 · Lara, jogo a cada 72 horas.
 * A semana da Lara em sete colunas: os jogos (dias 1, 4 e 7), o tanque que não volta em 24 h (dado real de
 * Krustrup 2011, homens de elite) e, embaixo, o carboidrato por tipo de dia da Premier League e a conta no peso dela.
 */
const COL_W = 108;
const TANK_W = 54;
const TANK_H = 108;
const BAR_H = 76;
const lara = castOf('lara');

const DayColumn = ({ day, index, step }: { day: Day; index: number; step: number }) => {
    const kind = day.game ? 'game' : 'training';
    const showTank = step >= 1 && day.tank;
    const nextGame = step >= 1 && day.game && !day.tank;
    return (
        <div className="flex flex-col items-center gap-3" style={{ width: COL_W }}>
            <div className="flex h-[54px] flex-col items-center gap-0.5">
                <span className="text-[18px] text-gray-300">{day.label}</span>
                {day.game
                    ? <span className="rounded-md px-2 py-0.5 text-[16px] font-bold" style={{ background: C.stone, color: '#04080F' }}>jogo</span>
                    : <span className="text-[16px] text-gray-400">treino</span>}
            </div>
            <div className="flex flex-col items-center justify-end" style={{ height: TANK_H + 60 }}>
                {showTank && day.tank && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stagger(index), duration: DUR.enter, ease: EASE_OUT }}>
                        <Tank level={day.tank.level} value={day.tank.value} label={day.tank.when} width={TANK_W} height={TANK_H} active />
                    </motion.div>
                )}
                {nextGame && index === 3 && (
                    <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: DUR.enter }}>
                        <span className="text-[16px] text-gray-300">72 h</span>
                        <span className="flex items-center justify-center rounded-[999px] border-2 border-dashed font-display text-[30px] text-gray-300"
                            style={{ width: TANK_W, height: TANK_H, borderColor: 'rgba(203,213,225,0.6)' }}>?</span>
                        <span className="text-[16px] text-gray-200">próximo jogo</span>
                    </motion.div>
                )}
            </div>
            {/* carboidrato do dia (Premier League) */}
            <div className="flex flex-col items-center gap-1" style={{ opacity: step >= 2 ? 1 : 0, transition: 'opacity 300ms ease-out' }}>
                <span className="font-mono text-[18px] font-semibold tabular-nums" style={{ color: day.game ? C.glucose : C.glucoseSoft }}>
                    {step >= 3 ? LARA_G[kind] : GKG_TEXT[kind]}
                </span>
                <div className="relative overflow-hidden rounded-t-md" style={{ width: 44, height: BAR_H }}>
                    <Grow axis="y" value={step >= 2 ? GKG[kind] / BAR_MAX : 0} color={day.game ? C.glucose : C.glucoseDeep} delay={stagger(index)} />
                </div>
            </div>
        </div>
    );
};

const LaraNote = ({ step }: { step: number }) => {
    const Icon = lara.icon;
    return (
        <div className="flex w-[250px] shrink-0 flex-col gap-3 pt-2">
            <Icon size={52} strokeWidth={2} color={C.text} aria-hidden />
            <span className="font-display text-[34px] font-semibold leading-none text-white">{lara.name}</span>
            <span className="text-[20px] leading-snug text-gray-200">{lara.age} anos · {lara.kg} kg<br />{lara.sport}</span>
            <span className="text-[20px] italic leading-snug text-gray-100">{lara.dilemma}</span>
            <span className="text-[16px] leading-snug text-gray-300 transition-opacity duration-300" style={{ opacity: step >= 2 ? 1 : 0 }}>
                barras: CHO do dia, {step >= 3 ? 'gramas para 60 kg' : 'g/kg'}
            </span>
        </div>
    );
};

export default function LaraRecoverySim() {
    const { step } = useSlideSteps(PHRASES.length);
    const design = DESIGN[step];
    return (
        <div className="not-prose flex flex-col gap-3">
            <HeadRow chips={<><FictionChip />{design && <DesignChip>{design}</DesignChip>}{step === 3 && <CalcChip />}</>}>
                <Phrase beat={step} width={step === 3 ? 820 : 760} size={step === 3 ? 26 : 28}>{PHRASES[step]}</Phrase>
            </HeadRow>
            <div className="flex items-start gap-8">
                <LaraNote step={step} />
                <div className="flex">
                    {DAYS.map((d, i) => <DayColumn key={d.label} day={d} index={i} step={step} />)}
                </div>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
