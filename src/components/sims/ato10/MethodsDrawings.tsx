import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { sample, toPath } from '../kit/useMorphPath';

/**
 * Slide 183 · o princípio de cada instrumento, desenhado em 300 × 124 px de projeto (viewBox = tamanho, escala 1).
 * Esquemas de princípio, não anatomia em escala. Cada um anima uma vez quando entra (`fresh`).
 */
export const DRAW_W = 300;
export const DRAW_H = 124;

const MUSCLE = 'rgba(139,92,246,0.22)';
const EDGE = '#9CA3AF';
const ARROW = 'M 0 0 L -9 -6 L -9 6 Z';

const Arrow = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
    <g>
        <line x1={x1} x2={x2 - 6} y1={y} y2={y} stroke={C.caveat} strokeWidth={3} />
        <path d={ARROW} transform={`translate(${x2} ${y})`} fill={C.caveat} />
    </g>
);

const Svg = ({ label, children }: { label: string; children: ReactNode }) => (
    <svg viewBox={`0 0 ${DRAW_W} ${DRAW_H}`} width={DRAW_W} height={DRAW_H} role="img" aria-label={label} className="shrink-0">{children}</svg>
);

/** Biópsia: a agulha entra na coxa; o fragmento vai para a bioquímica ou para o PAS (cor por fibra). */
export const BiopsyDrawing = ({ fresh }: { fresh: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const fibers = [[40, 50], [62, 44], [84, 56], [34, 76], [76, 84], [58, 100]] as const;
    const pas = [[252, 86, 1], [276, 86, 0.35], [252, 108, 0.7], [276, 108, 1]] as const;
    return (
        <Svg label="Biópsia por agulha: fragmento para bioquímica ou para coloração PAS">
            <ellipse cx={60} cy={70} rx={54} ry={46} fill={MUSCLE} stroke={EDGE} strokeWidth={2} />
            {fibers.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={9} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2} />)}
            <circle cx={56} cy={74} r={10} fill="#E5E7EB" />
            <motion.g initial={reduce || !fresh ? false : { x: 26, y: -26, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: DUR.draw, ease: EASE_OUT }}>
                <line x1={118} y1={8} x2={82} y2={46} stroke="#E5E7EB" strokeWidth={5} strokeLinecap="round" />
                <rect x={110} y={0} width={20} height={10} rx={3} fill="#E5E7EB" transform="rotate(-45 120 5)" />
            </motion.g>
            <line x1={122} x2={136} y1={70} y2={70} stroke={C.caveat} strokeWidth={3} />
            <line x1={136} x2={136} y1={31} y2={97} stroke={C.caveat} strokeWidth={3} />
            <Arrow x1={136} x2={150} y={31} />
            <Arrow x1={136} x2={150} y={97} />
            <rect x={152} y={4} width={146} height={54} rx={8} fill="none" stroke={C.glucose} strokeWidth={2} />
            <SvgText x={160} y={26} text="bioquímica" color="#fff" weight={700} />
            <SvgText x={160} y={48} text="ácido → glicose" color={C.glucoseSoft} />
            <rect x={152} y={68} width={146} height={54} rx={8} fill="none" stroke={C.glycogen} strokeWidth={2} />
            <SvgText x={160} y={90} text="PAS" color="#fff" weight={700} />
            <SvgText x={160} y={112} text="por fibra" color={C.glycogenSoft} />
            {pas.map(([x, y, a]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={9} fill={C.glycogen} fillOpacity={a} stroke="#fff" strokeWidth={2} />)}
        </Svg>
    );
};

