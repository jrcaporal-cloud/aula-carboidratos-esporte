import { motion } from 'framer-motion';
import { Check, Equal } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Legs } from './ato8/Legs';
import { Appear, Foot, Frame, Headline } from './ato8/parts';
import { HANSEN_BEATS, HANSEN_CAVEATS, HANSEN_SOURCE, LEG_ROWS, RESULTS, type LegRow } from './ato8/hansen.content';

/**
 * Slide 140 · A perna que treinou com fome (Hansen 2005).
 * Cena: o corpo à esquerda (cada coxa é um tanque), o calendário à direita.
 * 1 desenho · 2 calendário de 2 semanas (14 × 14 sessões) e a coxa LOW esvazia · 3 resultados · 4 ressalvas.
 */

/** Nível ilustrativo das coxas por passo [LOW, HIGH]: no fim, a LOW guarda mais glicogênio em repouso. */
const LEVELS: readonly (readonly [number, number])[] = [[0.85, 0.85], [0.28, 0.72], [1, 0.82], [1, 0.82]];

const Dot = ({ low }: { low: boolean }) => (
    <span className="block h-[18px] w-[18px] rounded-full border-[3px]"
        style={{ borderColor: C.glycogen, background: low ? 'transparent' : C.glycogen }} />
);

const CalendarRow = ({ row, show }: { row: LegRow; show: boolean }) => (
    <div className="flex items-center gap-3">
        <div className="w-[226px] shrink-0">
            <p className="m-0 text-[22px] font-bold" style={{ color: C.text }}>{row.name}</p>
            <p className="m-0 text-[18px] text-gray-300">{row.rule}</p>
        </div>
        <Wipe show={show} from="left" duration={0.8}>
            <div className="flex gap-1">
                {row.days.map((n, d) => (
                    <div key={d} className="flex h-[70px] w-[36px] flex-col items-center justify-center gap-[6px] rounded-lg border-2 border-white/15">
                        {Array.from({ length: n }, (_, k) => <Dot key={k} low={row.id === 'low' && k === 1} />)}
                    </div>
                ))}
            </div>
        </Wipe>
    </div>
);

const Calendar = ({ show }: { show: boolean }) => (
    <div className="flex flex-col gap-4">
        <Appear show={show} className="ml-[238px] flex text-[16px] text-gray-300">
            <span className="w-[280px]">semana 1</span><span>semana 2</span>
        </Appear>
        {LEG_ROWS.map(r => <CalendarRow key={r.id} row={r} show={show} />)}
        <Appear show={show} delay={0.5} className="ml-[238px] flex items-center gap-6 text-[18px] text-gray-200">
            <span className="flex items-center gap-2"><Dot low={false} /> sessão</span>
            <span className="flex items-center gap-2"><Dot low /> 2ª sessão, 2 h depois, em jejum</span>
        </Appear>
        <Appear show={show} delay={0.7} className="ml-[238px] text-[22px] text-white">
            14 sessões <span className="text-gray-400">×</span> 14 sessões <span className="text-gray-400">· repete por 10 semanas</span>
        </Appear>
    </div>
);

const Results = ({ caveats }: { caveats: boolean }) => (
    <div className="flex flex-col gap-3">
        <div className="flex text-[16px] text-gray-300">
            <span className="w-[330px]" /><span className="w-[220px] font-semibold text-white">perna LOW</span><span>perna HIGH</span>
        </div>
        {RESULTS.map((r, i) => (
            <motion.div key={r.label} className="flex items-center rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.1, 0.15), duration: 0.35, ease: EASE_OUT }}>
                <span className="w-[314px] text-[20px] font-semibold text-white">{r.label}</span>
                <span className="flex w-[220px] items-center gap-2 text-[20px]" style={{ color: C.text, fontWeight: r.winner === 'low' ? 700 : 400 }}>
                    {r.winner === 'low' ? <Check size={22} strokeWidth={3} /> : <Equal size={22} strokeWidth={3} />}{r.low}
                </span>
                <span className="text-[20px] text-gray-300">{r.high}</span>
            </motion.div>
        ))}
        <Appear show={caveats} className="mt-3 flex flex-wrap gap-3">
            {HANSEN_CAVEATS.map(c => (
                <span key={c} className="rounded-lg border-2 px-3 py-1.5 text-[18px]" style={{ borderColor: `${C.stone}66`, color: C.stone }}>{c}</span>
            ))}
        </Appear>
    </div>
);

export default function HansenLegsSim() {
    const { step } = useSlideSteps(HANSEN_BEATS.length);
    const [low, high] = LEVELS[step];
    return (
        <Frame>
            <Headline beat={step} chips={<><DesignChip>intraindivíduo · n = 7 · não treinados</DesignChip><IllustrativeChip /></>}>{HANSEN_BEATS[step]}</Headline>
            <div className="mt-4 flex items-start gap-8">
                <Legs low={low} high={high} focusLow={step >= 1} />
                <div className="flex-1 pt-6">
                    {step < 2 ? <Calendar show={step >= 1} /> : <Results caveats={step >= 3} />}
                </div>
            </div>
            <Foot source={HANSEN_SOURCE} />
        </Frame>
    );
}
