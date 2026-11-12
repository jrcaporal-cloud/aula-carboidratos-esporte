import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { sample, toPath } from '../kit/useMorphPath';
import { EVENTS, glucoseAt, THRESHOLD } from './cgm.content';

/**
 * Slide 185 · peças do palco: o sensor em corte (com o único laço do slide: a glicose saindo do capilar até o filamento)
 * e o monitor de 24 h. A curva é ilustrativa e o selo "curva ilustrativa" fica PRESO a ela, em todos os passos.
 */

export const SENSOR_W = 196;
export const MON_W = 432;
export const PART_H = 172;

const HEX = 'M 0 -10 L 9 -5 L 9 5 L 0 10 L -9 5 L -9 -5 Z';

/** Corte da pele: disco do sensor, filamento no intersticial, capilar embaixo; a glicose sobe do capilar ao filamento. */
export const SensorDrawing = () => {
    const reduce = useReducedMotion() ?? false;
    const tokens = [0, 1, 2] as const;
    return (
        <svg viewBox={`0 0 ${SENSOR_W} ${PART_H}`} width={SENSOR_W} height={PART_H} role="img" aria-label="Sensor de glicose: filamento no líquido intersticial, glicose vinda do capilar" className="shrink-0">
            <rect x={0} y={30} width={SENSOR_W} height={16} fill="#78716C" />
            <rect x={0} y={46} width={SENSOR_W} height={78} fill="rgba(34,211,238,0.10)" />
            <rect x={56} y={4} width={84} height={26} rx={8} fill="#E5E7EB" />
            <line x1={98} x2={98} y1={30} y2={98} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
            <circle cx={98} cy={100} r={6} fill={C.glucoseSoft} stroke="#04080F" strokeWidth={2} />
            <rect x={0} y={128} width={SENSOR_W} height={24} rx={12} fill="rgba(244,63,94,0.30)" stroke={C.risk} strokeWidth={2} />
            <SvgText x={146} y={23} text="sensor" color="#E5E7EB" />
            <SvgText x={108} y={74} text="filamento" color="#fff" weight={700} />
            <SvgText x={110} y={118} text="intersticial" color={C.lactateSoft} />
            <SvgText x={6} y={168} text="capilar (sangue)" color="#FDA4AF" />
            {tokens.map(i => reduce ? (
                <path key={i} d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2} transform={`translate(${[40, 70, 150][i]} ${[140, 116, 140][i]})`} />
            ) : (
                <motion.path key={i} d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                    initial={{ x: 40 + i * 50, y: 140, opacity: 0 }}
                    animate={{ x: [40 + i * 50, 88, 94], y: [140, 116, 104], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.8, times: [0, 0.6, 1], repeat: Infinity, repeatDelay: 0.8, delay: i * 1.1, ease: 'easeInOut' }} />
            ))}
        </svg>
    );
};

const Y_MIN = 3.5;
const Y_MAX = 9.5;
const PL = 8;
const PT = 26;
const PB = 146;
const yOf = (mmol: number) => PB - ((mmol - Y_MIN) / (Y_MAX - Y_MIN)) * (PB - PT);
const xOf = (h: number) => PL + (h / 24) * (MON_W - PL - 4);
const CURVE = sample(120, 0, 24, glucoseAt, (h, g) => [xOf(h), yOf(g)]);
const LINE_D = toPath(CURVE);
const AREA_D = `${LINE_D} L ${xOf(24)} ${PB} L ${xOf(0)} ${PB} Z`;
const Y_TH = yOf(THRESHOLD);

/** Monitor de 24 h: área acima de 6,0 mmol/L acende no passo dos subelite. */
export const Monitor = ({ lit }: { lit: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${MON_W} ${PART_H}`} width={MON_W} height={PART_H} role="img" aria-label="Curva ilustrativa de glicose em 24 h, com o limiar de 6,0 mmol/L">
            <defs><clipPath id="cgm185-above"><rect x={0} y={0} width={MON_W} height={Y_TH} /></clipPath></defs>
            {EVENTS.map(e => <SvgText key={e.label} x={xOf(e.at)} y={16} text={e.label} anchor="middle" color="#E5E7EB" />)}
            <motion.path d={AREA_D} fill={C.glucose} clipPath="url(#cgm185-above)" initial={false}
                animate={{ opacity: lit ? 0.5 : 0.16 }} transition={{ duration: DUR.enter }} />
            <line x1={PL} x2={MON_W} y1={Y_TH} y2={Y_TH} stroke={C.stone} strokeWidth={2} strokeDasharray="10 8" />
            <motion.path d={LINE_D} fill="none" stroke={C.glucose} strokeWidth={4} strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }} />
            {/* o selo vive DENTRO do gráfico, colado à curva: os números reais embaixo não herdam a forma desenhada */}
            <rect x={PL + 2} y={Y_TH + 8} width={150} height={26} rx={6} fill="#04080F" stroke={C.caveat} strokeWidth={2} />
            <SvgText x={PL + 77} y={Y_TH + 27} text="curva ilustrativa" anchor="middle" color={C.caveat} />
            <SvgText x={PL + 2} y={Y_TH - 8} text="6,0 mmol/L" color={C.stone} weight={700} />
            {[0, 6, 12, 18, 24].map(h => (
                <SvgText key={h} x={Math.min(Math.max(xOf(h), 14), MON_W - 18)} y={PART_H - 4} text={`${h} h`} anchor="middle" color="#D1D5DB" />
            ))}
        </svg>
    );
};
