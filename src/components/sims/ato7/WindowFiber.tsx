import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Slide 120 · a fibra logo depois do treino (o "porquê" da janela). Capilar em cima, sarcolema, GLUT4 já na
 * membrana (contração), receptor de insulina (fase lenta), e a via de síntese: glicose-6-P → UDP-glicose →
 * glicogênio sintase → grânulo. Loop permitido: 3 glicoses percorrem o caminho (fluxo = conteúdo).
 * O grânulo cresce um pouco a cada passo. Geometria em px do palco (viewBox = tamanho real).
 */

export const FIBER_W = 616;
export const FIBER_H = 178;
const MEM_Y = 48;
const PATH_Y = 138;
const GLUT_X = [60, 128] as const;
const GRAN = { x: 560, y: 132, r: 28 };
const LOOP_S = 3.2;

const HEX = 'M 0 -9 L 8 -4.5 L 8 4.5 L 0 9 L -8 4.5 L -8 -4.5 Z';

/** Caminho de uma glicose (x, y, visível): sangue → GLUT4 → G6P → UDP-glicose → grânulo. Some dentro das pílulas. */
const ROUTE: readonly (readonly [number, number, number])[] = [
    [24, 20, 0], [60, 20, 1], [94, 20, 1], [94, PATH_Y - 22, 1], [94, PATH_Y - 18, 0],
    [162, PATH_Y, 0], [166, PATH_Y, 1], [220, PATH_Y, 1], [224, PATH_Y, 0],
    [356, PATH_Y, 0], [360, PATH_Y, 1], [GRAN.x - 34, GRAN.y, 1], [GRAN.x - 26, GRAN.y, 0],
];

/** Tempo de cada ponto proporcional à distância percorrida à vista (os saltos escondidos custam quase nada). */
const ROUTE_TIMES = (() => {
    const seg = ROUTE.slice(1).map((p, i) => {
        const q = ROUTE[i];
        const hidden = p[2] === 0 && q[2] === 0;
        return hidden ? 2 : Math.hypot(p[0] - q[0], p[1] - q[1]);
    });
    const total = seg.reduce((a, b) => a + b, 0);
    return seg.reduce<number[]>((acc, d) => [...acc, acc[acc.length - 1] + d / total], [0]);
})();

const Glucose = ({ delay }: { delay: number }) => (
    <motion.path d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2}
        initial={{ x: ROUTE[0][0], y: ROUTE[0][1], opacity: 0 }}
        animate={{ x: ROUTE.map(p => p[0]), y: ROUTE.map(p => p[1]), opacity: ROUTE.map(p => p[2]) }}
        transition={{ duration: LOOP_S, times: ROUTE_TIMES, ease: 'linear', repeat: Infinity, repeatDelay: 0.6, delay }} />
);

const Pill = ({ cx, label, w }: { cx: number; label: string; w: number }) => (
    <g>
        <rect x={cx - w / 2} y={PATH_Y - 16} width={w} height={32} rx={16} fill={`${C.glucose}24`} stroke={C.glucose} strokeWidth={2} />
        <SvgText x={cx} y={PATH_Y + 6} text={label} size={16} anchor="middle" color="#F9FAFB" />
    </g>
);

/** GLUT4: dois blocos atravessando a membrana, com o poro no meio. */
const Glut4 = ({ x }: { x: number }) => (
    <g>
        <rect x={x - 13} y={MEM_Y - 15} width={10} height={30} rx={4} fill={C.co2} />
        <rect x={x + 3} y={MEM_Y - 15} width={10} height={30} rx={4} fill={C.co2} />
    </g>
);

const Arrow = ({ d, color, id }: { d: string; color: string; id: string }) => (
    <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" markerEnd={`url(#win-head-${id})`} />
);

