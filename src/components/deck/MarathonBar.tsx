import { C } from '../sims/kit/palette';
import { WALL_FRACTION, fractionAt, kmAt, markerLabel, markerLabelSide, wallLabelVisible } from './motion/marathon';

interface MarathonBarProps {
    index: number;
    total: number;
}

const TRACK = 4;
const ROW = 22;
const DOT = 12;
const BG = '#04080F';
/** Tudo o que anda na barra anda junto (só transform), na curva da aula; com movimento reduzido, salta. */
const MOVE = 'motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[var(--ease-out)]';

const Label = ({ children, color, side }: { children: string; color: string; side: 'left' | 'right' }) => (
    <span
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-1.5 font-mono text-[14px] leading-none tabular-nums"
        style={{ color, background: BG, [side === 'right' ? 'left' : 'right']: DOT / 2 + 6 }}
    >
        {children}
    </span>
);

/**
 * Progresso da aula como uma maratona de 0 a 42,195 km (o fio é a Marina): trilho chapado de 4 px no topo,
 * a parte percorrida em âmbar, o muro do km 32 marcado em vermelho e o ponto do km atual com rótulo.
 * Trilho e preenchimento são da largura toda e se movem por transform (sem layout a cada slide).
 */
export const MarathonBar = ({ index, total }: MarathonBarProps) => {
    const fraction = fractionAt(index, total);
    const km = kmAt(index, total);
    const isLast = index >= total - 1;
    const side = markerLabelSide(km);
    const wallPct = `${WALL_FRACTION * 100}%`;
    return (
        <div
            className="pointer-events-none absolute top-0 left-0 right-0 z-30"
            style={{ height: ROW }}
            role="img"
            aria-label={`Progresso da aula: ${markerLabel(km, isLast)} de 42,195 km`}
        >
            {/* faixa útil com respiro nas pontas: o ponto do km 0 e o da chegada não saem da tela */}
            <div className="absolute inset-y-0 left-3 right-4 [container-type:inline-size]">
                <div className="absolute inset-x-0 overflow-hidden" style={{ top: ROW / 2 - TRACK / 2, height: TRACK, background: 'rgba(255,255,255,0.14)' }}>
                    <div className={`h-full w-full origin-left ${MOVE}`} style={{ background: C.glucose, transform: `scaleX(${fraction})` }} />
                </div>

                {/* o muro: traço vermelho atravessando o trilho, com o nome ao lado */}
                <div className="absolute top-0 bottom-0 w-0" style={{ left: wallPct }}>
                    <span className="absolute top-[3px] bottom-[3px] -translate-x-1/2" style={{ width: 4, background: C.risk }} />
                    {wallLabelVisible(km, isLast) && <Label color={C.risk} side="right">32 · muro</Label>}
                </div>

                {/* chegada: poste branco no fim do trilho */}
                <span className="absolute -translate-x-1/2" style={{ left: '100%', top: 3, bottom: 3, width: 4, background: C.text }} />

                {/* o marcador anda pela largura da faixa (wrapper de largura zero, x em cqw) */}
                <div className={`absolute top-0 bottom-0 left-0 w-0 ${MOVE}`} style={{ transform: `translateX(${fraction * 100}cqw)` }}>
                    <span
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ width: DOT, height: DOT, background: C.glucose, border: `3px solid ${BG}`, boxSizing: 'content-box' }}
                    />
                    <Label color={isLast ? C.ok : C.text} side={side}>{markerLabel(km, isLast)}</Label>
                </div>
            </div>
        </div>
    );
};
