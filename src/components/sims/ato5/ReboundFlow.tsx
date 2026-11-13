import { motion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { CountUp } from '../kit/CountUp';
import { Stamp } from '../kit/Stamp';
import { br } from '../kit/format';
import { ChainCell as Cell, ScaleBar as Bar } from '../ato3/chainStrip';
import { GlycemiaChart } from './GlycemiaChart';
import { ARMS, FOSTER, KUIPERS, MYTH, TEXT } from './rebound.content';

/**
 * Slide 85 · o palco em 3 faixas numeradas, um estudo por faixa e cada um no seu eixo: 1 Foster 1979, o medo (minutos até
 * a exaustão) → 2 Moseley 2003, a glicemia em minutos de exercício e, no passo 3, a potência → 3 Kuipers 1999, quem sente.
 * Embaixo, o veredito: o carimbo MITO cai sobre o conselho (“não coma na hora antes”), não sobre o dado de 1979.
 */


const Foster = () => (
    <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            {FOSTER.rows.map((r, i) => (
                <Bar key={r.label} label={r.label} value={r.min} text={br(r.min)} max={FOSTER.max} color={i === 0 ? C.co2 : C.risk}
                    delay={0.25 + i * 0.15} labelWidth={64} thin />
            ))}
            <span className="text-[16px] leading-tight text-gray-300">{FOSTER.caption}</span>
        </div>
        <CountUp text={FOSTER.value} delay={0.5} className="w-[96px] shrink-0 text-right font-display text-[36px] font-bold leading-none" style={{ color: C.risk }} />
    </div>
);

/** Coluna à direita do gráfico: quem tomou quando (a legenda das cores) e, a partir do passo 3, a potência de cada braço. */
const Arms = ({ watts }: { watts: boolean }) => (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[16px] font-semibold text-gray-300">{TEXT.legend}</span>
        {ARMS.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2 text-[16px] font-bold leading-tight" style={{ color: a.color }}>
                <span className="h-3.5 w-3.5 shrink-0 rounded-sm" style={{ background: a.color }} />
                <span className="flex-1 whitespace-nowrap">{a.before} min antes</span>
                {watts && <CountUp text={String(a.watts)} delay={0.3 + i * 0.1} className="font-display text-[20px] font-bold leading-none text-white" />}
            </div>
        ))}
        {watts && (
            <motion.span className="text-right text-[16px] leading-tight" style={{ color: C.ok }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: DUR.text, delay: 0.6 }}>{TEXT.watts}</motion.span>
        )}
    </div>
);

const Kuipers = () => (
    <div className="flex flex-col gap-1.5">
        <div className="flex gap-[6px]">
            {Array.from({ length: KUIPERS.n }, (_, i) => (
                <motion.span key={i} className="h-[16px] w-[16px] shrink-0 rounded-full"
                    style={{ background: i < KUIPERS.low ? C.risk : 'rgba(148,163,184,0.55)' }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: stagger(i, 0.2, 0.025), duration: DUR.text, ease: EASE_OUT }} />
            ))}
        </div>
        <span className="text-[16px] leading-tight text-gray-100">
            <b style={{ color: C.risk }}>{KUIPERS.caption}</b> com 50 g, transitório
        </span>
    </div>
);

/** O fim da cadeia: o conselho de 1979 e o carimbo sobre ele. Antes do último passo, só a moldura tracejada. */
const Verdict = ({ show }: { show: boolean }) => (
    <div className="flex min-h-[58px] items-center justify-between gap-3 rounded-xl border-2 px-3 py-1.5"
        style={{ borderColor: show ? C.risk : '#334155', borderStyle: show ? 'solid' : 'dashed' }}>
        {show ? (
            <motion.div className="flex min-w-0 flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: 0.2 }}>
                <span className="text-[19px] font-bold leading-tight text-white">{MYTH}</span>
                <span className="text-[16px] leading-tight text-gray-300">{TEXT.verdictNote}</span>
            </motion.div>
        ) : <span className="text-[17px] font-bold text-gray-400">{TEXT.verdictTitle}</span>}
        {show && <span className="shrink-0 pr-1"><Stamp verdict="mito" /></span>}
    </div>
);

export const ReboundFlow = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2 [&>*]:shrink-0">
        <Cell n={1} title="O medo, 1979" note="Foster · n = 8" show={step >= 0} born={step === 0}>
            <Foster />
        </Cell>
        {/* altura fixa da faixa 2: a moldura tracejada já reserva o lugar do gráfico, nada pula quando ele entra */}
        <div className="shrink-0 [&>div]:h-[190px]">
            <Cell n={2} title="A glicemia se acerta, 2003" note="Moseley · n = 8 ciclistas" show={step >= 1} born={step === 1}>
                <div className="flex items-center gap-3">
                    <GlycemiaChart />
                    <Arms watts={step >= 2} />
                </div>
            </Cell>
        </div>
        <Cell n={3} title="Quem sente, 1999" note="Kuipers · n = 19" show={step >= 3} born={step === 3}>
            <Kuipers />
        </Cell>
        <div className="mt-auto"><Verdict show={step >= 3} /></div>
    </div>
);