/** Espectro esquemático: um pico grande (C1 do glicogênio) e um vizinho pequeno. */
const SPEC_X0 = 160;
const SPEC_X1 = 296;
const BASE_Y = 100;
const spec = (x: number) => BASE_Y - 68 * Math.exp(-((x - 226) ** 2) / (2 * 7 ** 2)) - 14 * Math.exp(-((x - 182) ** 2) / (2 * 5 ** 2));
const SPEC_PTS = sample(90, SPEC_X0, SPEC_X1, spec, (x, y) => [x, y]);
const SPEC_D = toPath(SPEC_PTS);
const PEAK_AREA = `${toPath(sample(40, 206, 246, spec, (x, y) => [x, y]))} L 246 ${BASE_Y} L 206 ${BASE_Y} Z`;
const WAVE_D = toPath(sample(30, 116, 150, x => 62 + 7 * Math.sin((x - 116) * 0.55), (x, y) => [x, y]));

/** ¹³C-MRS: a perna dentro do ímã, a bobina na pele, o sinal vira espectro e a área do pico, glicogênio. */
export const MrsDrawing = ({ fresh }: { fresh: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <Svg label="Ressonância de carbono-13: a área do pico do glicogênio acompanha a concentração">
            <circle cx={58} cy={64} r={52} fill="none" stroke={C.co2} strokeWidth={10} />
            <circle cx={58} cy={70} r={28} fill={MUSCLE} stroke={EDGE} strokeWidth={2} />
            <circle cx={52} cy={76} r={8} fill="#E5E7EB" />
            <ellipse cx={58} cy={40} rx={16} ry={6} fill="none" stroke="#fff" strokeWidth={3} />
            <path d={WAVE_D} fill="none" stroke="#fff" strokeWidth={3} />
            <line x1={SPEC_X0} x2={SPEC_X1} y1={BASE_Y + 2} y2={BASE_Y + 2} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
            <motion.path d={PEAK_AREA} fill={C.glycogen} initial={reduce || !fresh ? false : { opacity: 0 }} animate={{ opacity: 0.85 }}
                transition={{ duration: DUR.enter, delay: 0.8 }} />
            <motion.path d={SPEC_D} fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round"
                initial={reduce || !fresh ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }} />
            <SvgText x={226} y={22} text="pico do C1" anchor="middle" color={C.glycogenSoft} weight={700} />
            <SvgText x={228} y={121} text="área ∝ glicogênio" anchor="middle" color="#E5E7EB" />
        </Svg>
    );
};

const PIXELS = ['#4B5563', '#6B7280', '#374151', '#9CA3AF', '#6B7280', '#4B5563', '#9CA3AF', '#374151', '#374151', '#9CA3AF', '#6B7280', '#4B5563'] as const;

/** Ultrassom: a sonda emite o leque, a imagem vira tons de cinza, o software dá um escore. */
export const UsDrawing = ({ fresh, score }: { fresh: boolean; score: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <Svg label="Ultrassom: brilho da imagem convertido num escore de 0 a 100">
            <rect x={4} y={52} width={118} height={66} rx={8} fill={MUSCLE} stroke={EDGE} strokeWidth={2} />
            <motion.path d="M 52 42 L 76 42 L 112 114 L 16 114 Z" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.55)" strokeWidth={2}
                style={{ transformBox: 'fill-box', transformOrigin: 'top' }}
                initial={reduce || !fresh ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: DUR.bar, ease: EASE_OUT }} />
            <rect x={44} y={6} width={40} height={36} rx={6} fill="#E5E7EB" />
            <Arrow x1={126} x2={146} y={70} />
            {PIXELS.map((g, i) => (
                <rect key={i} x={152 + (i % 4) * 15} y={44 + Math.floor(i / 4) * 15} width={14} height={14} fill={g} />
            ))}
            <SvgText x={181} y={110} text="brilho" anchor="middle" color="#E5E7EB" />
            <Arrow x1={216} x2={234} y={70} />
            <rect x={236} y={38} width={60} height={56} rx={8} fill="none" stroke={C.stone} strokeWidth={2} />
            <SvgText x={266} y={73} text={score} anchor="middle" color="#fff" size={score.length > 3 ? 18 : 26} weight={800} />
            <SvgText x={266} y={114} text="escore" anchor="middle" color="#E5E7EB" />
        </Svg>
    );
};
