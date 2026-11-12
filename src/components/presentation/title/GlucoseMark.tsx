import { C } from '../../sims/kit/palette';

/**
 * Anel de glicose (piranose, projeção de Haworth simplificada) em traço fino: a marca d'água da capa.
 * Hexágono com o oxigênio do anel no vértice de cima à direita e as hidroxilas como hastes curtas.
 */
export const GlucoseMark = ({ className }: { className?: string }) => {
    const cx = 300;
    const cy = 300;
    const r = 150;
    const corner = (k: number) => {
        const a = ((k * 60 - 30) * Math.PI) / 180;
        return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
    };
    const pts = Array.from({ length: 6 }, (_, k) => corner(k));
    const ring = pts.map(p => `${p.x},${p.y}`).join(' ');
    const ringO = pts[1];
    // Hastes das hidroxilas: saem dos carbonos para fora do anel.
    const stems = [0, 2, 3, 4, 5].map(k => {
        const p = pts[k];
        const dx = (p.x - cx) / r;
        const dy = (p.y - cy) / r;
        return { x1: p.x, y1: p.y, x2: p.x + dx * 70, y2: p.y + dy * 70 };
    });
    return (
        <svg viewBox="0 0 600 600" className={className} aria-hidden>
            <g stroke={C.glucoseSoft} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points={ring} />
                {stems.map((s, i) => <line key={i} {...s} />)}
            </g>
            <g fontFamily="'Clash Display', sans-serif" fontWeight={600} fill="#FEF3C7" textAnchor="middle" dominantBaseline="central">
                <circle cx={ringO.x} cy={ringO.y} r={30} fill="#04080F" stroke="none" />
                <text x={ringO.x} y={ringO.y} fontSize={48}>O</text>
                {stems.slice(1).map((s, i) => (
                    <text key={i} x={s.x2 + (s.x2 - s.x1) * 0.45} y={s.y2 + (s.y2 - s.y1) * 0.45} fontSize={34}>OH</text>
                ))}
            </g>
        </svg>
    );
};
