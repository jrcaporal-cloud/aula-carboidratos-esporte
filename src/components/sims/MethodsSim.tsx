import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { MedirShell } from './ato10/MedirShell';
import { BiopsyDrawing, MrsDrawing, UsDrawing } from './ato10/MethodsDrawings';
import { COMPARE, LANES, ROUTLEDGE, STEPS, type MethodLane } from './ato10/methods.content';

/**
 * Slide 183 · Como se Mede o Glicogênio (palco + painel). Três faixas, uma por instrumento, cada uma com o princípio
 * desenhado (agulha → bioquímica/PAS; ímã e bobina → espectro; sonda → brilho → escore), o número-chave, a vantagem e o
 * limite. No último passo o ultrassom leva o carimbo do teste independente. O painel acumula o comparador dos três.
 */
const STAGE_W = 680;
const ACCENT = [C.glycogenSoft, C.glycogenSoft, C.stone, C.risk] as const;

const Drawing = ({ id, fresh, step }: { id: MethodLane['id']; fresh: boolean; step: number }) => {
    if (id === 'biopsia') return <BiopsyDrawing fresh={fresh} />;
    if (id === 'mrs') return <MrsDrawing fresh={fresh} />;
    return <UsDrawing fresh={fresh} score={step >= 3 ? '49' : '0–100'} />;
};

const Lane = ({ lane, index, step }: { lane: MethodLane; index: number; step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const fresh = index === step;
    const failed = lane.id === 'us' && step >= 3;
    return (
        <Wipe show={step >= index} from="left" className="relative">
            <motion.div className="flex items-center gap-3.5 rounded-xl border-2 px-2"
                initial={false} animate={{ opacity: fresh || step >= 3 ? 1 : 0.72, borderColor: fresh ? `${lane.color}99` : 'rgba(255,255,255,0)' }}
                transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <Drawing id={lane.id} fresh={fresh} step={step} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-tight">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[18px] font-semibold text-white">{lane.name}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <CountUp text={lane.key} run={step >= index} className="text-[24px] font-bold tabular-nums" style={{ color: lane.color }} />
                        <span className="text-[16px] text-gray-300">{lane.keyCaption}</span>
                    </div>
                    <span className="text-[16px] text-gray-100"><b style={{ color: C.ok }}>+</b> {lane.pro}</span>
                    {failed ? (
                        <motion.span className="text-[16px] font-semibold" style={{ color: C.risk }} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: DUR.enter }}>
                            − rugby: {ROUTLEDGE.glycogen}; {ROUTLEDGE.score} ({ROUTLEDGE.p})
                        </motion.span>
                    ) : (
                        <span className="text-[16px] text-gray-100"><b style={{ color: C.risk }}>−</b> {lane.con}</span>
                    )}
                </div>
            </motion.div>
            {failed && (
                <motion.span className="absolute left-[150px] top-0 rounded-md border-[3px] px-2 py-0.5 text-[17px] font-bold uppercase tracking-wide"
                    style={{ borderColor: C.risk, color: C.risk, background: '#04080F', rotate: -6 }}
                    initial={reduce ? false : { scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.25 }}>
                    não detectou
                </motion.span>
            )}
        </Wipe>
    );
};

const Mark = ({ ok }: { ok: boolean }) => ok
    ? <Check size={20} strokeWidth={3} color={C.ok} aria-label="sim" className="mx-auto" />
    : <X size={20} strokeWidth={3} color={C.risk} aria-label="não" className="mx-auto" />;

/** Comparador do painel: entra uma linha por método; no fim, o asterisco vira o achado independente. */
const Compare = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-1 border-t-2 border-white/15 pt-1 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">método</th>
                <th className="font-normal">precisão</th>
                <th className="text-center font-normal">sem agulha</th>
                <th className="text-center font-normal">fígado</th>
            </tr>
        </thead>
        <tbody>
            {COMPARE.filter(r => r.at <= step).map((r, i) => (
                <motion.tr key={r.name} className="text-[17px] font-semibold" initial={r.at === step ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: stagger(i, 0.4, 0.06), ease: EASE_OUT }}>
                    <td style={{ color: r.color }}>{r.name}</td>
                    <td className="tabular-nums text-white">{r.name === 'Ultrassom' && step >= 3 ? 'n.s. independente' : r.precision}</td>
                    <td><Mark ok={!r.needle} /></td>
                    <td><Mark ok={r.liver} /></td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function MethodsSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const stage = (
        <div className="flex h-full flex-col justify-between px-3 py-2">
            {LANES.map((l, i) => <Lane key={l.id} lane={l} index={i} step={step} />)}
        </div>
    );
    return (
        <MedirShell tabs={STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="ato10-methods-tabs"
            chips={<><DesignChip>{s.design}</DesignChip><IllustrativeChip>desenhos: esquema</IllustrativeChip></>}
            stageWidth={STAGE_W} stage={stage} accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<Compare step={step} />}
            sources={sourcesUpTo(STEPS.map(t => t.sources), step)} />
    );
}
