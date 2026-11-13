import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { GATE } from './fatbrake.content';

/**
 * Slide 45 · a cena única: citosol em cima, membrana, matriz embaixo. À esquerda a rota da gordura (AGL → CPT-I →
 * β-oxidação), no meio o estoque de carnitina, à direita a rota do carboidrato (glicogênio → piruvato → PDH → acetil-CoA).
 * A cada passo a mesma cena muda de estado; o único loop é o AGL atravessando a CPT-I (é o resultado do slide).
 */

export const GATE_W = 660;
export const GATE_H = 414;
const MEM_Y = 226;
const MEM_H = 14;
const DOOR = { x: 124, w: 52 } as const;
const SLATE = '#475569';
const DARK = '#04080F';
const font = { fontFamily: 'var(--font-body)' } as const;

const RINGS = [254, 298, 342, 386].flatMap(x => [[x, 140], [x, 182]] as const);
const AC = [470, 512, 554, 596].flatMap(x => [[x, 344], [x, 376]] as const);

/** AGL em fila no citosol e os que atravessam a porta (loop: 2,8 s por volta, pausa de 0,6 s). */
const FatStream = ({ count, reduce }: { count: number; reduce: boolean }) => (
    <g>
        {[0, 1, 2].map(i => (
            <g key={`q${i}`} transform={`translate(20 ${82 + i * 38})`}>
                <rect width={56} height={28} rx={14} fill={C.fat} />
                <text x={28} y={20} textAnchor="middle" fontSize={16} fontWeight={800} fill={DARK} style={font}>AGL</text>
            </g>
        ))}
        {Array.from({ length: count }, (_, i) => (
            <g key={`s${i}`} transform="translate(98 168)"><motion.g
                initial={false}
                animate={reduce ? { x: 52, y: 66 + i * 30, opacity: 1 } : { x: [0, 52, 52, 52], y: [0, 50, 112, 140], opacity: [0, 1, 1, 0] }}
                transition={reduce ? { duration: 0 } : { duration: 2.8, times: [0, 0.4, 0.8, 1], repeat: Infinity, repeatDelay: 0.6, delay: i * 1.1, ease: 'easeInOut' }}>
                <rect x={-26} y={-13} width={52} height={26} rx={13} fill={C.fat} />
                <text y={6} textAnchor="middle" fontSize={16} fontWeight={800} fill={DARK} style={font}>AGL</text>
            </motion.g></g>
        ))}
    </g>
);

/** Uma ponta de seta por cor (context-stroke não é confiável em todos os navegadores). */
const HEAD_ID: Record<string, string> = { '#FFFFFF': 'w', [C.glucose]: 'g', [SLATE]: 's', [C.stone]: 'n' };

const Arrow = ({ d, color, width, dashed = false }: { d: string; color: string; width: number; dashed?: boolean }) => (
    <path d={d} fill="none" stroke={color} strokeLinecap="round" strokeDasharray={dashed ? '7 7' : undefined}
        markerEnd={`url(#fg-head-${HEAD_ID[color] ?? 'w'})`} style={{ strokeWidth: width, transition: 'stroke-width 450ms, stroke 350ms' }} />
);

