import { motion, useReducedMotion } from 'framer-motion';
import { User } from 'lucide-react';
import { DUR, EASE_IN_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { SvgText } from '../kit/ui';
import { sample, toPath } from '../kit/useMorphPath';
import { ChainCell as Cell } from '../ato3/chainStrip';
import { BOWLER, glucoseAt, MATKIN, THOMAS, THRESHOLD } from './cgm.content';

/**
 * Slide 185 · o palco em 4 faixas, uma por elo: 1 o sensor lê o intersticial e atrasa → 2 atletas saudáveis passam de
 * 6,0 boa parte do dia (Thomas 2016) → 3 o CGM não separa REDs de controles (Matkin-Hussey 2026) → 4 logo, não há régua
 * para atleta (Flockhart & Larsen 2024; o que existe é descrição, como Bowler 2025). Só o elo 2 tem curva, e ela é
 * ilustrativa: o selo fica preso a ela. Os P são texto fixo (sem contador).
 */

const HEX = 'M 0 -9 L 8 -4.5 L 8 4.5 L 0 9 L -8 4.5 L -8 -4.5 Z';
const TRACK_W = 52;

/** Trilho com a glicose andando (único laço do slide; com movimento reduzido, para). */
const Diffuse = ({ offset }: { offset: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${TRACK_W} 22`} width={TRACK_W} height={22} aria-hidden className="shrink-0">
            <line x1={2} x2={TRACK_W - 2} y1={11} y2={11} stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeLinecap="round" />
            {reduce
                ? <path d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2} transform={`translate(${TRACK_W / 2} 11)`} />
                : <motion.path d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                    initial={{ x: 10, y: 11, opacity: 0 }} animate={{ x: [10, TRACK_W - 10], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.6, times: [0, 0.15, 0.85, 1], repeat: Infinity, repeatDelay: 0.9, delay: offset, ease: 'easeInOut' }} />}
        </svg>
    );
};

const Box = ({ label, color }: { label: string; color: string }) => (
    <span className="whitespace-nowrap rounded-lg border-2 px-2 py-0.5 text-[16px] font-semibold" style={{ borderColor: color, color }}>{label}</span>
);

const Sensor = () => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
            <Box label="capilar" color="#FDA4AF" />
            <Diffuse offset={0} />
            <Box label="intersticial" color={C.lactateSoft} />
            <Diffuse offset={1.3} />
            <Box label="filamento" color="#F3F4F6" />
        </div>
        <span className="text-[16px] leading-tight text-gray-200">chega <b style={{ color: C.glucoseSoft }}>depois</b> do sangue; mais ainda no exercício</span>
    </div>
);

/* Mini-monitor de 24 h (ilustrativo): área acima de 6,0 mmol/L acesa. */
const MW = 196;
const MH = 112;
const Y_MIN = 3.5;
const Y_MAX = 9.5;
const PT = 6;
const PB = 86;
const my = (g: number) => PB - ((g - Y_MIN) / (Y_MAX - Y_MIN)) * (PB - PT);
const mx = (h: number) => 4 + (h / 24) * (MW - 8);
const LINE_D = toPath(sample(90, 0, 24, glucoseAt, (h, g) => [mx(h), my(g)]));
const AREA_D = `${LINE_D} L ${mx(24)} ${PB} L ${mx(0)} ${PB} Z`;
const Y_TH = my(THRESHOLD);

const MiniCurve = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${MW} ${MH}`} width={MW} height={MH} role="img" aria-label="Curva ilustrativa de 24 h com o limiar de 6,0 mmol/L" className="shrink-0">
            <defs><clipPath id="cgm185-mini"><rect x={0} y={0} width={MW} height={Y_TH} /></clipPath></defs>
            <path d={AREA_D} fill={C.glucose} opacity={0.45} clipPath="url(#cgm185-mini)" />
            <line x1={4} x2={MW - 4} y1={Y_TH} y2={Y_TH} stroke={C.stone} strokeWidth={2} strokeDasharray="8 6" />
            <motion.path d={LINE_D} fill="none" stroke={C.glucose} strokeWidth={3.5} strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }} />
            {/* o selo vive colado à curva: os números reais ao lado não herdam a forma desenhada */}
            <rect x={4} y={Y_TH + 6} width={136} height={22} rx={5} fill="#04080F" stroke={C.caveat} strokeWidth={2} />
            <SvgText x={72} y={Y_TH + 22} text="curva ilustrativa" anchor="middle" color={C.caveat} size={16} />
            <SvgText x={4} y={MH - 2} text="0 h" color="#D1D5DB" />
            <line x1={44} x2={62} y1={MH - 8} y2={MH - 8} stroke={C.stone} strokeWidth={2} strokeDasharray="5 4" />
            <SvgText x={67} y={MH - 2} text="6,0 mmol/L" color={C.stone} weight={700} />
            
            <SvgText x={MW - 4} y={MH - 2} text="24 h" anchor="end" color="#D1D5DB" />
        </svg>
    );
};

