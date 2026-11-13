import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { Wipe } from '../kit/Beat';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ARMS, type PdhArm } from './pdh.content';

/**
 * Palco da Torneira Fechada: duas vias lado a lado (CHO alto × gordura → CHO), do tanque de glicogênio ao ciclo
 * de Krebs, com a PDH desenhada como a porta da mitocôndria. A espessura de cada trecho é o fluxo; a porta gira
 * conforme a PDH ativa. Loop só no trecho piruvato → PDH → acetil-CoA (o fluxo é o conteúdo). Embaixo, quem
 * fecha a porta (PDK) e o perfil ilustrativo da prova de Havemann (eixo: potência × distância, sem números).
 * Cada número do palco leva a unidade embaixo: glicogênio µmol/g ps, PDH ativa mmol/kg pú/min, glicogenólise
 * no sprint mmol glicosil/kg ps/min.
 */

const W = 608;
const LANE = 124;
const INK = '#04080F';
const LINE = 58;
const SEG_H = 12;

/** Trecho reto do fluxo: cresce/encolhe por scaleY (espessura = fluxo). */
const Seg = ({ x1, x2, y, k, color = C.glucose }: { x1: number; x2: number; y: number; k: number; color?: string }) => (
    <motion.rect x={x1} y={y - SEG_H / 2} width={x2 - x1} height={SEG_H} rx={3} fill={color}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={false} animate={{ scaleY: k }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }} />
);

const Head = ({ x, y }: { x: number; y: number }) => <polygon points={`${x},${y - 11} ${x + 12},${y} ${x},${y + 11}`} fill={C.glucose} />;

const Box = ({ x, w, y, text, color = C.glucose }: { x: number; w: number; y: number; text: string; color?: string }) => (
    <g>
        <rect x={x} y={y - 18} width={w} height={36} rx={10} fill={INK} stroke={color} strokeWidth={3} />
        <SvgText x={x + w / 2} y={y + 6} text={text} anchor="middle" size={16} weight={600} color="#F3F4F6" />
    </g>
);

/** Pontos que atravessam a porta da PDH: o fluxo do piruvato até o acetil-CoA. */
const Flow = ({ y, count }: { y: number; count: number }) => {
    const reduce = useReducedMotion();
    if (reduce) return null;
    return (
        <g>
            {Array.from({ length: count }, (_, i) => (
                <motion.circle key={i} cx={338} cy={y} r={7} fill={C.glucoseSoft} stroke={INK} strokeWidth={2}
                    initial={{ x: 0, opacity: 0 }} animate={{ x: [0, 46, 92], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.8, delay: i * (2.8 / count), repeat: Infinity, repeatDelay: 0.4, ease: 'linear' }} />
            ))}
        </g>
    );
};

