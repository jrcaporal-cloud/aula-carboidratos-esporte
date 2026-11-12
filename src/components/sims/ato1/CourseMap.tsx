import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { CHAPTERS } from '../../../data/chapters';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ACT_PLAN } from './course.content';
import { ROLES } from './roles.content';

/**
 * O percurso da aula: os 10 atos como marcos de uma prova, numa estrada que sobe e desce. Junto de cada marco,
 * três pontos (Combustível, Sinal, Escolha) mostram que papéis o ato acende. Os marcos são clicáveis (atalho).
 * viewBox = tamanho da caixa (1:1): fonte 16 do SVG = 16 px de projeto.
 */
export const MAP_W = 1132;
export const MAP_H = 236;
const X0 = 84;
const X1 = MAP_W - 84;
const Y_HIGH = 86;
const Y_LOW = 152;

type P = readonly [number, number];
const POINTS: readonly P[] = CHAPTERS.map((_, i): P => [X0 + ((X1 - X0) * i) / (CHAPTERS.length - 1), i % 2 === 0 ? Y_LOW : Y_HIGH]);

/** Curva suave entre dois marcos (alças horizontais: a estrada nunca dá ré). */
const segment = ([x1, y1]: P, [x2, y2]: P): string => {
    const dx = (x2 - x1) / 2;
    return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
};
const SEGMENTS = POINTS.slice(1).map((p, i) => segment(POINTS[i], p));
const DARK = '#04080F';
/** Posição x de cada item da legenda (Combustível, Sinal, Escolha). */
const LEGEND_X = [22, 146, 216] as const;

/** Quebra o título em duas linhas quando passa de ~14 caracteres (os títulos dos atos têm até 4 palavras). */
const lines = (title: string): readonly string[] => {
    if (title.length <= 14) return [title];
    const words = title.split(' ');
    const cut = Math.ceil(words.length / 2);
    return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
};

interface CourseMapProps {
    current: number;
    onSelect: (i: number) => void;
}

export const CourseMap = ({ current, onSelect }: CourseMapProps) => {
    const reduce = useReducedMotion();
    return (
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W} height={MAP_H} role="img"
            aria-label={`Percurso da aula: ato ${current + 1} de ${CHAPTERS.length}`}>
            {/* legenda dos três pontos de cada marco */}
            {ROLES.map((r, k) => (
                <g key={`leg-${r.id}`}>
                    <circle cx={LEGEND_X[k]} cy={18} r={6} fill={r.color} />
                    <SvgText x={LEGEND_X[k] + 12} y={24} text={r.name} color={r.color} />
                </g>
            ))}
            {/* o percurso inteiro, ainda por correr */}
            {SEGMENTS.map(d => <path key={`base-${d}`} d={d} fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />)}
            {/* o trecho já corrido: cada pedaço se desenha quando o marco seguinte é alcançado */}
            {SEGMENTS.map((d, i) => {
                const on = i < current;
                return (
                    <motion.path key={`run-${d}`} d={d} fill="none" stroke={CHAPTERS[i + 1].color} strokeWidth={5} strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                        transition={{
                            pathLength: { duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT },
                            opacity: { duration: 0.01, delay: on ? 0 : DUR.draw },
                        }} />
                );
            })}
            {CHAPTERS.map((ch, i) => {
                const [x, y] = POINTS[i];
                const reached = i <= current;
                const here = i === current;
                const above = y === Y_HIGH;
                const title = lines(ch.title);
                const labelY = above ? y - 38 - (title.length - 1) * 20 : y + 48;
                const dotsY = above ? y + 40 : y - 40;
                const roles = ACT_PLAN[i].roles;
                return (
                    <g key={ch.roman} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
                        <motion.g initial={false} animate={{ opacity: reached ? 1 : 0.6 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                            {ROLES.map((r, k) => {
                                const on = roles.includes(r.id);
                                return (
                                    <circle key={r.id} cx={x + (k - 1) * 17} cy={dotsY} r={6}
                                        fill={on ? r.color : DARK} stroke={on ? r.color : 'rgba(255,255,255,0.3)'} strokeWidth={2} />
                                );
                            })}
                            {title.map((t, k) => (
                                <SvgText key={t} x={x} y={labelY + k * 20} text={t} anchor="middle" size={here ? 18 : 16}
                                    color={here ? ch.color : C.text} weight={here ? 700 : 600} />
                            ))}
                        </motion.g>
                        <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                            initial={false} animate={{ scale: here ? 1.22 : 1 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
                            <circle cx={x} cy={y} r={22} fill={reached ? ch.color : DARK} stroke={ch.color} strokeWidth={3} />
                            <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={800}
                                fill={reached ? DARK : ch.color} style={{ fontFamily: 'var(--font-body)' }}>{ch.roman}</text>
                        </motion.g>
                    </g>
                );
            })}
        </svg>
    );
};