const People = () => (
    <div className="flex min-w-0 flex-col gap-1">
        <div className="flex gap-0.5 self-start">
            {Array.from({ length: 10 }, (_, i) => (
                <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger(i, 0.3, 0.04), duration: DUR.text }}>
                    <User size={21} strokeWidth={2.6} color={i < THOMAS.lit ? C.glucose : '#6B7280'} fill={i < THOMAS.lit ? C.glucose : 'none'} aria-hidden />
                </motion.span>
            ))}
        </div>
        <span className="text-[16px] leading-tight text-gray-100">
            <KeyFact color={C.glucoseSoft} delay={0.8}><b className="text-[20px]" style={{ color: C.glucoseSoft }}>4 de 10</b></KeyFact> &gt; 70% do dia acima de 6,0
        </span>
        <span className="text-[16px] leading-tight text-gray-100"><b className="text-[18px] text-white">3 de 10</b> jejum de pré-diabetes</span>
    </div>
);

const PRow = ({ what, p }: { what: string; p: string }) => (
    <div className="flex items-baseline gap-3">
        <span className="w-[200px] shrink-0 text-[16px] text-gray-200">{what}</span>
        <span className="text-[22px] font-bold tabular-nums" style={{ color: C.stone }}>{p}</span>
    </div>
);

const Stat = ({ value, caption }: { value: string; caption: string }) => (
    <div className="flex flex-col leading-tight">
        <span className="text-[22px] font-bold tabular-nums" style={{ color: C.ok }}>{value}</span>
        <span className="text-[16px] text-gray-300">{caption}</span>
    </div>
);

export const CgmChain = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-[80px_1fr_80px_92px] gap-2">
        <Cell n={1} title="O sensor atrasa" note="lê o intersticial, não o sangue" show={step >= 0} born={step === 0}>
            <Sensor />
        </Cell>
        <Cell n={2} title="Saudáveis passam de 6,0" note="Thomas 2016 · 10 subelite · 6 dias" show={step >= 1} born={step === 1}>
            <div className="flex items-center gap-2"><MiniCurve /><People /></div>
        </Cell>
        <Cell n={3} title="REDs não se separa" note="Matkin-Hussey 2026 · n = 18" show={step >= 2} born={step === 2}>
            <PRow what="glicose noturna" p={MATKIN.night} />
            <PRow what="variabilidade (MAGE)" p={MATKIN.mage} />
        </Cell>
        <Cell n={4} title="Logo: sem régua" note="Flockhart & Larsen 2024" show={step >= 3} born={step === 3}>
            <span className="text-[16px] leading-tight text-gray-200">só descrição: Bowler 2025, elite a 8,4 g/kg/d (mg/dL)</span>
            <div className="flex gap-5">
                <Stat value={BOWLER.mean} caption="média 24 h" />
                <Stat value={BOWLER.night} caption="noturna" />
                <Stat value={BOWLER.mage} caption="MAGE" />
            </div>
        </Cell>
    </div>
);
