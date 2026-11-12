/**
 * Onde a glicose personagem pousa: logo depois do fim do título do slide, no meio da última linha.
 * É um lugar que nunca cobre conteúdo. Sem espaço até a borda do slide, ela se recolhe.
 */
export interface Box { left: number; top: number; right: number; bottom: number }

export interface Perch { x: number; y: number; size: number; visible: boolean }

/** Respiro entre o fim do título e a molécula, em fração da altura da linha. */
const GAP = 0.55;
/** Diâmetro da molécula em fração da altura da linha do título. */
const SIZE = 1.1;

/**
 * `lastLine` = retângulo da última linha do título; `limit` = borda direita útil do slide
 * (mesmo sistema de coordenadas: px da tela relativos ao deck).
 */
export const perchAfterTitle = (lastLine: Box, limit: number): Perch => {
    const lineH = Math.max(lastLine.bottom - lastLine.top, 1);
    const size = lineH * SIZE;
    const x = lastLine.right + lineH * GAP + size / 2;
    const y = (lastLine.top + lastLine.bottom) / 2;
    return { x, y, size, visible: x + size / 2 <= limit };
};
