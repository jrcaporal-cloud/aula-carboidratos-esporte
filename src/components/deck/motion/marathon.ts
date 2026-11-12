/**
 * A aula como uma maratona: a barra de progresso vai de 0 a 42,195 km, proporcional à posição do slide.
 * O fio da aula é a Marina, que bate no muro no km 32 — a marca fica discreta na barra.
 */
export const MARATHON_KM = 42.195;
export const WALL_KM = 32;
export const WALL_FRACTION = WALL_KM / MARATHON_KM;

/** Faixa (km) em que o rótulo do marcador encostaria no rótulo do muro: o do muro se recolhe. */
const WALL_LABEL_GAP: readonly [number, number] = [28.5, 36];
/** Daqui em diante o rótulo do marcador vai para a esquerda do ponto (não sai da tela). */
const FLIP_KM = 39;

/** Fração da prova (0 → 1) no slide `index` de `total`. */
export const fractionAt = (index: number, total: number): number =>
    total > 1 ? Math.min(Math.max(index / (total - 1), 0), 1) : 1;

export const kmAt = (index: number, total: number): number => fractionAt(index, total) * MARATHON_KM;

/** Rótulo do marcador: km inteiro; no muro e na chegada, o nome do lugar. */
export const markerLabel = (km: number, isLast: boolean): string => {
    if (isLast) return 'chegada · 42,195 km';
    if (Math.abs(km - WALL_KM) < 0.5) return 'km 32 · o muro';
    return `km ${Math.round(km)}`;
};

export const wallLabelVisible = (km: number, isLast: boolean): boolean =>
    !isLast && (km < WALL_LABEL_GAP[0] || km > WALL_LABEL_GAP[1]);

export const markerLabelSide = (km: number): 'left' | 'right' => (km > FLIP_KM ? 'left' : 'right');