export const WindowFiber = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const fill = [0.35, 0.5, 0.62, 0.85, 0.9][step] ?? 0.9;
    return (
        <svg viewBox={`0 0 ${FIBER_W} ${FIBER_H}`} width={FIBER_W} height={FIBER_H} className="block" role="img"
            aria-label="Fibra muscular depois do exercício: GLUT4 na membrana, glicogênio sintase ativa e o grânulo enchendo">
            <defs>
                {[['amber', C.glucoseSoft], ['violet', C.glycogenSoft]].map(([id, color]) => (
                    <marker key={id} id={`win-head-${id}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
                    </marker>
                ))}
            </defs>
            {/* sarcoplasma (chapado), capilar e membrana */}
            <rect x={0} y={MEM_Y} width={FIBER_W} height={FIBER_H - MEM_Y} rx={10} fill="rgba(139,92,246,0.06)" />
            <rect x={6} y={6} width={238} height={28} rx={14} fill="rgba(148,163,184,0.12)" stroke={C.co2} strokeWidth={2} />
            <SvgText x={236} y={26} text="capilar" size={16} anchor="end" color={C.caveat} weight={500} />
            <rect x={0} y={MEM_Y - 2} width={FIBER_W} height={4} fill={C.stone} />
            <SvgText x={FIBER_W - 2} y={MEM_Y - 10} text="sarcolema" size={16} anchor="end" color={C.caveat} weight={500} />
            {GLUT_X.map(x => <Glut4 key={x} x={x} />)}
            <SvgText x={158} y={74} text="GLUT4 ainda na membrana" size={17} color="#FFFFFF" weight={700} />
            <SvgText x={158} y={94} text="contração · sem insulina" size={16} color={C.caveat} weight={500} />
            {/* receptor de insulina: a fase lenta */}
            <g>
                <path d={`M 440 ${MEM_Y + 14} L 440 ${MEM_Y - 4} M 440 ${MEM_Y - 4} L 430 ${MEM_Y - 18} M 440 ${MEM_Y - 4} L 450 ${MEM_Y - 18}`}
                    stroke={C.insulin} strokeWidth={5} strokeLinecap="round" fill="none" />
                <SvgText x={FIBER_W - 2} y={74} text="insulina" size={17} anchor="end" color={C.insulinSoft} weight={700} />
                <SvgText x={FIBER_W - 2} y={94} text="fase lenta · horas" size={16} anchor="end" color={C.caveat} weight={500} />
            </g>
            {/* via de síntese (Leloir) */}
            <Arrow id="amber" color={C.glucoseSoft} d={`M 94 ${MEM_Y + 18} L 94 ${PATH_Y - 22}`} />
            <SvgText x={84} y={108} text="HK" size={16} anchor="end" color="#D1D5DB" />
            <Pill cx={94} label="glicose-6-P" w={124} />
            <Arrow id="amber" color={C.glucoseSoft} d={`M 160 ${PATH_Y} L 222 ${PATH_Y}`} />
            <SvgText x={190} y={PATH_Y + 32} text="PGM · UGP" size={16} anchor="middle" color="#D1D5DB" />
            <Pill cx={290} label="UDP-glicose" w={124} />
            <Arrow id="violet" color={C.glycogenSoft} d={`M 356 ${PATH_Y} L ${GRAN.x - GRAN.r - 8} ${GRAN.y + 2}`} />
            <SvgText x={444} y={PATH_Y - 12} text="glicogênio sintase" size={17} anchor="middle" color={C.glycogenSoft} weight={700} />
            <SvgText x={400} y={PATH_Y + 32} text="ativada pelo glicogênio baixo" size={16} anchor="middle" color={C.caveat} weight={500} />
            {/* grânulo: cresce um pouco a cada passo */}
            <circle cx={GRAN.x} cy={GRAN.y} r={GRAN.r} fill="rgba(139,92,246,0.14)" stroke={C.glycogen} strokeWidth={3} />
            <motion.circle cx={GRAN.x} cy={GRAN.y} r={GRAN.r - 4} fill={C.glycogen}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={false} animate={{ scale: fill }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
            <SvgText x={GRAN.x} y={FIBER_H - 2} text="glicogênio" size={16} anchor="middle" color={C.glycogenSoft} weight={700} />
            {!reduce && [0, 1.25, 2.5].map(d => <Glucose key={d} delay={d} />)}
            {/* pulso curto na sintase a cada passo: o clique "liga" a via de novo */}
            <motion.g key={`pulse-${step}`} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: reduce ? 0 : 1, ease: EASE_IN_OUT }}>
                <rect x={354} y={PATH_Y - 34} width={180} height={30} rx={8} fill="none" stroke={C.glycogenSoft} strokeWidth={3} />
            </motion.g>
        </svg>
    );
};
