import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { sample, toPath, useMorphPath, type Pt } from '../kit/useMorphPath';
import { SvgText } from '../kit/ui';
import { I_MAX, I_MIN, LAYERS, crossoverAt, mixAt, type Mix } from './crossover.content';

/**
 * Slide 44 · só o modelo: áreas empilhadas das 4 fontes × intensidade (viewBox 660 × 352, 1:1), com eixos e unidade e o
 * rótulo dentro de cada área. O cruzamento (CHO = 50%) é uma linha de alto a baixo com o seu selo em cima; os rótulos das
 * áreas ficam longe dela nos dois estados. No estado treinado, a fronteira do destreinado fica como fantasma tracejado
 * (a curva e o selo), para o deslocamento ser visto, não só lido. Tudo aqui é modelo ilustrativo (selo no slide).
 */
export const CHART_W = 660;
const H = 352;
const X0 = 64;
const X1 = 644;
const Y0 = 62;
const Y1 = 290;
const N = 25;
const PILL_Y = 30;
const DARK = '#04080F';

const xOf = (I: number) => X0 + ((I - I_MIN) / (I_MAX - I_MIN)) * (X1 - X0);
const yOf = (frac: number) => Y1 - frac * (Y1 - Y0);

type LayerKey = keyof Mix;
const ORDER: readonly LayerKey[] = LAYERS.map(l => l.key);
const below = (m: Mix, k: LayerKey) => ORDER.slice(0, ORDER.indexOf(k)).reduce((acc, key) => acc + m[key], 0);

const areaPoints = (k: LayerKey, trained: boolean): Pt[] => {
    const upper = sample(N, I_MIN, I_MAX, I => { const m = mixAt(I, trained); return below(m, k) + m[k]; }, (x, y) => [xOf(x), yOf(y)]);
    const lower = sample(N, I_MIN, I_MAX, I => below(mixAt(I, trained), k), (x, y) => [xOf(x), yOf(y)]);
    return [...upper, ...lower.reverse()];
};

/** Fronteira gordura | carboidrato (topo do TG do músculo) do destreinado: o fantasma do estado treinado. */
const UNTRAINED_EDGE = toPath(sample(N, I_MIN, I_MAX, I => { const m = mixAt(I, false); return m.agl + m.imtg; }, (x, y) => [xOf(x), yOf(y)]));

const Area = ({ k, trained, color, opacity }: { k: LayerKey; trained: boolean; color: string; opacity: number }) => {
    const ref = useMorphPath(areaPoints(k, trained), 700);
    return <path ref={ref} fill={color} fillOpacity={opacity} />;
};

/** Rótulo no meio da área, na intensidade `labelAt` (\n quebra a linha); acompanha a área quando o treino a desloca. */
const AreaLabel = ({ k, label, at, trained, dark }: { k: LayerKey; label: string; at: number; trained: boolean; dark: boolean }) => {
    const m = mixAt(at, trained);
    const y = yOf(below(m, k) + m[k] / 2) + 6;
    return (
        <motion.g initial={false} animate={{ x: xOf(at), y }} transition={{ duration: 0.7, ease: EASE_IN_OUT }}>
            <text textAnchor="middle" fontSize={17} fontWeight={800} fill={dark ? DARK : '#FFFFFF'} style={{ fontFamily: 'var(--font-body)' }}>
                {label.split('\n').map((line, i, all) => <tspan key={line} x={0} y={(i - (all.length - 1) / 2) * 20}>{line}</tspan>)}
            </text>
        </motion.g>
    );
};

const PILL_W = 112;

