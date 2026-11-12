import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { EXHAUSTED_LEFT, EXHAUSTED_STEP, POOL_FOCUS, POOL_LEADS, POOLS, POOLS_SOURCE, type Pool } from './ato4/pools.content';
import { Model3DHint } from './kit/Model3DHint';

/**
 * Slide 65 · mapa de endereços: um corte longitudinal chapado da fibra (membrana, miofibrilas, retículo) com os
 * grânulos em três zonas. Cada passo acende um endereço, e a etiqueta dele à direita; no fim, o exercício exaustivo.
 * A tecla 3 abre o modelo 3D `fibra-glicogenio` (feito à parte).
 */

const W = 720;
const H = 330;
const FIBRILS = [104, 188, 272] as const;
const FIB_H = 52;
/** Altura (em px do desenho) onde cada etiqueta se alinha com a sua zona. */
const TAG_Y: Record<Pool, number> = { sub: 44, inter: 134, intra: 224 };

const hash = (n: number) => {
    const s = Math.sin(n * 91.7) * 12345.678;
    return s - Math.floor(s);
};

interface Granule { x: number; y: number; pool: Pool; t: number }

const GRANULES: readonly Granule[] = (() => {
    const out: Granule[] = [];
    const add = (pool: Pool, n: number, y0: number, y1: number, seed: number) => {
        for (let i = 0; i < n; i++) {
            out.push({ pool, x: 24 + hash(seed + i) * (W - 70), y: y0 + hash(seed + i + 500) * (y1 - y0), t: hash(seed + i + 900) });
        }
    };
    add('sub', 18, 52, 88, 1);
    add('inter', 20, FIBRILS[0] + FIB_H + 8, FIBRILS[1] - 8, 100);
    add('inter', 20, FIBRILS[1] + FIB_H + 8, FIBRILS[2] - 8, 200);
    add('intra', 9, FIBRILS[0] + 12, FIBRILS[2] + FIB_H - 12, 300);
    // os intramiofibrilares ficam dentro das faixas, nunca no vão
    return out.map(g => (g.pool !== 'intra' ? g : { ...g, y: FIBRILS[Math.floor(g.t * 3)] + 14 + hash(g.x) * (FIB_H - 28) }));
})();

const Fibril = ({ y }: { y: number }) => (
    <g>
        <rect x={10} y={y} width={W - 40} height={FIB_H} rx={10} fill="#3B2F45" />
        {Array.from({ length: 6 }, (_, i) => 10 + 40 + i * 112).filter(x => x + 80 < W - 30).map(x => (
            <g key={x}>
                <rect x={x + 22} y={y + 4} width={56} height={FIB_H - 8} rx={4} fill="#4E3E5C" />
                <rect x={x - 2} y={y} width={4} height={FIB_H} fill="#7C6A8C" />
            </g>
        ))}
    </g>
);

const Reticulum = ({ y }: { y: number }) => <rect x={14} y={y} width={W - 48} height={7} rx={3.5} fill={C.co2} />;

const Figure = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const focus = POOL_FOCUS[step];
    const exhausted = step === EXHAUSTED_STEP;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block shrink-0" style={{ width: W, height: H }} role="img"
            aria-label="Corte longitudinal da fibra muscular com o glicogênio em três zonas">
            <rect x={0} y={28} width={W - 20} height={12} rx={4} fill={C.stone} />
            <SvgText x={14} y={20} text="membrana (sarcolema)" size={16} color={C.caveat} />
            {FIBRILS.map(y => <Fibril key={y} y={y} />)}
            <Reticulum y={FIBRILS[0] + FIB_H + 12} />
            <Reticulum y={FIBRILS[1] + FIB_H + 12} />
            {GRANULES.map((g, i) => {
                const on = focus === null || focus === g.pool;
                const gone = exhausted && g.t > EXHAUSTED_LEFT[g.pool];
                return (
                    <motion.circle key={i} cx={g.x} cy={g.y} r={8}
                        initial={false} animate={{ opacity: gone ? 0 : on ? 1 : 0.6, fill: on ? C.glycogenSoft : '#4A4F5E' }}
                        transition={{ duration: reduce ? 0 : DUR.morph, delay: reduce ? 0 : (i % 6) * 0.05, ease: EASE_OUT }} />
                );
            })}
            <SvgText x={W - 30} y={20} text="miofibrilas · retículo em cinza" size={16} anchor="end" color={C.caveat} />
        </svg>
    );
};

const Tags = ({ step }: { step: number }) => {
    const focus = POOL_FOCUS[step];
    return (
        <div className="relative flex-1" style={{ height: H }}>
            <div className="absolute right-0 top-[-4px]"><Model3DHint label="a fibra em 3D" /></div>
            {POOLS.map(p => {
                const on = focus === p.id || (step === EXHAUSTED_STEP && p.id === 'intra');
                return (
                    <div key={p.id} className="absolute left-0 right-0 rounded-xl border-[3px] px-4 py-2 transition-[border-color,opacity] duration-300"
                        style={{ top: TAG_Y[p.id] + 0, borderColor: on ? C.glycogenSoft : 'rgba(255,255,255,0.14)', opacity: focus === null || on ? 1 : 0.6 }}>
                        <span className="block font-display text-[24px] font-semibold text-white">{p.name}</span>
                        <span className="block text-[18px] leading-snug text-gray-200">{p.where}</span>
                        {p.share && <span className="block font-display text-[24px] font-semibold" style={{ color: C.glycogenSoft }}>{p.share}</span>}
                    </div>
                );
            })}
        </div>
    );
};

export default function GlycogenPoolsSim() {
    const { step } = useSlideSteps(POOL_LEADS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <SimBox>
            <Lead beat={step} chips={<><DesignChip>MET · 10 atletas de elite</DesignChip><IllustrativeChip /></>} className="min-h-[72px]">{POOL_LEADS[step]}</Lead>
            <div className="mt-3 flex gap-6">
                <Figure step={step} reduce={reduce} />
                <Tags step={step} />
            </div>
            <Foot source={POOLS_SOURCE} />
        </SimBox>
    );
}
