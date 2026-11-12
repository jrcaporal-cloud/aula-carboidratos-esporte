import { C } from '../../sims/kit/palette';

/*
 * Geometria do enterócito em corte (plano z = 0 é a face cortada; as moléculas andam logo à frente).
 * Unidades da cena, fora de escala: célula de 6 × 10, borda em escova em cima, capilar embaixo.
 */

export const CELL = { w: 6, h: 10, d: 4 } as const;
export const APICAL_Y = CELL.h / 2;
export const BASAL_Y = -CELL.h / 2;
export const NEIGHBOR_X = CELL.w + 0.3;
export const MOL_Z = 0.45;
export const CAPILLARY = { y: -7.4, r: 1.25, len: 22 } as const;
export const LUMEN_TOP = 10.5;

export type Pt = readonly [number, number];

/** Portas na face cortada (x na membrana). */
export const DOOR = {
    sglt1: { x: -1.6, y: APICAL_Y, color: C.glucoseDeep },
    glut5: { x: 1.6, y: APICAL_Y, color: '#BE185D' },
    glut2: { x: -0.2, y: BASAL_Y, color: '#64748B' },
    nak: { x: 2.3, y: BASAL_Y, color: '#475569' },
    glut2Apical: { x: 0, y: APICAL_Y, color: '#64748B' },
} as const;

export const CELL_COLORS = {
    face: '#18263D',
    neighbor: '#101A2B',
    membrane: '#94A3B8',
    microvilli: '#7184A6',
    capillary: '#6B2338',
    capillaryInside: '#3A1220',
} as const;

const through = (x: number, y: number, inside: number): Pt[] => [[x, y + inside], [x, y - inside]];

/** Glicose/galactose: lúmen → SGLT1 → citosol → GLUT2 → capilar → corrente. */
export const ROUTE_GLUCOSE = (lx: number, drift: number): Pt[] => [
    [lx, LUMEN_TOP - 1], [DOOR.sglt1.x, APICAL_Y + 0.9], ...through(DOOR.sglt1.x, APICAL_Y, 0.6),
    [DOOR.sglt1.x + 0.6 + drift, 0.8], [DOOR.glut2.x + drift * 0.2, BASAL_Y + 0.8], ...through(DOOR.glut2.x, BASAL_Y, -0.6).reverse(),
    [DOOR.glut2.x, CAPILLARY.y], [DOOR.glut2.x + 9, CAPILLARY.y + drift * 0.3],
];

/** Frutose: lúmen → GLUT5 → citosol → GLUT2 → capilar. */
export const ROUTE_FRUCTOSE = (lx: number, drift: number): Pt[] => [
    [lx, LUMEN_TOP - 1], [DOOR.glut5.x, APICAL_Y + 0.9], ...through(DOOR.glut5.x, APICAL_Y, 0.6),
    [DOOR.glut5.x - 0.5 + drift, 0.6], [DOOR.glut2.x, BASAL_Y + 0.8], ...through(DOOR.glut2.x, BASAL_Y, -0.6).reverse(),
    [DOOR.glut2.x, CAPILLARY.y], [DOOR.glut2.x + 9, CAPILLARY.y - drift * 0.3],
];

/** Frutose que a KHK fosforila no próprio enterócito: para no citosol. */
export const ROUTE_KHK = (lx: number, drift: number): Pt[] => [
    [lx, LUMEN_TOP - 1], [DOOR.glut5.x, APICAL_Y + 0.9], ...through(DOOR.glut5.x, APICAL_Y, 0.6),
    [DOOR.glut5.x + 0.4 + drift * 0.5, 1.6],
];

/** Na⁺: entra com a glicose pelo SGLT1 e sai pela Na⁺/K⁺-ATPase da base. */
export const ROUTE_SODIUM = (lx: number, drift: number): Pt[] => [
    [lx - 0.5, LUMEN_TOP - 1], [DOOR.sglt1.x - 0.35, APICAL_Y + 0.9], ...through(DOOR.sglt1.x - 0.35, APICAL_Y, 0.6),
    [DOOR.nak.x - 1 + drift, -1.5], [DOOR.nak.x, BASAL_Y + 0.8], ...through(DOOR.nak.x, BASAL_Y, -0.6).reverse(),
    [DOOR.nak.x + 0.8, BASAL_Y - 1.4],
];

/** Ponto da fila em cima do SGLT1 (a fila sobe para o lúmen em zigue-zague). */
export const queueSlot = (x: number, slot: number): Pt => [x + (slot % 2 === 0 ? -0.22 : 0.22), APICAL_Y + 1.0 + slot * 0.48];
