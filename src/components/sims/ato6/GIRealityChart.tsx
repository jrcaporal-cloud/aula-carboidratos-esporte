import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';
import { EVENTS, GH_MAX, GH_TICKS, GI_MAX, GUIDE, RANGE, type EventRow } from './gireality.content';

/**
 * Slide 113 · o palco: o que 221 atletas comeram em prova (média ± DP, Pfeiffer 2012) contra o teto de 90 g/h,
 * a faixa individual de 6 a 136 g/h, a coluna de sintomas GI graves, a correlação nos Ironman e a linha do ultra-trail.
 * Tudo em HTML sobre um trilho em % (texto ≥ 16 px, sem viewBox encolhendo letra).
 */

const pos = (gh: number) => `${(Math.max(0, Math.min(gh, GH_MAX)) / GH_MAX) * 100}%`;
const GRID = 'grid grid-cols-[192px_1fr_118px] items-center gap-x-4';

/** Fundo de cada trilho: grade dos g/h e a linha da diretriz (as linhas se emendam de uma faixa à outra). */
const TrackBg = () => (
    <>
        {GH_TICKS.map(t => (
            <span key={t} aria-hidden className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white/10" style={{ left: pos(t) }} />
        ))}
        <span aria-hidden className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white/70" style={{ left: pos(GUIDE) }} />
    </>
);

const GiBar = ({ from = 0, to, label, delay }: { from?: number; to: number; label: string; delay: number }) => (
    <div className="relative flex h-[26px] items-center">
        <div className="relative h-full overflow-hidden rounded-md" style={{ marginLeft: `${(from / GI_MAX) * 48}%`, width: `${Math.max(((to - from) / GI_MAX) * 48, 3)}%` }}>
            <Grow value={1} color={C.risk} delay={delay} />
        </div>
        <span className="ml-2 whitespace-nowrap font-mono text-[17px] font-semibold text-[#FDA4AF]">{label}</span>
    </div>
);

/** Altura da linha: generosa no começo, encolhe quando a correlação e o ultra-trail entram. */
const rowH = (step: number) => (step <= 2 ? 54 : step === 3 ? 46 : 42);

const focusOf = (e: EventRow, step: number) => {
    if (step === 1) return e.id === 'mar';
    if (step === 3) return Boolean(e.ironman);
    return true;
};

const Row = ({ e, i, step }: { e: EventRow; i: number; step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const focus = focusOf(e, step);
    return (
        <motion.div className={`${GRID} transition-[height] duration-300`} style={{ height: rowH(step) }}
            initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: focus ? 1 : 0.6, x: 0 }}
            transition={{ delay: step === 0 ? stagger(i, 0.1) : 0, duration: DUR.enter, ease: EASE_OUT }}>
            <span className="flex flex-col leading-tight">
                <span className="whitespace-nowrap text-[19px] font-semibold text-gray-50">{e.name}</span>
                <span className="font-mono text-[16px] text-gray-300">{e.mean} ± {e.sd} g/h</span>
            </span>
            <div className="relative h-full">
                <TrackBg />
                <span className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-white/55"
                    style={{ left: pos(e.mean - e.sd), right: `calc(100% - ${pos(e.mean + e.sd)})` }} />
                <motion.span className="absolute top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: pos(e.mean), background: C.glucose, border: '3px solid #04080F' }}
                    initial={false} animate={{ scale: step === 1 && e.id === 'mar' ? 1.35 : 1 }} transition={{ duration: DUR.morph, ease: EASE_OUT }} />
            </div>
            <div style={{ opacity: step >= 2 ? 1 : 0, transition: 'opacity 300ms' }}>
                {step >= 2 && <GiBar to={e.severe} label={`${e.approx ? '~' : ''}${e.severe}%`} delay={step === 2 ? stagger(i, 0.2, 0.08) : 0} />}
            </div>
        </motion.div>
    );
};

/** Ultra-trail (revisão de 8 estudos): sem média em g/h, só "a maioria abaixo de 90"; sintomas de qualquer grau. */
const UltraRow = () => (
    <motion.div className={`${GRID} h-[46px] border-t-2 border-white/20`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: DUR.enter, ease: EASE_OUT }}>
        <span className="flex flex-col leading-tight">
            <span className="text-[20px] font-semibold text-white">ultra-trail</span>
            <span className="text-[16px] text-gray-300">GI de qualquer grau</span>
        </span>
        <div className="relative h-full">
            <TrackBg />
            <div className="absolute inset-y-[9px] left-0 flex items-center rounded-md px-3" style={{ width: pos(GUIDE), background: 'rgba(245,158,11,0.30)' }}>
                <span className="whitespace-nowrap text-[16px] font-semibold text-white">a maioria abaixo de 90</span>
            </div>
        </div>
        <GiBar from={65} to={82} label="65–82%" delay={0.35} />
    </motion.div>
);

/** Colchete da faixa individual: do atleta que comeu 6 g/h ao que comeu 136 g/h. */
const RangeBracket = () => (
    <div className={`${GRID} h-[34px]`}>
        <span className="text-[16px] text-gray-300">indivíduos</span>
        <div className="relative h-full">
            <TrackBg />
            <motion.div className="absolute bottom-[4px] h-[14px] rounded-t-md border-x-[3px] border-t-[3px]"
                style={{ left: pos(RANGE[0]), right: `calc(100% - ${pos(RANGE[1])})`, borderColor: C.glucoseSoft, transformOrigin: 'left center' }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.draw, delay: 0.5, ease: EASE_OUT }} />
            <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded px-2 text-[16px] font-semibold"
                style={{ color: C.glucoseSoft, background: '#04080F' }}>faixa individual: 6 a 136 g/h</span>
        </div>
        <span />
    </div>
);

export const GIRealityChart = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col px-4 pb-2 pt-2">
        <div className={`${GRID} h-[24px] text-[16px] text-gray-300`}>
            <span>média ± 1 DP</span>
            <span className="relative h-full">
                <span className="absolute -translate-x-1/2 whitespace-nowrap font-semibold text-white" style={{ left: pos(GUIDE) }}>90 g/h · teto &gt; 2,5 h</span>
            </span>
            <span style={{ opacity: step >= 2 ? 1 : 0, color: '#FDA4AF', transition: 'opacity 300ms' }}>GI graves</span>
        </div>
        <RangeBracket />
        {EVENTS.map((e, i) => <Row key={e.id} e={e} i={i} step={step} />)}
        {step >= 4 && <UltraRow />}
        <div className={`${GRID} h-[24px] text-[16px] text-gray-300`}>
            <span>g/h de carboidrato</span>
            <span className="relative h-full">
                {GH_TICKS.map(t => <span key={t} className="absolute -translate-x-1/2 font-mono" style={{ left: pos(t) }}>{t}</span>)}
            </span>
            <span />
        </div>
        <div className="mt-auto flex flex-col gap-1.5">
            {step >= 3 && (
                <motion.p className="m-0 rounded-xl px-4 py-1 text-[17px] leading-snug text-gray-50"
                    style={{ background: 'rgba(252,211,77,0.14)' }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: 0.2, ease: EASE_OUT }}>
                    <strong style={{ color: C.glucoseSoft }}>Ironman:</strong> mais g/h, chegada mais rápida (r = −0,55 e −0,48), e mais náusea e flatulência.
                </motion.p>
            )}
            <p className="m-0 text-[16px] text-gray-300">221 atletas, homens e mulheres · questionário logo após a prova · Pfeiffer 2012</p>
        </div>
    </div>
);
