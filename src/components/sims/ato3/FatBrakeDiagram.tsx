import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Díptico 55% × 75% da Wmáx (cada cena 320 × 240 no viewBox do palco). Em cada uma: o citosol com a fila de AGL e a
 * carnitina, a membrana com a porta CPT-I e a matriz com a PDH despejando acetil-CoA. A 75%, a CAT transforma carnitina
 * livre em acetilcarnitina (fichas âmbar) e só 1 AGL passa. Fichas ilustrativas; os kJ/min são de VANLOON2001.
 */

export const SCENE_W = 320;
export const SCENE_H = 240;
const MEM_Y = 118;
const DOOR = { l: 58, r: 102 } as const;
const SLATE = '#475569';
const MATRIX = '#0E1729';

type Pt = readonly [number, number];
const WAIT: readonly Pt[] = [[10, 74], [10, 42], [66, 42]];
const INSIDE: readonly Pt[] = [[12, 166], [12, 196], [68, 196]];
const CARN: readonly Pt[] = [[176, 72], [210, 72], [244, 72], [176, 102], [210, 102], [244, 102]];
const ACETYL: readonly Pt[] = [[150, 176], [186, 176], [222, 176], [258, 176], [150, 206], [186, 206]];

interface SceneSpec { high: boolean; label: string; fat: string }

/** Ficha de AGL: espera no citosol; as que passam atravessam a CPT-I e descem para a β-oxidação. */
const Fat = ({ i, passes, reduce, delay }: { i: number; passes: boolean; reduce: boolean; delay: number }) => {
    const [wx, wy] = WAIT[i];
    const [ix, iy] = INSIDE[i];
    const via: Pt = [DOOR.l - 3, MEM_Y - 12];
    const to = passes ? { x: reduce ? ix - wx : [0, via[0] - wx, ix - wx], y: reduce ? iy - wy : [0, via[1] - wy, iy - wy] } : { x: 0, y: 0 };
    return (
        <motion.g initial={{ x: 0, y: 0 }} animate={to} transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : delay + i * 0.12, ease: EASE_IN_OUT }}>
            <rect x={wx} y={wy - 12} width={50} height={24} rx={12} fill={C.fat} />
            <text x={wx + 25} y={wy + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>AGL</text>
        </motion.g>
    );
};

const Scene = ({ spec, show, current, reduce }: { spec: SceneSpec; show: boolean; current: boolean; reduce: boolean }) => {
    const { high } = spec;
    const passing = high ? 1 : 3;
    const bound = high ? 4 : 0;
    const acetyl = high ? 6 : 2;
    const doorColor = high ? C.stone : C.fat;
    const delay = current ? 0.35 : 0;
    return (
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <rect x={1} y={1} width={SCENE_W - 2} height={SCENE_H - 2} rx={14} fill="#0B1220" stroke={SLATE} strokeWidth={2} />
            <rect x={2} y={MEM_Y + 6} width={SCENE_W - 4} height={SCENE_H - MEM_Y - 8} rx={12} fill={MATRIX} />
            <SvgText x={12} y={24} text={spec.label} size={19} color="#FFFFFF" weight={800} />
            <SvgText x={SCENE_W - 12} y={24} text={spec.fat} size={19} anchor="end" color={C.fat} weight={800} />
            <rect x={0} y={MEM_Y} width={DOOR.l} height={12} fill={SLATE} />
            <rect x={DOOR.r} y={MEM_Y} width={SCENE_W - DOOR.r} height={12} fill={SLATE} />
            <rect x={DOOR.l - 4} y={MEM_Y - 10} width={DOOR.r - DOOR.l + 8} height={32} rx={8} fill="none" stroke={doorColor} strokeWidth={4} />
            <SvgText x={(DOOR.l + DOOR.r) / 2} y={MEM_Y + 42} text="CPT-I" size={17} anchor="middle" color={doorColor} weight={800} />
            <SvgText x={12} y={SCENE_H - 10} text="β-oxidação" size={16} color={C.fat} weight={700} />

            <SvgText x={162} y={50} text={high ? 'acetilcarnitina ↑' : 'carnitina livre'} size={16} color="#F3F4F6" weight={700} />
            {CARN.map(([x, y], i) => {
                const isBound = i < bound;
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r={13} fill={isBound ? C.glucose : '#FFFFFF'} stroke="#04080F" strokeWidth={2}
                            style={{ transition: `fill 350ms ${current && isBound ? 600 + i * 90 : 0}ms` }} />
                        <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>C</text>
                    </g>
                );
            })}

            <SvgText x={140} y={156} text="PDH → acetil-CoA" size={16} color={C.glucoseSoft} weight={700} />
            {ACETYL.map(([x, y], i) => (
                <motion.g key={i} initial={false} animate={{ opacity: i < acetyl ? 1 : 0, scale: i < acetyl ? 1 : 0.6 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    transition={{ duration: reduce ? 0 : DUR.enter, delay: reduce ? 0 : delay + i * 0.06, ease: EASE_OUT }}>
                    <rect x={x - 15} y={y - 12} width={30} height={24} rx={5} fill={C.glucose} />
                    <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>Ac</text>
                </motion.g>
            ))}
            <path d="M 290 168 C 306 140, 300 108, 266 96" fill="none" stroke={high ? C.glucose : SLATE} strokeWidth={high ? 4 : 2}
                strokeDasharray={high ? undefined : '6 6'} markerEnd={`url(#fb-head-${high ? 'on' : 'off'})`} />
            <SvgText x={SCENE_W - 6} y={204} text="CAT" size={16} anchor="end" color={high ? C.glucoseSoft : C.muted} weight={800} />

            {WAIT.map((_, i) => <Fat key={`${spec.label}-${i}`} i={i} passes={show && i < passing} reduce={reduce} delay={delay} />)}
        </motion.g>
    );
};

const SCENES: readonly SceneSpec[] = [
    { high: false, label: '55% Wmáx', fat: '32 kJ/min' },
    { high: true, label: '75% Wmáx', fat: '19 kJ/min' },
];

/** O díptico: cena da esquerda desde o passo 1, a da direita entra no passo 2 e as duas ficam. */
export const FatBrakeDiagram = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            <defs>
                {[['on', C.glucose], ['off', SLATE]].map(([id, color]) => (
                    <marker key={id} id={`fb-head-${id}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={3.5} markerHeight={3.5} orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
                    </marker>
                ))}
            </defs>
            {SCENES.map((spec, i) => (
                <g key={spec.label} transform={`translate(${i * (SCENE_W + 20)} 0)`}>
                    <Scene spec={spec} show={step >= i} current={step === i} reduce={reduce} />
                </g>
            ))}
        </g>
    );
};
