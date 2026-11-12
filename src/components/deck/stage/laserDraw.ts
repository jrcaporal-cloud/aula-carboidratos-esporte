/**
 * Desenho da caneta em canvas 2D (sem React): traços chapados que somem e pontos com um anel.
 * Videochamada: sem halo nem brilho (o codec vira borrão); traço de 5 px com contorno escuro para ler em qualquer fundo.
 */

export interface LaserPoint { x: number; y: number }

export interface LaserMark {
    points: LaserPoint[];
    color: string;
    /** Instante (ms) em que o botão foi solto; null enquanto desenha. */
    releasedAt: number | null;
    /** Clique simples: vira um ponto marcado em vez de traço. */
    dot: boolean;
}

/** O traço fica inteiro por HOLD_MS e se apaga em FADE_MS: some ~1,5 s depois de soltar. */
export const HOLD_MS = 1000;
export const FADE_MS = 500;
export const LIFE_MS = HOLD_MS + FADE_MS;
/** O anel do ponto abre uma vez só (sem pulsar em loop). */
const RING_MS = 450;
const OUTLINE = '#04080F';

export const markAlpha = (mark: LaserMark, now: number): number => {
    if (mark.releasedAt == null) return 1;
    const t = now - mark.releasedAt;
    if (t <= HOLD_MS) return 1;
    return Math.max(0, 1 - (t - HOLD_MS) / FADE_MS);
};

const tracePath = (ctx: CanvasRenderingContext2D, pts: LaserPoint[]) => {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    // Curva pelos pontos médios: traço liso mesmo com o mouse rápido.
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
};

const drawStroke = (ctx: CanvasRenderingContext2D, mark: LaserMark, alpha: number) => {
    const pts = mark.points;
    if (pts.length < 2) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    tracePath(ctx, pts);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = mark.color;
    ctx.lineWidth = 5;
    ctx.stroke();
};

const drawDot = (ctx: CanvasRenderingContext2D, mark: LaserMark, alpha: number, now: number) => {
    const { x, y } = mark.points[0];
    const age = mark.releasedAt == null ? 0 : now - mark.releasedAt;
    const open = Math.min(age / RING_MS, 1);
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 4;
    ctx.strokeStyle = mark.color;
    ctx.beginPath();
    ctx.arc(x, y, 12 + open * 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = OUTLINE;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = mark.color;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
};

/** Desenha todas as marcas vivas; devolve só as que ainda aparecem (as apagadas saem da lista). */
export const drawMarks = (ctx: CanvasRenderingContext2D, marks: LaserMark[], now: number): LaserMark[] => {
    const alive = marks.filter(m => markAlpha(m, now) > 0);
    for (const mark of alive) {
        const alpha = markAlpha(mark, now);
        if (mark.dot) drawDot(ctx, mark, alpha, now);
        else drawStroke(ctx, mark, alpha);
    }
    ctx.globalAlpha = 1;
    return alive;
};
