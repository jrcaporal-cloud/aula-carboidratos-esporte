import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ChainCell as Cell } from '../ato3/chainStrip';
import { MECHANISMS, POSITIVE, RECIPE, TOTAL } from './forest.content';

/**
 * Slide 101 · o palco em 3 faixas, uma por elo: 1 82% dos ensaios ajudam (Stellingwerff & Cox, contagem de votos) →
 * 2 quanto mais longa a prova, maior o ganho (mesma revisão; tendência ilustrativa com eixo, o artigo dá só o p) →
 * 3 a formulação decide o tamanho (Vandenbogaerde & Hopkins, OUTRA base: meta-análise, −2% a +6%).
 */

const TILE = 10;
const TILE_GAP = 3;
const PER_ROW = 31;

/** Faixa 1: cada quadrado é um ECR; 50 âmbar (benefício) e 11 cinza (sem mudança). */
const Votes = ({ born }: { born: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap" style={{ width: PER_ROW * (TILE + TILE_GAP), gap: TILE_GAP }}>
                {Array.from({ length: TOTAL }, (_, i) => (
                    <motion.span key={i} className="rounded-[3px]" style={{ width: TILE, height: TILE, background: i < POSITIVE ? C.glucose : '#64748B' }}
                        initial={born && !reduce ? { opacity: 0, scale: 0.4 } : false} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: born ? stagger(i, 0.2, 0.012) : 0, ease: EASE_OUT }} />
                ))}
            </div>
            <div className="flex flex-wrap items-baseline gap-x-4 text-[16px] leading-tight">
                <span className="font-semibold" style={{ color: C.glucoseSoft }}>■ 50 com benefício · 82%</span>
                <span className="font-semibold text-gray-200"><span style={{ color: '#64748B' }}>■</span> 11 sem mudança · 18%</span>
            </div>
        </div>
    );
};

/* Faixa 2: duração (h) × ganho (%). A reta é ilustrativa: o artigo dá a correlação (p = 0,0036), não os pontos. */
const W = 404;
const H = 166;
const X0 = 40;
const X1 = 392;
const Y_TOP = 26;
const Y0 = 122;
const hx = (h: number) => X0 + (h / 4) * (X1 - X0);

const DurationChart = ({ born }: { born: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const [oral, fuel] = MECHANISMS;
    return (
        <div className="flex flex-col gap-1">
            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img"
                aria-label="Ganho de desempenho cresce com a duração da prova; perto de 1 hora age a boca e o cérebro, acima de 2 horas o combustível">
                <rect x={hx(0.5)} y={Y_TOP} width={hx(1.5) - hx(0.5)} height={Y0 - Y_TOP} fill={`${C.insulin}24`} />
                <rect x={hx(2)} y={Y_TOP} width={X1 - hx(2)} height={Y0 - Y_TOP} fill={`${C.glucose}1F`} />
                <line x1={X0} x2={X0} y1={Y_TOP - 6} y2={Y0} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                <SvgText x={X0 - 8} y={16} text="ganho de desempenho (%)" size={16} color={C.muted} weight={700} />
                <SvgText x={X1} y={16} text="p = 0,0036" size={16} anchor="end" color={C.glucoseSoft} weight={800} />
                {[0, 1, 2, 3, 4].map(h => (
                    <SvgText key={h} x={hx(h)} y={Y0 + 20} text={`${h} h`} size={16} anchor="middle" color={C.muted} weight={600} />
                ))}
                <SvgText x={X0 - 8} y={Y0 + 42} text="duração da prova →" size={16} color={C.muted} weight={700} />
                <SvgText x={X1} y={Y0 + 42} text="reta ilustrativa" size={16} anchor="end" color={C.caveat} weight={700} />
                <motion.line x1={hx(0.25)} y1={Y0 - 12} x2={hx(4)} y2={Y_TOP + 16} stroke={C.glucose} strokeWidth={4} strokeLinecap="round"
                    initial={born && !reduce ? { pathLength: 0 } : false} animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: born ? 0.3 : 0, ease: EASE_OUT }} />
                <SvgText x={X0 + 8} y={Y_TOP + 20} text={`${oral.when}: ${oral.what}`} size={16} color={oral.color} weight={800} />
                <SvgText x={X0 + 8} y={Y_TOP + 40} text="tipo e dose “irrelevantes”" size={16} color="#E5E7EB" weight={600} />
                <SvgText x={X1 - 6} y={Y0 - 30} text={`${fuel.when}: ${fuel.what}`} size={16} anchor="end" color={C.glucoseSoft} weight={800} />
                <SvgText x={X1 - 6} y={Y0 - 10} text="entrega > 90 g/h" size={16} anchor="end" color="#E5E7EB" weight={600} />
            </svg>
        </div>
    );
};

