import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Slide 66 · o acoplamento excitação-contração desenhado: sarcolema, túbulo T com o sensor DHPR, cisterna do retículo
 * com o canal RyR1, retículo longitudinal com a bomba SERCA e a miofibrila (actina, troponina, miosina).
 * O Ca²⁺ circula em laço lento (é o fluxo que o slide ensina): sai pelo RyR1, vai à miofibrila e volta pela SERCA.
 * O elo "glicogênio intramiofibrilar → RyR1" é tracejado com "?" e, no passo da causa, ganha o carimbo.
 */

export const TRIAD_W = 680;
export const TRIAD_H = 176;

const SR = '#64748B';
const CA = C.insulinSoft;

/** Trajeto do Ca²⁺: RyR1 → miofibrila → SERCA → de volta pelo retículo até a cisterna. */
const LOOP_X = [128, 170, 280, 400, 470, 470, 360, 230, 170, 128];
const LOOP_Y = [100, 124, 130, 128, 112, 78, 78, 78, 78, 100];
const IONS = 5;
const CYCLE = 3.4;

const Filaments = () => (
    <g>
        <rect x={0} y={116} width={TRIAD_W} height={36} fill="#283040" />
        {[0, 1, 2].map(r => <line key={r} x1={0} y1={121 + r * 13} x2={TRIAD_W} y2={121 + r * 13} stroke={C.caveat} strokeWidth={2.5} />)}
        {[230, 420, 610].map(x => [0, 1].map(r => <rect key={`${x}-${r}`} x={x - 70} y={124 + r * 13} width={140} height={7} rx={3.5} fill="#7B8496" />))}
        {[150, 260, 340, 500, 580].map(x => [0, 1, 2].map(r => <circle key={`${x}-${r}`} cx={x} cy={121 + r * 13} r={4} fill={C.stone} />))}
    </g>
);

export const CalciumTriad = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const doubt = step >= 4;
    return (
        <svg viewBox={`0 0 ${TRIAD_W} ${TRIAD_H}`} width={TRIAD_W} height={TRIAD_H} className="block" role="img"
            aria-label="Acoplamento excitação-contração: túbulo T, DHPR, RyR1, retículo sarcoplasmático, SERCA e miofibrila">
            <SvgText x={8} y={20} text="potencial de ação →" size={16} color={C.stone} weight={700} />
            <rect x={0} y={28} width={TRIAD_W} height={8} fill={C.stone} />
            <SvgText x={TRIAD_W - 6} y={20} text="sarcolema" size={16} anchor="end" color={C.stone} weight={700} />
            <rect x={98} y={36} width={12} height={84} fill={C.stone} />
            <SvgText x={90} y={60} text="túbulo T" size={16} anchor="end" color={C.stone} weight={700} />
            <rect x={110} y={64} width={10} height={26} rx={3} fill={C.glucoseSoft} />
            <SvgText x={90} y={84} text="DHPR" size={16} anchor="end" color={C.glucoseSoft} weight={800} />
            <rect x={122} y={52} width={76} height={50} rx={12} fill={SR} />
            <rect x={122} y={64} width={12} height={26} rx={3} fill="#0B1220" stroke={CA} strokeWidth={2.5} />
            <SvgText x={90} y={108} text="RyR1" size={16} anchor="end" color={CA} weight={800} />
            <rect x={198} y={70} width={272} height={16} rx={8} fill={SR} />
            <SvgText x={330} y={62} text="retículo sarcoplasmático (RS)" size={16} anchor="middle" color="#E2E8F0" weight={700} />
            <circle cx={470} cy={80} r={16} fill={C.stone} />
            <path d="M 470 90 L 470 70 M 463 77 L 470 70 L 477 77" fill="none" stroke="#04080F" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <SvgText x={494} y={86} text="SERCA (gasta ATP)" size={16} color={C.stone} weight={700} />
            <Filaments />
            <SvgText x={TRIAD_W - 6} y={172} text="actina · troponina C · miosina" size={16} anchor="end" color={C.caveat} weight={700} />
            {/* glicogênio intramiofibrilar perto da tríade, e o elo proposto */}
            {[[150, 140], [176, 146], [124, 146]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={7} fill={C.glycogenSoft} stroke="#04080F" strokeWidth={1.5} />)}
            <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.5 : 0 }}>
                <path d="M 150 132 L 130 104" stroke={C.glycogenSoft} strokeWidth={3} strokeDasharray="5 5" />
                <SvgText x={8} y={172} text="↑ glicogênio intramiofibrilar" size={16} color={C.glycogenSoft} weight={700} />
            </motion.g>
            {!reduce && Array.from({ length: IONS }, (_, i) => (
                <motion.circle key={i} r={8} fill={CA} stroke="#04080F" strokeWidth={2} initial={{ x: LOOP_X[0], y: LOOP_Y[0], opacity: 0 }}
                    animate={{ x: LOOP_X, y: LOOP_Y, opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0] }}
                    transition={{ duration: CYCLE, repeat: Infinity, repeatDelay: 0.4, delay: i * (CYCLE / IONS), ease: 'linear' }} />
            ))}
            {reduce && [[170, 124], [280, 130], [470, 112]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={8} fill={CA} stroke="#04080F" strokeWidth={2} />)}
            <SvgText x={300} y={108} text="Ca²⁺" size={17} anchor="middle" color={CA} weight={800} />
            <motion.g initial={false} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={{ opacity: step >= 1 ? 1 : 0, scale: doubt && !reduce ? [1, 1.6, 1.3] : doubt ? 1.3 : 1 }}
                transition={{ duration: doubt ? DUR.bar : DUR.enter, delay: step === 1 ? 0.6 : 0, ease: EASE_OUT }}>
                <circle cx={146} cy={113} r={12} fill="#04080F" stroke={doubt ? C.stone : C.glycogenSoft} strokeWidth={3} />
                <SvgText x={146} y={119} text="?" size={17} anchor="middle" color={doubt ? C.stone : C.glycogenSoft} weight={800} />
            </motion.g>
        </svg>
    );
};
