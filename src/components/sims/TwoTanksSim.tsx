import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Beat } from './kit/Beat';
import { Tank } from './kit/Tank';
import { BigStat } from './kit/Stamp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { GlucoseGauge } from './ato4/GlucoseGauge';
import { TANK_STAGES, TWO_TANKS_SOURCE } from './ato4/twoTanks.content';

/**
 * Slide 67 · músculo e fígado lado a lado, com o mostrador da glicose. Coyle 1986 não mediu o fígado (o tanque fica
 * apagado, "não medido"); Gonzalez 2015 mediu, e o tanque volta. O carboidrato entra por cima do fígado.
 */

/** Seta de entrada do carboidrato, acima do fígado e do sangue. */
const Feed = ({ on }: { on: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="flex flex-col items-center" initial={false} animate={{ opacity: on ? 1 : 0, y: on || reduce ? 0 : -8 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }} aria-hidden={!on}>
            <span className="text-[18px] font-semibold" style={{ color: C.glucose }}>carboidrato na prova</span>
            <ArrowDown size={34} strokeWidth={3} color={C.glucose} />
        </motion.div>
    );
};

const Scene = ({ step }: { step: number }) => {
    const s = TANK_STAGES[step];
    const measured = s.liver !== null;
    return (
        <div className="flex items-end gap-10">
            <Tank level={s.muscle} label="músculo" value="~500 g" width={118} height={268} active={step === 0} />
            <div className="flex flex-col items-center gap-2">
                <Feed on={s.feed} />
                <div className="transition-opacity duration-300" style={{ opacity: measured ? 1 : 0.6 }}>
                    <Tank level={measured ? s.liver ?? 0 : 0} label={measured ? 'fígado' : 'fígado: não medido'} value="~80 g" width={72} height={118} active={measured && step > 0} />
                </div>
            </div>
            <div className="pb-6"><GlucoseGauge mM={s.glucose} /></div>
        </div>
    );
};

/** O número que o passo acrescenta, à direita. */
const Readout = ({ step }: { step: number }) => {
    if (step === 0) return <Beat beat={0}><p className="m-0 text-[22px] leading-snug text-gray-200">O fígado oscila entre as refeições e treinar não o aumenta.</p></Beat>;
    if (step === 1) return <Beat beat={1}><BigStat value="3,02 h" caption="até a fadiga, sem carboidrato" color={C.risk} /></Beat>;
    if (step === 2) return <Beat beat={2}><BigStat value="4,02 h" caption="a hora extra saiu do sangue: glicose a 4,2–5,2 mM, com quase nenhum glicogênio muscular" color={C.glucose} /></Beat>;
    if (step === 3) {
        return (
            <Beat beat={3} className="flex flex-col gap-3">
                <p className="m-0 font-display text-[30px] font-semibold text-white">fígado <span style={{ color: C.ok }}>325 → 345</span></p>
                <p className="m-0 font-display text-[30px] font-semibold text-white">músculo <span style={{ color: C.risk }}>101 → 60</span></p>
                <p className="m-0 text-[19px] leading-snug text-gray-300">mmol/L, com glicose na prova<br />só água (n = 4): fígado 454 → 283</p>
            </Beat>
        );
    }
    return <Beat beat={4}><BigStat value="~24" caption="mmol/kg de glicogênio muscular poupado em ~100 min (SMD −0,16)" color={C.glycogenSoft} size={96} /></Beat>;
};

export default function TwoTanksSim() {
    const { step } = useSlideSteps(TANK_STAGES.length);
    return (
        <SimBox>
            <Lead beat={step} chips={<><DesignChip>{TANK_STAGES[step].design}</DesignChip><IllustrativeChip /></>} className="min-h-[72px]">{TANK_STAGES[step].lead}</Lead>
            <div className="mt-4 flex flex-1 items-end gap-12 pb-2">
                <Scene step={step} />
                <div className="flex flex-1 items-center self-stretch">
                    <Readout step={step} />
                </div>
            </div>
            <Foot source={TWO_TANKS_SOURCE} />
        </SimBox>
    );
}