/** Faixa 3: efeito na potência média do contrarrelógio, de −2% a +6%, com o zero marcado. */
const RANGE_TICKS = [-2, 0, 2, 4, 6] as const;
const pos = (v: number) => `${((v + 2) / 8) * 100}%`;
const fmt = (v: number) => (v > 0 ? `+${v}%` : v < 0 ? `−${-v}%` : '0');

const Formulation = () => (
    <div className="flex flex-col gap-1">
        <span className="text-[16px] font-semibold leading-tight text-gray-300">efeito na potência média do contrarrelógio (%)</span>
        <div className="relative h-[20px] w-full">
            <div className="absolute inset-y-0 left-0 overflow-hidden rounded-l-md" style={{ width: pos(0) }}><Grow value={1} color={C.risk} /></div>
            <div className="absolute inset-y-0 right-0 overflow-hidden rounded-r-md" style={{ left: pos(0) }}><Grow value={1} color={C.ok} delay={0.25} /></div>
            <span className="absolute -top-[4px] h-[28px] w-[4px] -translate-x-1/2 bg-white" style={{ left: pos(0) }} />
        </div>
        <div className="relative h-[20px] w-full">
            {RANGE_TICKS.map(v => (
                <span key={v} className="absolute -translate-x-1/2 text-[16px] font-bold tabular-nums leading-tight"
                    style={{ left: `clamp(16px, ${pos(v)}, calc(100% - 22px))`, color: v === 0 ? '#FFFFFF' : v < 0 ? '#FDA4AF' : C.ok }}>
                    {v === 0 ? '0 = sem efeito' : fmt(v)}
                </span>
            ))}
        </div>
        <motion.div className="flex flex-col text-[16px] leading-snug" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, delay: 0.5, ease: EASE_OUT }}>
            <span className="text-gray-200">
                <b style={{ color: C.ok }}>↑ topo (g/kg/h):</b>{' '}
                {RECIPE.map((r, i) => (
                    <span key={r.what} className="whitespace-nowrap"><b style={{ color: r.color }}>{r.amount}</b> {r.short}{i < RECIPE.length - 1 ? ' + ' : ''}</span>
                ))}
            </span>
            <span className="text-gray-200"><b style={{ color: '#FDA4AF' }}>↓ menos:</b> frutose &gt; 0,25 g/kg/h; +10 °C no ambiente</span>
        </motion.div>
    </div>
);

export const ForestChain = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-[84px_1fr_148px] gap-2 p-2">
        <Cell n={1} title="82% ajudam" note="Stellingwerff & Cox 2014 · 1 quadrado = 1 ECR" show={step >= 0} born={step === 0}>
            <Votes born={step === 0} />
        </Cell>
        <Cell n={2} title="Prova mais longa, ganho maior" note="mesma revisão; do artigo, só o p" show={step >= 1} born={step === 1}>
            <DurationChart born={step === 1} />
        </Cell>
        <Cell n={3} title="A formulação decide quanto" note="Vandenbogaerde & Hopkins 2011 · outra base" show={step >= 2} born={step === 2}>
            <Formulation />
        </Cell>
    </div>
);