const Lane = ({ arm, i, step }: { arm: PdhArm; i: number; step: number }) => {
    const y0 = i * LANE;
    const y = y0 + LINE;
    const after = step >= 1 ? arm.cho : 1;
    const glyco = step >= 3 && arm.id === 'fat' ? 0.74 : 1;
    const angle = step >= 1 ? (1 - arm.pdh) * 150 : 0;
    return (
        <g>
            <SvgText x={0} y={y0 + 18} text={arm.name} size={18} weight={700} color={arm.color} />
            <SvgText x={arm.id === 'fat' ? 150 : 96} y={y0 + 18} text={arm.sub} size={16} weight={500} color="#CBD5E1" />
            {/* tanque */}
            <rect x={0} y={y - 30} width={54} height={62} rx={8} fill={INK} stroke={C.glycogen} strokeWidth={3} />
            <rect x={5} y={y - 24} width={44} height={51} rx={5} fill={C.glycogen} />
            <SvgText x={27} y={y + 9} text={arm.glycogen} anchor="middle" size={17} weight={700} color="#fff" />
            <SvgText x={0} y={y + 52} text="µmol/g ps" size={16} weight={500} color="#CBD5E1" />
            {/* fosforilase → glicólise → piruvato */}
            <Seg x1={56} x2={132} y={y} k={glyco} />
            <Head x={132} y={y} />
            <SvgText x={94} y={y - 16} text="fosforilase" anchor="middle" size={16} weight={500} color="#CBD5E1" />
            {step >= 3 && (
                <g>
                    <SvgText x={112} y={y + 34} text={`sprint: ${arm.sprint}`} size={17} weight={700} color={arm.color} />
                    <SvgText x={112} y={y + 52} text="mmol glicosil/kg ps/min" size={16} weight={500} color="#CBD5E1" />
                </g>
            )}
            <Box x={146} w={86} y={y} text="glicólise" />
            <Seg x1={232} x2={250} y={y} k={1} />
            <Box x={252} w={78} y={y} text="piruvato" />
            <Seg x1={330} x2={360} y={y} k={after} />
            {/* membrana */}
            <line x1={344} x2={344} y1={y - 36} y2={y + 24} stroke={C.co2} strokeWidth={3} />
            <line x1={351} x2={351} y1={y - 36} y2={y + 24} stroke={C.co2} strokeWidth={3} />
            {/* a porta: PDH */}
            <Seg x1={404} x2={428} y={y} k={after} />
            <Head x={428} y={y} />
            <circle cx={382} cy={y} r={22} fill={INK} stroke="#F3F4F6" strokeWidth={3} />
            <motion.rect x={362} y={y - 4} width={40} height={8} rx={4} fill={arm.color}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={false} animate={{ rotate: angle }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }} />
            <SvgText x={358} y={y + 40} text={step >= 1 ? `PDH ${arm.pdhText}` : 'PDH'} size={17} weight={700} color={step >= 1 ? arm.color : '#F3F4F6'} />
            {step >= 1 && <SvgText x={358} y={y + 58} text="mmol/kg pú/min" size={16} weight={500} color="#CBD5E1" />}
            {step >= 1 && <Flow y={y} count={arm.id === 'hcho' ? 3 : 2} />}
            {step >= 2 && arm.id === 'fat' && (
                <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <circle cx={382} cy={y - 34} r={11} fill={C.stone} />
                    <SvgText x={382} y={y - 28} text="P" anchor="middle" size={16} weight={800} color={INK} />
                    <SvgText x={398} y={y - 29} text="PDK4" size={16} weight={700} color={C.stone} />
                </motion.g>
            )}
            {/* acetil-CoA → Krebs, com a gordura entrando por baixo */}
            <Box x={440} w={92} y={y} text="acetil-CoA" color={C.co2} />
            <motion.rect x={481} y={y + 18} width={10} height={LANE - LINE - 22} rx={3} fill={C.fat}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={false} animate={{ scaleX: step >= 1 ? arm.fat / 1.45 : 0.69 }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }} />
            <SvgText x={498} y={y0 + LANE - 6} text="gordura" size={16} weight={600} color={C.fat} />
            <Seg x1={532} x2={548} y={y} k={after} color={C.co2} />
            <circle cx={576} cy={y} r={28} fill={INK} stroke={C.co2} strokeWidth={3} />
            <SvgText x={576} y={y + 6} text="Krebs" anchor="middle" size={16} weight={600} color="#F3F4F6" />
        </g>
    );
};