/** Selo do cruzamento + linha de alto a baixo + ponto na fronteira (50%). `ghost` = o destreinado, tracejado. */
const CrossMarker = ({ at, label, ghost }: { at: number; label: string; ghost: boolean }) => (
    <g>
        <line x1={xOf(at)} y1={PILL_Y + 24} x2={xOf(at)} y2={Y1} stroke={ghost ? '#FFFFFF' : DARK} strokeWidth={3} strokeDasharray={ghost ? '6 6' : undefined} />
        <rect x={xOf(at) - PILL_W / 2} y={PILL_Y} width={PILL_W} height={26} rx={7} fill={ghost ? DARK : '#F3F4F6'}
            stroke="#F3F4F6" strokeWidth={2} strokeDasharray={ghost ? '5 4' : undefined} />
        <text x={xOf(at)} y={PILL_Y + 19} textAnchor="middle" fontSize={16} fontWeight={800} fill={ghost ? '#E5E7EB' : DARK}
            style={{ fontFamily: 'var(--font-body)' }}>{label}</text>
        <circle cx={xOf(at)} cy={yOf(0.5)} r={7} fill={ghost ? DARK : '#F3F4F6'} stroke={ghost ? '#FFFFFF' : DARK} strokeWidth={3} />
    </g>
);

export const CrossoverChart = ({ intensity, trained }: { intensity: number; trained: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const fade = { duration: reduce ? 0 : DUR.enter };
    return (
        <svg width={CHART_W} height={H} viewBox={`0 0 ${CHART_W} ${H}`} className="block shrink-0" role="img"
            aria-label="Modelo ilustrativo: fração da energia por fonte conforme a intensidade; o treino desloca o cruzamento para a direita">
            {LAYERS.map(l => <Area key={l.key} k={l.key} trained={trained} color={l.color} opacity={l.opacity} />)}
            {LAYERS.map(l => <AreaLabel key={l.key} k={l.key} label={l.label} at={trained && 'labelAtTrained' in l ? l.labelAtTrained : l.labelAt} trained={trained} dark={l.key === 'agl' || l.key === 'plasmaGlucose'} />)}
            <line x1={X0} y1={yOf(0.5)} x2={X1} y2={yOf(0.5)} stroke={DARK} strokeWidth={2} strokeDasharray="8 8" />

            {/* Fantasma do destreinado: só no estado treinado */}
            <motion.g initial={false} animate={{ opacity: trained ? 1 : 0 }} transition={fade}>
                <path d={UNTRAINED_EDGE} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeDasharray="6 6" />
                <CrossMarker at={crossoverAt(false)} label="destreinado" ghost />
                <path d={`M ${xOf(crossoverAt(false)) + PILL_W / 2 + 6} ${PILL_Y + 13} L ${xOf(crossoverAt(true)) - PILL_W / 2 - 10} ${PILL_Y + 13}`}
                    stroke="#F3F4F6" strokeWidth={3} markerEnd="url(#co-head)" />
            </motion.g>
            <motion.g initial={false} animate={{ x: xOf(crossoverAt(trained)) - xOf(crossoverAt(false)) }}
                transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }}>
                <CrossMarker at={crossoverAt(false)} label="cruzamento" ghost={false} />
            </motion.g>
            <defs>
                <marker id="co-head" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={3.5} markerHeight={3.5} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill="#F3F4F6" />
                </marker>
            </defs>

            {/* Eixos */}
            <line x1={X0} y1={Y1 + 2} x2={X1} y2={Y1 + 2} stroke="#94A3B8" strokeWidth={3} />
            <line x1={X0 - 2} y1={Y0} x2={X0 - 2} y2={Y1 + 2} stroke="#94A3B8" strokeWidth={3} />
            {[25, 35, 45, 55, 65, 75, 85].map(v => <SvgText key={v} x={xOf(v)} y={Y1 + 24} text={`${v}`} anchor="middle" color="#E5E7EB" size={17} />)}
            <SvgText x={X1} y={Y1 + 50} text="intensidade, % do VO₂máx" anchor="end" color="#D1D5DB" size={16} weight={700} />
            {[0, 25, 50, 75, 100].map(v => <SvgText key={v} x={X0 - 10} y={yOf(v / 100) + 6} text={`${v}`} anchor="end" color="#E5E7EB" size={16} />)}
            <SvgText x={0} y={22} text="% da energia" color="#D1D5DB" size={16} weight={700} />

            {/* Cursor da intensidade */}
            <rect x={xOf(intensity) - 2} y={Y0} width={4} height={Y1 - Y0} rx={2} fill="#FFFFFF" />
        </svg>
    );
};
