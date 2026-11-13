import { motion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { ChainCell, ScaleBar } from '../ato3/chainStrip';
import { DAY, type DayBlock } from './sleeplow.content';

/**
 * Peças do slide 142 (Sleep low: o ganho que sumiu).
 * DayLine: o dia em blocos, das 17 h às 17 h do dia seguinte (mesmo carboidrato, outro horário; horários ilustrativos).
 * SleepChain: três elos numerados, um estudo por elo: 1 Marquet, o ganho → 2 réplicas, o ganho some → 3 Hulston, o custo.
 */

const BLOCK_STYLE: Record<DayBlock['id'], { fill: string; border: string; ink: string }> = {
    hit: { fill: C.glucose, border: C.glucose, ink: '#04080F' },
    night: { fill: '#1E293B', border: C.co2, ink: '#F3F4F6' },
    easy: { fill: '#04080F', border: C.stone, ink: '#F3F4F6' },
    refuel: { fill: `${C.glucose}55`, border: C.glucose, ink: '#F3F4F6' },
};

/** Linha do dia como faixa de blocos: largura didática (horários ilustrativos), hora de início sob cada bloco. */
export const DayLine = () => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
            <span className="text-[17px] font-bold text-white">Um dia de sleep low</span>
            <span className="text-[16px] font-semibold" style={{ color: C.glucoseSoft }}>mesmo total: 6 g/kg/d nos dois grupos</span>
        </div>
        <div className="flex gap-1">
            {DAY.map((b, i) => {
                const st = BLOCK_STYLE[b.id];
                return (
                    <motion.div key={b.id} className="flex min-w-0 flex-col gap-1" style={{ flex: b.flex }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: stagger(i, 0.05, 0.1), ease: EASE_OUT }}>
                        <div className="flex h-[48px] items-center justify-center rounded-md border-[3px] px-1 text-center text-[16px] font-bold leading-[1.1]"
                            style={{ background: st.fill, borderColor: st.border, color: st.ink }}>{b.label}</div>
                        <div className="flex justify-between text-[16px] font-semibold tabular-nums text-gray-300">
                            <span>{b.start}</span>
                            {i === DAY.length - 1 && <span>17 h</span>}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
);

/** Legenda das barras: neutro = sleep/train low, âmbar = controle (carboidrato no horário de sempre). */
const ArmLegend = () => (
    <div className="flex items-center gap-4 text-[16px] font-semibold text-gray-200">
        <span className="text-gray-300">CR = contrarrelógio</span>
        <span className="flex items-center gap-2"><span className="h-[14px] w-[22px] rounded-[3px]" style={{ background: C.stone }} />sleep / train low</span>
        <span className="flex items-center gap-2"><span className="h-[14px] w-[22px] rounded-[3px]" style={{ background: C.glucose }} />controle</span>
    </div>
);

/** Duas barras de melhora a partir do zero (escala 0–3%): Marquet 10 km. */
const GainBars = () => (
    <div className="flex flex-col gap-1">
        <ScaleBar label="sleep low" value={2.9} text="−2,9%" max={3.2} color={C.stone} delay={0.3} labelWidth={92} thin />
        <ScaleBar label="controle" value={0.1} text="−0,1%" max={3.2} color={C.glucose} delay={0.45} labelWidth={92} thin />
    </div>
);

/** Réplicas: Gejl em barras (+5% nos dois); Riis sem número no resumo, só a direção. */
const ReplicaBars = () => (
    <div className="flex flex-col gap-1">
        <ScaleBar label="sleep low" value={5} text="+5%" max={6} color={C.stone} delay={0.3} labelWidth={92} thin />
        <ScaleBar label="controle" value={5} text="+5%" max={6} color={C.glucose} delay={0.45} labelWidth={92} thin />
        <span className="text-[16px] font-semibold leading-tight text-gray-200">Riis 2019 (n = 13): também igual</span>
    </div>
);

const CostBars = () => (
    <div className="flex flex-col gap-1">
        <ScaleBar label="train low" value={297} text="297 W" max={340} color={C.stone} delay={0.3} labelWidth={92} thin />
        <ScaleBar label="controle" value={323} text="323 W" max={340} color={C.glucose} delay={0.45} labelWidth={92} thin />
    </div>
);

export const SleepChain = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-end">
            <ArmLegend />
        </div>
        <div className="grid min-h-0 flex-1 grid-rows-3 gap-2">
            <ChainCell n={1} title="Marquet: o ganho" note="n = 21 · tempo dos 10 km" show={step >= 1} born={step === 1}>
                <GainBars />
            </ChainCell>
            <ChainCell n={2} title="Réplicas: o ganho some" note="Gejl · n = 26 · CR" show={step >= 2} born={step === 2}>
                <ReplicaBars />
            </ChainCell>
            <ChainCell n={3} title="O custo, no treino intenso" note="Hulston · n = 14 · watts" show={step >= 3} born={step === 3}>
                <CostBars />
            </ChainCell>
        </div>
    </div>
);