export const FatGate = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const s = GATE[step];
    const door = s.jammed ? C.stone : C.fat;
    return (
        <svg viewBox={`0 0 ${GATE_W} ${GATE_H}`} width={GATE_W} height={GATE_H} className="block" role="img"
            aria-label="Mais carboidrato abre a PDH; o acetil-CoA em excesso prende a carnitina; sem carnitina livre, menos gordura entra pela CPT-I">
            <defs>
                {Object.entries(HEAD_ID).map(([color, id]) => (
                    <marker key={id} id={`fg-head-${id}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={3} markerHeight={3} orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
                    </marker>
                ))}
            </defs>
            {/* Compartimentos */}
            <rect x={0} y={MEM_Y + MEM_H} width={GATE_W} height={GATE_H - MEM_Y - MEM_H} fill="#0E1729" />
            <rect x={0} y={MEM_Y} width={DOOR.x} height={MEM_H} fill={SLATE} />
            <rect x={DOOR.x + DOOR.w} y={MEM_Y} width={GATE_W - DOOR.x - DOOR.w} height={MEM_H} fill={SLATE} />
            <SvgText x={GATE_W - 12} y={24} text="citosol" anchor="end" color={C.muted} />
            <SvgText x={GATE_W - 12} y={MEM_Y + 34} text="matriz" anchor="end" color={C.muted} />

            {/* Intensidade */}
            <SvgText x={14} y={26} text="intensidade" color={C.muted} />
            <rect x={112} y={7} width={128} height={28} rx={14} fill="#F3F4F6" />
            <text x={176} y={27} textAnchor="middle" fontSize={18} fontWeight={800} fill={DARK} style={font}>{s.intensity}</text>

            {/* Rota da gordura */}
            <SvgText x={20} y={68} text="gordura (AGL)" size={18} color={C.fat} weight={800} />
            <FatStream count={s.stream} reduce={reduce} />
            <rect x={DOOR.x - 4} y={MEM_Y - 8} width={DOOR.w + 8} height={MEM_H + 16} rx={8} fill="none" stroke={door} strokeWidth={4}
                style={{ transition: 'stroke 350ms' }} />
            <SvgText x={186} y={MEM_Y + 36} text={s.jammed ? 'CPT-I · travada' : 'CPT-I'} size={18} color={door} weight={800} />
            <SvgText x={186} y={MEM_Y + 58} text="só passa com carnitina livre" color="#D1D5DB" />
            <rect x={40} y={322} width={190} height={36} rx={10} fill="none" stroke={C.fat} strokeWidth={3} />
            <SvgText x={135} y={346} text="β-oxidação" size={17} anchor="middle" color={C.fat} weight={800} />
            <SvgText x={20} y={394} text="gordura oxidada" color="#D1D5DB" />
            <text x={150} y={398} fontSize={26} fontWeight={800} fill={s.fat ? C.fat : C.muted} style={font}>{s.fat ?? '?'}</text>

            {/* Estoque de carnitina */}
            <rect x={216} y={50} width={220} height={158} rx={14} fill="#0B1220" stroke={SLATE} strokeWidth={2} />
            <SvgText x={230} y={76} text="carnitina na fibra" size={17} color="#FFFFFF" weight={800} />
            <circle cx={238} cy={97} r={7} fill="#FFFFFF" />
            <SvgText x={250} y={103} text="livre" color="#F3F4F6" />
            <circle cx={302} cy={97} r={7} fill={C.glucose} />
            <SvgText x={314} y={103} text="acetilcarnitina" color={C.glucoseSoft} />
            {RINGS.map(([x, y], i) => {
                const bound = i < s.bound;
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r={16} fill={bound ? C.glucose : '#FFFFFF'} stroke={DARK} strokeWidth={2}
                            style={{ transition: `fill 350ms ${step === 2 && bound ? 300 + i * 90 : 0}ms` }} />
                        <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill={DARK} style={font}>C</text>
                    </g>
                );
            })}
            <Arrow d="M 222 200 L 182 222" color={s.jammed ? C.stone : '#FFFFFF'} width={3} dashed={s.jammed} />

            {/* Rota do carboidrato */}
            <rect x={470} y={50} width={140} height={30} rx={15} fill={C.glycogen} />
            <SvgText x={540} y={71} text="glicogênio" size={17} anchor="middle" color="#FFFFFF" weight={800} />
            <Arrow d="M 540 84 L 540 146" color={C.glucose} width={s.flux} />
            <SvgText x={556} y={122} text="glicólise" color={C.glucoseSoft} />
            <rect x={480} y={152} width={120} height={30} rx={15} fill="none" stroke={C.glucose} strokeWidth={3} />
            <SvgText x={540} y={173} text="piruvato" size={17} anchor="middle" color={C.glucoseSoft} weight={700} />
            <Arrow d="M 540 186 L 540 256" color={C.glucose} width={s.flux} />
            <rect x={460} y={262} width={170} height={34} rx={10} fill="none" stroke={C.glucose} strokeWidth={3} />
            <SvgText x={545} y={285} text={s.pdh} anchor="middle" color="#FFFFFF" weight={800} />
            <SvgText x={460} y={322} text="acetil-CoA" size={17} color={C.glucose} weight={800} />
            {AC.map(([x, y], i) => (
                <motion.g key={i} initial={false} animate={{ opacity: i < s.acetyl ? 1 : 0, scale: i < s.acetyl ? 1 : 0.6 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    transition={{ duration: reduce ? 0 : DUR.enter, delay: reduce || step !== 1 ? 0 : 0.3 + i * 0.06, ease: EASE_OUT }}>
                    <rect x={x - 17} y={y - 13} width={34} height={26} rx={5} fill={C.glucose} />
                    <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill={DARK} style={font}>Ac</text>
                </motion.g>
            ))}
            <SvgText x={630} y={406} text={step >= 1 ? 'mais do que o Krebs consome' : 'o Krebs dá conta'} anchor="end" color="#D1D5DB" />

            {/* CAT: o excesso de acetil-CoA prende a carnitina */}
            <Arrow d="M 446 352 C 410 348, 430 268, 420 214" color={s.cat ? C.glucose : SLATE} width={s.cat ? 5 : 3} dashed={!s.cat} />
            <SvgText x={400} y={318} text="CAT" size={18} anchor="end" color={s.cat ? C.glucoseSoft : C.muted} weight={800} />
            <SvgText x={400} y={340} text="prende a carnitina" anchor="end" color={s.cat ? '#F3F4F6' : C.muted} />
        </svg>
    );
};