/** PDH ativa ⇄ PDH-P inativa: quem desliga (PDK) e quem religa (Ca²⁺, piruvato). */
const Switch = () => (
    <div className="flex h-full flex-col justify-center gap-2 pl-2">
        <span className="text-[17px] font-bold" style={{ color: C.stone }}>Quem fecha a porta</span>
        <div className="flex items-center gap-2">
            <span className="rounded-lg border-[3px] px-2 py-[2px] text-[16px] font-bold" style={{ borderColor: C.glucose, color: '#fff' }}>PDH</span>
            <div className="flex flex-1 flex-col items-center text-[16px] leading-tight">
                <span className="flex items-center gap-1 font-semibold" style={{ color: C.stone }}>PDK4 <ArrowRight size={18} strokeWidth={3} /></span>
                <span className="flex items-center gap-1 whitespace-nowrap text-gray-200"><ArrowLeft size={18} strokeWidth={3} /> Ca²⁺, piruvato</span>
            </div>
            <span className="rounded-lg border-[3px] px-2 py-[2px] text-[16px] font-bold" style={{ borderColor: C.co2, color: C.caveat }}>PDH-P</span>
        </div>
        <span className="text-[16px] leading-snug text-gray-300">ativa ⇄ inativa · dieta gordurosa: PDK ↑ em 1–3 dias</span>
    </div>
);

/** Perfil de potência ilustrativo: base estável com ataques de 1 km (número e posição dos ataques: ilustrativos). */
const PX0 = 30;
const PW = 236;
const AXIS_Y = 58;
const BASE_Y = 50;
const profile = (sprint: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= PW; x += 4) {
        const attack = [30, 90, 150, 206].some(a => x >= a && x < a + 14);
        pts.push(`${PX0 + x},${attack ? BASE_Y - sprint : BASE_Y}`);
    }
    return pts.join(' ');
};

const RaceProfile = () => (
    <div className="flex h-full flex-col justify-center gap-1 pl-1">
        <span className="text-[17px] font-bold text-white">Havemann · potência nos 100 km</span>
        <svg viewBox="0 0 272 78" width={272} height={78} role="img" aria-label="Perfil de potência ilustrativo da prova de Havemann: base igual, picos menores após gordura">
            {/* eixo y: potência (W); eixo x: distância */}
            <line x1={PX0} x2={PX0} y1={2} y2={AXIS_Y} stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
            <line x1={PX0} x2={PX0 + PW} y1={AXIS_Y} y2={AXIS_Y} stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
            <SvgText x={22} y={34} text="W" size={16} anchor="end" weight={700} color="#CBD5E1" />
            <SvgText x={PX0 + PW} y={76} text="distância →" size={16} anchor="end" weight={500} color="#CBD5E1" />
            <SvgText x={PX0 + 37} y={76} text="sprint 1 km" size={16} anchor="middle" weight={500} color="#CBD5E1" />
            <polyline points={profile(42)} fill="none" stroke={C.glucose} strokeWidth={4} strokeLinejoin="round" />
            <polyline points={profile(24)} fill="none" stroke={C.fat} strokeWidth={4} strokeLinejoin="round" />
        </svg>
        <span className="flex items-center gap-3 text-[16px] font-semibold leading-tight">
            <span className="flex items-center gap-1.5" style={{ color: C.glucose }}><span className="h-[4px] w-[18px] rounded" style={{ background: C.glucose }} />CHO alto</span>
            <span className="flex items-center gap-1.5" style={{ color: C.fat }}><span className="h-[4px] w-[18px] rounded" style={{ background: C.fat }} />gordura → CHO</span>
        </span>
    </div>
);

export const PdhStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2">
        <svg viewBox={`0 0 ${W} ${LANE * 2}`} width={W} height={LANE * 2} role="img"
            aria-label="Duas vias do glicogênio ao ciclo de Krebs, com a PDH como porta da mitocôndria">
            {ARMS.map((arm, i) => <Lane key={arm.id} arm={arm} i={i} step={step} />)}
        </svg>
        <div className="mt-auto grid h-[150px] grid-cols-2 gap-3">
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', opacity: step >= 2 ? 1 : 0 }}>
                {step >= 2 && <Wipe from="left" duration={0.6} className="h-full"><Switch /></Wipe>}
            </div>
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', opacity: step >= 4 ? 1 : 0 }}>
                {step >= 4 && <Wipe from="left" duration={0.9} className="h-full"><RaceProfile /></Wipe>}
            </div>
        </div>
    </div>
);
